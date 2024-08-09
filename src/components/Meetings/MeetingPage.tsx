import React, { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../firebaseConf";
import { useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from "@mui/icons-material/Info";
import ParticipantsIcon from "@mui/icons-material/Group";
import SendIcon from "@mui/icons-material/Send";
import { AppBar, Toolbar, Typography, TextField } from "@mui/material";
import "./MeetingPage.css";

const MeetingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<any>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    const userUid = localStorage.getItem("userUid");
    const userRef = ref(database, `users/${userUid}`);

    const fetchUserData = async () => {
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
        } else {
          console.log("No user data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const toggleVideo = () => {
    setIsVideoOn((prev) => !prev);
  };

  const toggleAudio = () => {
    setIsAudioOn((prev) => !prev);
  };

  const toggleChatDrawer = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleSendMessage = () => {
    // Handle sending the chat message
    console.log("Sending message:", chatMessage);
    setChatMessage("");
  };

  return (
    <div className="meeting-page_main">
      <div className={`meeting-page ${isChatOpen ? "shifted" : ""}`}>
        <div className="meeting-content">
          <div className={`mute_icon_meeting ${isChatOpen ? "shifted" : ""}`}>
            <IconButton
              className="icon_back"
              onClick={toggleAudio}
              color="inherit"
            >
              {isAudioOn ? (
                <MicIcon style={{ fontSize: "18px" }} />
              ) : (
                <MicOffIcon style={{ fontSize: "18px" }} />
              )}
            </IconButton>
          </div>
          {userData ? (
            <div style={{ textAlign: "center" }}>
              {isVideoOn ? (
                <img src={userData.pic} alt="Profile" className="profile-pic" />
              ) : (
                <VideocamOffIcon style={{ fontSize: "150px" }} />
              )}
              <h5 className="user-info">{userData.name}</h5>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div className={`bottom-navbar ${isChatOpen ? "shifted" : ""}`}>
          <Toolbar className="toolbar">
            <div className="left-icon-div">
              <Typography
                variant="body1"
                color="inherit"
                style={{ marginRight: "auto" }}
              >
                {new Date().toLocaleTimeString()} | {id}
              </Typography>
            </div>
            <div className="center-icon-div">
              <IconButton
                className="icon_back"
                onClick={toggleAudio}
                color="inherit"
              >
                {isAudioOn ? (
                  <MicIcon style={{ fontSize: "26px" }} />
                ) : (
                  <MicOffIcon style={{ fontSize: "26px" }} />
                )}
              </IconButton>
              <IconButton
                className="icon_back"
                onClick={toggleVideo}
                color="inherit"
              >
                {isVideoOn ? (
                  <VideocamIcon style={{ fontSize: "26px" }} />
                ) : (
                  <VideocamOffIcon style={{ fontSize: "26px" }} />
                )}
              </IconButton>
              <IconButton className="icon_back" color="inherit">
                <ScreenShareIcon style={{ fontSize: "26px" }} />
              </IconButton>
              <IconButton className="icon_back red" color="inherit">
                <CallEndIcon />
              </IconButton>
            </div>
            <div className="right-icon-div">
              <IconButton color="inherit">
                <InfoIcon style={{ fontSize: "26px" }} />
              </IconButton>
              <IconButton color="inherit" className="chat_icon">
                <ChatIcon
                  style={{ fontSize: "26px" }}
                  onClick={toggleChatDrawer}
                />
              </IconButton>
              <IconButton color="inherit">
                <ParticipantsIcon style={{ fontSize: "26px" }} />
              </IconButton>
            </div>
          </Toolbar>
        </div>
      </div>
      <div className={`chat-drawer ${isChatOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleChatDrawer}>
          ×
        </button>
        <div className="chat-content">
          <h3>Chat</h3>
          {/* Display chat messages here */}
        </div>
        <div className="chat-input-container">
          <TextField
            label="Type a message"
            variant="outlined"
            fullWidth
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <IconButton onClick={handleSendMessage}>
            <SendIcon className="send_button_chat" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default MeetingPage;
