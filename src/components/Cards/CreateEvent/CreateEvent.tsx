import React, { useState } from "react";
import { Modal, Button, Form, Nav } from "react-bootstrap";
import "./CreateEvent.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Signup from "../../Signup/Signup";
import { auth, database, storage } from "../../../firebaseConf";
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
import DropZone from "../../../utils/DropZone";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
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
        setImagePreview(croppedImageUrl);
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

      <div className="container ">
        <div className="Create_event_box">
          <div className="box1">
            <h3 className="font-bold">Event Info</h3>
            <Form>
              <Form.Group controlId="formTitle" className="mt-4">
                <Form.Label className="create-event-label">
                  Event Title
                </Form.Label>
                <Form.Control
                  type="text"
                  className="create-event-input"
                  placeholder="Enter title"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mt-4">
                <Form.Label className="create-event-label">
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className="create-event-input"
                  rows={5}
                  placeholder="Enter description"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group controlId="formTags" className="mt-4">
                <Form.Label className="create-event-label">
                  Event Tags
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter tags"
                  className="create-event-input"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPopTags(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  value={popTags}
                />
                <Stack direction="row" className="mt-2" spacing={1}>
                  {listTags.map((ele, index) => (
                    <Chip
                      key={index}
                      label={ele}
                      onDelete={() => handleDelete(ele)}
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Form.Group>
            </Form>
          </div>
          <div className="left-create">
            <div className="publish-box">
              <h5 className="create-publish" onClick={createEventDb}>
                Publish Event
              </h5>
              <div className="button-container">
                <Button
                  variant="primary"
                  className="publish-button"
                  onClick={createEventDb}
                >
                  Publish
                </Button>
                <Button variant="secondary" className="preview-button">
                  Preview
                </Button>
              </div>
            </div>
            <div className="upload-box">
              <h5 className="upload-box-head">Upload Event Banner</h5>
              <div className="">
                <DropZone handleImageChange={handleImageChange} />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="mt-4"
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={showCropperModal}
          onHide={() => setShowCropperModal(false)}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Crop Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {imagePreview && (
              <ImageCropper
                setCroppedImageUrl={handleSaveCroppedImage}
                src={imagePreview}
                aspectRatio={cropperAspectRatio}
              />
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default CreateEvent;
