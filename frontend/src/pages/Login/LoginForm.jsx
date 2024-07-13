import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();

    axiosInstance
      .post("/api/users/login", {
        email,
        password,
      })
      .then((res) => {
        const authorizationHeader = res.headers["Authorization"];
        console.log(authorizationHeader);
        console.log(res.data);
        alert(res.data.message);
      });
  };

  return (
    <div className="w-[230px] sm:w-[300px] md:w-[350px] flex flex-col gap-4">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
        <Input
          type="email"
          variant={"underlined"}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
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
          Login
        </Button>
        <h5 className="text-[13px] text-center mt-4 flex gap-2 justify-center">
          <span>Not registered yet?</span>
          <Link
            to="/auth/register"
            className="flex items-center gap-1 text-blue-400"
          >
            Create an account
          </Link>
        </h5>
      </form>
    </div>
  );
};

export default LoginForm;
