import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Nav } from "react-bootstrap";
import "./CreateEvent.css";
import { auth, database, storage } from "../../../firebaseConf";
import { ref, get, child, set, getDatabase } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import EventInfoForm from "../EventInfoForm/EventInfoForm";
import EventBannerUpload from "../EventBannerUpload/EventBannerUpload";
import EventPreviewModal from "../EventPreviewModal/EventPreviewModal";
import ImageCropperModal from "../ImageCropperModal/ImageCropperModal";
import dayjs, { Dayjs } from 'dayjs';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [tags, setTags] = useState("");
  const [popTags, setPopTags] = useState("");
  const [listTags, setListTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hostName, setHostName] = useState("");

  useEffect(() => {
    const fetchHostName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const dbRef = ref(database);
          const snapshot = await get(child(dbRef, `users/${userId}`));
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setHostName(userData.username);
          } else {
            console.log("User data not found");
          }
        }
      } catch (error) {
        console.error("Error fetching host name:", error);
      }
    };

    fetchHostName();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setShowCropper(true);
    }
  };

  const handleSaveCroppedImage = (croppedImageUrl: string | null) => {
    setCroppedImageUrl(croppedImageUrl);
    setShowCropper(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setListTags([...listTags, popTags]);
      setPopTags('');
    }
  };

  const handleDelete = (tag: string) => {
    setListTags(listTags.filter((t) => t !== tag));
  };

  const handlePublish = async () => {
    if (!title || !description || !startDate || !startTime || !croppedImageUrl) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }

      const userId = user.uid;
      const uniqueId = Date.now().toString();

      const fileRef = storageRef(storage, `event_banners/${uniqueId}.jpg`);
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      await uploadBytes(fileRef, blob);

      const downloadUrl = await getDownloadURL(fileRef);
      const database = getDatabase();

      await set(ref(database, `events/${uniqueId}`), {
        title,
        description,
        startDate: startDate.toISOString(),
        startTime: startTime.toISOString(),
        tags: listTags.join(", "),
        bannerUrl: downloadUrl,
        host: userId,
        hostName: hostName,
      });

      toast.success("Event published successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Zoom,
      });

      navigate('/');
    } catch (error) {
      toast.error("Failed to publish event. Please try again later.");
      console.error("Error publishing event:", error);
    }
  };

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <Nav.Link onClick={() => navigate('')}>
          <i className="fa-solid fa-arrow-left"></i>
        </Nav.Link>
        <h2>Create Event</h2>
      </div>

      <div className="create-event-content">
        <div className="left-section">
          <EventInfoForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            startDate={startDate}
            setStartDate={setStartDate}
            startTime={startTime}
            setStartTime={setStartTime}
            tags={tags}
            popTags={popTags}
            setPopTags={setPopTags}
            listTags={listTags}
            setTags={setTags}
            setListTags={setListTags}
            handleKeyDown={handleKeyDown}
            handleDelete={handleDelete}
          />
        </div>
        <div className="right-section">
          <div className="button-container">
            <Button onClick={() => setShowPreview(true)}>
              Preview Event
            </Button>
            </div>
            <div className="button-container">
            <Button onClick={handlePublish}>
              Publish Event
            </Button>
          </div>
          <EventBannerUpload
            handleImageChange={handleImageChange}
            imagePreview={imagePreview}
          />
        </div>
      </div>

      <EventPreviewModal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        title={title}
        description={description}
        tags={listTags.join(", ")}
        date={startDate ? startDate.format("DD-MM-YYYY") : ""}
        time={startTime ? startTime.format("hh:mm A") : ""}
        image={croppedImageUrl || ""}
        host={auth.currentUser?.uid || ""}
        hostName={hostName}
        handlePublish={handlePublish}
      />

      <ImageCropperModal
        show={showCropper}
        onHide={() => setShowCropper(false)}
        imagePreview={imagePreview || ""}
        cropperAspectRatio={16 / 9}
        handleSaveCroppedImage={handleSaveCroppedImage}
      />
    </div>
  );
};

export default CreateEvent;
