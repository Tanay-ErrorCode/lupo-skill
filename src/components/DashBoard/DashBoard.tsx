import React, { useEffect, useState } from "react";
import { Button, Spinner, Pagination } from "react-bootstrap";
import Signup from "../Signup/Signup";
import ProfilePage from "../ProfilePage/ProfilePage";
import bannerImage3 from "../image_assets/bannerImage3.png";
import "./DashBoard.css";
import EventCard from "../Cards/EventCard/EventCard";

import {
  auth,
  firestore,
  database,
  storage,
  signInWithGooglePopup,
} from "../../firebaseConf";
import GoogleButton from "react-google-button";
import { ref, get, child, set } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { reload } from "firebase/auth";
import PageTitle from "../../utils/PageTitle";

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

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [eventCardsData, setEventCardsData] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("userUid") == null) {
      window.location.href = "#/";
    }

    const fetchData = async () => {
      const usersRef = ref(database, "users");
      const userUid = localStorage.getItem("userUid");

      if (!userUid) {
        console.error("User is not logged In.");
        return;
      }

      const userRef = child(usersRef, userUid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        let eventList: any[] = [];
        if (snapshot.hasChild("createdEvents")) {
          eventList = [
            ...eventList,
            ...snapshot.val().createdEvents.split(","),
          ];
        }
        if (snapshot.hasChild("registeredEvents")) {
          const registeredEvents = snapshot.val().registeredEvents.split(",");
          registeredEvents.forEach((event: string) => {
            if (!eventList.includes(event)) {
              eventList.push(event);
            }
          });
        }
        const fetchedEvents: Event[] = [];
        await Promise.all(
          eventList.map(async (eventId: string) => {
            const trimmedEventId = eventId.trim();
            const eventsRef = ref(database, "events");
            const eventRef = child(eventsRef, trimmedEventId);
            const eventSnapshot = await get(eventRef);
            if (eventSnapshot.exists()) {
              const event = eventSnapshot.val();
              fetchedEvents.push(event);
            } else {
              console.log("No data available for event ID:", trimmedEventId);
            }
          })
        );

        fetchedEvents.sort((a: Event, b: Event) => b.createdAt - a.createdAt);
        setEventCardsData(fetchedEvents);
        setTotalPages(Math.ceil(fetchedEvents.length / itemsPerPage));
        setIsLoading(false);
      } else {
        console.log("No data available");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <h1
            style={{
              textAlign: "center",
              marginBottom: "2em",
            }}
          >
            Created Events
          </h1>

          {eventCardsData
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
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
                  hostName: string;
                  lastEdited?: number;
                },
                index
              ) => (
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
                  lastEdited={card.lastEdited}
                />
              )
            )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination>
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
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
