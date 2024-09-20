import { useContext, useEffect, useRef, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import { Button, Spinner } from "@nextui-org/react";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Tooltip } from "@nextui-org/tooltip";
import { RxCopy } from "react-icons/rx";
import "./Chatbot.css";
import ChatbotTextBox from "./ChatbotTextBox";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import FeedbackContainer from "../Playground/FeedbackContainer";
import { BiConversation } from "react-icons/bi";
import { BsChatLeftText } from "react-icons/bs";
import { TiPinOutline, TiPin } from "react-icons/ti";

import toast from "react-hot-toast";

const Chatbot = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const [showPinnedMessagesModal, setShowPinnedMessagesModal] = useState(false);

  const scrollRef = useRef(null);

  const { user } = useContext(UserContext);

  const promptClasses =
    "w-[80%] bg-[#522258] text-white ml-auto mr-3 rounded-xl px-5 py-3";
  const responseClasses =
    "w-[80%] bg-[#C8A1E0] text-black ml-2 rounded-xl px-5 py-3";

  useEffect(() => {
    console.log(selectedChat);
    axiosInstance
      .get(`/api/bot/responses?token=${user?.token}&chatId=${selectedChat}`)
      .then((res) => {
        console.log(res);
        setConversation(res.data);
        setConversationLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setConversationLoading(false);
      });
  }, [selectedChat, user, refetch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      console.log("scrolling down");
    }
  }, [conversation]);

  const reloadConversation = () => {
    setRefetch(!refetch);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Text Copied");
      },
      (err) => {
        console.error("Failed to copy text to clipboard:", err);
      }
    );
  };

  const pinMessage = (message) => {
    console.log(message);
    // toast.success("Message Pinned");
    // not premium user alert
    toast.error("Only premium users can pin messages");
    // error alert
    // toast.error("Error! Please try again!");
  };

  const handleCloseModal = () => {
    setShowPinnedMessagesModal(false);
  };

  return (
    <div className="mx-6 mt-2 pb-4 relative">
      {/* Pined Message Modal */}
      {showPinnedMessagesModal && (
        <div className="bg-black bg-opacity-70 w-full h-full absolute top-0 left-0 z-50">
          <div className="bg-[#333] rounded-lg shadow-lg p-6 w-[80vw] h-[80vh] mx-auto overflow-auto">
            <h2 className="text-lg font-bold mb-4">Pinned Messages</h2>
            {/* Add your pinned message content here */}
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            <h1>Message</h1>
            {/* Close button */}
            <Button variant="flat" color="danger" onClick={handleCloseModal}>
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:grid grid-cols-5">
        {!isSidebarHidden && (
          <div className="col-span-1 px-2">
            <ChatSidebar
              isSidebarHidden={isSidebarHidden}
              setIsSidebarHidden={setIsSidebarHidden}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              setConversation={setConversation}
              setConversationLoading={setConversationLoading}
            />
          </div>
        )}
        <div
          className={`mt-5 md:mt-0 mx-2 ${
            isSidebarHidden ? "col-span-5" : "col-span-4"
          }`}
        >
          <div className="flex gap-4 items-center">
            {isSidebarHidden && (
              <div>
                <Tooltip
                  placement="bottom"
                  content="Show sidebar"
                  color="secondary"
                >
                  <Button
                    className="self-start"
                    onClick={() => setIsSidebarHidden(!isSidebarHidden)}
                    size="sm"
                  >
                    <TbLayoutSidebarLeftExpand className="text-xl" />
                  </Button>
                </Tooltip>
              </div>
            )}
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              Chatbot
            </span>
          </div>

          {/* main content */}
          <div className="mt-2 chatbot-chat-holder rounded-lg p-3 bg-gray-900 h-full relative">
            {/* if pinned messages exist then render */}
            {/* pinnedMessages && (rest ) --- render conditionally like this */}
            {true && (
              <div className="absolute bg-white/10 backdrop-blur-lg top-0 left-0 right-0 p-3 rounded-t-lg">
                <span
                  onClick={() => setShowPinnedMessagesModal(true)}
                  className="cursor-pointer hover:text-primary tracking-wide"
                >
                  Pinned messages
                </span>
              </div>
            )}
            <div
              ref={scrollRef}
              className="h-[75%] pb-4 overflow-y-auto flex flex-col gap-6"
            >
              {!selectedChat && (
                <h1 className="text-xl flex gap-3 items-center justify-center h-full">
                  <BiConversation className="text-3xl text-secondary" />
                  <span className="font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    Create a new conversation
                  </span>
                </h1>
              )}
              {selectedChat && conversationLoading && (
                <div className="h-full flex justify-center items-center">
                  <Spinner color="white" />
                </div>
              )}
              {selectedChat && !conversationLoading && (
                <>
                  {conversation.length === 0 && (
                    <h1 className="text-xl flex gap-3 items-center justify-center h-full">
                      <BsChatLeftText className="text-3xl text-secondary" />
                      <span className="font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        Write something to begin
                      </span>
                    </h1>
                  )}
                  {conversation.map((message) => {
                    return (
                      <div key={message.id}>
                        <div
                          className={`${
                            message.from === "bot"
                              ? responseClasses
                              : promptClasses
                          }`}
                        >
                          <FeedbackContainer text={message.message} />
                        </div>
                        {message.from === "bot" && (
                          <>
                            <div
                              onClick={() => copyToClipboard(message.message)}
                              className="group flex gap-2 items-center h-[20px] ml-3 mt-2 cursor-pointer"
                            >
                              <RxCopy className="group-hover:text-secondary transition-all duration-200" />
                              <span className="text-white group-hover:text-secondary opacity-0 group-hover:opacity-100 transition-all duration-200">
                                Copy to clipboard
                              </span>
                            </div>
                            <div
                              onClick={() => pinMessage(message)}
                              className="group flex gap-2 items-center h-[20px] ml-3 mt-2 cursor-pointer"
                            >
                              {/* IF message is not pinned */}
                              <TiPinOutline className="group-hover:text-secondary transition-all duration-200" />
                              <span className="text-white group-hover:text-secondary opacity-0 group-hover:opacity-100 transition-all duration-200">
                                Pin Message
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            <div className="h-[25%]">
              {selectedChat && (
                <ChatbotTextBox
                  chatId={selectedChat}
                  conversation={conversation}
                  setConversation={setConversation}
                  reloadConversation={reloadConversation}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
