import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Badge,
  useMediaQuery,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme";
import { ref, onValue, update } from "firebase/database";
import { database } from "../../firebaseConf";

interface Notification {
  id: string;
  title: string;
  text: string;
  date: number;
  link?: string;
}

const NotificationsPanel = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isHome = location.pathname === "/";
  const navigate = useNavigate();
  const screenTheme = useTheme();
  const isSmallScreen = useMediaQuery(screenTheme.breakpoints.down("sm"));
  const userUid = localStorage.getItem("userUid");
  const iconPadding = isSmallScreen ? "8px 10px" : "16px";

  useEffect(() => {
    if (userUid) {
      const userRef = ref(database, `users/${userUid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (Array.isArray(userData.notifications)) {
            const currentTime = new Date().getTime();
            const validNotifications = userData.notifications
              .filter(
                (notification: Notification) =>
                  currentTime - notification.date < 7 * 24 * 60 * 60 * 1000
              )
              .sort((a: Notification, b: Notification) => b.date - a.date); // Sort by date descending

            update(userRef, { notifications: validNotifications });

            setNotifications(validNotifications);
          } else {
            console.error(
              "Notifications data is not an array:",
              userData.notifications
            );
            setNotifications([]);
          }
        } else {
          console.log("No data available");
        }
      });

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    }
  }, [userUid]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const maxNotificationWidth = "250px";
  const maxNotificationHeight = "400px";
  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="notifications"
        onClick={handleOpen}
        sx={{
          border: isHome ? "1px solid" : "none",
          borderColor: theme.colors.lightBackground,
          padding: iconPadding,
          borderRadius: "32px",
          alignItems: "center",
          backgroundColor: isHome ? "rgba(255, 255, 255, 0.17)" : "transparent",
        }}
      >
        <Badge badgeContent={notifications.length} color="primary">
          <NotificationsIcon sx={{ color: "white" }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          marginTop: "0.5rem",
          transform: isSmallScreen
            ? "translate(-100px, 0px)"
            : "translate(-130px, 0px)",
          maxHeight: maxNotificationHeight,
          overflowY: "auto",
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleClose}
              sx={{
                maxWidth: maxNotificationWidth,
                whiteSpace: "normal",
                wordWrap: "break-word",
                padding: "10px",
              }}
            >
              <div>
                <strong>{notification.title}</strong>
                <p style={{ marginBottom: "0px" }}>{notification.text}</p>
                {notification.link && (
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "#0d6efd",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(notification?.link || "")}
                  >
                    Learn more
                  </p>
                )}
              </div>
            </MenuItem>
          ))
        ) : (
          <MenuItem
            sx={{
              maxWidth: maxNotificationWidth,
              whiteSpace: "normal",
              wordWrap: "break-word",
              padding: "10px",
            }}
          >
            <div>
              <strong>You are up to date!</strong>
              <p style={{ marginBottom: "0px" }}>No new notifications.</p>
            </div>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default NotificationsPanel;
