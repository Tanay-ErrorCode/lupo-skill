import React from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "./EventCard.css";
// import props.image from "../../image_assets/props.image.png";
import { Link } from "@mui/material";
import {
  auth,
  firestore,
  database,
  storage,
  signInWithGooglePopup,
} from "../../../firebaseConf";
import GoogleButton from "react-google-button";
import { ref, get, child, set, update } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
interface EventCardProps {
  title: string;
  description: string;
  date: string;
  time: string;
  tags: string;
  host: string;
  isDashboard: boolean;
  image: string;
  id: string;
}

const EventCard: React.FC<EventCardProps> = (props) => {
  const registerForEventX = async () => {
    const usersRef = ref(database, "users");
    const userEmailId = localStorage.getItem("userEmailId");

    if (userEmailId === null) {
      toast.warn("You are not signed in", { transition: Zoom });

      return;
    }
    const userRef = child(usersRef, userEmailId);

    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      if (snapshot.hasChild("registeredEvents")) {
        let registeredEventsArray = snapshot.val().registeredEvents.split(",");
        if (registeredEventsArray.includes(props.id)) {
          toast.error("You are already registered for this event", {
            transition: Zoom,
          });
          return;
        }

        registeredEventsArray.push(props.id);
        update(userRef, { registeredEvents: registeredEventsArray.join(",") });
        const eventRef = ref(database, "events");
        const eventRefChild = child(eventRef, props.id);
        get(eventRefChild)
          .then((snapshot) => {
            if (snapshot.exists()) {
              let registrantsArray = snapshot.val().registrants
                ? snapshot.val().registrants.split(",")
                : [];
              if (registrantsArray.includes(userEmailId)) {
                toast.error("You are already registered for this event", {
                  transition: Zoom,
                });
                return;
              }

              registrantsArray.push(userEmailId);
              update(eventRefChild, {
                registrants: registrantsArray.join(","),
              });
            } else {
              toast.error("Event does not exist", { transition: Zoom });
            }
          })
          .catch((error) => {
            console.error(error);
          });

        toast.success("Successfully registered for the event", {
          transition: Zoom,
        });
      } else {
        // const registeredEvents = [props.id];
        // update(userRef, { registeredEvents });

        // toast.success("Successfully registered for the event");
        let registeredEvents = "";
        registeredEvents += props.id;
        update(userRef, { registeredEvents });
        const eventRef = ref(database, "events");
        const eventRefChild = child(eventRef, props.id);
        get(eventRefChild)
          .then((snapshot) => {
            if (snapshot.exists()) {
              let registrantsArray = snapshot.val().registrants
                ? snapshot.val().registrants.split(",")
                : [];
              if (registrantsArray.includes(userEmailId)) {
                toast.error("You are already registered for this event", {
                  transition: Zoom,
                });
                return;
              }

              registrantsArray.push(userEmailId);
              update(eventRefChild, {
                registrants: registrantsArray.join(","),
              });
            } else {
              toast.error("Event does not exist", { transition: Zoom });
            }
          })
          .catch((error) => {
            console.error(error);
          });

        toast.success("Successfully registered for the event", {
          transition: Zoom,
        });
      }
    } else {
      toast.error("User does not exist", { transition: Zoom });
    }
  };
  return (
    <Container>
      {!props.isDashboard ? (
        <Row className="justify-content-md-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="mb-3 shadow card card-background">
              <Card.Img
                src={props.image}
                alt="Card Image"
                className="card_image"
              />
              <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-calendar"></i>{" "}
                    <span className="ms-2">{props.date}</span>
                    <i className="bi bi-clock ms-2"></i>{" "}
                    <span className="ms-2">{props.time}</span>
                  </div>
                  Host:{" "}
                  <a href={"#/profile/" + props.host} className="link-primary">
                    {props.host}
                  </a>
                  <br />
                  {props.description}
                  <br />
                  {props.tags.split(",").map((tag, index) => (
                    <span key={index} className="tag badge me-2">
                      {tag}
                    </span>
                  ))}
                </Card.Text>
                {new Date(props.date) > new Date() ? (
                  <Button
                    className="btn-c position-absolute bottom-0 end-0 m-3"
                    onClick={registerForEventX}
                  >
                    Register
                  </Button>
                ) : (
                  <Button
                    className="btn-d position-absolute bottom-0 end-0 m-3"
                  >
                    Expired
                  </Button>
                )}
                {/* <Button
                  className="btn-c position-absolute bottom-0 end-0 m-3"
                  onClick={registerForEventX}
                >
                  Register
                </Button> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-md-center">
          <Col xs={12} md={8} lg={6}>
            <Link href={"#/eventDetails/" + props.id} className="link-nothing">
              <Card className="mt-2 mb-2 shadow card card-background">
                <Card.Img
                  src={props.image}
                  alt="Card Image"
                  className="card_image"
                  referrerPolicy="no-referrer"
                />
                <Card.Body>
                  <Card.Title>{props.title}</Card.Title>
                  <Card.Text>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-calendar"></i>{" "}
                      <span className="ms-2">{props.date}</span>
                      <i className="bi bi-clock ms-2"></i>{" "}
                      <span className="ms-2">{props.time}</span>
                    </div>
                    Host:{" "}
                    <a
                      href={"#/profile/" + props.host}
                      className="link-primary"
                    >
                      {props.host}
                    </a>
                    <br />
                    {props.description}
                    <br />
                    {props.tags.split(",").map((tag, index) => (
                      <span key={index} className="tag badge me-2">
                        {tag}
                      </span>
                    ))}
                  </Card.Text>
                  {!props.isDashboard ? (
                    new Date(props.date) > new Date() ? (
                      <Button
                        className="btn-c position-absolute bottom-0 end-0 m-3"
                        onClick={registerForEventX}
                      >
                        Register
                      </Button>
                    ) : (
                      <Button
                        className="btn-c position-absolute bottom-0 end-0 m-3"
                        variant="danger"
                      >
                        Expired
                      </Button>
                    )
                  ) : null}
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EventCard;
