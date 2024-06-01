import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { Grid } from "@mui/material";

interface Event {
  banner: string;
  createdAt: number;
  date: string;
  description: string;
  host: string;
  hostName: string;
  id: string;
  registrants: string[];
  tags: string;
  time: string;
  title: string;
}

const EventList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [eventCardsData, setEventCardsData] = useState<Event[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortedEvents, setSortedEvents] = useState<Event[]>([]);
  const [sortOption, setSortOption] = useState<
    "All" | "Ongoing" | "Past" | "Upcoming"
  >("All");

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const sortEvents = (
    events: Event[],
    option: "All" | "Ongoing" | "Past" | "Upcoming"
  ): Event[] => {
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
        const snapshotValue = snapshot.val();
        if (snapshotValue !== null && typeof snapshotValue === "object") {
          const res: Event[] = Object.values(snapshotValue) as Event[];
          res.sort((a: Event, b: Event) => b.createdAt - a.createdAt);
          setEventCardsData(res);
          const filteredEvents = sortEvents(res, sortOption);
          setSortedEvents(filteredEvents);
          setTotalPages(Math.ceil(filteredEvents.length / itemsPerPage));
          setIsLoading(false);
        }
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
    <div
      style={{
        paddingTop: "6.5em",
      }}
    >
      {isLoading ? (
        <div className=" d-flex justify-content-center align-items-center spinner-container">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <h1 style={{ textAlign: "center", marginBottom: "1em" }}>
            All Events
          </h1>
          <div className="d-flex justify-content-center">
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
            <Grid container spacing={2} justifyContent="center">
              {sortedEvents
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((card: Event, index) => {
                  const user_uid = localStorage.getItem("userUid");
                  const isRegistered = card.registrants.includes(user_uid!);
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
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
                    </Grid>
                  );
                })}
            </Grid>
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination>
              {[...Array(totalPages)].map((_, i) => (
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
