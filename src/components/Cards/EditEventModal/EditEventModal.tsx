import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { ref, update } from "firebase/database";
import { storage, database } from "../../../firebaseConf";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import ImageCropper from "../../../utils/ImageCropper";
import { Zoom, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import differenceInMinutes from "date-fns/differenceInMinutes"; // Import from date-fns library

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
      const [timeString, timezone] = event.time.split(" ");
      const eventTime = new Date(`1970-01-01T${timeString}Z`);
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
        const maxFileSize = 200000;
        const compressedBlob = await compressAndResizeImage(
          croppedImageUrl,
          maxFileSize
        );
        const compressedFile = new File([compressedBlob], "croppedImage.jpg", {
          type: "image/jpeg",
        });

        setImage(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("An error occurred while compressing the image");
      }
    }
    setShowCropperModal(false);
  };

  const compressAndResizeImage = (
    imageUrl: string,
    maxFileSize: number
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidthOrHeight = 1024;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidthOrHeight) {
            height *= maxWidthOrHeight / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width *= maxWidthOrHeight / height;
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        let quality = 0.8;

        const adjustQuality = () => {
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size > maxFileSize && quality > 0.1) {
                quality -= 0.05;
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                ctx?.drawImage(img, 0, 0, width, height);
                adjustQuality();
              } else {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error("Failed to compress image"));
                }
              }
            },
            "image/jpeg",
            quality
          );
        };

        adjustQuality();
      };

      img.onerror = function (error) {
        reject(error);
      };
    });
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
      // Ensure startDate and startTime are valid
      if (isNaN(startDate.getTime()) || isNaN(startTime.getTime())) {
        toast.error("Invalid date or time", {
          transition: Zoom,
        });
        return;
      }

      const formattedDate = startDate.toDateString();
      const formattedTime = startTime.toTimeString().split(" ")[0];
      const timezoneOffset =
        startTime.toTimeString().match(/\((.*)\)/)?.[1] || "";

      const formattedTimeWithTimezone = `${formattedTime} GMT+0530 (${timezoneOffset})`;

      // Upload image if a new one is provided
      let bannerUrl = formData.banner;
      if (image) {
        const imageRef = storageRef(
          storage,
          `event-banners/banner-${event.id}`
        );
        try {
          const snapshot = await uploadBytes(imageRef, image);
          bannerUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("An error occurred while uploading the image", {
            transition: Zoom,
          });
          return;
        }
      }

      const eventRef = ref(database, `events/${event.id}`);
      try {
        await update(eventRef, {
          ...formData,
          date: formattedDate, // e.g., "Tue Jun 04 2024"
          time: formattedTimeWithTimezone, // e.g., "15:41:58 GMT+0530 (India Standard Time)"
          banner: bannerUrl,
          lastEdited: Date.now(),
        });
        toast.success("EVENT DETAILS UPDATED SUCCESSFULLY");
        window.location.reload();
        handleClose();
        refreshEvents();
      } catch (error) {
        console.error("Error updating event:", error);
        toast.error("An error occurred while updating the event", {
          transition: Zoom,
        });
      }
    } else {
      toast.error("Please ensure all fields are correctly filled", {
        transition: Zoom,
      });
    }
  };

  const isEventStartTimeValid = (): boolean => {
    if (!event || !startDate || !startTime) {
      return false;
    }

    const eventStartDateTime = new Date(`${event.date} ${event.time}`);
    const now = new Date();
    const differenceInMinutes =
      Math.abs(eventStartDateTime.getTime() - now.getTime()) / (1000 * 60);

    // Return false if the difference in minutes is less than 60
    return differenceInMinutes >= 60;
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
                disabled={!isEventStartTimeValid()} // Disable date picker if event starts in less than one hour
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
                dateFormat="HH:mm:ss"
                disabled={!isEventStartTimeValid()} // Disable time picker if event starts in less than one hour
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
