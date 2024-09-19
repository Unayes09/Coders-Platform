import { Link } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import SignUpForm from "./SignUpForm";
import VantaGlobe from "../../components/VantaGlobe/VantaGlobe";
import { useState } from "react";
import FinishSignUp from "./FinishSignUp";
import axios from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  // states to show different forms
  const [isCredentials, setIsCredentials] = useState(true);
  const [isExtraInfo, setIsExtraInfo] = useState(false);

  // states for handling credentials
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // states for extra information
  const [role, setRole] = useState("");
  const [interests, setInterests] = useState([]);
  const [skills, setSkills] = useState([]);

  const handleRegistration = () => {
    console.log("registering...");
    console.log({
      fullName,
      username,
      email,
      password,
      role,
      interests,
      skills,
    });

    axiosInstance
      .post("/api/users/register", {
        fullName,
        username,
        email,
        password,
        image: "",
        address: "",
        phone: "",
        role,
        interests,
        skills,
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Registered successfully! Please cofirm your email!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong!");
      });
  };

  return (
    <div className="">
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
                Sign Up
              </h2>
              <h2></h2>
            </div>
            {isCredentials && (
              <SignUpForm
                fullName={fullName}
                setFullName={setFullName}
                username={username}
                setUsername={setUsername}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                setIsCredentials={setIsCredentials}
                setIsExtraInfo={setIsExtraInfo}
              />
            )}
            {isExtraInfo && (
              <FinishSignUp
                role={role}
                setRole={setRole}
                interests={interests}
                setInterests={setInterests}
                skills={skills}
                setSkills={setSkills}
                handleRegistration={handleRegistration}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
