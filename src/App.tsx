import React from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import EventList from "./components/EventList/EventList";
import { Routes, Route, HashRouter } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Dashboard from "./components/DashBoard/DashBoard";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import EventDetails from "./components/EventDetails/EventDetails";
import Signup from "./components/Signup/Signup";
import { NotificationsPannel } from "./components/NotificationsPannel";
import ErrorPage from "./components/ErrorPage/404ErrorPage";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <NavBar />
        <NotificationsPannel />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/eventDetails/:id" element={<EventDetails />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
