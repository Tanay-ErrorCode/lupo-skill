import React, { useEffect, useState } from "react";
import EventCard from "../Cards/EventCard/EventCard";
import { Pagination, Spinner, DropdownButton, Dropdown } from "react-bootstrap";
import bannerImage3 from "../image_assets/bannerImage3.png";
import "./EventList.css";
import {
  auth,
  firestore,
  database,
  storage,
  signInWithGooglePopup,
} from "../../firebaseConf";
import GoogleButton from "react-google-button";
import { ref, get, child, set } from "firebase/database";
import { toast } from "react-toastify";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const EventList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [eventCardsData, setEventCardsData] = useState<any[]>([]);
  const [sortedEvents, setSortedEvents] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState<
    "All" | "Ongoing" | "Past" | "Upcoming"
  >("All");

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const sortEvents = (
    events: any[],
    option: "All" | "Ongoing" | "Past" | "Upcoming"
  ): any[] => {
    const now = new Date();
    switch (option) {
      case "Ongoing":
        return events.filter((event) => {
          const eventDate = new Date(`${event.date} ${event.time}`);
          const eventEndDate = new Date(eventDate);
          eventEndDate.setHours(eventDate.getHours() + 2); // Assuming events last 2 hours
          return eventDate <= now && now <= eventEndDate;
        });
      case "Past":
        return events.filter(
          (event) => new Date(`${event.date} ${event.time}`) < now
        );
      case "Upcoming":
        return events.filter(
          (event) => new Date(`${event.date} ${event.time}`) > now
        );
      case "All":
      default:
        return events;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database, "events");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const events: any[] = Object.values(snapshot.val());
        setEventCardsData(events);
        const filteredEvents = sortEvents(events, sortOption);
        setSortedEvents(filteredEvents);
        setTotalPages(Math.ceil(filteredEvents.length / itemsPerPage));
        setIsLoading(false);
      } else {
        console.log("No data available");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredEvents = sortEvents(eventCardsData, sortOption);
    setSortedEvents(filteredEvents);
    setTotalPages(Math.ceil(filteredEvents.length / itemsPerPage));
  }, [eventCardsData, sortOption]);

  const renderNoEventsMessage = (
    option: "All" | "Ongoing" | "Past" | "Upcoming"
  ) => {
    switch (option) {
      case "Upcoming":
        return "No upcoming events found";
      case "Past":
        return "No past events found";
      case "Ongoing":
        return "No ongoing events found";
      case "All":
      default:
        return "No events found";
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <h1
            style={{
              textAlign: "center",
              marginBottom: "1em",
              marginTop: "3em",
            }}
          >
            All Events
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1em",
              marginRight: "15%",
            }}
          >
            <DropdownButton
              id="dropdown-basic-button"
              title={`Sort by: ${sortOption}`}
              variant="dark"
              onSelect={(e: any) => {
                setSortOption(e);
                setCurrentPage(1); // Reset to first page when sort option changes
              }}
              style={{ marginBottom: "1em", textAlign: "center" }}
            >
              <Dropdown.Item eventKey="All">All Events</Dropdown.Item>
              <Dropdown.Item eventKey="Upcoming">Upcoming</Dropdown.Item>
              <Dropdown.Item eventKey="Ongoing">Ongoing</Dropdown.Item>
              <Dropdown.Item eventKey="Past">Past</Dropdown.Item>
            </DropdownButton>
          </div>
          {sortedEvents.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                marginTop: "5em",
                fontSize: "20px",
              }}
            >
              {renderNoEventsMessage(sortOption)}
            </div>
          ) : (
            sortedEvents
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
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
                    registrants: string[];
                    hostName: string;
                  },
                  index
                ) => {
                  const user_uid = localStorage.getItem("userUid");
                  let isRegistered = false;
                  if (card.registrants.includes(user_uid!)) {
                    isRegistered = true;
                  }
                  return (
                    <div className="event-card-wrapper" key={index}>
                      <EventCard
                        isValid={true}
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
                        isRegistered={isRegistered}
                        hostName={card.hostName}
                      />
                    </div>
                  );
                }
              )
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination>
              {[...Array(totalPages)].map((e, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => {
                    handlePageChange(i + 1);
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
        </>
      )}
    </div>
  );
};

export default EventList;
