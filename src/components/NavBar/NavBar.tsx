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
import theme from "../../theme";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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
import Person2Icon from "@mui/icons-material/Person2";
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

  const isHome = location.pathname === "/";

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
      <MenuItem
        component={Link}
        to="/"
        onClick={handleMobileMenuClose}
        sx={{
          fontWeight: 700,
          color: "white",

          "&:hover": {
            backgroundColor: "#A0DEFF",
            color: "black",
          },
        }}
      >
        Home
      </MenuItem>
      <MenuItem
        component={Link}
        to="/dashboard"
        onClick={() => {
          handleMobileMenuClose();
          handleDashboard();
        }}
        sx={{
          fontWeight: 700,
          color: "white",

          "&:hover": {
            backgroundColor: "#A0DEFF",
            color: "black",
          },
        }}
      >
        Dashboard
      </MenuItem>
      <MenuItem
        component={Link}
        to="/events"
        onClick={handleMobileMenuClose}
        sx={{
          fontWeight: 700,
          color: "white",

          "&:hover": {
            backgroundColor: "#A0DEFF",
            color: "black",
          },
        }}
      >
        Events
      </MenuItem>
      <MenuItem
        sx={{
          fontWeight: 700,
          color: "white",

          "&:hover": {
            backgroundColor: "#A0DEFF",
            color: "black",
          },
        }}
      >
        <CreateEvent onNavLinkClick={handleMobileMenuClose} />
      </MenuItem>
    </>
  );

  const screenTheme = useTheme();
  const isSmallScreen = useMediaQuery(screenTheme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(screenTheme.breakpoints.down("lg"));

  const iconPadding = isSmallScreen ? "10px 12px" : "20px 32px";
  const mdGap = isMediumScreen ? "16px" : "32px";
  const mdFontSize = isMediumScreen ? "16px" : theme.fontSize.textBody;
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.colors.darkBackground,
        zIndex: 1,
        paddingY: "20px",
      }}
    >
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
                width={isSmallScreen ? "32px" : "65px"}
                height={isSmallScreen ? "32px" : "65px"}
                alt="Lupo Skill logo"
                style={{ pointerEvents: "none", marginRight: "10px" }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#/"
                sx={{
                  mr: "16px",
                  display: { md: "flex" },
                  fontFamily: "Inter",
                  fontWeight: 700,
                  color: "inherit",
                  textDecoration: "none",
                  fontSize: isSmallScreen
                    ? "16px"
                    : isMediumScreen
                    ? "24px"
                    : theme.fontSize.subheading,
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
                },
                fontWeight: 700,
                border: isHome ? "1px solid" : "none",
                borderColor: theme.colors.lightBackground,
                padding: isHome ? "12px 20px" : "0px 12px",
                gap: mdGap,
                borderRadius: "32px",
                alignItems: "center",

                backgroundColor: isHome
                  ? "rgba(255, 255, 255, 0.17)"
                  : "transparent",
              }}
            >
              <Button
                href="#/"
                sx={{
                  fontWeight: 700,
                  fontSize: mdFontSize,
                  color: isHome
                    ? isActive("/")
                      ? "white"
                      : "rgba(255, 255, 255, 0.6)"
                    : isActive("/")
                    ? "black"
                    : theme.colors.brightBackground,
                  backgroundColor: isHome
                    ? isActive("/")
                      ? theme.colors.primary
                      : "transparent"
                    : isActive("/")
                    ? theme.colors.secondaryDark
                    : "transparent",
                  display: "block",
                  borderRadius: theme.borderRadius.large,
                  border: isHome ? "2px solid white" : "none",

                  paddingX: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: isHome
                      ? theme.colors.primary
                      : theme.colors.secondaryDark,
                    color: isHome ? "white" : "black",
                    border: isHome ? "2px solid white" : "none",
                  },
                }}
              >
                Home
              </Button>
              <Button
                href="#/dashboard"
                onClick={handleDashboard}
                sx={{
                  display: "block",
                  fontWeight: 600,
                  gap: "10px",
                  padding: "8px 16px",
                  fontSize: mdFontSize,
                  color: isHome
                    ? isActive("/dashboard")
                      ? "white"
                      : "rgba(255, 255, 255, 0.6)"
                    : isActive("/dashboard")
                    ? "black"
                    : "white",
                  backgroundColor: isHome
                    ? isActive("/dashboard")
                      ? "#A0DEFF"
                      : "rgba(252, 252, 252, 0.2)"
                    : isActive("/dashboard")
                    ? theme.colors.secondaryDark
                    : "transparent",
                  borderRadius: theme.borderRadius.large,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: isHome
                      ? theme.colors.primary
                      : theme.colors.secondaryDark,
                    color: isHome ? "white" : "black",
                    border: isHome ? "2px solid white" : "none",
                  },
                }}
              >
                Dashboard
              </Button>
              <Button
                href="#/events"
                onClick={handleMobileMenuClose}
                sx={{
                  display: "block",
                  fontWeight: 600,
                  gap: "10px",
                  padding: "8px 16px",
                  fontSize: mdFontSize,
                  color: isHome
                    ? isActive("/events")
                      ? "white"
                      : "rgba(255, 255, 255, 0.6)"
                    : isActive("/events")
                    ? "black"
                    : "white",
                  backgroundColor: isHome
                    ? isActive("/events")
                      ? "#A0DEFF"
                      : "rgba(252, 252, 252, 0.2)"
                    : isActive("/events")
                    ? theme.colors.secondaryDark
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isHome
                      ? theme.colors.primary
                      : theme.colors.secondaryDark,
                    color: isHome ? "white" : "black",
                    border: isHome ? "2px solid white" : "none",
                  },
                  borderRadius: theme.borderRadius.large,
                  textTransform: "none",
                }}
              >
                Events
              </Button>
              <Button
                sx={{
                  display: "block",
                  fontWeight: 600,
                  gap: "10px",
                  padding: "8px 16px",
                  fontSize: mdFontSize,
                  color: isHome ? "rgba(255, 255, 255, 0.6)" : "white",
                  backgroundColor: isHome
                    ? "rgba(252, 252, 252, 0.2)"
                    : "transparent",
                  borderRadius: theme.borderRadius.large,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: isHome
                      ? theme.colors.primary
                      : theme.colors.secondaryDark,
                    color: isHome ? "white" : "black",
                    border: isHome ? "2px solid white" : "none",
                  },
                }}
              >
                <CreateEvent onNavLinkClick={handleMobileMenuClose} />
              </Button>
            </Box>
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: mdGap,
              }}
            >
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                sx={{
                  border: isHome ? "1px solid" : "none",
                  borderColor: theme.colors.lightBackground,
                  padding: iconPadding,
                  gap: "32px",
                  borderRadius: "32px",
                  alignItems: "center",

                  backgroundColor: isHome
                    ? "rgba(255, 255, 255, 0.17)"
                    : "transparent",
                }}
              >
                {mode ? <Brightness4 /> : <Brightness7 />}
              </IconButton>

              {!is_signup ? (
                // <Signup />

                <IconButton
                  onClick={handleDashboard}
                  color="inherit"
                  sx={{
                    border: isHome ? "1px solid" : "none",
                    borderColor: theme.colors.lightBackground,
                    padding: iconPadding,
                    gap: "32px",
                    borderRadius: "32px",
                    alignItems: "center",

                    backgroundColor: isHome
                      ? "rgba(255, 255, 255, 0.17)"
                      : "transparent",
                  }}
                >
                  <Person2Icon />
                </IconButton>
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
                  top: "14px",
                  left: "-16px",
                  zIndex: 1,
                }}
                MenuListProps={{
                  sx: {
                    padding: 0, // Remove padding from MenuList
                    backgroundColor: "#0F0F0F",
                  },
                }}
              >
                {" "}
                <Box sx={{ backgroundColor: "#0F0F0F", width: "100%" }}>
                  {mobileMenuItems}
                </Box>
              </Menu>
            )}
          </Box>
        </Container>{" "}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
