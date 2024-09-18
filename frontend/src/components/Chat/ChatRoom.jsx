//import { PrettyChatWindow } from "react-chat-engine-pretty";
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
          
        </>
      )}
    </div>
  );
};

export default ChatPage;
