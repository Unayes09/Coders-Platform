import { PrettyChatWindow } from "react-chat-engine-pretty";

const ChatPage = () => {
  return (
    <div className="mx-6 mt-2 pt-2 pb-6 h-[90vh]">
      <PrettyChatWindow
        projectId="0e16047b-9510-4874-89dd-1cbce8ada1d7"
        username="Unayes"
        secret="5d633895-77af-4e14-8888-e3611aba8cea"
        // style={{ height: "100vh" }}
      />
    </div>
  );
};

export default ChatPage;
