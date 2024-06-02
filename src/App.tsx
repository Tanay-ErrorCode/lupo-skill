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
import Footer from "./components/Footer/Footer";
import PageTitle from "./utils/PageTitle";

function App() {
  return (
    <div className="App">
      <NavBar />
      <NotificationsPannel />
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HomePage />
                <PageTitle title="Lupo Skill" />
              </>
            }
          />
          <Route
            path="/events"
            element={
              <>
                <EventList /> <PageTitle title="Events | Lupo Skill" />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <Dashboard /> <PageTitle title="Dashboard | Lupo Skill" />
              </>
            }
          />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/eventDetails/:id" element={<EventDetails />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </HashRouter>
      <Footer />
    </div>
  );
}

export default App;
