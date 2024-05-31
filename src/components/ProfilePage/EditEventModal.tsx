import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { ref, update } from "firebase/database";
import { database, storage } from "../../firebaseConf";
import ImageCropper from "../../utils/ImageCropper";
import { Zoom, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

interface EditEventModalProps {
  show: boolean;
  handleClose: () => void;
  event: Event | null;
  refreshEvents: () => void;
}

interface Event {
  id: string;
  date: string;
  time: string;
  description: string;
  banner: string;
  title: string;
  // other properties...
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  show,
  handleClose,
  event,
  refreshEvents,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [cropperAspectRatio, setCropperAspectRatio] = useState<number>(16 / 9);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [formData, setFormData] = useState<Event | null>(null);

  useEffect(() => {
    if (event) {
      setFormData(event);
      const eventDate = new Date(event.date);
      const eventTime = new Date(event.time);
      setStartDate(eventDate);
      setStartTime(eventTime);
    }
  }, [event]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setCropperAspectRatio(16 / 9);
      setShowCropperModal(true);
    } else {
      toast.error("Please select a valid image file (JPEG/PNG)", {
        transition: Zoom,
      });
    }
  };

  const handleSaveCroppedImage = async (croppedImageUrl: string | null) => {
    if (croppedImageUrl) {
      try {
        // Here you can add your image compression logic if needed
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("An error occurred while compressing the image");
      }
    }
    setShowCropperModal(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (event && formData && startDate && startTime) {
      const formattedDate = startDate.toDateString();
      const formattedTime = startTime.toTimeString();

      const eventRef = ref(database, `events/${event.id}`);
      try {
        await update(eventRef, {
          ...formData,
          date: formattedDate,
          time: formattedTime,
        });
        handleClose();
        refreshEvents();
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                defaultValue={formData?.title || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                defaultValue={formData?.description || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <br />
              <DatePicker
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
              />
            </Form.Group>
            <Form.Group controlId="formTime">
              <Form.Label>Time</Form.Label>
              <br />
              <DatePicker
                selected={startTime}
                onChange={(date: Date) => setStartTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </Form.Group>
            <Form.Group controlId="formImageUpload">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showCropperModal} onHide={() => setShowCropperModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {image && (
            <ImageCropper
              setCroppedImageUrl={handleSaveCroppedImage}
              src={URL.createObjectURL(image)}
              aspectRatio={cropperAspectRatio}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditEventModal;
