import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import DepotCodeEditor from "./DepotCodeEditor";
import { UserContext } from "../../providers/UserProvider";
import { toast } from "react-hot-toast";

const DepotFile = () => {
  const { depotId, fileId } = useParams();

  const { user } = useContext(UserContext);

  const { isOpen, onClose, onOpen } = useDisclosure();

  // if the logged-in user owns the current repository then he/she can edit it
  const [isEditable, setIsEditable] = useState(false);
  const [editModeTurnedOn, setEditModeTurnedOn] = useState(false);
  const [isCodeSaving, setIsCodeSaving] = useState(false);
  const [file, setFile] = useState(undefined);
  const [depot, setDepot] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("");

  const [isFileDeleting, setIsFileDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/api/repos/${depotId}/files`, {
        params: {
          token: JSON.parse(localStorage.getItem("token")) || "",
        },
      })
      .then((res) => {
        console.log(res);
        const repoFile = res.data.files.find((file) => file.id === fileId);
        setFile(repoFile);
        setDepot(res.data);
        setValue(repoFile.fileContent);

        if (!user) {
          setIsLoading(false);
          return;
        }

        axiosInstance
          .get(`/api/repos/${user.id}/repos`, {
            params: {
              token: user?.token || null,
            },
          })
          .then((r) => {
            // console.log(r.data);
            const match = r.data.find((d) => d.id === repoFile?.repoId);

            if (match) {
              // console.log("this is the owner");
              setIsEditable(true);
            } else {
              // console.log("this is not the owner");
              setIsEditable(false);
            }
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [user]);

  useEffect(() => {
    console.log(file);
    console.log(depot);
  }, [file, depot]);

  const handleSaveButton = () => {
    if (!editModeTurnedOn) {
      setEditModeTurnedOn(true);
      return;
    }

    setIsCodeSaving(true);
    setEditModeTurnedOn(false);

    axiosInstance
      .put(`/api/repos/${file.repoId}/files/${file.id}?token=${user?.token}`, {
        fileName: file.fileName,
        fileContent: value,
        // language: file.language || "javascript",
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Saved");
        setIsCodeSaving(false);
      })
      .catch((error) => {
        console.log(error);
        setIsCodeSaving(false);
        setEditModeTurnedOn(true);
        toast.error("Error! Could not save");
      });
  };

  const handleDeleteFile = () => {
    console.log(file);
    setIsFileDeleting(true);

    axiosInstance
      .delete(`/api/repos/files/${file.id}?token=${user?.token || null}`)
      .then((res) => {
        console.log(res);
        setIsFileDeleting(false);
        toast.success("File deleted successfully.");
        // redirect to the repository
        navigate(`/depots/${file.repoId}`);
      })
      .catch((err) => {
        console.log(err);
        toast.error("File was not deleted!");
      });
  };

  return (
    <div className="mx-6 mt-4 pb-20">
      {!((!isLoading && file == undefined) || isError) && (
        <div>
          <h1 className="font-semibold tracking-wide">
            <Link
              className="text-blue-500 hover:underline"
              to={`/depots/${depotId}`}
            >
              {depot?.repository?.repoName}
            </Link>{" "}
            / {file?.fileName}
          </h1>

          <div className="border-1 rounded-md border-[#30363db3] mt-5 p-3 flex items-center justify-between">
            
            {/* if the owner is viewing then show the button */}
            {isEditable && (
              <Button
                color={editModeTurnedOn ? "secondary" : "default"}
                onClick={handleSaveButton}
                disabled={isCodeSaving}
              >
                {!editModeTurnedOn && !isCodeSaving && (
                  <CiEdit className="text-[22px] font-bold" />
                )}
                {editModeTurnedOn && <span>Save</span>}
                {isCodeSaving && <Spinner color="white" />}
              </Button>
            )}
          </div>

          <div className="mt-6">
            <DepotCodeEditor
              editModeTurnedOn={editModeTurnedOn}
              value={value}
              setValue={setValue}
              selectedLanguage={file?.language ? file.language : "javascript"}
            />
          </div>

          <div className="mt-4 flex justify-end">
            {isEditable && (
              <Button
                disabled={isFileDeleting}
                radius="full"
                color="danger"
                variant="shadow"
                onPress={() => {
                  onOpen();
                }}
              >
                {!isFileDeleting && <span>Delete This File</span>}
                {isFileDeleting && <Spinner color="white" />}
              </Button>
            )}

            <Modal
              className="dark text-foreground bg-[#333]"
              backdrop="blur"
              isOpen={isOpen}
              onClose={onClose}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      <span className="text-red-500">Delete this file</span>
                    </ModalHeader>
                    <ModalBody>
                      <p>Are you sure you want to delete this file?</p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="success" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        onClick={handleDeleteFile}
                        disabled={isFileDeleting}
                        color="danger"
                        onPress={onClose}
                      >
                        {!isFileDeleting && <span>Confirm Delete</span>}
                        {isFileDeleting && <Spinner color="white" />}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      )}

      {((!isLoading && file == undefined) || isError) && (
        <h1>File was not found</h1>
      )}
    </div>
  );
};

export default DepotFile;
