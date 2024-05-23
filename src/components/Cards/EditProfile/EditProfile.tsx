import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref as dbRef, get, set } from "firebase/database";
import { storage, database, auth } from "../../../firebaseConf";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageCropper from "../../../utils/ImageCropper"; // Import the ImageCropper component
import "./EditProfile.css";
import { Instagram, Twitter, Facebook } from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

        const EditProfile = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [tags, setTags] = useState("");
  const [popTags, setPopTags] = useState("");
  const [listTags, setListTags] = useState<string[]>([]);
  const [website, setWebsite] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [showCropperModal, setShowCropperModal] = useState(false);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const uid = user.uid;
    const userDetailsRef = dbRef(database, `users/${uid}`);

    try {
      const snapshot = await get(userDetailsRef);
      const userData = snapshot.exists() ? snapshot.val() : {};

      setName(userData.name || "");
      setHeadline(userData.headline || "");
      // setTags(userData.tags || "");
      setWebsite(userData.website || "");
      setInstagram(userData.instagram || "");
      setTwitter(userData.twitter || "");
      setFacebook(userData.facebook || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchUserData();
    }
  }, [show]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setBannerImage(file);
    } else {
      toast.error("Please select a valid image file (JPEG/PNG)", {
        transition: Zoom,
      });
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      setShowCropperModal(true); // Show the cropper modal
    } else {
      toast.error("Please select a valid image file (JPEG/PNG)", {
        transition: Zoom,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newTag = popTags.trim();
    const tagsArray = tags.split(", ").length;
    if (e.key === "Enter" && newTag !== "" && tagsArray < 5) {
      setTags((prevTags) => (prevTags ? `${prevTags}, ${newTag}` : newTag));
      setListTags((prev) => [...prev, newTag]);
      setPopTags("");
    }
  };

  const handleDelete = (tag: string) => {
    setListTags(listTags.filter((ele) => ele !== tag));
    setTags((prevTags) =>
      prevTags
        .split(", ")
        .filter((ele) => ele !== tag)
        .join(", ")
    )}
  const handleSaveCroppedImage = (croppedImageUrl: string | null) => {
    setCroppedImageUrl(croppedImageUrl);
    setShowCropperModal(false); // Close the cropper modal after saving
  };

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const user = auth.currentUser;
    if (!user) return;

    const uid = user.uid;
    const userDetailsRef = dbRef(database, `users/${uid}`);

    try {
      const snapshot = await get(userDetailsRef);
      const currentUserDetails = snapshot.exists() ? snapshot.val() : {};

      let bannerImageUrl = currentUserDetails.banner || "";

      if (bannerImage) {
        const bannerImageRef = storageRef(
          storage,
          `user-banners/banner-${uid}`
        );
        await uploadBytes(bannerImageRef, bannerImage);
        bannerImageUrl = await getDownloadURL(bannerImageRef);
      }

      let profileImageUrl = currentUserDetails.pic || "";

      if (croppedImageUrl) {
        const croppedImageBlob = dataURLtoBlob(croppedImageUrl);
        const profileImageRef = storageRef(
          storage,
          `user-profile-pics/user-profile-pic-${uid}`
        );
        await uploadBytes(profileImageRef, croppedImageBlob);
        profileImageUrl = await getDownloadURL(profileImageRef);
      }

      const updatedUserDetails = { ...currentUserDetails };

      if (name) updatedUserDetails.name = name;
      if (headline) updatedUserDetails.headline = headline;
      if (tags) updatedUserDetails.tags = tags;
      if (website) updatedUserDetails.website = website;
      if (instagram) updatedUserDetails.instagram = instagram;
      if (twitter) updatedUserDetails.twitter = twitter;
      if (facebook) updatedUserDetails.facebook = facebook;

      updatedUserDetails.banner = bannerImageUrl;
      updatedUserDetails.pic = profileImageUrl;

      await set(userDetailsRef, updatedUserDetails);
      toast.success("User details have been successfully updated");
      setIsLoading(false);
      handleClose();
      window.location.reload();
    } catch (error) {
      toast.error("An error occurred while updating user details");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="main-button">
        Edit Profile
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Headline</Form.Label>
              <Form.Control
                type="text"
                value={headline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setHeadline(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Tags (max 5)</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setPopTags(e.target.value)}
                onKeyDown={handleKeyDown}
                value={popTags}
              />
              <Stack direction="row" className="mt-2" spacing={1}>
                {listTags.map((ele, index) => {
                  return (
                    <Chip
                      key={index}
                      label={ele}
                      onDelete={() => handleDelete(ele)}
                      color="success"
                      variant="outlined"
                    />
                  );
                })}
              </Stack>
            </Form.Group>

            <Form.Group>
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="text"
                value={website}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWebsite(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <Instagram />
                Instagram URL
              </Form.Label>
              <Form.Control
                type="text"
                value={instagram.substring(8)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const inputValue = e.target.value;
                  const updatedValue = inputValue.startsWith("https://")
                    ? inputValue.substring(8)
                    : inputValue;
                  setInstagram(`https://${updatedValue}`);
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <Twitter /> Twitter URL
              </Form.Label>
              <Form.Control
                type="text"
                value={twitter.substring(8)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const inputValue = e.target.value;
                  const updatedValue = inputValue.startsWith("https://")
                    ? inputValue.substring(8)
                    : inputValue;
                  setTwitter(`https://${updatedValue}`);
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <Facebook />
                Facebook URL
              </Form.Label>
              <Form.Control
                type="text"
                value={facebook.substring(8)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const inputValue = e.target.value;
                  const updatedValue = inputValue.startsWith("https://")
                    ? inputValue.substring(8)
                    : inputValue;
                  setFacebook(`https://${updatedValue}`);
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Banner Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleBannerImageUpload}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCropperModal} onHide={() => setShowCropperModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileImage && (
            <ImageCropper
              setCroppedImageUrl={handleSaveCroppedImage}
              src={URL.createObjectURL(profileImage)}
            />
          )}
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default EditProfile;
