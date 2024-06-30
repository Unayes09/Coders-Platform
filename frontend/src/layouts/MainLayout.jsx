import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div>
      This is main layout
      <Outlet />
    </div>
  );
};

export default MainLayout;
