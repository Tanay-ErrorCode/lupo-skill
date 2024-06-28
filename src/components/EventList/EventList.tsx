import React, { useEffect, useState } from "react";
import EventCard from "../Cards/EventCard/EventCard";
import {
  Pagination,
  Spinner,
  DropdownButton,
  Dropdown,
  Button,
} from "react-bootstrap";
import "./EventList.css";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ref, get } from "firebase/database";
import { database } from "../../firebaseConf";
import AOS from "aos";
import "aos/dist/aos.css";

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
  const [isLoading, setIsLoading] = useState(true);
  const [eventCardsData, setEventCardsData] = useState<Event[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortedEvents, setSortedEvents] = useState<Event[]>([]);
  const [sortOption, setSortOption] = useState<
    "All" | "Ongoing" | "Past" | "Upcoming"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    setTimeout(() => {
      AOS.init({
        duration: 1200,
      });
    }, 100);

    // Refresh AOS on component unmount
    return () => {
      AOS.refreshHard();
    };
  }, []);
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
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    const filteredEvents = filterEventsByTitle(eventCardsData, trimmedQuery);
    const sortedFilteredEvents = sortEvents(filteredEvents, sortOption);
    setSortedEvents(sortedFilteredEvents);
    setDisplayedEvents(sortedFilteredEvents);
    setTotalPages(Math.ceil(sortedFilteredEvents.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when search is performed
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
                  <div className="event-card-wrapper" key={index} data-aos="fade-up">
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
