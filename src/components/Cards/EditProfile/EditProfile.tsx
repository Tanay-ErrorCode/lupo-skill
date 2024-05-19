import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./EditProfile.css";
import { Instagram, Twitter, Facebook } from "@mui/icons-material";

const EditProfile = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [tags, setTags] = useState([]);
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const handleClose = () => setShow(true);
  const handleShow = () => setShow(false);

  const handleImageUpload = (e: any, setImage: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleTagChange = (e: any) => {
    if (e.target.value.split(",").length <= 5) {
      setTags(e.target.value.split(","));
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="main-button">
        Edit Profile
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form>
            <Form.Group>
              <Form.Label className="form-label">Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="form-label">Headline</Form.Label>
              <Form.Control
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="form-label">Tags (max 5)</Form.Label>
              <Form.Control
                type="text"
                value={tags.join(",")}
                onChange={handleTagChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="form-label">Website</Form.Label>
              <Form.Control
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="form-label">
                <Instagram /> Instagram URL
              </Form.Label>
              <Form.Control
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="form-label">
                <Twitter /> Twitter URL
              </Form.Label>
              <Form.Control
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="form-label">
                <Facebook /> Facebook URL
              </Form.Label>
              <Form.Control
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="form-label">Banner Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleImageUpload(e, setBannerImage)}
              />
              {bannerImage && (
                <div className="image-preview">
                  <img src={bannerImage} alt="Banner Preview" />
                </div>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label className="form-label">Profile Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleImageUpload(e, setProfileImage)}
              />
              {profileImage && (
                <div className="image-preview">
                  <img src={profileImage} alt="Profile Preview" />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="footer-buttons">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditProfile;
