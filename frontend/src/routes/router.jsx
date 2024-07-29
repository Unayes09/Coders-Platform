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
  // {
  //   path: "*", // This will catch all undefined routes
  //   element: <ErrorPage />,
  // },
]);

export default router;
