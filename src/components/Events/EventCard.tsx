import React from "react";
import { Card } from "react-bootstrap";
import "./EventCard.css";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  tags: string;
  banner: string;
  host: string;
  hostName: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  time,
  tags,
  banner,
  host,
  hostName,
}) => {
  return (
    <Card className="event-card">
      <Card.Img variant="top" src={banner} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Text>{date}</Card.Text>
        <Card.Text>{time}</Card.Text>
        <Card.Text>{tags}</Card.Text>
        <Card.Text>{hostName}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default EventCard;
