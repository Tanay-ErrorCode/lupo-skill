import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Badge,
  useMediaQuery,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import theme from "../../theme";

interface Notification {
  id: number;
  message: string;
}

const NotificationsPanel = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "The event Summer Fest has been deleted." },
    { id: 2, message: "The event Winter Gala has been deleted." },
    { id: 3, message: "The event Spring Carnival has been deleted." },
    { id: 4, message: "The event Spring Carnival has been deleted." },
    { id: 5, message: "The event Spring Carnival has been deleted." },
  ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isHome = location.pathname === "/";

  const screenTheme = useTheme();
  const isSmallScreen = useMediaQuery(screenTheme.breakpoints.down("sm"));

  const iconPadding = isSmallScreen ? "8px 10px" : "16px";

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
          translate: "-150px 0px",
          maxHeight: maxNotificationHeight,
          overflowY: "auto",
        }}
      >
        {notifications.map((notification) => (
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
            {notification.message}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default NotificationsPanel;
