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
import "./ProfilePage.css";
import default_user from "../image_assets/default_user.png";
import bannerImage from "../image_assets/bannerImage.png";
import EventCard from "../Cards/EventCard/EventCard";
import EditProfile from "../Cards/EditProfile/EditProfile";

import { ref, get, child } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { auth, database } from "../../firebaseConf";
import { Instagram, Twitter, Facebook } from "@mui/icons-material";
import { X } from "@mui/icons-material";
import { Grid } from "@mui/material";

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

  const userUid = localStorage.getItem("userUid");
  if (userUid === null) {
    window.location.href = "#/";
  }

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
          updateProfileData(userData);

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
    const updateProfileData = (userData: any) => {
      const headline = document.getElementById(
        "headline"
      ) as HTMLParagraphElement;
      const tags = document.getElementById("tags") as HTMLElement;
      const website = document.getElementById("website") as HTMLSpanElement;
      const instagram = document.getElementById(
        "instagram"
      ) as HTMLAnchorElement;
      const twitter = document.getElementById("twitter") as HTMLAnchorElement;
      const facebook = document.getElementById("facebook") as HTMLAnchorElement;
      const userName = document.getElementById(
        "user-name"
      ) as HTMLHeadingElement;
      const profileBanner = document.getElementById(
        "profile-banner"
      ) as HTMLImageElement;
      const profileImage = document.getElementById(
        "profile-image"
      ) as HTMLImageElement;

      headline.innerText = userData.headline || "Developer";
      userName.innerText = userData.name || "Sample User";
      website.innerText = userData.website || "NAN";

      const isValidUrl = (url: string) => {
        return url.startsWith("https://");
      };

      if (
        userData.instagram &&
        isValidUrl(userData.instagram.trim()) &&
        userData.instagram != "https://" &&
        userData.instagram != ""
      ) {
        instagram.href = userData.instagram;
        instagram.style.opacity = "1.0";
        instagram.style.pointerEvents = "auto";
      } else {
        instagram.style.opacity = "0.5";
        instagram.style.pointerEvents = "none";
      }

      if (
        userData.twitter &&
        isValidUrl(userData.twitter.trim()) &&
        userData.twitter != "https://" &&
        userData.twitter != ""
      ) {
        twitter.href = userData.twitter;
        twitter.style.opacity = "1.0";
        twitter.style.pointerEvents = "auto";
      } else {
        twitter.style.opacity = "0.5";
        twitter.style.pointerEvents = "none";
      }

      if (
        userData.facebook &&
        isValidUrl(userData.facebook.trim()) &&
        userData.facebook != "https://" &&
        userData.facebook != ""
      ) {
        facebook.href = userData.facebook;
        facebook.style.opacity = "1.0";
        facebook.style.pointerEvents = "auto";
      } else {
        facebook.style.opacity = "0.5";
        facebook.style.pointerEvents = "none";
      }

      profileBanner.src = userData.banner || bannerImage;
      profileImage.src = userData.pic || default_user;

      const tagsArray = userData.tags ? userData.tags.split(",") : ["none"];
      tags.innerHTML = tagsArray
        .map(
          (tag: string, index: number) =>
            `<span key=${index} class="tag badge me-2">${tag}</span>`
        )
        .join("");
    };

    fetchData();
  }, [userUid, id]);

  const handleCreatedPageChange = (page: number) => {
    setCurrentCreatedPage(page);
  };

  const handleJoinedPageChange = (page: number) => {
    setCurrentJoinedPage(page);
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
                  {["dev", "designer", "react", "angular", "vue"].map(
                    (tag, index) => (
                      <span key={index} className="tag badge me-2">
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-center mt-2">
                {currentUserUid === id && <EditProfile />}
              </div>
            </div>
          </div>
          <Card className="mt-3">
            <Card.Body>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-globe mr-2 icon-inline"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path>
                    </svg>
                    Website
                  </h6>
                  <span className="text-secondary" id="website">
                    NAN
                  </span>
                  <div className="social-media-list d-flex justify-content-center align-items-center flex-wrap">
                    <div className="social-media-item">
                      <a
                        id="instagram"
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="instagram-icon" />
                      </a>
                      <span className="social-media-label" />
                    </div>
                    <div className="social-media-item">
                      <a
                        id="twitter"
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <X className="x-icon" />
                      </a>
                      <span className="social-media-label" />
                    </div>
                    <div className="social-media-item">
                      <a
                        id="facebook"
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="facebook-icon" />
                      </a>
                      <span className="social-media-label" />
                    </div>
                  </div>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
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
                    <Grid container spacing={1} justifyContent="center">
                      {createdEventCardsData
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
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={6}
                              lg={6}
                              justifyContent="center"
                              key={index}
                              style={{
                                maxWidth: 384,
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <EventCard
                                isValid={true}
                                isRegistered={isRegistered}
                                id={card.id}
                                key={index}
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
                            </Grid>
                          );
                        })}
                    </Grid>
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
                        handleCreatedPageChange(i + 1);
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
                            isValid={true}
                            isRegistered={isRegistered}
                            id={card.id}
                            key={index}
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
                        handleJoinedPageChange(i + 1);
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
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
