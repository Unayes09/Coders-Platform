import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  Button,
  Chip,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { IoBookOutline } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { timeAgo } from "../../utils/timeAgo";
import { UserContext } from "../../providers/UserProvider";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";

import {
  LANGUAGE_VERSIONS,
  LANGUAGE_EXTENSIONS,
} from "../Playground/LanguageVersions";

const SingleDepot = () => {
  const [depot, setDepot] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEditModeTurnedOn, setIsEditModeTurnedOn] = useState(false);
  const [isDescriptionSaving, setIsDescriptionSaving] = useState(false);
  const [isAddFileLoading, setIsAddFileLoading] = useState(false);
  const [isUserAllowedToEdit, setIsUserAllowedToEdit] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileExtension, setNewFileExtension] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [isDepotDeleting, setIsDepotDeleting] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const [deletingDepotText, setDeletingDepotText] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { user } = useContext(UserContext);

  const { id } = useParams();

  const inputRef = useRef(null);

  const navigate = useNavigate();

  console.log(depot);
  console.log(user);

  useEffect(() => {
    axiosInstance
      .get(`/api/repos/${id}/files`, {
        params: {
          token: JSON.parse(localStorage.getItem("token")),
        },
      })
      .then((res) => {
        // console.log(res.data);
        setDepot(res.data);
        // console.log(res.data.files);
        setIsLoading(false);
      })
      .catch(() => {
        // console.log(err);
        setDepot([]);
        setIsLoading(false);
        setIsError(true);
      });
  }, [id, refetch]);

  useEffect(() => {
    if (!isError && !isLoading && depot?.repository?.userId === user?.id) {
      setIsUserAllowedToEdit(true);
    } else {
      setIsUserAllowedToEdit(false);
    }
  }, [depot, isError, isLoading, user]);

  const handleDescriptionButton = () => {
    if (!isEditModeTurnedOn) {
      setIsEditModeTurnedOn(true);

      if (inputRef.current) {
        inputRef.current.focus();
      }

      return;
    }

    setIsDescriptionSaving(true);
    setIsEditModeTurnedOn(false);

    // api call to update description and then refetch the data
    axiosInstance
      .put(`/api/repos/${depot?.repository?.id}?token=${user?.token}`, {
        repoName: depot?.repository?.repoName,
        repoDescription: inputRef.current.value,
        repoTopicTags: depot?.repository?.repoTopicTags,
        public: depot?.repository?.public,
      })
      .then((res) => {
        console.log(res);
        setIsDescriptionSaving(false);
        toast.success("Description updated!");
      })
      .catch((err) => {
        console.log(err);

        setIsDescriptionSaving(false);
        setIsEditModeTurnedOn(true);

        toast.error("Description was not updated!");
        inputRef.current.focus();
      });
  };

  const handleCreateNewFile = () => {
    console.log({ newFileName });
    console.log(LANGUAGE_EXTENSIONS[newFileExtension]);
    // return;

    const fileName = newFileName;
    const fileExtension = LANGUAGE_EXTENSIONS[newFileExtension];

    if (!fileName || !fileExtension) {
      toast.error("Please enter valid filename or extension");
      return;
    }

    const data = [
      {
        fileName: `${fileName}.${fileExtension}`,
        fileContent: "",
        language: newFileExtension,
      },
    ];

    setIsAddFileLoading(true);
    axiosInstance
      .post(
        `/api/repos/${depot?.repository?.id}/files?token=${user?.token}`,
        data
      )
      .then((res) => {
        setIsAddFileLoading(false);
        toast.success("File created successfully");
        setRefetch(!refetch);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error! File was not created.");
        setIsAddFileLoading(false);
      });
  };

  const handleDeleteDepot = () => {
    console.log(deletingDepotText);

    if (deletingDepotText !== "I want to delete this depot") {
      toast.error("Please type 'I want to delete this depot'");
      return;
    }

    setIsDepotDeleting(true);
    axiosInstance
      .delete(`/api/repos/${depot.repository.id}?token=${user?.token}`)
      .then((res) => {
        console.log(res);
        setIsDepotDeleting(false);
        toast.success("Depot deleted successfully");
        navigate("/depots");
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        toast.error("Error! Depot was not deleted");
      });
    console.log(depot);
  };

  return (
    <div className="mx-6 mt-4 pb-20">
      {/* Depot name, visibility and Add File button */}
      {!isError && !isLoading && depot?.repository && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-[20px] font-semibold tracking-wide text-blue-500">
                {depot.repository.repoName}
              </h1>
              <Chip color="default" size="sm">
                {depot.repository.public === true ? "Public" : "Private"}
              </Chip>
            </div>
            {isUserAllowedToEdit && (
              <Button
                disabled={isAddFileLoading}
                onPress={onOpen}
                color="success"
              >
                {!isAddFileLoading && <span>Add File</span>}
                {isAddFileLoading && <Spinner color="white" />}
              </Button>
            )}
            {/* New file modal */}
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
                      Add New File
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        autoFocus
                        label="Filename"
                        placeholder="Enter filename"
                        variant="bordered"
                      />
                      <Select
                        label="Select Language"
                        className=""
                        onChange={(e) => setNewFileExtension(e.target.value)}
                      >
                        {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
                          <SelectItem key={lang}>{lang}</SelectItem>
                        ))}
                      </Select>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        onClick={handleCreateNewFile}
                        color="primary"
                        onPress={onClose}
                        disabled={isAddFileLoading}
                      >
                        {!isAddFileLoading && <span>Add File</span>}
                        {isAddFileLoading && <Spinner color="white" />}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
          <div className="flex gap-2 items-center mt-1">
            {depot.repository?.repoTopicTags?.map((tag) => {
              return (
                <Chip
                  key={tag}
                  size="sm"
                  className="bg-[#121D2F] cursor-default hover:bg-blue-600"
                >
                  {tag}
                </Chip>
              );
            })}
          </div>
        </>
      )}

      {/* Files in the depot */}
      {!isError && !isLoading && depot?.files && depot.files.length > 0 && (
        <div className="border-1 rounded-md border-[#30363db3] mt-5 overflow-hidden">
          

          {/* All files */}
          <div className="">
            {depot.files.map((file) => {
              return (
                <div
                  key={file.id}
                  className="hover:bg-[#161B22] flex items-center justify-between text-[#8D96A0] text-[16px] border-t-1 border-[#30363db3] px-3 py-2"
                >
                  <Link
                    className="flex items-center gap-3 "
                    to={`/depots/${file.repoId}/${file.id}`}
                  >
                    <FaFileAlt />
                    <span className="hover:underline">{file.fileName}</span>
                  </Link>
                  <span className="text-[14px]">
                    {file.timestamp ? timeAgo(file.timestamp) : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Description of the depot */}
      {!isError &&
        !isLoading &&
        depot?.repository &&
        depot.repository.repoDescription !== "" && (
          <div className="border-1 rounded-md border-[#30363db3] mt-12 overflow-hidden">
            <div className="flex justify-between p-3 border-b-1 border-[#30363db3]">
              <div className="flex items-center gap-3">
                <IoBookOutline className="text-[#F78166] text-[20px]" />
                <h1>Description</h1>
              </div>
              {isUserAllowedToEdit && (
                <Button
                  disabled={isDescriptionSaving}
                  color={isEditModeTurnedOn ? "secondary" : "default"}
                  onClick={handleDescriptionButton}
                >
                  {!isEditModeTurnedOn && !isDescriptionSaving && (
                    <CiEdit className="text-[22px] font-bold" />
                  )}
                  {isEditModeTurnedOn && <span>Save</span>}
                  {isDescriptionSaving && <Spinner color="white" />}
                </Button>
              )}
            </div>

            <Textarea
              ref={inputRef}
              isReadOnly={!isEditModeTurnedOn}
              radius="none"
              variant={isEditModeTurnedOn ? "faded" : ""}
              defaultValue={depot.repository.repoDescription}
              className=""
            />
          </div>
        )}

      <div className="mt-12 flex flex-col gap-5">
        {isUserAllowedToEdit && (
          <Button
            className="self-start"
            disabled={isDepotDeleting}
            radius="full"
            color="danger"
            variant="bordered"
            onClick={() => {
              setDeletingDepotText("");
              setShowDeleteBtn(true);
            }}
          >
            {!isDepotDeleting && <span>Delete This Depot</span>}
            {isDepotDeleting && <Spinner color="white" />}
          </Button>
        )}
        {isUserAllowedToEdit && showDeleteBtn && (
          <div>
            <Input
              value={deletingDepotText}
              onChange={(e) => setDeletingDepotText(e.target.value)}
              className="max-w-sm"
              variant="bordered"
              color="danger"
              label="Please type: 'I want to delete this depot'"
              placeholder="Are you sure?"
            >
              I am sure
            </Input>
            <Button
              className="self-start mt-4"
              disabled={isDepotDeleting}
              radius="full"
              color="danger"
              variant="shadow"
              onClick={handleDeleteDepot}
            >
              {!isDepotDeleting && <span>Confirm</span>}
              {isDepotDeleting && <Spinner color="white" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleDepot;
