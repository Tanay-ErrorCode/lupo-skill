import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { ref, update, get, child } from "firebase/database";

import { storage, database } from "../../../firebaseConf";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import ImageCropper from "../../../utils/ImageCropper";
import { Zoom, toast } from "react-toastify";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

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
  registrants?: string;
  // other properties...
}
function generateUUID() {
  var d = new Date().getTime();
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
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
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [formData, setFormData] = useState<Event | null>(null);
  const userUid = localStorage.getItem("userUid");
  useEffect(() => {
    if (event) {
      setFormData(event);
      const eventDate = dayjs(event.date);
      const [timeString, timezone] = event.time.split(" ");
      const eventTime = dayjs(`1970-01-01T${timeString}Z`);
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
      if (
        isNaN(startDate.toDate().getTime()) ||
        isNaN(startTime.toDate().getTime())
      ) {
        toast.error("Invalid date or time", { transition: Zoom });
        return;
      }

      const formattedDate = startDate.format("YYYY-MM-DD");
      const formattedTime = startTime.format("hh:mm A");

      // Check if the date or time has changed
      const hasDateChanged = formattedDate !== event.date;
      const hasTimeChanged = formattedTime !== event.time;

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
          date: formattedDate,
          time: formattedTime,
          banner: bannerUrl,
          lastEdited: Date.now(),
        });

        // Notify users if the event date or time has changed
        if (hasDateChanged || hasTimeChanged) {
          const registrantsArray = event.registrants
            ? event.registrants.split(",")
            : [];
          registrantsArray.forEach(async (userUid: string) => {
            const userRef = child(ref(database, "users"), userUid);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
              const notifications = userSnapshot.val().notifications || [];
              notifications.push({
                id: generateUUID(),
                title: "Event Rescheduled",
                text: `The event "${formData.title}" has been rescheduled.`,
                date: Date.now(),
                link: `/eventDetails/${event.id}`,
              });

              await update(userRef, { notifications });
            }
          });
        }

        toast.success("Event details updated successfully");
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
      <Modal show={show} onHide={handleClose} animation={true}>
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  disabled={!isEventStartTimeValid()}
                />
              </LocalizationProvider>
            </Form.Group>
            <Form.Group controlId="formTime">
              <Form.Label>Time</Form.Label>
              <br />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Time"
                  value={startTime}
                  onChange={(time) => setStartTime(time)}
                  disabled={!isEventStartTimeValid()}
                />
              </LocalizationProvider>
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
      <Modal
        show={showCropperModal}
        onHide={() => setShowCropperModal(false)}
        className={`fade-modal ${show ? "fade-in" : "fade-out"}`}
      >
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
