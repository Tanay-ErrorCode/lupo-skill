import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "./EventCard.css";
import { Link } from "@mui/material";
import {
  auth,
  firestore,
  database,
  storage,
  signInWithGooglePopup,
} from "../../../firebaseConf";
import GoogleButton from "react-google-button";
import { ref, get, child, set, update, remove } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageTitle from "../../../utils/PageTitle";
import moment from "moment";

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
  isRegistered?: boolean;
  isValid: boolean;
  hostName: string;
  onBackToDashboard?: () => void;
  showEditIcon?: boolean;
  onEditEvent?: () => void;
  lastEdited?: number;
  showDeleteIcon?: boolean;
  ispreview?: boolean;
}
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

const EventCard: React.FC<EventCardProps> = (props) => {
  const [registerData, setRegisterData] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, [props.isRegistered]);

  const fetchUserData = async () => {
    const userUid = localStorage.getItem("userUid");

    if (userUid) {
      const userRef = child(ref(database, "users"), userUid);
      const snapshot = await get(userRef);

      if (snapshot.exists() && snapshot.val().registeredEvents) {
        const registeredEventsArray = snapshot
          .val()
          .registeredEvents.split(",");
        setRegisterData(registeredEventsArray.includes(props.id));
      } else {
        setRegisterData(false);
      }
    } else {
      setRegisterData(false);
    }
  };

  const registerForEvent = async () => {
    const userUid = localStorage.getItem("userUid");

    if (!userUid) {
      toast.warn("You are not signed in", { transition: Zoom });
      return;
    }

    const userRef = child(ref(database, "users"), userUid);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      let registeredEventsArray = userSnapshot.val().registeredEvents
        ? userSnapshot.val().registeredEvents.split(",")
        : [];
      if (registeredEventsArray.includes(props.id)) {
        toast.error("You are already registered for this event", {
          transition: Zoom,
        });
        return;
      }

      registeredEventsArray.push(props.id);
      await update(userRef, {
        registeredEvents: registeredEventsArray.join(","),
      });

      const eventRef = child(ref(database, "events"), props.id);
      const eventSnapshot = await get(eventRef);

      if (eventSnapshot.exists()) {
        let registrantsArray = eventSnapshot.val().registrants
          ? eventSnapshot.val().registrants.split(",")
          : [];
        registrantsArray.push(userUid);
        await update(eventRef, { registrants: registrantsArray.join(",") });

        setRegisterData(true);
        toast.success("Successfully registered for the event", {
          transition: Zoom,
        });
      } else {
        toast.error("Event does not exist", { transition: Zoom });
      }
    } else {
      toast.error("User does not exist", { transition: Zoom });
    }
  };

  const cancelRegistration = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel registration?"
    );
    if (!confirmed) return;

    const userUid = localStorage.getItem("userUid");

    if (!userUid) {
      toast.warn("You are not signed in", { transition: Zoom });
      return;
    }

    const userRef = child(ref(database, "users"), userUid);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      let registeredEventsArray = userSnapshot
        .val()
        .registeredEvents.split(",");
      if (!registeredEventsArray.includes(props.id)) {
        toast.error("You are not registered for this event", {
          transition: Zoom,
        });
        return;
      }

      registeredEventsArray = registeredEventsArray.filter(
        (eventId: string) => eventId !== props.id
      );
      await update(userRef, {
        registeredEvents: registeredEventsArray.join(","),
      });

      const eventRef = child(ref(database, "events"), props.id);
      const eventSnapshot = await get(eventRef);

      if (eventSnapshot.exists()) {
        let registrantsArray = eventSnapshot.val().registrants
          ? eventSnapshot.val().registrants.split(",")
          : [];
        registrantsArray = registrantsArray.filter(
          (uid: string) => uid !== userUid
        );
        await update(eventRef, { registrants: registrantsArray.join(",") });

        setRegisterData(false);
        toast.success("Successfully canceled registration for the event", {
          transition: Zoom,
        });
      } else {
        toast.error("Event does not exist", { transition: Zoom });
      }
    } else {
      toast.error("User does not exist", { transition: Zoom });
    }
  };

  const handleDeleteEvent = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      const eventRef = ref(database, `events/${props.id}`);
      const eventSnapshot = await get(eventRef);
      if (!eventSnapshot.exists()) {
        toast.error("Event does not exist", { transition: Zoom });
        return;
      }

      // Get registrants and event details
      const eventData = eventSnapshot.val();
      const registrantsArray = eventData.registrants
        ? eventData.registrants.split(",")
        : [];

      // Remove the event
      await remove(eventRef);

      // Notify all registrants about the event deletion
      registrantsArray.forEach(async (userUid: string) => {
        const userRef = child(ref(database, "users"), userUid);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const notifications = userSnapshot.val().notifications || [];
          notifications.push({
            id: generateUUID(), // Ensure each notification has a unique ID
            title: "Event Deleted",
            text: `The event '${eventData.title}' has been deleted.`,
            date: new Date().getTime(),
            link: "",
          });
          await update(userRef, { notifications });
        }
      });

      toast.success("Event successfully deleted", { transition: Zoom });
      window.location.reload();
      if (props.onBackToDashboard) props.onBackToDashboard();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event", { transition: Zoom });
    }
  };

  // Corrected parsing of date and time
  const eventDateTime = new Date(`${props.date} ${props.time}`);
  const now = new Date();

  return (
    <>
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
                <Card.Body style={{ position: "relative" }}>
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
                      {props.hostName}
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
                  {eventDateTime > now ? (
                    <Button
                      className={`${
                        (props.isValid && props.isRegistered) || registerData //( props.ispreview? false: registerData)
                          ? "btn-unregister"
                          : "btn-c"
                      }   position-absolute end-0 bottom-0 m-3`}
                      onClick={
                        (props.isValid && props.isRegistered) || registerData
                          ? cancelRegistration
                          : registerForEvent
                      }
                      disabled={props.ispreview}
                    >
                      {(props.isValid && props.isRegistered) || registerData
                        ? "Unregister"
                        : "Register"}
                    </Button>
                  ) : (
                    <Button className="btn-d position-absolute bottom-0 end-0 m-3">
                      Expired
                    </Button>
                  )}
                  {props.showEditIcon && (
                    <EditIcon
                      onClick={props.onEditEvent}
                      style={{
                        width: "22px",
                        cursor: "pointer",
                        position: "absolute",
                        top: "15px",
                        right: "30px",
                      }}
                    />
                  )}
                  {props.showDeleteIcon && (
                    <DeleteIcon
                      onClick={handleDeleteEvent}
                      style={{
                        color: "red",
                        width: "22px",
                        cursor: "pointer",
                        position: "absolute",
                        top: "15px",
                        right: "5px",
                      }}
                    />
                  )}
                  {props.lastEdited && (
                    <div className="text-muted mt-2">
                      Edited {moment(props.lastEdited).fromNow()}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row className="justify-content-md-center">
            <Col xs={12} md={8} lg={6}>
              <Link
                href={"#/eventDetails/" + props.id}
                className="link-nothing"
              >
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
                        {props.hostName}
                      </a>
                      <br />
                      {props.description}
                      <br />
                      {props.tags.split(",").map((tag, index) => (
                        <span key={index} className="tag badge me-2">
                          {tag}
                        </span>
                      ))}
                      {props.lastEdited && (
                        <div className="text-muted mt-2">
                          Edited {moment(props.lastEdited).fromNow()}
                        </div>
                      )}
                    </Card.Text>
                    {!props.isDashboard ? (
                      eventDateTime > now ? (
                        <Button
                          className="btn-c position-absolute bottom-0 end-0 m-3"
                          onClick={registerForEvent}
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
    </>
  );
};

export default EventCard;
