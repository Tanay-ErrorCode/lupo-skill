import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Card,
  Breadcrumb,
  Pagination,
  Spinner,
} from "react-bootstrap";
import "./ProfilePage.css"; // Import the CSS file
import dora from "../image_assets/dora.png";
import default_user from "../image_assets/default_user.png";
import bannerImage from "../image_assets/bannerImage.png";
import bannerImage2 from "../image_assets/bannerImage2.png";
import EventCard from "../Cards/EventCard/EventCard";
import EditProfile from "../Cards/EditProfile/EditProfile";

import { ref, get, child, set } from "firebase/database";
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
import { useParams } from "react-router-dom";
type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  tags: string;
  banner: string;
  host: string;
};

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

  // const totalJoinedPages = Math.ceil(
  //   joinedEventCardsData.length / itemsPerPage
  // );
  const [totalCreatedPages, setTotalCreatedPages] = useState(1);
  const [totalJoinedPages, setTotalJoinedPages] = useState(1);

  const handleJoinedPageChange = (pageNumber: number) => {
    setCurrentJoinedPage(pageNumber);
  };
  const handleCreatedPageChange = (pageNumber: number) => {
    setCurrentCreatedPage(pageNumber);
  };

  const userEmailId = localStorage.getItem("userEmailId");
  if (userEmailId === null) {
    window.location.href = "#/";
  }
  const usersRef = ref(database, "users");

  useEffect(() => {
    if (localStorage.getItem("userEmailId") === null) {
      window.location.href = "#/";
      toast.warn("You are not signed in",  {transition:Zoom});
    }
    const fetchData = async () => {
      const usersRef = ref(database, "users");
      const userRef = child(usersRef, id + "%40gmail%2Ecom");
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const snap = snapshot.val();
        const headline = document.getElementById("headline");
        const tags = document.getElementById("tags");
        const website = document.getElementById("website");
        const userName = document.getElementById("user-name");
        const profileBanner = document.getElementById("profile-banner");
        const profileImage = document.getElementById("profile-image");

        (headline as HTMLParagraphElement).innerText = snap.name;
        (userName as HTMLHeadingElement).innerText = snap.name;
        (website as HTMLSpanElement).innerText = "NAN";
        (profileBanner as HTMLImageElement).src = snap.banner;
        (profileImage as HTMLImageElement).src = snap.pic;

        if (snap.tags !== "") {
          const tagsArray = snap.tags.split(",");
          const tagsHTML = tagsArray
            .map(
              (tag: string, index: number) =>
                `<span key=${index} class="tag badge me-2">${tag}</span>`
            )
            .join("");
          (tags as HTMLElement).innerHTML = tagsHTML;
        } else {
          const tagsHTML = ["none"]
            .map(
              (tag: string, index: number) =>
                `<span key=${index} class="tag badge me-2">${tag}</span>`
            )
            .join("");
          (tags as HTMLElement).innerHTML = tagsHTML;
        }
        if (snapshot.exists() && snapshot.hasChild("createdEvents")) {
          const eventList = snapshot.val().createdEvents.split(",");
          eventList.forEach((eventId: string) => {
            const trimmedEventId = eventId.trim();
            const eventsRef = ref(database, "events");
            const eventRef = child(eventsRef, trimmedEventId);
            get(eventRef).then((snapshot) => {
              if (snapshot.exists()) {
                const event = snapshot.val();
                setCreatedEventCardsData((prev: any[]) => [...prev, event]);
                setIsCLoading(false);
              } else {
                console.log("No data available");
              }
            });
          });
        }
      } else {
        console.log("No data available");
        setIsCLoading(false);
      }
      if (snapshot.exists() && snapshot.hasChild("registeredEvents")) {
        const eventList = snapshot.val().registeredEvents.split(",");
        // console.log(Object.values(snapshot.val()));
        // setEventCardsData(Object.values(snapshot.val()));
        // setTotalPages(totalPages);
        // setIsLoading(false);
        eventList.forEach((eventId: string) => {
          const trimmedEventId = eventId.trim();
          const eventsRef = ref(database, "events");
          const eventRef = child(eventsRef, trimmedEventId);
          get(eventRef).then((snapshot) => {
            if (snapshot.exists()) {
              const event = snapshot.val();
              setJoinedEventCardsData((prev: any[]) => [...prev, event]);
              setTotalJoinedPages(
                Math.ceil(joinedEventCardsData.length / itemsPerPage)
              );
              setIsJLoading(false);
            } else {
              console.log("No data available");
            }
          });
        });
      }
    };
    if (usersRef !== null && userEmailId !== null && id !== null) {
      fetchData();
    }
  }, []);
  return (
    <Container className="mt-5">
      <Row className="gutters-sm">
        <Col md={4} className="mb-3 ">
          <div className="card">
            <div className="card-body ">
              <div className="profile-banner-wrapper position-relative">
                <Image
                  src={bannerImage}
                  alt="Banner"
                  className="profile-banner"
                  fluid
                  id="profile-banner"
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
                <EditProfile />
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
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Website
                  </h6>
                  <span className="text-secondary" id="website">
                    NAN
                  </span>
                </li>
                {/* Other list items */}
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="mb-3" style={{zIndex:"-1"}}>
            <Card.Body>
              <Row>
                <Col sm={3}>
                  <h6 className="mb-0">Created Events</h6>
                </Col>
              </Row>
              <hr />

              {isCLoading ? (
                <div className="d-flex justify-content-center align-items-center">
                                  <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" />
                </div>
                </div>
              ) : (
                <div>
                  {createdEventCardsData
                    .slice(
                      (currentCreatedPage - 1) * itemsPerPage,
                      currentCreatedPage * itemsPerPage
                    )
                    .map(
                      (
                        card: {
                          id: string;
                          title: string;
                          description: string;
                          date: string;
                          time: string;
                          tags: string;
                          banner: string;
                          host: string;
                        },
                        index
                      ) => (
                        <EventCard
                          id={card.id}
                          key={index}
                          title={card.title}
                          description={card.description}
                          date={card.date}
                          time={card.time}
                          tags={card.tags}
                          host={card.host.split("%40")[0]}
                          isDashboard={false}
                          image={card.banner}
                        />
                      )
                    )}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Pagination>
                  {[...Array(totalCreatedPages)].map((e, i) => (
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
              {/* Other rows */}
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
                  {joinedEventCardsData
                    .slice(
                      (currentJoinedPage - 1) * itemsPerPage,
                      currentJoinedPage * itemsPerPage
                    )
                    .map((card, index) => (
                      <EventCard
                        id="{card.id}"
                        key={index}
                        title={card.title}
                        description={card.description}
                        date={card.date}
                        time={card.time}
                        tags={card.tags}
                        host={card.host.split("%40")[0]}
                        isDashboard={false}
                        image={card.banner}
                      />
                    ))}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Pagination>
                  {[...Array(totalJoinedPages)].map((e, i) => (
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
              {/* Other rows */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
