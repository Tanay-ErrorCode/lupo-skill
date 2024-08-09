import React from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import EventList from "./components/EventList/EventList";
import { Routes, Route, HashRouter, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Dashboard from "./components/DashBoard/DashBoard";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import EventDetails from "./components/EventDetails/EventDetails";
import Signup from "./components/Signup/Signup";
import { NotificationsPannel } from "./components/NotificationsPannel";
import ErrorPage from "./components/ErrorPage/404ErrorPage";
import Footer from "./components/Footer/Footer";
import PageTitle from "./utils/PageTitle";
import { ScrollToTop } from "./components/Scrolltotop";
import CreateEvent from "./components/Cards/CreateEvent/CreateEvent";
import ArticlesHomepage from "./components/Article/ArticlesHomepage";
import ArticleWritingPage from "./components/Article/ArticleWritingPage";
import ArticlePage from "./components/Article/ArticlePage";
import ArticleEditingPage from "./components/Article/ArticleEditingPage";
import MeetingPage from "./components/Meetings/MeetingPage";

function App() {
  return (
    <div className="App">
      <NotificationsPannel />
      <HashRouter>
        <AppContent />
      </HashRouter>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isMeetingRoute = location.pathname.startsWith("/meeting/");

  return (
    <>
      {!isMeetingRoute && <NavBar />}
      <ScrollToTop />
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
        <Route path="/createEvent" element={<CreateEvent />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/eventDetails/:id" element={<EventDetails />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route
          path="/article"
          element={
            <>
              <ArticlesHomepage /> <PageTitle title="Articles | Lupo Skill" />
            </>
          }
        />
        <Route
          path="/article/write"
          element={
            <>
              <ArticleWritingPage />{" "}
              <PageTitle title="Create Article | Lupo Skill" />
            </>
          }
        />
        <Route path="/edit-article/:id" element={<ArticleEditingPage />} />
        <Route path="/meeting/:id" element={<MeetingPage />} />
      </Routes>
      {!isMeetingRoute && <Footer />}
    </>
  );
}

export default App;
