import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Button, Spinner } from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import DepotCodeEditor from "./DepotCodeEditor";
import { UserContext } from "../../providers/UserProvider";

const DepotFile = () => {
  const { depotId, fileId } = useParams();

  const { user } = useContext(UserContext);

  // if the logged-in user owns the current repository then he/she can edit it
  const [isEditable, setIsEditable] = useState(false);
  const [editModeTurnedOn, setEditModeTurnedOn] = useState(false);
  const [isCodeSaving, setIsCodeSaving] = useState(false);
  const [file, setFile] = useState(undefined);
  const [depot, setDepot] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/api/repos/${depotId}/files`, {
        params: {
          token: JSON.parse(localStorage.getItem("token")) || "",
        },
      })
      .then((res) => {
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

    // TODO: THIS PART GIVING INTERNAL SERVER ERROR
    axiosInstance
      .put(`/api/repos/${file.repoId}/files/${file.id}?token=${user?.token}`, {
        fileName: file.fileName,
        fileContent: value,
        // language: file.language || "javascript",
      })
      .then((res) => {
        console.log(res.data);
        setIsCodeSaving(false);
      })
      .catch((error) => {
        console.log(error);
        setIsCodeSaving(false);
        setEditModeTurnedOn(true);
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
            <div className="flex items-center gap-3">
              <img
                className="rounded-full h-[40px] w-[40px]"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoMnN60nm51kqp9I8CcoAzxAINFwjZs11ikw&s"
                alt=""
              />
              <h1>Donald Trump</h1>
            </div>
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
              selectedLanguage="javascript"
            />
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
