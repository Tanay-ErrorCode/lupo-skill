import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Card,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";
import "./ProfilePage.css";
import default_user from "../image_assets/default_user.png";
import bannerImage from "../image_assets/bannerImage.png";
import EventCard from "../Cards/EventCard/EventCard";
import EditProfile from "../Cards/EditProfile/EditProfile";
import EditEventModal from "./EditEventModal";

import { ref, get, update, child } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { auth, database } from "../../firebaseConf";
import { Instagram, Twitter, Facebook } from "@mui/icons-material";
import { X } from "@mui/icons-material";

const currentUserUid = localStorage.getItem("userUid");

interface Event {
  banner: string;
  createdAt: number;
  date: string;
  description: string;
  host: string;
  hostName: string;
  id: string;
  registrants: string;
  tags: string;
  time: string;
  title: string;
}

const ProfilePage = () => {
  const [currentJoinedPage, setCurrentJoinedPage] = useState(1);
  const [currentCreatedPage, setCurrentCreatedPage] = useState(1);
  const itemsPerPage = 3;
  const { id } = useParams();
  const [isCLoading, setIsCLoading] = useState(true);
  const [isJLoading, setIsJLoading] = useState(true);

  const [joinedEventCardsData, setJoinedEventCardsData] = useState<Event[]>([]);
  const [createdEventCardsData, setCreatedEventCardsData] = useState<Event[]>(
    []
  );
  const [totalCreatedPages, setTotalCreatedPages] = useState(1);
  const [totalJoinedPages, setTotalJoinedPages] = useState(1);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const userUid = localStorage.getItem("userUid");
  if (userUid === null) {
    window.location.href = "#/";
  }

  const fetchEvents = async (eventIds: string) => {
    const eventsRef = ref(database, "events");
    const eventList = eventIds.split(",");
    const eventPromises = eventList.map(async (eventId: string) => {
      const eventRef = child(eventsRef, eventId.trim());
      const eventSnapshot = await get(eventRef);
      return eventSnapshot.exists() ? eventSnapshot.val() : null;
    });

    const events = await Promise.all(eventPromises);
    return events.filter((event): event is Event => event !== null);
  };

  useEffect(() => {
    if (!userUid) {
      window.location.href = "#/";
      toast.warn("You are not signed in", { transition: Zoom });
      return;
    }

    const fetchData = async () => {
      setIsCLoading(true);
      setIsJLoading(true);

      const userRef = ref(database, `users/${id ? id : userUid}`);

      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.createdEvents) {
            const createdEvents = await fetchEvents(userData.createdEvents);
            setCreatedEventCardsData(createdEvents);
            setTotalCreatedPages(
              Math.ceil(createdEvents.length / itemsPerPage)
            );
          }
          if (userData.registeredEvents) {
            const joinedEvents = await fetchEvents(userData.registeredEvents);
            setJoinedEventCardsData(joinedEvents);
            setTotalJoinedPages(Math.ceil(joinedEvents.length / itemsPerPage));
          }
        } else {
          console.log("No user data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsCLoading(false);
        setIsJLoading(false);
      }
    };

    fetchData();
  }, [userUid, id]);

  const handleCreatedPageChange = (page: number) => {
    setCurrentCreatedPage(page);
  };

  const handleJoinedPageChange = (page: number) => {
    setCurrentJoinedPage(page);
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const refreshEvents = async () => {
    const userRef = ref(database, `users/${id ? id : userUid}`);

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();

        if (userData.createdEvents) {
          const createdEvents = await fetchEvents(userData.createdEvents);
          setCreatedEventCardsData(createdEvents);
          setTotalCreatedPages(Math.ceil(createdEvents.length / itemsPerPage));
        }
        if (userData.registeredEvents) {
          const joinedEvents = await fetchEvents(userData.registeredEvents);
          setJoinedEventCardsData(joinedEvents);
          setTotalJoinedPages(Math.ceil(joinedEvents.length / itemsPerPage));
        }
      } else {
        console.log("No user data available");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="gutters-sm">
        <Col md={4} className="mb-3">
          <div className="card">
            <div className="card-body">
              <div className="profile-banner-wrapper position-relative">
                <Image
                  src={bannerImage}
                  alt="Banner"
                  className="profile-banner"
                  fluid
                  id="profile-banner"
                  style={{ pointerEvents: "none", borderRadius: "16px" }}
                />
                <div className="profile-image-overlay position-absolute top-100 start-50 translate-middle">
                  <Image
                    src={default_user}
                    alt="Admin"
                    className="profile-round"
                    width={150}
                    id="profile-image"
                  />
                </div>
              </div>
              <div className="mt-5 text-center">
                <h4 id="user-name">Sample User</h4>
                <p className="text-secondary mb-1" id="headline">
                  Developer
                </p>
                <div id="tags">
                  <span className="tag badge me-2">None</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0">
                  <Instagram className="bi bi-instagram" />
                </h6>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary"
                  id="instagram"
                  style={{ opacity: "0.5", pointerEvents: "none" }}
                >
                  Instagram
                </a>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0">
                  <Twitter className="bi bi-twitter" />
                </h6>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary"
                  id="twitter"
                  style={{ opacity: "0.5", pointerEvents: "none" }}
                >
                  Twitter
                </a>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0">
                  <Facebook className="bi bi-facebook" />
                </h6>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary"
                  id="facebook"
                  style={{ opacity: "0.5", pointerEvents: "none" }}
                >
                  Facebook
                </a>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0">
                  <X className="bi bi-globe" />
                </h6>
                <span className="text-secondary" id="website">
                  NAN
                </span>
              </li>
            </ul>
          </div>
          {currentUserUid === id ? (
            <div className="d-grid gap-2 mt-3">
              <EditProfile />
            </div>
          ) : null}
        </Col>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Col sm={3}>
                  <h6 className="mb-0">Joined Events</h6>
                </Col>
              </Row>
              <hr />
              {isJLoading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div>
                  {joinedEventCardsData.length === 0 ? (
                    <p className="text-center">No Events joined</p>
                  ) : (
                    joinedEventCardsData
                      .slice(
                        (currentJoinedPage - 1) * itemsPerPage,
                        currentJoinedPage * itemsPerPage
                      )
                      .map((card: Event, index) => {
                        const user_uid = localStorage.getItem("userUid");
                        let isRegistered = false;
                        if (card.registrants.includes(user_uid!)) {
                          isRegistered = true;
                        }
                        return (
                          <EventCard
                            key={index}
                            isValid={true}
                            isRegistered={isRegistered}
                            id={card.id}
                            title={card.title}
                            description={card.description}
                            date={card.date}
                            time={card.time}
                            tags={card.tags}
                            host={card.host}
                            isDashboard={false}
                            image={card.banner}
                            hostName={card.hostName}
                          />
                        );
                      })
                  )}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Pagination>
                  {[...Array(totalJoinedPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentJoinedPage}
                      onClick={() => {
                        setCurrentJoinedPage(i + 1);
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </div>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Col sm={3}>
                  <h6 className="mb-0">Created Events</h6>
                </Col>
              </Row>
              <hr />
              {isCLoading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div>
                  {createdEventCardsData.length === 0 ? (
                    <p className="text-center">No Events created</p>
                  ) : (
                    createdEventCardsData
                      .slice(
                        (currentCreatedPage - 1) * itemsPerPage,
                        currentCreatedPage * itemsPerPage
                      )
                      .map((card: Event, index) => {
                        const user_uid = localStorage.getItem("userUid");
                        let isRegistered = false;
                        if (card.registrants.includes(user_uid!)) {
                          isRegistered = true;
                        }
                        return (
                          <div
                            key={index}
                            className="d-flex justify-content-between"
                          >
                            <EventCard
                              isValid={true}
                              isRegistered={isRegistered}
                              id={card.id}
                              title={card.title}
                              description={card.description}
                              date={card.date}
                              time={card.time}
                              tags={card.tags}
                              host={card.host}
                              isDashboard={false}
                              image={card.banner}
                              hostName={card.hostName}
                            />
                            <Pencil
                              style={{ cursor: "pointer" }}
                              onClick={() => handleEditClick(card)}
                            />
                          </div>
                        );
                      })
                  )}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Pagination>
                  {[...Array(totalCreatedPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentCreatedPage}
                      onClick={() => {
                        setCurrentCreatedPage(i + 1);
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </div>
            </Card.Body>
          </Card>
          <EditEventModal
            show={showEditModal}
            handleClose={handleCloseEditModal}
            event={selectedEvent}
            refreshEvents={refreshEvents}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
