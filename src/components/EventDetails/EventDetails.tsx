import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, FormControl, InputGroup, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { database } from "../../firebaseConf";
import PageTitle from "../../utils/PageTitle";
import moment from "moment";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const userUid = localStorage.getItem("userUid");
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [banner_Image, setBannerImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [host, setHost] = useState("");
  const [hostName, setHostName] = useState("");
  const [lastEdited, setLastEdited] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [googleMeetLink, setGoogleMeetLink] = useState("Nothing yet, ask the host to add one");

  useEffect(() => {

    if (!userUid) {
      window.location.href = "#/dashboard";

    if (userUid == null) {
      window.location.href = "#/dashboard";
      toast.warn("You are not signed in", { transition: Zoom });

    }
    const fetchData = async () => {
      const eventRef = ref(database, `events/${id}`);
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
        setLastEdited(eventData.lastEdited);

        if (eventData.host === userUid) {
          setIsHost(true);
        }
        if (eventData.registrants) {
          setRegisteredUsers(eventData.registrants.split(","));

          if (!eventData.registrants.split(",").includes(userUid) && userUid !== eventData.host) {
            window.location.href = "#/dashboard";


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
      }
    };
    fetchData();
  }, [id, userUid]);

  const addMeetingLink = () => {
    const eventRef = ref(database, `events/${id}`);
    update(eventRef, { googleMeetLink });
  };

  return (
    <>
      <PageTitle title={`${title} | Lupo Skill`} />
      <div>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ paddingTop: "9.5em" }}>
            <Spinner animation="border" />
          </div>
        ) : (
          <Container className="event-detailcontainer">
            <Row>
              <Col>
                <Card className="p-3 shadow mt-2">
                  <Card.Img variant="top" src={banner_Image} alt="Event Header" className="card-image" />
                  <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Container>
                      <Row className="align-items-center mb-2">
                        <Col xs="auto"><i className="bi bi-calendar"></i></Col>
                        <Col xs="auto">{date}</Col>
                        <Col xs="auto"><i className="bi bi-clock"></i></Col>
                        <Col xs="auto">{time}</Col>
                      </Row>
                      <Row>
                        <Col>

                          Host: <a href={`#/profile/${host}`} className="link-primary">{hostName}</a>

                          Host:{" "}
                          <a
                            href={"#/profile/" + host}
                            className="link-primary"
                          >
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
                            <span key={index} className="tag badge me-2">{tag}</span>
                          ))}
                        </Col>
                      </Row>
                      {lastEdited && (
                        <div className="text-muted mt-2">
                          Edited {moment(lastEdited).fromNow()}
                        </div>
                      )}
                    </Container>
                  </Card.Body>
                </Card>
                <Card className="p-1 mt-2 shadow">
                  <Card.Body>
                    <div>
                      {isHost ? (
                        <InputGroup className="mb-3">
                          <InputGroup.Text>Google Meet link :</InputGroup.Text>
                          <FormControl type="text" value={googleMeetLink} onChange={(e) => setGoogleMeetLink(e.target.value)} />
                          <Button onClick={addMeetingLink} variant="primary">Add Link</Button>
                        </InputGroup>
                      ) : (
                        <span>
                          Google Meet link :{" "}
                          {googleMeetLink === "Nothing yet, ask the host to add one" ? googleMeetLink : <a href={googleMeetLink} className="link-primary">{googleMeetLink}</a>}
                        </span>
                      )}
                    </div>
                  </Card.Body>
                </Card>
                <Card className="p-1 mt-2 shadow">
                  <Card.Body>
                    Number of registrants : {registeredUsers.length}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default EventDetails;
