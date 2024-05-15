import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Card,
  FormControl,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Image as BootstrapImage } from "react-bootstrap";
import "./EventDetails.css";
import bannerImage from "../image_assets/bannerImage.png";
import { Link, useParams } from "react-router-dom";
import { ref, get, child, set, update } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  auth,
  firestore,
  database,
  storage,
  signInWithGooglePopup,
} from "../../firebaseConf";
const EventDetails = () => {
  const { id } = useParams();
  const userUid = localStorage.getItem("userUid");
  const [isHost, setIsHost] = useState(false); // Change this variable to true if the current user is the host
  // const googleMeetLink = "https://meet.google.com/xyz-pqrs"; // Replace with your Google Meet link
  const [isLoading, setIsLoading] = useState(true);
  const [banner_Image, setBannerImage] = useState(bannerImage);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [host, setHost] = useState("");
  const [hostName, setHostName] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [googleMeetLink, setGoogleMeetLink] = useState(
    "Nothing yet, ask the host to add one"
  );

  useEffect(() => {
    if (userUid == null) {
      window.location.href = "#/dashboard";
      toast.warn("You are not signed in", { transition: Zoom });
    }
    const fetchData = async () => {
      const eventRef = ref(database, "events/" + id);
      const snapshot = await get(eventRef);
      if (snapshot.exists()) {
        const eventData = snapshot.val();

        setBannerImage(eventData.banner);
        setTitle(eventData.title);
        setDescription(eventData.description);
        setTags(eventData.tags.split(","));
        setDate(eventData.date);
        setTime(eventData.time);
        setHost(eventData.host);
        setHostName(eventData.hostName);
        if (eventData.host === userUid) {
          setIsHost(true);
        }
        if (eventData.registrants) {
          setRegisteredUsers(eventData.registrants.split(","));
          console.log(
            !eventData.registrants.split(",").includes(userUid) ||
              (userUid == null && userUid !== eventData.host),
            eventData.host
          );
          if (
            (!eventData.registrants.split(",").includes(userUid) ||
              userUid == null) &&
            userUid !== eventData.host
          ) {
            window.location.href = "#/dashboard";
            toast.warn("You are not registered for this event", {
              transition: Zoom,
            });
          }
        }
        if (eventData.googleMeetLink) {
          setGoogleMeetLink(eventData.googleMeetLink);
        }
        setIsLoading(false);
      } else {
        toast.error("Event not found", { transition: Zoom });
      }
    };
    fetchData();
  }, []);
  const addMeetingLink = () => {
    const eventRef = ref(database, "events/" + id);
    update(eventRef, {
      googleMeetLink: googleMeetLink,
    });
    toast.success("Google Meet link added successfully", { transition: Zoom });
  };
  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Container>
          <Row>
            <Col>
              <Card className="p-3 shadow mt-2">
                <Card.Img
                  variant="top"
                  src={banner_Image}
                  alt="Event Header"
                  className="card-image"
                />
                <Card.Body>
                  <Card.Title>{title}</Card.Title>
                  <Container>
                    <Row className="align-items-center mb-2">
                      <Col xs="auto">
                        <i className="bi bi-calendar"></i>
                      </Col>
                      <Col xs="auto">{date}</Col>
                      <Col xs="auto">
                        <i className="bi bi-clock"></i>
                      </Col>
                      <Col xs="auto">{time}</Col>
                    </Row>
                    <Row>
                      <Col>
                        Host:{" "}
                        <a href={"#/profile/" + host} className="link-primary">
                          {hostName}
                        </a>
                      </Col>
                    </Row>
                    <Row>
                      <Col>{description}</Col>
                    </Row>
                    <Row>
                      <Col>
                        {tags.map((tag, index) => (
                          <span key={index} className="tag badge me-2">
                            {tag}
                          </span>
                        ))}
                      </Col>
                    </Row>
                  </Container>
                </Card.Body>
              </Card>
              <Card className="p-1 mt-2 shadow">
                <Card.Body>
                  <div>
                    {isHost ? (
                      <>
                        {" "}
                        <InputGroup className="mb-3">
                          <InputGroup.Text>Google Meet link :</InputGroup.Text>
                          <FormControl
                            type="text"
                            value={googleMeetLink}
                            onChange={(e) => setGoogleMeetLink(e.target.value)}
                          />
                          <Button
                            onClick={() => {
                              addMeetingLink();
                            }}
                            variant="primary"
                          >
                            Add Link
                          </Button>
                        </InputGroup>
                      </>
                    ) : (
                      <>
                        Google Meet link :{" "}
                        {googleMeetLink ===
                        "Nothing yet, ask the host to add one" ? (
                          "Nothing yet, ask the host to add one"
                        ) : (
                          <a href={googleMeetLink} className="link-primary">
                            {googleMeetLink}
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
              <Card className="p-1 mt-2 shadow">
                <Card.Body>
                  Number of registerents : {registeredUsers.length}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default EventDetails;
