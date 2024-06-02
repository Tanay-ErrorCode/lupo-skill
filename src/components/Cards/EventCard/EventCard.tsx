import React, { useState } from "react";
// import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "./EventCard.css";
// import props.image from "../../image_assets/props.image.png";
import { Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container, Grid, Box } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

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
import theme from "../../../theme";
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
}

const EventCard: React.FC<EventCardProps> = (props) => {
  const [register_data, setRegister_data] = useState<boolean>(false);
  const registerForEventX = async () => {
    const usersRef = ref(database, "users");
    const userUid = localStorage.getItem("userUid");

    if (userUid === null) {
      toast.warn("You are not signed in", { transition: Zoom });

      return;
    }
    const userRef = child(usersRef, userUid);

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
        setRegister_data(true);
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
              if (registrantsArray.includes(userUid)) {
                toast.error("You are already registered for this event", {
                  transition: Zoom,
                });
                return;
              }

              registrantsArray.push(userUid);
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
              if (registrantsArray.includes(userUid)) {
                toast.error("You are already registered for this event", {
                  transition: Zoom,
                });
                return;
              }

              registrantsArray.push(userUid);
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
    <Container
      className="shadow"
      style={{
        padding: "8px",
        borderRadius: theme.borderRadius.medium,
        border: "2px solid ",
        borderColor: theme.colors.secondaryLight,
        position: "relative",
        height: "auto",
        marginBottom: "16px",
      }}
    >
      {!props.isDashboard ? (
        <Card className="" style={{ boxShadow: "none", height: "100%" }}>
          <CardMedia
            component="img"
            image={props.image}
            alt="Card Image"
            className="card_image"
            style={{ height: "224px" }}
          />
          <CardContent
            style={{
              padding: "16px",
            }}
          >
            <Typography
              style={{
                fontSize: theme.fontSize.subheading,
                fontWeight: 800,
              }}
              className="card-title"
              component="div"
            >
              {props.title}
            </Typography>
            <div
              className="link-primary"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.lightBackground,
              }}
            >
              <a href={"#/profile/" + props.host}>{props.hostName}</a>
            </div>
            <p className="card-description"> {props.description}</p>
            <div className="d-flex align-items-center justify-between mt-4">
              <div className="d-flex align-items-center ">
                <EventAvailableIcon
                  style={{
                    fontSize: theme.fontSize.subheading,
                    color: theme.colors.primary,
                  }}
                />
                <span className="card-time ">
                  <span className="ms-2">{props.date}</span>
                  <span className="ms-2">
                    {props.time.replace(/\s\(India Standard Time\)/, "")}
                  </span>
                </span>
              </div>
              <div>
                {new Date(props.date) > new Date() ? (
                  <Button
                    style={{
                      color: "black",
                      textTransform: "none",
                      fontSize: theme.fontSize.textBody,
                      fontWeight: "700",
                      padding: "2px 12px",
                      backgroundColor: "rgba(63, 196, 0, 0.5)",
                      borderRadius: "8px",
                    }}
                    className={`${
                      (props.isValid && props.isRegistered) || register_data
                        ? "registration_color"
                        : "btn-e"
                    }    `}
                    onClick={registerForEventX}
                    disabled={
                      (props.isValid && props.isRegistered) || register_data
                    }
                  >
                    {(props.isValid && props.isRegistered) || register_data
                      ? "Registered"
                      : "Register"}
                  </Button>
                ) : (
                  <Button
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      color: "black",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: theme.fontSize.textBody,
                    }}
                    className="btn-d "
                  >
                    Expired
                  </Button>
                )}
              </div>
            </div>
            <hr
              style={{
                color: theme.colors.secondaryLight,
                border: "1px solid",
              }}
            />

            {props.tags.split(",").map((tag, index) => (
              <Chip
                label={tag}
                key={index}
                clickable
                sx={{
                  backgroundColor: theme.colors.secondaryLight,
                  fontWeight: "bold",
                  marginX: "0.3rem",
                }}
              />
            ))}
          </CardContent>

          {/* <Button
                  className="btn-c position-absolute bottom-0 end-0 m-3"
                  onClick={registerForEventX}
                >
                  Register
                </Button> */}
        </Card>
      ) : (
        // <Link href={"#/eventDetails/" + props.id} className="link-nothing">
        <Link
          href={`#/eventDetails/${props.id}`}
          className="link-nothing"
          style={{ textDecoration: "none" }}
        >
          <Card className="" style={{ boxShadow: "none" }}>
            <CardMedia
              component="img"
              image={props.image}
              alt="Card Image"
              className="card_image"
              style={{ height: "224px" }}
            />

            <CardContent
              style={{
                padding: "16px",
              }}
            >
              <Typography
                style={{
                  fontSize: theme.fontSize.subheading,
                  fontWeight: 800,
                }}
                component="div"
                className="card-title"
              >
                {props.title}
              </Typography>
              <div
                className="link-primary"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.lightBackground,
                }}
              >
                <a href={"#/profile/" + props.host}>{props.hostName}</a>
              </div>
              <p className="card-description"> {props.description}</p>
              <div className="d-flex align-items-center mt-4 ">
                <EventAvailableIcon
                  style={{ fontSize: "26px", color: theme.colors.primary }}
                />
                <span className="card-time">
                  <span className="ms-2">{props.date}</span>
                  <span className="ms-2">
                    {props.time.replace(/\s\(Indian Standard Time\)/, "")}
                  </span>
                </span>
                {!props.isDashboard ? (
                  new Date(props.date) > new Date() ? (
                    <Button className="btn-c  m-3" onClick={registerForEventX}>
                      Register
                    </Button>
                  ) : (
                    <Button
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        color: "black",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                      className="btn-d  m-2"
                    >
                      Expired
                    </Button>
                  )
                ) : null}
              </div>
              <hr
                style={{
                  color: theme.colors.secondaryLight,
                  border: "1px solid",
                }}
              />
              <Stack direction="row" spacing={1}>
                {props.tags.split(",").map((tag, index) => (
                  <Chip
                    label={tag}
                    key={index}
                    clickable
                    sx={{
                      backgroundColor: theme.colors.secondaryLight,
                      fontWeight: "bold",
                      marginX: "0.3rem",
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Link>
      )}
    </Container>
  );
};

export default EventCard;
