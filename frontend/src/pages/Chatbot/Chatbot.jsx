import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import { Button } from "@nextui-org/react";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Tooltip } from "@nextui-org/tooltip";
import "./Chatbot.css";
import ChatbotTextBox from "./ChatbotTextBox";

const Chatbot = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  return (
    <div className="mx-6 mt-2 pb-4">
      <div className="flex flex-col md:grid grid-cols-5">
        {!isSidebarHidden && (
          <div className="col-span-1 px-2">
            <ChatSidebar
              isSidebarHidden={isSidebarHidden}
              setIsSidebarHidden={setIsSidebarHidden}
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
          <div className="mt-2 chatbot-chat-holder rounded-lg p-3 bg-gray-900 h-full">
            <div className="h-[90%] pb-4 overflow-y-auto">
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
              <h1>Messages holder</h1>
            </div>
            <div className="h-[10%]">
              <ChatbotTextBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
