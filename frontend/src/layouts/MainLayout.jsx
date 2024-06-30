import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="max-w-[2000px] mx-auto">
      <Outlet />
    </div>
  );
};

export default MainLayout;
