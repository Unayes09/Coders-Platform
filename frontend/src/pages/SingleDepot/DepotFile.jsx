import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Button } from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import DepotTextEditor from "./DepotTextEditor";

const DepotFile = () => {
  const { depotId, fileId } = useParams();

  const [file, setFile] = useState(undefined);
  const [depot, setDepot] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`http://localhost:8080/api/repos/${depotId}/files`, {
        params: {
          token: JSON.parse(localStorage.getItem("token")),
        },
      })
      .then((res) => {
        const repoFile = res.data.files.find((file) => file.id === fileId);
        setFile(repoFile);
        setDepot(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  useEffect(() => {
    console.log(file);
    console.log(depot);
  }, [file, depot]);

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
            <Button>
              <CiEdit className="text-[22px] font-bold" />
            </Button>
          </div>

          <DepotTextEditor />
        </div>
      )}

      {((!isLoading && file == undefined) || isError) && (
        <h1>File was not found</h1>
      )}
    </div>
  );
};

export default DepotFile;
