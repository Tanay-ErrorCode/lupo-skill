import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.css";
import default_user from "../image_assets/default_user.png";
import CreateEvent from "../Cards/CreateEvent/CreateEvent";
import Signup from "../Signup/Signup";
import { toast } from "react-toastify";
import { signOutUser } from "../../firebaseConf";
import logo from "../image_assets/logo.png";

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);
  const [show, setShow] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleClose = () => {
    setExpanded(false); // This will close the navbar
  };

  const userPic = localStorage.getItem("userPic");
  const is_signup = userPic ? true : false;
  const userUid = localStorage.getItem("userUid");

  const handleDashboard = () => {
    if (!is_signup) setShow(!show);
    handleClose(); // Close the navbar when Dashboard is clicked
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      expanded={expanded}
      style={{ userSelect: "none" }}
      fixed="top"
    >
      <Signup isShow={show} returnShow={setShow} />
      <Container>
        <Navbar.Brand href="#/" className="me-auto">
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Lupo Skill logo"
            style={{ pointerEvents: "none" }}
          />{" "}
          Lupo Skill
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={handleToggle}
        />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="m-auto align-items-center">
            <Nav.Link href="#/" onClick={handleClose}>
              {" "}
              {/* Close the navbar when Home is clicked */}
              Home
            </Nav.Link>
            <Nav.Link href="#/dashboard" onClick={handleDashboard}>
              {" "}
              {/* Close the navbar when Dashboard is clicked */}
              Dashboard
            </Nav.Link>
            <Nav.Link href="#/events" onClick={handleClose}>
              {" "}
              {/* Close the navbar when Events is clicked */}
              Events
            </Nav.Link>
            <CreateEvent onNavLinkClick={handleClose} />{" "}
            {/* Pass handleClose to CreateEvent */}
          </Nav>
          <Nav className="align-items-center">
            {!is_signup ? (
              // <Signup />
              <Button variant="success" onClick={handleDashboard}>
                Login
              </Button>
            ) : (
              <NavDropdown
                title={
                  <img
                    src={userPic || default_user}
                    className="nav-profile-round"
                  />
                }
                id="basic-nav-dropdown"
                className="text-center"
              >
                <div>
                  <NavDropdown.Item
                    href={"#/profile/" + (userUid ? userUid : "")}
                    className="text-success  nav-profile-dropdown"
                    onClick={handleClose} // Close the navbar when View Profile is clicked
                  >
                    View Profile
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    className="text-danger  nav-profile-dropdown"
                    onClick={() => {
                      signOutUser();
                      handleClose(); // Close the navbar when Logout is clicked
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </div>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
