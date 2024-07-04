import React, { useEffect, useState } from "react";
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
import {
  Box,
  Card,
  CardHeader,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import theme from "../../../theme";

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

  useEffect(() => {
    if (localStorage.getItem("userUid") == null) {
      // toast.error("Please Login first", { transition: Zoom });
      window.location.href = "#/";
    }
  }, []);
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
        // toast.error("Please Login first", { transition: Zoom });
        window.location.href = "#/";
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

      <Container className="containerCreate">
        <Box className="Create_event_box">
          <Card className="box1">
            <Typography variant="h5" className="font-bold">
              Event Info
            </Typography>
            <form>
              <Box className="mt-3">
                <Typography className="create-event-label ">
                  Event Title
                </Typography>
                <TextField
                  label="Event Title"
                  variant="outlined"
                  fullWidth
                  className="mt-3 create-event-input"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                />
              </Box>
              <Box className="mt-3">
                <Typography className="create-event-label">
                  Event Description
                </Typography>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={5}
                  className="mt-3 create-event-input"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                  }
                />
              </Box>
              <Form.Group controlId="formDate" style={{ zIndex: 100 }}>
                <Form.Label>Date</Form.Label>
                <br />
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                />
              </Form.Group>

              <Form.Group controlId="formTime" style={{ zIndex: 100 }}>
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
              <Box className="mt-3">
                <Typography className="create-event-label">
                  Event Tags
                </Typography>
                <TextField
                  label="Event Tags"
                  variant="outlined"
                  fullWidth
                  className="mt-3 create-event-input"
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
              </Box>
            </form>
          </Card>
          <Box className="left-create">
            <Card className="publish-box">
              <Typography
                variant="h6"
                className="create-publish"
                onClick={createEventDb}
              >
                Publish Event
              </Typography>
              <Box className="button-container">
                <Button
                  variant="contained"
                  className="publish-button"
                  onClick={createEventDb}
                >
                  Publish
                </Button>
                <Button variant="outlined" className="preview-button">
                  Preview
                </Button>
              </Box>
            </Card>
            <Card className="upload-box">
              <Typography variant="h6" className="upload-box-head">
                Upload Event Banner
              </Typography>
              <Box>
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
              </Box>
            </Card>
          </Box>
        </Box>

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
      </Container>
    </>
  );
};

export default CreateEvent;
