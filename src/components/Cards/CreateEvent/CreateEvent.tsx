import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  FormControl,
  Nav,
} from "react-bootstrap";
import "./CreateEvent.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Signup from "../../Signup/Signup";
import {
  auth,
  firestore,
  database,
  storage,
  signInWithGooglePopup,
} from "../../../firebaseConf";
import GoogleButton from "react-google-button";
import { ref, get, child, set } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ImageCropper from "../../../utils/ImageCropper";

function generateUUID() {
  var d = new Date().getTime();
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const CreateEvent = ({ onNavLinkClick, props }: any) => {
  const [show, setShow] = useState(false);
  const is_signup = localStorage.getItem("userUid") ? true : false;
  const [isSignupModelOpen, setIsSignupModelOpen] = useState(false);

  const [showCropperModal, setShowCropperModal] = useState(false);
  const [cropperAspectRatio, setCropperAspectRatio] = useState<number>(16 / 9);

  const handleClose = () => setShow(false);

  const handleShow = () => {
    if (is_signup) setShow(true);
    else setIsSignupModelOpen(!isSignupModelOpen);

    if (onNavLinkClick) {
      onNavLinkClick();
    }
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [popTags, setPopTags] = useState<string>("");
  const [listTags, setListTags] = useState<string[]>([]);

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setCropperAspectRatio(16 / 9);

      setShowCropperModal(true);
    } else {
      toast.error("Please select a valid image file (JPEG/PNG)", {
        transition: Zoom,
      });
    }
  };
  const handleSaveCroppedImage = async (croppedImageUrl: string | null) => {
    if (croppedImageUrl) {
      try {
        const maxFileSize = 200000;
        const compressedBlob = await compressAndResizeImage(
          croppedImageUrl,
          maxFileSize
        );
        const compressedFile = new File([compressedBlob], "croppedImage.jpg", {
          type: "image/jpeg",
        });

        setImage(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("An error occurred while compressing the image");
      }
    }
    setShowCropperModal(false);
  };

  const compressAndResizeImage = (
    imageUrl: string,
    maxFileSize: number
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidthOrHeight = 1024;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidthOrHeight) {
            height *= maxWidthOrHeight / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width *= maxWidthOrHeight / height;
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        let quality = 0.8;

        const adjustQuality = () => {
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size > maxFileSize && quality > 0.1) {
                quality -= 0.05;
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                ctx?.drawImage(img, 0, 0, width, height);
                adjustQuality();
              } else {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error("Failed to compress image"));
                }
              }
            },
            "image/jpeg",
            quality
          );
        };

        adjustQuality();
      };

      img.onerror = function (error) {
        reject(error);
      };
    });
  };

  const createEventDb = async () => {
    const userUid = localStorage.getItem("userUid");
    if (
      image &&
      title.trim() !== "" &&
      description.trim() !== "" &&
      tags.trim() !== "" &&
      startDate &&
      startTime &&
      userUid
    ) {
      const eventRef = ref(database, "events");
      const newEventId = generateUUID();

      const usersRef = ref(database, "users");
      const userRef = child(usersRef, userUid);

      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            set(userRef, {
              ...snapshot.val(),
              createdEvents: snapshot.val().createdEvents
                ? snapshot.val().createdEvents + "," + newEventId
                : newEventId,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });

      let ImageUrl = "";
      const eventRefChild = child(eventRef, newEventId);
      get(eventRefChild)
        .then((snapshot) => {
          if (!snapshot.exists()) {
            const bannerRef = storageRef(
              storage,
              `/event-banners/banner-${newEventId}`
            );

            toast.promise(
              uploadBytes(bannerRef, image).then(() => {
                getDownloadURL(bannerRef).then((value) => {
                  const event = {
                    title: title,
                    description: description,
                    tags: tags,
                    date: startDate.toDateString(),
                    time: startTime.toTimeString(),
                    id: newEventId,
                    host: userUid,
                    registrants: "",
                    banner: value,
                    createdAt: Date.now(),
                    hostName: auth.currentUser?.displayName,
                  };
                  set(eventRefChild, event);

                  handleClose();
                  window.location.reload();
                });
              }),
              {
                pending: "Creating Event ...",
                success: "Event Created successfully!",
                error: "Failed to create event",
              },
              { transition: Zoom }
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      if (!userUid) {
        toast.error("Please Login first", { transition: Zoom });
      } else {
        toast.error("Fill all the required details first", {
          transition: Zoom,
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newTag = popTags.trim();
    const tagsArray = tags.split(", ").length;
    if (e.key === "Enter" && newTag !== "" && tagsArray < 5) {
      setTags((prevTags) => (prevTags ? `${prevTags}, ${newTag}` : newTag));
      setListTags((prev) => [...prev, newTag]);
      setPopTags("");
    }
  };

  const handleDelete = (tag: string) => {
    setListTags(listTags.filter((ele) => ele !== tag));
    setTags((prevTags) =>
      prevTags
        .split(", ")
        .filter((ele) => ele !== tag)
        .join(", ")
    );
  };
  return (
    <>
      <Signup isShow={isSignupModelOpen} returnShow={setIsSignupModelOpen} />
      {props === "other" ? (
        <Button variant="primary" onClick={handleShow} className="main-button">
          Create Event
        </Button>
      ) : (
        <Nav.Link onClick={handleShow}>Create Event</Nav.Link>
      )}

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton className="modal_back">
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal_back">
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <br />
              <DatePicker
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
              />
            </Form.Group>

            <Form.Group controlId="formTime">
              <Form.Label>Time</Form.Label>
              <br />
              <DatePicker
                selected={startTime}
                onChange={(date: Date) => setStartTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </Form.Group>

            <Form.Group controlId="formTags">
              <Form.Label>Tags (max 5)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tags"
                onChange={(e) => setPopTags(e.target.value)}
                onKeyDown={handleKeyDown}
                value={popTags}
              />
              <Stack direction="row" className="mt-2" spacing={1}>
                {listTags.map((ele, index) => {
                  return (
                    <Chip
                      key={index}
                      label={ele}
                      onDelete={() => handleDelete(ele)}
                      color="success"
                      variant="outlined"
                    />
                  );
                })}
              </Stack>
            </Form.Group>
            <Form.Group controlId="formImageUpload">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal_back">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button className="btn-create" onClick={createEventDb}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showCropperModal}
        onHide={() => setShowCropperModal(false)}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {image && (
            <ImageCropper
              setCroppedImageUrl={handleSaveCroppedImage}
              src={URL.createObjectURL(image)}
              aspectRatio={cropperAspectRatio}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateEvent;
