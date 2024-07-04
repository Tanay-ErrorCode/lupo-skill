import React, { useEffect, useState, useRef } from "react";
import EventCard from "../Cards/EventCard/EventCard";
import {
  Pagination,
  Spinner,
  DropdownButton,
  Dropdown,
  Button,
} from "react-bootstrap";
import "./EventList.css";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ref, get, set } from "firebase/database";
import { database } from "../../firebaseConf";

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
  lastEdited?: number;
}

const EventList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [eventCardsData, setEventCardsData] = useState<Event[]>([
    {
      banner: "https://example.com/event1.jpg",
      createdAt: 1657036800000,
      date: "2024-07-20",
      description: "A workshop on modern JavaScript frameworks and libraries.",
      host: "js_dev_conference",
      hostName: "JS Dev Conference",
      id: "event1",
      registrants: ["user1", "user2", "user3"],
      tags: "javascript, development, workshop",
      time: "10:00 AM - 4:00 PM",
      title: "Modern JavaScript Workshop",
      lastEdited: 1659648000000,
    },
    {
      banner: "https://example.com/event2.jpg",
      createdAt: 1657123200000,
      date: "2024-08-05",
      description:
        "An introductory seminar on blockchain technology and its applications.",
      host: "blockchain_hub",
      hostName: "Blockchain Hub",
      id: "event2",
      registrants: ["user4", "user5", "user6"],
      tags: "blockchain, seminar, technology",
      time: "1:00 PM - 5:00 PM",
      title: "Blockchain Basics Seminar",
      lastEdited: 1659734400000,
    },
    {
      banner: "https://example.com/event3.jpg",
      createdAt: 1657209600000,
      date: "2024-09-10",
      description:
        "A conference on the latest trends and innovations in AI and machine learning.",
      host: "ai_conference",
      hostName: "AI Conference",
      id: "event3",
      registrants: ["user7", "user8", "user9"],
      tags: "AI, machine learning, conference",
      time: "9:00 AM - 6:00 PM",
      title: "AI and Machine Learning Conference",
      lastEdited: 1659820800000,
    },
    {
      banner: "https://example.com/event4.jpg",
      createdAt: 1657296000000,
      date: "2024-10-15",
      description:
        "A hands-on hackathon for building innovative solutions using MERN stack.",
      host: "mern_hackathon",
      hostName: "MERN Hackathon",
      id: "event4",
      registrants: ["user10", "user11", "user12"],
      tags: "hackathon, MERN, coding",
      time: "8:00 AM - 8:00 PM",
      title: "MERN Stack Hackathon",
      lastEdited: 1659907200000,
    },
  ]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortedEvents, setSortedEvents] = useState<Event[]>([]);
  const [sortOption, setSortOption] = useState<
    "All" | "Ongoing" | "Past" | "Upcoming"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

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

  const filterEventsByTitle = (events: Event[], query: string): Event[] => {
    return events.filter((event) =>
      event.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (e.target.value.length >= 3) {
      setShowMessage(false);
      searchTimeoutRef.current = window.setTimeout(() => {
        const trimmedQuery = e.target.value.trim();
        const filteredEvents = filterEventsByTitle(
          eventCardsData,
          trimmedQuery
        );
        const sortedFilteredEvents = sortEvents(filteredEvents, sortOption);
        setSortedEvents(sortedFilteredEvents);
        setDisplayedEvents(sortedFilteredEvents);
        setTotalPages(Math.ceil(sortedFilteredEvents.length / itemsPerPage));
        setCurrentPage(1);
      }, 1000);
    } else {
      setShowMessage(true);
      setSortedEvents(eventCardsData);
      setDisplayedEvents(eventCardsData);
      setTotalPages(Math.ceil(eventCardsData.length / itemsPerPage));
      setCurrentPage(1);
    }
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    const filteredEvents = filterEventsByTitle(eventCardsData, trimmedQuery);
    const sortedFilteredEvents = sortEvents(filteredEvents, sortOption);
    setSortedEvents(sortedFilteredEvents);
    setDisplayedEvents(sortedFilteredEvents);
    setTotalPages(Math.ceil(sortedFilteredEvents.length / itemsPerPage));
    setCurrentPage(1);
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
          setSortedEvents(res);
          setDisplayedEvents(res);
          setTotalPages(Math.ceil(res.length / itemsPerPage));
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
    const sortedFilteredEvents = sortEvents(eventCardsData, sortOption);
    setSortedEvents(sortedFilteredEvents);
    setDisplayedEvents(sortedFilteredEvents);
    setTotalPages(Math.ceil(sortedFilteredEvents.length / itemsPerPage));
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
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

          <div className="d-flex justify-content-center align-items-center">
            <div className="search-bar-container m-2">
              <div className="search-input-container">
                <TextField
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  variant="outlined"
                  fullWidth
                  onChange={handleSearchInputChange}
                  className="search-input"
                  onKeyDown={handleKeyPress}
                />
              </div>
              <div className="search-button-container">
                <Button
                  variant="dark"
                  style={{
                    backgroundColor: "#5AB2FF",
                    color: "white",
                    borderColor: "#5AB2FF",
                  }}
                  className="search-button"
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </Button>
              </div>
            </div>
          </div>

          {showMessage && searchQuery.length > 0 && searchQuery.length < 3 && (
            <div
              style={{ textAlign: "center", marginTop: "1em", color: "red" }}
            >
              Please enter at least 3 characters to search
            </div>
          )}

          <div className="d-flex justify-content-center align-items-center">
            <DropdownButton
              id="dropdown-basic-button"
              title={`Sort by: ${sortOption}`}
              style={{
                backgroundColor: "#5AB2FF",
                color: "white",
                borderRadius: "10px",
              }}
              onSelect={(e: any) => {
                setSortOption(e);
                setCurrentPage(1); // Reset to first page when sort option changes
              }}
              className="m-3"
            >
              <Dropdown.Item eventKey="All">All Events</Dropdown.Item>
              <Dropdown.Item eventKey="Upcoming">Upcoming</Dropdown.Item>
              <Dropdown.Item eventKey="Ongoing">Ongoing</Dropdown.Item>
              <Dropdown.Item eventKey="Past">Past</Dropdown.Item>
            </DropdownButton>
          </div>

          {displayedEvents.length === 0 ? (
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
            displayedEvents
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((card: Event, index) => {
                const user_uid = localStorage.getItem("userUid");
                const isRegistered = card.registrants.includes(user_uid!);
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
                      lastEdited={card.lastEdited}
                    />
                  </div>
                );
              })
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
