import { Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  FormControl,
  Nav,
} from "react-bootstrap";
// import "./Signup.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import default_user from "../image_assets/default_user.png";
import "./Signup.css";
import {
  auth,
  firestore,
  database,
  storage,
  signInWithGooglePopup,
} from "../../firebaseConf";
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

const Signup = ({isShow,returnShow}:any) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    returnShow(false)
  };
  const handleShow = () => setShow(true);
  useEffect(()=>{
    setShow(isShow)
  },[isShow])
  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    const email = response.user.email;
    const username = response.user.displayName;
    const pic = response.user.photoURL;

    const usersRef = ref(database, "users");
    const user_email_to_post = encodeURIComponent(email ? email : "").replace(
      /\./g,
      "%2E"
    );
    const userRef = child(usersRef, user_email_to_post);

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          localStorage.setItem("userEmailId", user_email_to_post);
          localStorage.setItem("userPic", pic ? pic : "");
          window.location.reload();
          toast.success("Logged in successfully",  {transition:Zoom});
        } else {
          set(userRef, {
            name: username,
            email: user_email_to_post,
            pic: pic,
            tags: "",
            banner: "",
          });

          const bannerRef = storageRef(
            storage,
            `/user-banners/banner-${user_email_to_post}`
          );

          const images = [bannerImage, bannerImage2, bannerImage3];
          const randomImage = images[Math.floor(Math.random() * images.length)];
          fetch(randomImage)
            .then((res) => res.blob())
            .then((blob) => {
              toast.promise(
                uploadBytes(bannerRef, blob).then(() => {
                  getDownloadURL(bannerRef).then(
                    function (value) {
                      console.log(value, "banner uploaded");
                      localStorage.setItem("userEmailId", user_email_to_post);
                      localStorage.setItem("userPic", pic ? pic : "");
                      set(userRef, {
                        name: username,
                        email: user_email_to_post,
                        pic: pic,
                        tags: "",
                        banner: value,
                      });
                      window.location.reload();
                    },

                    function (error) {
                      console.log(error);
                    }
                  );
                }),
                {
                  pending: "Signing up...",
                  success: "Signed Up succesfully !",
                  error: "Failed to sign up",
                  
                },
                {transition:Zoom}
              );
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      {/* <Link onClick={handleShow} className="signup-link"> */}
        {/* <img src={default_user} className="signup-round" /> */}
        {/* <Button variant="success">Login</Button> */}
      {/* </Link> */}

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
