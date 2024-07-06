import { Button, Input } from "@nextui-org/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const SignUpForm = (props) => {
  const {
    fullName,
    setFullName,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    setIsCredentials,
    setIsExtraInfo,
  } = props;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{6,}$/;

  const handleNext = (event) => {
    event.preventDefault();

    // check if fields are empty or not
    if (fullName === "" || username === "" || email === "" || password === "") {
      toast.error("Please fill-up all the fields");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password must be 6 characters long");
      return;
    }

    setIsCredentials(false);
    setIsExtraInfo(true);

    // Log data to console
    console.log({ fullName, username, email, password });
  };

  return (
    <div className="w-full flex flex-col gap-4 min-w-[250px]">
      <form onSubmit={handleNext} className="flex flex-col gap-2">
        <Input
          name="fullName"
          isRequired
          type="text"
          variant={"underlined"}
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          name="userName"
          isRequired
          type="text"
          variant={"underlined"}
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          name="email"
          isRequired
          type="email"
          variant={"underlined"}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          name="password"
          isRequired
          type="password"
          variant={"underlined"}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          radius="full"
          className="mt-4 bg-gradient-to-r from-[#39393F] via-[#47474e] to-[#39393F] text-white shadow-lg"
        >
          Next
        </Button>
        <h5 className="text-[13px] text-center mt-4 flex gap-2 justify-center">
          <span>Already have an account?</span>
          <Link
            to="/auth/login"
            className="flex items-center gap-1 text-blue-400"
          >
            Login
          </Link>
        </h5>
      </form>
    </div>
  );
};

export default SignUpForm;
