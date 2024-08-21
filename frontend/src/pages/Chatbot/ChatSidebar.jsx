import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import Logo from "../../components/Logo/Logo";
import { CiEdit } from "react-icons/ci";
import { SlOptions } from "react-icons/sl";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { EditDocumentIcon } from "./EditDocumentIcon";
import { DeleteDocumentIcon } from "./DeleteDocumentIcon";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";

const ChatSidebar = ({ isSidebarHidden, setIsSidebarHidden }) => {
  const [chatList, setChatList] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    axiosInstance
      .get(`/api/bot/chats?ownerEmail=${user?.email}&token=${user?.token}`)
      .then((res) => {
        setChatList(res.data);
        console.log(res.data);
      });
  }, [refetch, user]);

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const handleRenameChat = (chatId) => {
    console.log(chatId);
    alert("rename");
  };

  const handleDeleteChat = (chatId) => {
    console.log(chatId);
    alert("delete chat");
  };

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
          {chatList.map((chat) => {
            return (
              <li
                key={chat.id}
                className="py-2 px-4 bg-[#181a20] hover:bg-[#282c34] rounded-lg cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden relative group"
              >
                {chat.chatName}
                <Dropdown className="bg-[#27272A] text-white hover:text-white">
                  <DropdownTrigger>
                    <div className="hidden rounded-md absolute top-1/2 -translate-y-1/2 right-[10px] h-[20px] w-[30px] bg-gray-700 group-hover:flex justify-center items-center">
                      <SlOptions />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu
                    variant="flat"
                    aria-label="Dropdown menu with description"
                  >
                    <DropdownItem
                      color="primary"
                      key="edit"
                      showDivider
                      description="Allows you to edit the file"
                      startContent={
                        <EditDocumentIcon className={iconClasses} />
                      }
                      onClick={() => handleRenameChat(chat.id)}
                    >
                      Rename
                    </DropdownItem>

                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      description="Permanently delete the file"
                      startContent={
                        <DeleteDocumentIcon
                          className={iconClasses + "text-danger"}
                        />
                      }
                      onClick={() => handleDeleteChat(chat.id)}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
