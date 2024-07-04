import { Button, Input } from "@nextui-org/react";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUpForm = () => {
  // TODO: as individual or company
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Fetch form data
    const formData = new FormData(event.target);
    const fullName = formData.get("fullName");
    const username = formData.get("userName");
    const email = formData.get("email");
    const password = formData.get("password");

    // Log data to console
    console.log({ fullName, username, email, password });
  };

  return (
    <div className="w-full flex flex-col gap-4 min-w-[250px]">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
        <Input
          name="fullName"
          isRequired
          type="text"
          variant={"underlined"}
          label="Full Name"
        />
        <Input
          name="userName"
          isRequired
          type="text"
          variant={"underlined"}
          label="Username"
        />
        <Input
          name="email"
          isRequired
          type="email"
          variant={"underlined"}
          label="Email"
        />
        <Input
          name="password"
          isRequired
          type="password"
          variant={"underlined"}
          label="Password"
        />
        <Button
          type="submit"
          radius="full"
          className="mt-4 bg-gradient-to-r from-[#39393F] via-[#47474e] to-[#39393F] text-white shadow-lg"
        >
          Sign Up
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
