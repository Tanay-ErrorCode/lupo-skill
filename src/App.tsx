import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import EventList from "./components/EventList/EventList";
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

const Layout = () => (
  <>
    <NotificationsPannel />
    <NavBar />
    <ScrollToTop />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HomePage />
            <PageTitle title="Lupo Skill" />
          </>
        ),
      },
      {
        path: "/events",
        element: (
          <>
            <EventList />
            <PageTitle title="Events | Lupo Skill" />
          </>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <>
            <Dashboard />
            <PageTitle title="Dashboard | Lupo Skill" />
          </>
        ),
      },
      {
        path: "/createEvent",
        element: <CreateEvent />,
      },
      {
        path: "/profile/:id",
        element: <ProfilePage />,
      },
      {
        path: "/eventDetails/:id",
        element: <EventDetails />,
      },
      {
        path: "/article",
        element: <ArticlesHomepage />,
      },
      {
        path: "/article/write",
        element: <ArticleWritingPage />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
