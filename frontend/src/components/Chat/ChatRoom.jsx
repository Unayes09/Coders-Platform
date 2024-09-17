import { PrettyChatWindow } from "react-chat-engine-pretty";
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../../providers/UserProvider";

const ChatPage = () => {
  const { user, isUserLoading } = useContext(UserContext);
  return (
    <div className="mx-6 mt-2 pt-2 pb-6 h-[90vh]">
      
      {isUserLoading ? (
        <div>Loading...</div>
      ) : !user ? (
        <div>Please login to chat with coders!!</div>
      ) : (
        <>
          <PrettyChatWindow
            projectId="0e16047b-9510-4874-89dd-1cbce8ada1d7"
            username={user.username}
            secret="secret"
            style={{ height: "100vh" }}
          />
        </>
      )}
    </div>
  );
};

export default ChatPage;
