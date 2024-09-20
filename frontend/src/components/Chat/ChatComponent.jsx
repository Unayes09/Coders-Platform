import { PrettyChatWindow } from "react-chat-engine-pretty";

const ChatComponent = ({ username }) => {
  console.log(username);

  return (
    <div>
      <div className="h-[100vh]">
        <PrettyChatWindow
          projectId={import.meta.env.VITE_CHAT_ENGINE_PROJECT_ID}
          username={username}
          secret="secret"
          style={{ height: "100vh" }}
        />
      </div>
    </div>
  );
};

export default ChatComponent;
