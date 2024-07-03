import { Outlet } from "react-router-dom";

const AuthenticationLayout = () => {
  return (
    <div className="max-w-[2000px] mx-auto">
      <Outlet />
    </div>
  );
};

export default AuthenticationLayout;
