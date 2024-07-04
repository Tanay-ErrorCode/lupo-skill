import React, { useEffect, useState } from "react";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { getDatabase, ref, get } from "firebase/database";
import PageTitle from "../../utils/PageTitle";
import EventCard from "../Cards/EventCard/EventCard";
import "./Events.css";

const Events: React.FC = () => {
  const [eventCardsData, setEventCardsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTags, setSearchTags] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const eventsRef = ref(db, "events");
      const snapshot = await get(eventsRef);
      if (snapshot.exists()) {
        const eventsData = snapshot.val();
        const fetchedEvents = Object.keys(eventsData).map((key) => ({
          id: key,
          ...eventsData[key],
        }));
        setEventCardsData(fetchedEvents);
        setTotalPages(Math.ceil(fetchedEvents.length / itemsPerPage));
      } else {
        console.log("No data available");
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    const db = getDatabase();
    const searchRef = ref(db, "events");
    const snapshot = await get(searchRef);
    if (snapshot.exists()) {
      const eventsData = snapshot.val();
      const filteredEvents = Object.keys(eventsData)
        .map((key) => ({ id: key, ...eventsData[key] }))
        .filter((event) => {
          const matchesTags =
            !searchTags ||
            event.tags.toLowerCase().includes(searchTags.toLowerCase());
          const matchesDate = !searchDate || event.date === searchDate;
          return matchesTags && matchesDate;
        });

      setEventCardsData(filteredEvents);
      setTotalPages(Math.ceil(filteredEvents.length / itemsPerPage));
    }
    setIsLoading(false);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <PageTitle title="Events | Lupo Skill" />
      <Container className="mt-5">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search by tags"
            value={searchTags}
            onChange={(e) => setSearchTags(e.target.value)}
          />
          <FormControl
            type="date"
            placeholder="Search by date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <div className="text-center mt-4">
        {isLoading ? (
          <Spinner animation="border" />
        ) : (
          <div>
            {eventCardsData
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            <Pagination className="justify-content-center mt-4">
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
