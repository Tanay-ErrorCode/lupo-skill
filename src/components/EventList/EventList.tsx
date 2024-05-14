import React, { useEffect, useState } from "react";
import EventCard from "../Cards/EventCard/EventCard";
import { Pagination, Spinner } from "react-bootstrap";
import bannerImage3 from "../image_assets/bannerImage3.png";
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
import "./EventList.css";

const EventList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [eventCardsData, setEventCardsData] = useState([]);

  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database, "events");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        // setEventCardsData(Object.values(snapshot.val()));
        // eventCardsData.push(Object.values(snapshot.val()));
        setEventCardsData(Object.values(snapshot.val()));
        setTotalPages(Math.ceil(eventCardsData.length / itemsPerPage));
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
        <div className="spinner-container">
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
            All Events
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
                  registrants: string[];
                },
                index
              ) => {
                const user_email = localStorage.getItem("userEmailId");
                let isRegistered = false;
                if (card.registrants.includes(user_email!)) {
                  isRegistered = true;
                }
                return (
                  <EventCard
                    isValid={true}
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
                    isRegistered={isRegistered}
                  />
                );
              }
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
