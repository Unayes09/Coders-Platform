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
  // loading state
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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

        const headers = {
          "Content-Type": "application/json; charset=utf8",
          "Api-Token": "426499d7daa83c388d482869d6419d07a159bdf8",
        };

        axios
          .post(
            `https://api-8FD3EBE6-0A49-4DD7-85D6-3E43A993D8C0.sendbird.com/v3/users`,
            {
              user_id: username,
              nickname: username,
              profile_url: "",
            },
            { headers }
          )
          .then(() => {
            console.log("chat user created");
            toast.success(
              "Registered successfully! Please confirm your email!"
            );
            setLoading(false);
          })
          .catch((err) => {
            console.log("chat user error");
            toast.error("Error. Please try again.");
            console.log(err);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong!");
        setLoading(false);
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
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
