import { Button, Input } from "@nextui-org/react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="w-full flex flex-col gap-4 min-w-[250px]">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
        <Input type="email" variant={"underlined"} label="Email" />
        <Input type="password" variant={"underlined"} label="Password" />
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
