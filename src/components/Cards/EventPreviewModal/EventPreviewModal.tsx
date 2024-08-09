// src/components/EventPreviewModal/EventPreviewModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import EventCard from '../EventCard/EventCard';

interface EventPreviewModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  description: string;
  tags: string;
  date: string;
  time: string;
  image: string;
  host: string;
  hostName: string;
  handlePublish: () => void;
}

const EventPreviewModal: React.FC<EventPreviewModalProps> = ({
  show, onHide, title, description, tags, date, time, image, host, hostName, handlePublish
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Event Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EventCard
          title={title}
          description={description}
          tags={tags}
          date={date}
          time={time}
          image={image}
          host={host}
          isDashboard={false}
          id="example_id"
          isRegistered={false}
          isValid={false}
          ispreview={true}
          hostName={hostName}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePublish}>
          Confirm Publish
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventPreviewModal;
