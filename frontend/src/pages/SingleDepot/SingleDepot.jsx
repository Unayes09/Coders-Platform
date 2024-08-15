import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Button, Chip, Spinner, Textarea } from "@nextui-org/react";
import { IoBookOutline } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { timeAgo } from "../../utils/timeAgo";
import { UserContext } from "../../providers/UserProvider";
import { CiEdit } from "react-icons/ci";

const SingleDepot = () => {
  const [depot, setDepot] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEditModeTurnedOn, setIsEditModeTurnedOn] = useState(false);
  const [isDescriptionSaving, setIsDescriptionSaving] = useState(false);
  const [isUserAllowedToEdit, setIsUserAllowedToEdit] = useState(false);

  const { user } = useContext(UserContext);

  const { id } = useParams();

  const inputRef = useRef(null);

  console.log(depot);
  console.log(user);

  useEffect(() => {
    axiosInstance
      .get(`http://localhost:8080/api/repos/${id}/files`, {
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
      .catch((err) => {
        // console.log(err);
        setDepot([]);
        setIsLoading(false);
        setIsError(true);
      });
  }, [id]);

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
    // axiosInstance
    //   .put(`/api/repos/${depot?.repository?.id}?token=${user?.token}`, {
    //     repoName: depot?.repository?.repoName,
    //     repoDescription: "new description",
    //     repoTopicTags: depot?.repository?.repoTopicTags,
    //     public: depot?.repository?.public,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
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
            {isUserAllowedToEdit && <Button color="success">Add File</Button>}
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
          <div className="flex items-center gap-3 p-3 bg-[#161B22]">
            <img
              className="rounded-full h-[40px] w-[40px]"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoMnN60nm51kqp9I8CcoAzxAINFwjZs11ikw&s"
              alt=""
            />
            <h1>Donald Trump</h1>
          </div>

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
    </div>
  );
};

export default SingleDepot;
