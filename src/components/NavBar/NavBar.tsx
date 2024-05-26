import React, { useEffect, useState } from "react";
// import {
//   Navbar,
//   Nav,
//   NavDropdown,
//   Container,
//   Offcanvas,
//   Button,
// } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import "./NavBar.css";
import default_user from "../image_assets/default_user.png";
import CreateEvent from "../Cards/CreateEvent/CreateEvent";
import Signup from "../Signup/Signup";
import { toast } from "react-toastify";
import { signOutUser } from "../../firebaseConf";
import logo from "../image_assets/logo.png";

import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);
  const [show, setShow] = useState(false);
  const location = useLocation();
  const [mode, SetMode] = useState(true);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const isActive = (path: String) => {
    return location.pathname === path;
  };

  const toggleMobileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExpanded(!expanded);
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);

    setExpanded(false);
  };

  const handleLogout = () => {
    signOutUser();
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleTheme = () => {
    SetMode(!mode);
  };

  const userPic = localStorage.getItem("userPic");
  const is_signup = userPic ? true : false;
  const userUid = localStorage.getItem("userUid");

  const handleDashboard = () => {
    if (!is_signup) setShow(!show);
    handleMobileMenuClose();
  };

  const mobileMenuItems = (
    <>
      <MenuItem component={Link} to="/" onClick={handleMobileMenuClose}>
        Home
      </MenuItem>
      <MenuItem
        component={Link}
        to="/dashboard"
        onClick={() => {
          handleMobileMenuClose();
          handleDashboard();
        }}
      >
        Dashboard
      </MenuItem>
      <MenuItem component={Link} to="/events" onClick={handleMobileMenuClose}>
        Events
      </MenuItem>
    </>
  );

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#0F0F0F", zIndex: 1 }}>
      <Signup isShow={show} returnShow={setShow} />
      <Toolbar>
        <Container maxWidth="xl">
          <Box
            sx={{
              margin: 0,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Add justify-content: space-between
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                width="30"
                height="30"
                alt="Lupo Skill logo"
                style={{ pointerEvents: "none", marginRight: "10px" }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#/"
                sx={{
                  mr: 2,
                  display: { md: "flex" },
                  fontFamily: "Inter",
                  fontWeight: 700,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Lupo Skill
              </Typography>
            </Box>

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                  padding: 10,
                  gap: 10,
                  borderRadius: 50,
                },
              }}
            >
              <Button
                variant="contained"
                href="#/"
                sx={{
                  my: 2,
                  fontWeight: 700,
                  color: isActive("/") ? "black" : "white",
                  backgroundColor: isActive("/") ? "#A0DEFF" : "transparent",
                  display: "block",
                  borderRadius: 50,
                  textTransform: "none",
                }}
              >
                Home
              </Button>
              <Button
                variant="contained"
                href="#/dashboard"
                onClick={handleDashboard}
                sx={{
                  my: 2,
                  display: "block",
                  fontWeight: 700,
                  color: isActive("/dashboard") ? "black" : "white",
                  backgroundColor: isActive("/dashboard")
                    ? "#A0DEFF"
                    : "transparent",
                  borderRadius: 50,
                  textTransform: "none",
                }}
              >
                Dashboard
              </Button>
              <Button
                variant="contained"
                href="#/events"
                onClick={handleMobileMenuClose}
                sx={{
                  my: 2,
                  display: "block",
                  borderRadius: 50,
                  fontWeight: 700,
                  color: isActive("/events") ? "black" : "white",
                  backgroundColor: isActive("/events")
                    ? "#A0DEFF"
                    : "transparent",

                  textTransform: "none",
                }}
              >
                Events
              </Button>

              <CreateEvent onNavLinkClick={handleMobileMenuClose} />
            </Box>
            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              <IconButton onClick={toggleTheme} color="inherit">
                {mode ? <Brightness4 /> : <Brightness7 />}
              </IconButton>

              {!is_signup ? (
                // <Signup />
                <Button
                  onClick={handleDashboard}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {" "}
                  Login
                </Button>
              ) : (
                <div>
                  <Button onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar alt="User Avatar" src={userPic || default_user} />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{ margin: 1 }}
                  >
                    <MenuItem
                      component={Link}
                      to={`/profile/${userUid ? userUid : ""}`}
                      onClick={handleMenuClose}
                      sx={{ color: "green" }}
                    >
                      View Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </Box>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenuOpen}
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            {expanded && (
              <Menu
                anchorEl={mobileMenuAnchorEl}
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
                sx={{
                  display: { xs: "flex", md: "none" },
                  flexDirection: "column",
                  position: "fixed",
                  top: "16px",
                  left: "-16px",
                }}
              >
                {mobileMenuItems}
                <CreateEvent
                  onNavLinkClick={handleMobileMenuClose}
                  props="other"
                />
              </Menu>
            )}
          </Box>
        </Container>{" "}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
