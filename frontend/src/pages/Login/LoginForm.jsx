import { useState } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    axiosInstance
      .post("/api/users/login", {
        email,
        password,
      })
      .then((response) => {
        const token = response.data?.token;
        axiosInstance
          .get(`/api/users/profile?token=${token}`)
          .then((res) => {
            setIsLoading(false);
            // save token and profile on local storage
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("profile", JSON.stringify(res.data));
            // After login, redirect back to the page they came from
            navigate(from, { replace: true });
          })
          .catch(() => {
            toast.error("Sorry! Something went wrong");
            setIsLoading(false);
          });
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message || "Sorry! Something went wrong"
        );
        setIsLoading(false);
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
          isDisabled={isLoading}
          type="submit"
          radius="full"
          className="mt-4 bg-gradient-to-r from-[#39393F] via-[#47474e] to-[#39393F] text-white shadow-lg"
        >
          {!isLoading && <span>Login</span>}
          {isLoading && <Spinner />}
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
