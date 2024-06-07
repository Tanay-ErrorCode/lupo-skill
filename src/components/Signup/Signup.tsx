import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { ref, get, child, set } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import { database, signInWithGooglePopup } from "../../firebaseConf";
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
        localStorage.setItem("username", `${username}`);
        localStorage.setItem("userPic", userData.pic || "");
        window.location.reload();
        toast.success("Logged in successfully", { transition: Zoom });
      } else {
        const randomColors = [
          "#FFEBEE",
          "#E3F2FD",
          "#E8F5E9",
          "#FFFDE7",
          "#F3E5F5",
          "#FFF3E0",
          "#E0F7FA",
          "#FFF0E1",
          "#F8F4FF",
          "#E0F2F1",
        ];
        const randomColor =
          randomColors[Math.floor(Math.random() * randomColors.length)];
        const picURL = photoURL || "";

        await set(userRef, {
          name: username,
          email,
          pic: picURL,
          tags: "",
          banner: randomColor,
          uid,
        });

        localStorage.setItem("userUid", uid);
        localStorage.setItem("userPic", picURL);
        window.location.reload();
        toast.success("Signed up successfully", { transition: Zoom });
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
    <Modal show={show} onHide={handleClose} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>SignUp or LogIn</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center align-items-center m-5">
        <GoogleButton
          type="light"
          onClick={logGoogleUser}
          label="Continue with Google"
        />
      </Modal.Body>
    </Modal>
  );
};

export default Signup;
