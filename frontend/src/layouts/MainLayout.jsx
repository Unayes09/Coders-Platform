import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import CustomNavbar from "../components/CustomNavbar/CustomNavbar";

const MainLayout = () => {
  return (
    <div className="max-w-[2000px] mx-auto">
      <CustomNavbar />
      <Outlet />
      <Toaster />
    </div>
  );
};

export default MainLayout;
