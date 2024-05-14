import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Signup from '../Signup/Signup';
import CreateEvent from "../Cards/CreateEvent/CreateEvent";
import ProfilePage from "../ProfilePage/ProfilePage";
import bannerImage3 from "../image_assets/bannerImage3.png";
import "./DashBoard.css";
import EventCard from "../Cards/EventCard/EventCard";
import { Pagination } from "react-bootstrap";

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

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [eventCardsData, setEventCardsData] = useState<Event[]>([]);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("userEmailId") == null) {
      window.location.href = "#/";
      toast.warn("You are not signed in", { transition: Zoom });
    }

    const fetchData = async () => {
      const usersRef = ref(database, "users");
      const userEmailId = localStorage.getItem("userEmailId");

      if (userEmailId === null) {
        console.error("User email ID is null");
        return;
      }

      // userRef is the reference to the user's data in the database
      const userRef = child(usersRef, userEmailId);
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
        eventList.forEach((eventId: string) => {
          const trimmedEventId = eventId.trim();
          const eventsRef = ref(database, "events");

          const eventRef = child(eventsRef, trimmedEventId);
          get(eventRef).then((snapshot) => {
            if (snapshot.exists()) {
              const event = snapshot.val();
              setEventCardsData((prev: any[]) => [...prev, event]);
              setTotalPages(Math.ceil(eventCardsData.length / itemsPerPage));
              setIsLoading(false);
            } else {
              console.log("No data available");
            }
          });
        });
        setIsLoading(false);
      } else {
        console.log("No data available");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="mt-5 pt-3">
      {isLoading ? (
        <div className="spinner-container d-flex justify-content-center align-items-center">
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
                  host={card.host.split("%40")[0]}
                  isDashboard={true}
                  image={card.banner}
                />
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

export default Dashboard;
