import { App as SendbirdApp } from "@sendbird/uikit-react";
import "@sendbird/uikit-react/dist/index.css";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";

const ChatComponent = ({ username }) => {
  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex my-2">
        <Link to="/" className="flex justify-center items-center gap-2">
          <Logo />
          <p className="hidden sm:block font-bold text-inherit">
            Coders Platform
          </p>
        </Link>
      </div>
      <div className="mx-auto w-full h-[85vh]">
        <SendbirdApp
          theme={"dark"}
          appId={import.meta.env.VITE_CHAT_APP_ID}
          userId={username}
        />
      </div>
    </div>
  );
};

export default ChatComponent;
