import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref as dbRef, get, set } from "firebase/database";
import { storage, database, auth } from "../../../firebaseConf";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageCropper from "../../../utils/ImageCropper";
import "./EditProfile.css";
import {
  Instagram,
  Twitter,
  Facebook,
  Add,
  Remove,
  Delete,
} from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
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

  const [socialLinks, setSocialLinks] = useState<
    { platform: string; url: string }[]
  >([]);
  const [newPlatform, setNewPlatform] = useState("Instagram");
  const [newURL, setNewURL] = useState("");
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [cropperAspectRatio, setCropperAspectRatio] = useState<number>(1);
  const [isBannerImage, setIsBannerImage] = useState(false);

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
      const fetchedSocialLinks = [];
      if (userData.instagram) {
        fetchedSocialLinks.push({
          platform: "Instagram",
          url: userData.instagram,
        });
      }
      if (userData.twitter) {
        fetchedSocialLinks.push({ platform: "Twitter", url: userData.twitter });
      }
      if (userData.facebook) {
        fetchedSocialLinks.push({
          platform: "Facebook",
          url: userData.facebook,
        });
      }
      setSocialLinks(fetchedSocialLinks);
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
      setCropperAspectRatio(16 / 9);
      setIsBannerImage(true);
      setShowCropperModal(true);
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
      setCropperAspectRatio(1);
      setIsBannerImage(false);
      setShowCropperModal(true);
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
    );
  };
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(",");
    if (tagsArray.length <= 5) {
      setTags(e.target.value);
    }
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

  const handleSaveCroppedImage = async (croppedImageUrl: string | null) => {
    if (croppedImageUrl) {
      try {
        const maxFileSize = isBannerImage ? 200000 : 100000;
        const compressedBlob = await compressAndResizeImage(
          croppedImageUrl,
          maxFileSize
        );
        const compressedFile = new File([compressedBlob], "croppedImage.jpg", {
          type: "image/jpeg",
        });

        if (isBannerImage) {
          setBannerImage(compressedFile);
        } else {
          setProfileImage(compressedFile);
        }
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

      if (profileImage) {
        const profileImageRef = storageRef(
          storage,
          `user-profile-pics/user-profile-pic-${uid}`
        );
        await uploadBytes(profileImageRef, profileImage);
        profileImageUrl = await getDownloadURL(profileImageRef);
      }

      const socialLinksObject = socialLinks.reduce((acc, link) => {
        acc[link.platform.toLowerCase()] = link.url;
        return acc;
      }, {} as { [key: string]: string });

      await set(userDetailsRef, {
        name,
        headline,
        website,
        tags: listTags.join(", "),
        banner: bannerImageUrl,
        profile: profileImageUrl,
        ...socialLinksObject,
      });

      localStorage.setItem("userPic", profileImageUrl);
      toast.success("User details have been successfully updated");
      setIsLoading(false);
      handleClose();
      window.location.reload();
    } catch (error) {
      toast.error("An error occurred while updating user details");
      setIsLoading(false);
    }
  };
  const handleAddSocialLink = () => {
    if (socialLinks.length >= 3) {
      toast.error("You can only add up to 3 social media links", {
        transition: Zoom,
      });
      return;
    }
    if (newURL.trim() === "") {
      toast.error("URL cannot be empty", {
        transition: Zoom,
      });
      return;
    }

    const newLink = {
      platform: newPlatform,
      url: newURL,
    };

    setSocialLinks((prevLinks) => [...prevLinks, newLink]);
    setNewURL("");
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return <Instagram />;
      case "Twitter":
        return <Twitter />;
      case "Facebook":
        return <Facebook />;
      default:
        return null;
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="main-button">
        Edit Profile
      </Button>

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} disabled />
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

            <Form.Group controlId="socialLinks">
              <Form.Label>Social Media Links</Form.Label>
              {socialLinks.map((link, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center mb-2 gap-1"
                >
                  <span className="iconedits">
                    {renderPlatformIcon(link.platform)}
                  </span>
                  <Form.Control
                    type="text"
                    value={link.url}
                    readOnly
                    className="ml-2"
                  />
                  <Button
                    variant="danger"
                    className="ml-2 iconedits"
                    onClick={() => handleRemoveSocialLink(index)}
                  >
                    <Delete />
                  </Button>
                </div>
              ))}
              {socialLinks.length < 3 && (
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  <Form.Control
                    as="select"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    style={{ width: "auto" }}
                  >
                    <option>Instagram</option>
                    <option>Twitter</option>
                    <option>Facebook</option>
                  </Form.Control>
                  <Form.Control
                    type="text"
                    placeholder="Enter URL"
                    value={newURL}
                    onChange={(e) => setNewURL(e.target.value)}
                  />
                  <Button
                    onClick={handleAddSocialLink}
                    className="mt-2 iconeditsadd"
                  >
                    <Add />
                  </Button>
                </div>
              )}
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

      <Modal
        show={showCropperModal}
        onHide={() => setShowCropperModal(false)}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileImage && !isBannerImage && (
            <ImageCropper
              setCroppedImageUrl={handleSaveCroppedImage}
              src={URL.createObjectURL(profileImage)}
              aspectRatio={cropperAspectRatio}
            />
          )}
          {bannerImage && isBannerImage && (
            <ImageCropper
              setCroppedImageUrl={handleSaveCroppedImage}
              src={URL.createObjectURL(bannerImage)}
              aspectRatio={cropperAspectRatio}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProfile;
