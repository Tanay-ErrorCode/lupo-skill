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

  const userPic = localStorage.getItem("userPic");
  const is_signup = userPic ? true : false;
  const userUid = localStorage.getItem("userUid");

  const handleDashboard = () => {
    if (!is_signup) setShow(!show);
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
            <Nav.Link href="#/">Home</Nav.Link>
            <Nav.Link href="#/dashboard" onClick={handleDashboard}>
              Dashboard
            </Nav.Link>
            <Nav.Link href="#/events">Events</Nav.Link>
            {/* /dashboard */}
            <CreateEvent props={"navbar"} />
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
                  >
                    View Profile
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    className="text-danger  nav-profile-dropdown"
                    onClick={() => {
                      signOutUser();
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
