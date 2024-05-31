import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { ref, get, child, set } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import { database, storage, signInWithGooglePopup } from "../../firebaseConf";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import bannerImage from "../image_assets/bannerImage.png";
import bannerImage2 from "../image_assets/bannerImage2.png";
import bannerImage3 from "../image_assets/bannerImage3.png";

import "./Signup.css";

interface SignupProps {
  isShow: boolean;
  returnShow: (show: boolean) => void;
}

const Signup: React.FC<SignupProps> = ({ isShow, returnShow }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    returnShow(false);
  };

  useEffect(() => {
    setShow(isShow);
  }, [isShow]);

  const logGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopup();
      const { email, uid, displayName: username, photoURL } = response.user;

      const usersRef = ref(database, "users");
      const userRef = child(usersRef, uid);

      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        localStorage.setItem("userUid", uid);
        localStorage.setItem("userPic", userData.pic || "");
        window.location.reload();
        toast.success("Logged in successfully", { transition: Zoom });
      } else {
        const bannerRef = storageRef(storage, `/user-banners/banner-${uid}`);
        const images = [bannerImage, bannerImage2, bannerImage3];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const blob = await fetch(randomImage).then((res) => res.blob());

        toast.promise(
          uploadBytes(bannerRef, blob).then(async () => {
            const bannerURL = await getDownloadURL(bannerRef);
            const picURL = photoURL || "";
            await set(userRef, {
              name: username,
              email,
              pic: picURL,
              tags: "",
              banner: bannerURL,
              uid,
            });
            localStorage.setItem("userUid", uid);
            localStorage.setItem("userPic", picURL);
            window.location.reload();
          }),
          {
            pending: "Signing up...",
            success: "Signed Up successfully!",
            error: "Failed to sign up",
          },
          { transition: Zoom }
        );
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error && error.message.includes("popup")) {
        // Handle pop-up closed by user
        // toast.error("Sign up process was canceled", { transition: Zoom });
      } else {
        // Handle other authentication errors
        toast.error("Failed to sign up. Please try again.", {
          transition: Zoom,
        });
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center align-items-center m-5">
          <GoogleButton type="light" onClick={logGoogleUser} label="Login with Google"/>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Signup;
