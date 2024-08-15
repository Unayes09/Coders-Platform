import { Button, Tooltip } from "@nextui-org/react";
import Logo from "../../components/Logo/Logo";
import { CiEdit } from "react-icons/ci";
import { SlOptions } from "react-icons/sl";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";

const ChatSidebar = ({ isSidebarHidden, setIsSidebarHidden }) => {
  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex flex-col gap-2">
        <Tooltip placement="right" content="Hide sidebar" color="secondary">
          <Button
            className="self-start"
            onClick={() => setIsSidebarHidden(!isSidebarHidden)}
            size="sm"
          >
            <TbLayoutSidebarLeftCollapse className="text-xl" />
          </Button>
        </Tooltip>
        <Button className="bg-[#282c34] text-white shadow-lg w-full flex gap-2 items-center justify-between group">
          <div className="flex items-center justify-start gap-2">
            <Logo />
            <span>New Chat</span>
          </div>
          <CiEdit className="hidden group-hover:block font-bold text-[18px]" />
        </Button>
      </div>

      <div className="overflow-y-auto chatbot-sidebar-list-holder">
        <ul className="flex flex-col gap-2">
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
          <li className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group">
            CV Summary And Review For Application
            <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
              <SlOptions />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
