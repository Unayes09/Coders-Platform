import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tooltip,
  useDisclosure,
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
import toast from "react-hot-toast";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { FavouriteIcon } from "./FavouriteIcon";
// import { FavouriteIcon } from "./FavouriteIcon";

const ChatSidebar = ({
  isSidebarHidden,
  setIsSidebarHidden,
  selectedChat,
  setSelectedChat,
  setConversation,
  setConversationLoading,
}) => {
  const [chatList, setChatList] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [isNewChatCreating, setIsNewChatCreating] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToBeDeleted, setChatToBeDeleted] = useState("");
  const [isChatDeleting, setIsChatDeleting] = useState(false);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [chatToBeRenamed, setChatToBeRenamed] = useState("");
  const [isChatRenaming, setIsChatRenaming] = useState(false);
  const [newRename, setNewRename] = useState("");

  const { user } = useContext(UserContext);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

    setShowRenameModal(true);
    setChatToBeRenamed(chatId);
  };

  const handleAddToFavoriteChat = (chatId) => {
    console.log(chatId);
    alert(`favorite ${chatId}`);
  };

  const handleDeleteChat = (chatId) => {
    console.log(chatId);
    setShowDeleteModal(true);
    setChatToBeDeleted(chatId);
  };

  const handleCreateNewChat = () => {
    if (!newChatName) {
      toast.error("Please enter a valid name!");
      return;
    }

    setIsNewChatCreating(true);
    axiosInstance
      .post(`/api/bot/chats?token=${user?.token}`, {
        chatName: newChatName,
        ownerEmail: user?.email,
        isFavourite: false,
      })
      .then((res) => {
        console.log(res);
        setIsNewChatCreating(false);
        setRefetch(!refetch);
        toast.success("New chat created successfully");
      })
      .catch((err) => {
        console.log(err);
        setIsNewChatCreating(false);
        toast.error("Error! New chat was not created");
      });
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
        <Button
          disabled={isNewChatCreating}
          onPress={() => {
            if (!user) {
              toast.error("Please login first");
              return;
            }
            if (!isNewChatCreating) {
              setNewChatName("");
              onOpen();
            }
          }}
          className="bg-[#282c34] text-white shadow-lg w-full flex gap-2 items-center justify-between group"
        >
          {!isNewChatCreating && (
            <>
              <div className="flex items-center justify-start gap-2">
                <Logo />
                <span>New Chat</span>
              </div>
              <CiEdit className="hidden group-hover:block font-bold text-[18px]" />
            </>
          )}
          {isNewChatCreating && <Spinner className="mx-auto" color="white" />}
        </Button>

        <Modal
          className="dark text-foreground bg-[#333]"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  New Chat
                </ModalHeader>
                <ModalBody>
                  <Input
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    autoFocus
                    label="Chat Name"
                    variant="bordered"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    onClick={handleCreateNewChat}
                    color="secondary"
                    onPress={onClose}
                  >
                    Create Chat
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      <div className="overflow-y-auto chatbot-sidebar-list-holder">
        <ul className="flex flex-col gap-2">
          {chatList.map((chat) => {
            return (
              <li
                onClick={() => {
                  if (selectedChat !== chat.id) {
                    setConversationLoading(true);
                    setConversation([]);
                    setSelectedChat(chat.id);
                  }
                }}
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
                      description="Rename this chat"
                      startContent={
                        <EditDocumentIcon className={iconClasses} />
                      }
                      onClick={() => handleRenameChat(chat.id)}
                    >
                      Rename
                    </DropdownItem>

                    {/* Add to favourite button */}
                    <DropdownItem
                      key="favourite"
                      color={!chat.favourite ? "primary" : "danger"}
                      description={
                        chat.favourite
                          ? "Remove this chat from favourite"
                          : "Add this chat to favourite"
                      }
                      startContent={
                        <FavouriteIcon
                          className={
                            chat.favourite
                              ? iconClasses + "text-danger"
                              : iconClasses
                          }
                        />
                      }
                      onClick={() => handleAddToFavoriteChat(chat.id)}
                    >
                      {chat.favourite
                        ? "Remove from favorite"
                        : "Add to favorite"}
                    </DropdownItem>

                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      description="Delete this chat"
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

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="absolute top-0 left-0 h-screen w-screen z-50 backdrop-blur-md">
          <div className="p-4  rounded-xl relative top-1/2 left-1/2 max-w-sm bg-[#333] -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-2 font-bold">
                <IoWarningOutline className="text-amber-500 font-bold text-xl" />
                Are you sure?
              </h1>
              <span
                onClick={() => setShowDeleteModal(false)}
                className="hover:bg-[#111] p-1 rounded-full"
              >
                <MdOutlineClose
                  onClick={() => setShowDeleteModal(false)}
                  className="text-xl cursor-pointer"
                />
              </span>
            </div>

            <p className="mt-4">
              Deleting this chat will permanently remove all messages and cannot
              be undone. Please confirm if you wish to proceed.
            </p>

            <div className="flex gap-3 items-center justify-end mt-5">
              <Button
                onClick={() => setShowDeleteModal(false)}
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                disabled={isChatDeleting}
                onClick={() => {
                  setIsChatDeleting(true);

                  if (chatToBeDeleted) {
                    axiosInstance
                      .delete(
                        `/api/bot/chats/${chatToBeDeleted}?token=${user?.token}`
                      )
                      .then(() => {
                        setChatToBeDeleted("");
                        toast.success("Chat deleted!");
                        setSelectedChat(null);
                        setConversation([]);
                        setIsChatDeleting(false);
                        setShowDeleteModal(false);
                        setRefetch(!refetch);
                      })
                      .catch((err) => {
                        toast.error("Error! Something went wrong");
                        console.log(err);
                        setIsChatDeleting(false);
                      });
                  }
                }}
                color="danger"
              >
                {isChatDeleting ? <Spinner color="white" /> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rename modal */}
      {showRenameModal && (
        <div className="absolute top-0 left-0 h-screen w-screen z-50 backdrop-blur-md">
          <div className="p-4  rounded-xl relative top-1/2 left-1/2 max-w-sm bg-[#333] -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-2 font-bold">
                Enter new name
              </h1>
              <span
                onClick={() => setShowRenameModal(false)}
                className="hover:bg-[#111] p-1 rounded-full"
              >
                <MdOutlineClose
                  onClick={() => setShowRenameModal(false)}
                  className="text-xl cursor-pointer"
                />
              </span>
            </div>

            <p className="mt-4">
              <Input
                value={newRename}
                onChange={(e) => setNewRename(e.target.value)}
                type="text"
                label="New Name"
              />
            </p>

            <div className="flex gap-3 items-center justify-end mt-5">
              <Button
                variant="flat"
                onClick={() => setShowRenameModal(false)}
                color="danger"
              >
                Cancel
              </Button>
              <Button
                disabled={isChatRenaming}
                onClick={() => {
                  if (!newRename) {
                    toast.error("Please enter new name");
                    return;
                  }

                  setIsChatRenaming(true);

                  if (chatToBeRenamed) {
                    axiosInstance
                      .put(
                        `/api/bot/chats/${chatToBeRenamed}?token=${user?.token}`,
                        {
                          chatName: newRename,
                          isFavourite: false,
                        }
                      )
                      .then(() => {
                        setChatToBeRenamed("");
                        toast.success("Chat renamed!");
                        setNewRename("");
                        setIsChatRenaming(false);
                        setShowRenameModal(false);
                        setRefetch(!refetch);
                      })
                      .catch((err) => {
                        toast.error("Error! Something went wrong");
                        console.log(err);
                        setIsChatRenaming(false);
                      });
                  }
                }}
                color="secondary"
              >
                {isChatRenaming ? <Spinner color="white" /> : "Rename"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
