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
const CreateEvent = ({ props }: any) => {
  const [show, setShow] = useState(false);
  const is_signup = localStorage.getItem("userUid") ? true : false;
  const [isSignupModelOpen, setIsSignupModelOpen] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (is_signup) setShow(true);
    else setIsSignupModelOpen(!isSignupModelOpen);
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [image, setImage] = useState<File | null>(null);
  const createEventDb = () => {
    const userUid = localStorage.getItem("userUid");
    if (
      image !== null &&
      image !== undefined &&
      title !== "" &&
      description !== "" &&
      tags !== "" &&
      startDate !== null &&
      startTime !== null &&
      userUid !== null
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
          } else {
          }
        })
        .catch((error) => {
          console.error(error);
        });

      const eventRefChild = child(eventRef, newEventId);
      get(eventRefChild)
        .then((snapshot) => {
          if (snapshot.exists()) {
          } else {
            const bannerRef = storageRef(
              storage,
              `/event-banners/banner-${newEventId}`,
            );
            if (image !== null) {
              toast.promise(
                uploadBytes(bannerRef, image).then(() => {
                  getDownloadURL(bannerRef).then(
                    function (value) {
                      console.log(value, "banner uploaded");
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
                    },
                    function (error) {
                      console.log(error);
                    },
                  );
                }),
                {
                  pending: "Creating Event ...",
                  success: "Event Created succesfully !",
                  error: "Failed to create event",
                },
                { transition: Zoom },
              );
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      if (userUid === null) {
        toast.error("Please Login first", { transition: Zoom });
      } else {
        toast.error("Fill all the required details first", {
          transition: Zoom,
        });
      }
    }
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

      <Modal show={show} onHide={handleClose}>
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
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tags"
                onChange={(e) => setTags(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formImageUpload">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const files = target.files;
                  if (files) {
                    setImage(files[0]);
                  } else {
                    setImage(null);
                  }
                }}
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
    </>
  );
};

export default CreateEvent;
