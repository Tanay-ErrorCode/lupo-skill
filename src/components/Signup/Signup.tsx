import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import default_user from "../image_assets/default_user.png";
import "./Signup.css";
import { database, storage, signInWithGooglePopup } from "../../firebaseConf";
import GoogleButton from "react-google-button";
import { ref, get, child, set } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import bannerImage from "../image_assets/bannerImage.png";
import bannerImage2 from "../image_assets/bannerImage2.png";
import bannerImage3 from "../image_assets/bannerImage3.png";

const Signup = ({ isShow, returnShow }: any) => {
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
      const {
        email,
        uid,
        displayName: username,
        photoURL: pic,
      } = response.user;

      const usersRef = ref(database, "users");
      const userRef = child(usersRef, uid);

      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        localStorage.setItem("userUid", uid);
        localStorage.setItem("userPic", pic ? pic : "");
        window.location.reload();
        toast.success("Logged in successfully", { transition: Zoom });
      } else {
        set(userRef, {
          name: username,
          email,
          pic: pic || "",
          tags: "",
          banner: "",
          uid,
        });

        const bannerRef = storageRef(storage, `/user-banners/banner-${uid}`);

        const images = [bannerImage, bannerImage2, bannerImage3];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const blob = await fetch(randomImage).then((res) => res.blob());

        toast.promise(
          uploadBytes(bannerRef, blob).then(async () => {
            const value = await getDownloadURL(bannerRef);
            console.log(value, "banner uploaded");
            localStorage.setItem("userUid", uid);
            localStorage.setItem("userPic", pic || "");
            set(userRef, {
              name: username,
              email,
              pic: pic || "",
              tags: "",
              banner: value,
              uid,
            });
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

      // Check the type of error using instanceof
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
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center align-items-center m-5">
          <GoogleButton
            type="light"
            onClick={() => {
              logGoogleUser();
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Signup;
