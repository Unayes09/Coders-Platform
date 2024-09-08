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
import News from "../pages/News/News";

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
        path: "news",
        element: <News />
      }
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
    ],
  },
  {
    path: "*", // This will catch all undefined routes
    element: <ErrorPage />,
  },
]);

export default router;
