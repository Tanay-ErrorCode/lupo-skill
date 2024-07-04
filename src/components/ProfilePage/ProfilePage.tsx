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
import EditEventModal from "../Cards/EditEventModal/EditEventModal";
import { ref, get, child } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { auth, database } from "../../firebaseConf";
// import { Instagram, Twitter, Facebook } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { X } from "@mui/icons-material";
import PageTitle from "../../utils/PageTitle";
import { classifyLink } from "../../utils/InputLink";

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
  lastEdited?: number;
}
interface Link {
  [key: string]: string;
}

const ProfilePage = () => {
  const [currentJoinedPage, setCurrentJoinedPage] = useState(1);
  const [currentCreatedPage, setCurrentCreatedPage] = useState(1);

  const itemsPerPage = 3;
  const { id } = useParams();
  const [isCLoading, setIsCLoading] = useState(true);
  const [isJLoading, setIsJLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [joinedEventCardsData, setJoinedEventCardsData] = useState<Event[]>([]);
  const [createdEventCardsData, setCreatedEventCardsData] = useState<Event[]>(
    []
  );
  const [banner, setBanner] = useState<string | null>(null);
  const [links, setLinks] = useState<Link>({});
  const [totalCreatedPages, setTotalCreatedPages] = useState(1);
  const [totalJoinedPages, setTotalJoinedPages] = useState(1);
  const [username, setUsername] = useState<string>("");
  const userUid = localStorage.getItem("userUid");
  if (userUid === null) {
    window.location.href = "/";
  }
  const openEditModal = (event: Event) => {
    setCurrentEvent(event);
    setShowEditModal(true);
  };

  useEffect(() => {
    if (!userUid) {
      window.location.href = "/";
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
      setLinks(userData.links || {});

      setBanner(userData.banner);

      profileImage.src = userData.pic || userData.profile || default_user;

      const tagsArray = userData.tags ? userData.tags.split(",") : ["none"];
      tags.innerHTML = tagsArray
        .map(
          (tag: string, index: number) =>
            `<span key=${index} class="tag badge me-2">${tag}</span>`
        )
        .join("");
      setUsername(userData.name || "Profile");
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
    <>
      <PageTitle
        title={username ? `${username} | Lupo Skill` : "Profile | Lupo Skill"}
      />
      <Container className="mt-5" style={{ paddingTop: "6.5em" }}>
        <Row className="gutters-sm">
          <Col md={4} className="mb-3">
            <div className="card">
              <div className="card-body">
                <div className="profile-banner-wrapper position-relative">
                  {banner && !banner.startsWith("#") ? (
                    <Image
                      src={banner}
                      alt="Banner"
                      className="profile-banner"
                      fluid
                      id="profile-banner"
                      style={{ pointerEvents: "none", borderRadius: "16px" }}
                    />
                  ) : (
                    <div
                      className="profile-banner-color"
                      style={{
                        backgroundColor: `${banner}`, // Use backgroundColor instead of background
                        borderRadius: "16px",
                        height: "200px", // Example height, you can adjust as needed
                      }}
                    ></div>
                  )}
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
                    <div className=" d-flex justify-content-center align-items-center flex-wrap ">
                      {Object.keys(links).map((key, index) => {
                        const linkInfo = classifyLink(links[key]);
                        const IconComponent = linkInfo.icon;
                        return (
                          <div className="mb-2" key={index}>
                            <a
                              href={links[key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-flex align-items-center text-black text-decoration-none"
                            >
                              <IconComponent size={24} className="me-2" />
                            </a>
                          </div>
                        );
                      })}
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
                            <div style={{ display: "flex" }}>
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
                                showEditIcon={true} // Pass showEditIcon prop as true
                                showDeleteIcon={true}
                                onEditEvent={() => openEditModal(card)}
                                lastEdited={card.lastEdited} // Pass the last edited timestamp
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
        <EditEventModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          event={currentEvent}
          refreshEvents={() => {
            // Function to refresh events after editing
          }}
        />
      </Container>
    </>
  );
};

export default ProfilePage;
