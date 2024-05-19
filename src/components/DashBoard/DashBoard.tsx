import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import { ref, get, child } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import EventCard from "../Cards/EventCard/EventCard";
import { database } from "../../firebaseConf";
import "./DashBoard.css";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  tags: string;
  banner: string;
  host: string;
  hostName: string;
};

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (localStorage.getItem("userUid") == null) {
      window.location.href = "#/";
      toast.warn("You are not signed in", { transition: Zoom });
      return;
    }

    const fetchData = async () => {
      const usersRef = ref(database, "users");
      const userUid = localStorage.getItem("userUid");

      if (userUid === null) {
        console.error("User is not logged In.");
        return;
      }

      const userRef = child(usersRef, userUid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        let createdEventList: string[] = [];
        let joinedEventList: string[] = [];

        if (snapshot.hasChild("createdEvents")) {
          createdEventList = snapshot.val().createdEvents.split(",");
        }
        if (snapshot.hasChild("registeredEvents")) {
          joinedEventList = snapshot.val().registeredEvents.split(",");
        }

        const fetchEventDetails = async (
          eventIdList: string[],
          setEventList: React.Dispatch<React.SetStateAction<Event[]>>
        ) => {
          const eventsRef = ref(database, "events");
          const eventDetails = await Promise.all(
            eventIdList.map(async (eventId: string) => {
              const trimmedEventId = eventId.trim();
              const eventRef = child(eventsRef, trimmedEventId);
              const eventSnapshot = await get(eventRef);
              if (eventSnapshot.exists()) {
                return eventSnapshot.val();
              } else {
                console.log(`Event with ID ${trimmedEventId} does not exist`);
                return null;
              }
            })
          );

          setEventList(
            eventDetails.filter((event) => event !== null) as Event[]
          );
        };

        await fetchEventDetails(createdEventList, setCreatedEvents);
        await fetchEventDetails(joinedEventList, setJoinedEvents);

        setIsLoading(false);
      } else {
        console.log("No data available");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
              marginBottom: "2em",
              marginTop: "1em",
            }}
          >
            Created Events
          </h1>
          {createdEvents.length === 0 ? (
            <p>No created events found.</p>
          ) : (
            createdEvents
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((card: Event, index) => (
                <EventCard
                  isValid={false}
                  id={card.id}
                  key={index}
                  title={card.title}
                  description={card.description}
                  date={card.date}
                  time={card.time}
                  tags={card.tags}
                  host={card.host}
                  isDashboard={true}
                  image={card.banner}
                  hostName={card.hostName}
                />
              ))
          )}

          <h1
            style={{
              textAlign: "center",
              marginBottom: "2em",
              marginTop: "1em",
            }}
          >
            Joined Events
          </h1>
          {joinedEvents.length === 0 ? (
            <p>No joined events found.</p>
          ) : (
            joinedEvents
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((card: Event, index) => (
                <EventCard
                  isValid={false}
                  id={card.id}
                  key={index}
                  title={card.title}
                  description={card.description}
                  date={card.date}
                  time={card.time}
                  tags={card.tags}
                  host={card.host}
                  isDashboard={true}
                  image={card.banner}
                  hostName={card.hostName}
                />
              ))
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

export default Dashboard;
