//import { PrettyChatWindow } from "react-chat-engine-pretty";
import { useContext, useEffect, useState } from "react";

import { UserContext } from "../../providers/UserProvider";
import ChatComponent from "./ChatComponent";

const ChatPage = () => {
  const { user, isUserLoading } = useContext(UserContext);
  console.log(user);

  return (
    <div className="mx-6 overflow-auto">
      {isUserLoading ? (
        <div>Loading...</div>
      ) : !user ? (
        <div>Please login to chat with coders!!</div>
      ) : (
        <>{user && <ChatComponent username={user.username} />} </>
      )}
    </div>
  );
};

export default ChatPage;
