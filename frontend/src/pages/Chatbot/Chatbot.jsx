import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import { Button } from "@nextui-org/react";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Tooltip } from "@nextui-org/tooltip";
import "./Chatbot.css";

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
          className={`${
            isSidebarHidden
              ? "col-span-5 flex gap-4 items-center"
              : "col-span-4"
          } mx-2`}
        >
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
      </div>
    </div>
  );
};

export default Chatbot;
