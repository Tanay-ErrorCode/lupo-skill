import React, { useState, useEffect } from "react";
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
import "./EditProfile.css";
import { Instagram, Twitter, Facebook } from "@mui/icons-material";

const EditProfile = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [tags, setTags] = useState("");
  const [website, setWebsite] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");

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
      setTags(userData.tags || "");
      setWebsite(userData.website || "");
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

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if the file type is an image
      if (file.type && file.type.startsWith("image/")) {
        setImage(file);
      } else {
        // Display error for non-image file types
        setImage(null);
        toast.error("Please select a valid image file (JPEG/PNG)", {
          transition: Zoom,
        });

        // Reset the file input element to clear the selected file
        e.target.value = "";
      }
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(",");
    if (tagsArray.length <= 5) {
      setTags(e.target.value);
    }
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

      let bannerImageUrl = currentUserDetails.banner || ""; // Initialize with current banner URL

      if (bannerImage) {
        const bannerImageRef = storageRef(
          storage,
          `user-banners/banner-${uid}`
        );
        await uploadBytes(bannerImageRef, bannerImage);
        bannerImageUrl = await getDownloadURL(bannerImageRef);
      }

      let profileImageUrl = currentUserDetails.pic || ""; // Initialize with current profile pic URL

      if (profileImage) {
        const profileImageRef = storageRef(
          storage,
          `user-profile-pics/user-profile-pic-${uid}`
        );
        await uploadBytes(profileImageRef, profileImage);
        profileImageUrl = await getDownloadURL(profileImageRef);
      }

      const updatedUserDetails = {
        ...currentUserDetails,
        banner: bannerImageUrl,
        email: user.email || currentUserDetails.email,
        name: name || currentUserDetails.name,
        headline: headline || currentUserDetails.headline,
        tags: tags || currentUserDetails.tags,
        website: website || currentUserDetails.website,
        instagram: instagram || currentUserDetails.instagram,
        twitter: twitter || currentUserDetails.twitter,
        facebook: facebook || currentUserDetails.facebook,
        pic: profileImageUrl,
        uid: uid,
      };

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
                value={tags}
                onChange={handleTagChange}
              />
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
                value={instagram}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInstagram(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <Twitter />
                Twitter URL
              </Form.Label>
              <Form.Control
                type="text"
                value={twitter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTwitter(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <Facebook />
                Facebook URL
              </Form.Label>
              <Form.Control
                type="text"
                value={facebook}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFacebook(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Banner Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleImageUpload(e, setBannerImage)
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleImageUpload(e, setProfileImage)
                }
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
      <ToastContainer />
    </>
  );
};

export default EditProfile;
