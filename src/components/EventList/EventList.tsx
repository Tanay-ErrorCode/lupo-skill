import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
}

const EventList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [eventCardsData, setEventCardsData] = useState<Event[]>([]);
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

        const snapshotValue = snapshot.val();
        if (snapshotValue !== null && typeof snapshotValue === "object") {
          const res: Event[] = Object.values(snapshotValue) as Event[];
          res.sort((a: Event, b: Event) => b.createdAt - a.createdAt);
          // console.log(res)
          setEventCardsData(res);
        }

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
            All Events
          </h1>
          {eventCardsData
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((card: Event, index) => {
              const user_uid = localStorage.getItem("userUid");
              let isRegistered = false;
              if (card.registrants.includes(user_uid!)) {
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
                  host={card.host}
                  isDashboard={false}
                  image={card.banner}
                  isRegistered={isRegistered}
                  hostName={card.hostName}
                />
              );
            })}
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
