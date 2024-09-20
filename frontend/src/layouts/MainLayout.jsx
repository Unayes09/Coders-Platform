import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import CustomNavbar from "../components/CustomNavbar/CustomNavbar";
import FacialExpressionRecognition from "../components/face/face";

const MainLayout = () => {
  return (
    <div>
      <FacialExpressionRecognition />
      <div className="max-w-[2000px] mx-auto">
        <CustomNavbar />
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
};

export default MainLayout;
