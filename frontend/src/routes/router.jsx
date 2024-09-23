import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import AuthenticationLayout from "../layouts/AuthenticationLayout";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import Playground from "../pages/Playground/Playground";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Depots from "../pages/Depots/Depots";
import SingleDepot from "../pages/SingleDepot/SingleDepot";
import DepotFile from "../pages/SingleDepot/DepotFile";
import Subscribe from "../pages/Subscribe/Subscribe";
import Chatbot from "../pages/Chatbot/Chatbot";
import QnA from "../pages/QNA/QnA";
import SingleQuestion from "../pages/QNA/SingleQuestion";
import AskQuestion from "../pages/QNA/AskQuestion";
import EditResume from "../pages/EditResume/EditResume";
import News from "../pages/News/News";
import AllSkill from "../pages/SkillTest/AllSkill";
import TestPage from "../pages/SkillTest/TestPage";
import GapAnalysis from "../pages/GapAnalysis/GapAnalysis";
import SchedulePage from "../pages/Schedule/SchedulePage";
import EventPage from "../pages/Events/EventPage"
import Story from "../pages/Story/Story";
import JobSearchPage from "../pages/Jobs/JobSearchPage";
import CreateJobPage from "../pages/Jobs/CreateJobPage";
import Chat from "../pages/Chat/Chat";
import UserConfirmation from "../pages/SignUp/UserConfirmation";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminLoginPage from "../pages/Admin/AdminLoginPage";
import AdminPage from "../pages/Admin/AdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "playground",
        element: <Playground />,
      },
      {
        path: "depots",
        element: <Depots />,
      },
      {
        path: "depots/:id",
        element: <SingleDepot />,
      },
      {
        path: "depots/:depotId/:fileId",
        element: <DepotFile />,
      },
      {
        path: "subscribe",
        element: <Subscribe />,
      },
      {
        path: "chatbot",
        element: <Chatbot />,
      },
      {
        path: "qna",
        element: <QnA />,
      },
      {
        path: "qna/:id",
        element: <SingleQuestion />,
      },
      {
        path: "qna/ask",
        element: <AskQuestion />,
      },
      {
        path: "edit_resume",
        element: <EditResume />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "skill-test",
        element: <AllSkill />,
      },
      {
        path: "skill-test/:topic",
        element: <TestPage />,
      },
      {
        path: "gap",
        element: <GapAnalysis />,
      },
      {
        path: "schedule",
        element: <SchedulePage />,
      },
      {
        path: "event",
        element: <EventPage />,
      },
      {
        path: "story",
        element: <Story />,
      },
      {
        path: "jobs",
        element: <JobSearchPage />,
      },
      {
        path: "create-job",
        element: <CreateJobPage />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "profile/:userId",
        element: <ProfilePage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthenticationLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <SignUp />,
      },
      {
        path: "confirm",
        element: <UserConfirmation />,
      },
      {
        path: "admin",
        element: <AdminLoginPage />,
      },
    ],
  },
  {
    path: "*", // This will catch all undefined routes
    element: <ErrorPage />,
  },
]);

export default router;
