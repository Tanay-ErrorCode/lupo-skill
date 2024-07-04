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
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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

  // Sample event data
  const sampleEvents: Event[] = [
    {
      banner: "https://example.com/banner1.jpg",
      createdAt: Date.now(),
      date: "2024-07-10",
      description: "Event 1 Description",
      host: "Host 1",
      hostName: "Host Name 1",
      id: "1",
      registrants: ["user1", "user2"],
      tags: "workshop",
      time: "10:00 AM",
      title: "Event 1",
    },
    {
      banner: "https://example.com/banner2.jpg",
      createdAt: Date.now(),
      date: "2024-08-15",
      description: "Event 2 Description",
      host: "Host 2",
      hostName: "Host Name 2",
      id: "2",
      registrants: ["user3", "user4"],
      tags: "conference",
      time: "2:00 PM",
      title: "Event 2",
    },
    {
      banner: "https://example.com/banner3.jpg",
      createdAt: Date.now(),
      date: "2024-09-20",
      description: "Event 3 Description",
      host: "Host 3",
      hostName: "Host Name 3",
      id: "3",
      registrants: ["user5", "user6"],
      tags: "meetup",
      time: "6:00 PM",
      title: "Event 3",
    },
  ];

  useEffect(() => {
    // Set sample events data
    setEventCardsData(sampleEvents);
    setSortedEvents(sampleEvents);
    setDisplayedEvents(sampleEvents);
    setTotalPages(Math.ceil(sampleEvents.length / itemsPerPage));
    setIsLoading(false);
  }, []);

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

  const filterEvents = (events: Event[], query: string): Event[] => {
    const trimmedQuery = query.trim().toLowerCase();
    return events.filter((event) => {
      const eventDate = new Date(event.date).toISOString().slice(0, 10);
      return (
        event.tags.toLowerCase().includes(trimmedQuery) ||
        eventDate.includes(trimmedQuery)
      );
    });
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    const filteredEvents = filterEvents(eventCardsData, searchQuery);
    const sortedFilteredEvents = sortEvents(filteredEvents, sortOption);
    setSortedEvents(sortedFilteredEvents);
    setDisplayedEvents(sortedFilteredEvents);
    setTotalPages(Math.ceil(sortedFilteredEvents.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when search is performed
  };

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
        <div className="d-flex justify-content-center align-items-center spinner-container">
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
                  placeholder="Search by tags or date..."
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
