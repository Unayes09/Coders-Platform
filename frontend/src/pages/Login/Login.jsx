import { Link } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import LoginForm from "./LoginForm";
import VantaGlobe from "../../components/VantaGlobe/VantaGlobe";

const Login = () => {
  return (
    <div>
      <div className="relative">
        <div className="z-10">
          <VantaGlobe />
        </div>
        <div
          className="p-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center rounded-2xl overflow-hidden shadow-lg text-white bg-[#0000003b] bg-opacity-80 backdrop-filter backdrop-blur-lg"
          style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)" }}
        >
          <div className="login-form">
            <div className="grid grid-cols-3 items-center">
              <Link to="/">
                <Logo />
              </Link>
              <h2 className="text-center text-lg font-semibold tracking-wide">
                Login
              </h2>
              <h2></h2>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
