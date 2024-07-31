import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ref, get, child, update, remove } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { Zoom, toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import "./EventCard.css";
import { database } from "../../../firebaseConf";
import placeholderImage from '../../image_assets/bannerImage.png';

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

const EventCard: React.FC<EventCardProps> = (props) => {
  const [registerData, setRegisterData] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>('/path/to/placeholder.png'); // Default placeholder

  useEffect(() => {
    fetchUserData();
    fetchImageURL();
  }, [props.isRegistered, props.image]);

  const fetchUserData = async () => {
    const userUid = localStorage.getItem("userUid");
    if (userUid) {
      const userRef = child(ref(database, "users"), userUid);
      const snapshot = await get(userRef);
      if (snapshot.exists() && snapshot.val().registeredEvents) {
        const registeredEventsArray = snapshot.val().registeredEvents.split(",");
        setRegisterData(registeredEventsArray.includes(props.id));
      } else {
        setRegisterData(false);
      }
    } else {
      setRegisterData(false);
    }
  };

  const fetchImageURL = async () => {
    if (props.image) {
      try {
        const storage = getStorage();
        const imageRef = storageRef(storage, props.image);
        const url = await getDownloadURL(imageRef);
        setImageURL(url);
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageURL(placeholderImage); // Use a placeholder image if error occurs
      }
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
        toast.error("You are already registered for this event", { transition: Zoom });
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
        toast.success("Successfully registered for the event", { transition: Zoom });
      } else {
        toast.error("Event does not exist", { transition: Zoom });
      }
    } else {
      toast.error("User does not exist", { transition: Zoom });
    }
  };

  const cancelRegistration = async () => {
    if (!window.confirm("Are you sure you want to cancel registration?")) return;

    const userUid = localStorage.getItem("userUid");
    if (!userUid) {
      toast.warn("You are not signed in", { transition: Zoom });
      return;
    }

    const userRef = child(ref(database, "users"), userUid);
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      let registeredEventsArray = userSnapshot.val().registeredEvents.split(",");
      if (!registeredEventsArray.includes(props.id)) {
        toast.error("You are not registered for this event", { transition: Zoom });
        return;
      }

      registeredEventsArray = registeredEventsArray.filter((eventId: string) => eventId !== props.id);
      await update(userRef, {
        registeredEvents: registeredEventsArray.join(","),
      });

      const eventRef = child(ref(database, "events"), props.id);
      const eventSnapshot = await get(eventRef);
      if (eventSnapshot.exists()) {
        let registrantsArray = eventSnapshot.val().registrants
          ? eventSnapshot.val().registrants.split(",")
          : [];
          registrantsArray = registrantsArray.filter((uid: string) => uid !== userUid);
          await update(eventRef, { registrants: registrantsArray.join(",") });

        setRegisterData(false);
        toast.success("Successfully canceled registration for the event", { transition: Zoom });
      } else {
        toast.error("Event does not exist", { transition: Zoom });
      }
    } else {
      toast.error("User does not exist", { transition: Zoom });
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const eventRef = ref(database, `events/${props.id}`);
      await remove(eventRef);

      const userUid = localStorage.getItem("userUid");
      if (userUid) {
        const userRef = ref(database, `users/${userUid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          let createdEventsArray: string[] = snapshot.val().createdEvents.split(",");
          createdEventsArray = createdEventsArray.filter(eventId => eventId !== props.id);
          await update(userRef, {
            createdEvents: createdEventsArray.join(","),
          });
        }
      }

      toast.success("Event successfully deleted", { transition: Zoom });
      window.location.reload();

      if (props.onBackToDashboard) {
        props.onBackToDashboard();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event", { transition: Zoom });
    }
  };

  // Corrected parsing of date and time
  const eventDateTime = new Date(`${props.date} ${props.time}`);
  const now = new Date();

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} lg={6}>
          <Card className={`mb-3 shadow card card-background ${props.isDashboard ? 'dashboard-card' : ''}`}>
            <Card.Img
              src={imageURL}
              alt={props.title}
              className="card_image"
            />
            <Card.Body style={{ position: "relative" }}>
              <Card.Title>{props.title}</Card.Title>
              <Card.Text>
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-calendar"></i>
                  <span className="ms-2">{props.date}</span>
                  <i className="bi bi-clock ms-2"></i>
                  <span className="ms-2">{props.time}</span>
                </div>
                Host:{" "}
                <Link
                  to={`/profile/${props.host}`}
                  className="link-primary"
                >
                  {props.hostName}
                </Link>
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
              {eventDateTime > now ? (
                <Button
                  className={`${
                    (props.isValid && props.isRegistered) || registerData
                      ? "btn-unregister"
                      : "btn-c"
                  } position-absolute end-0 bottom-0 m-3`}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EventCard;
