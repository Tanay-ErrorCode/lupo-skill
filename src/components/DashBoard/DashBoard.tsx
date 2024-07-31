import React, { useEffect, useState } from "react";
import { Spinner, Pagination } from "react-bootstrap";
import EventCard from "../Cards/EventCard/EventCard";
import { ref, get } from "firebase/database";
import { database } from "../../firebaseConf";

// Import static image for fallback
import defaultBannerImage from "../image_assets/bannerImage.png";

interface Event {
  banner: string; // URL or path to the banner image
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

const Dashboard: React.FC = () => {
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
      const eventsRef = ref(database, "events");
      const snapshot = await get(eventsRef);

      if (snapshot.exists()) {
        const fetchedEvents: Event[] = [];
        snapshot.forEach((childSnapshot) => {
          const event = childSnapshot.val();
          fetchedEvents.push(event);
        });

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
                card: Event,
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
                  image={defaultBannerImage || card.banner} // Use default image if banner is not available
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
