import { useContext, useEffect, useState } from "react";
import { depotTags } from "./depotTags";
import { TiPlus } from "react-icons/ti";
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import { useNavigate } from "react-router-dom";

const NewDepotForm = ({ refetch, setRefetch }) => {
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [depotName, setDepotName] = useState("");
  const [depotDescription, setDepotDescription] = useState("");
  // state for depot tags
  const [values, setValues] = useState(new Set([]));
  //   state for depot visibility
  const [visibility, setVisibility] = useState("");

  const navigate = useNavigate();

  const handleVisibilityChange = (v) => {
    setVisibility(v);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const tags = [...values];

    if (depotName === "") {
      toast.error("Please provide e depot name");
      return;
    } else if (visibility === "") {
      toast.error("Please set the visibility of the depot");
      return;
    }

    // create new depot
    setIsLoading(true);

    const params = new URLSearchParams({
      userId: user?.id,
      token: user?.token,
    });

    console.log(params.toString());

    axiosInstance
      .post(`/api/repos/create?${params.toString()}`, {
        repoName: depotName,
        repoDescription: depotDescription,
        repoTopicTags: tags,
        public: visibility === "public" ? true : false,
        files: [],
      })
      .then((res) => {
        console.log(res.data);
        // CLEAR THE INPUT FIELDS
        setDepotName("");
        setDepotDescription("");
        setValues(new Set([]));
        setVisibility("");
        // REFETCH DEPOTS
        setRefetch(!refetch);
        // STOP LOADING
        setIsLoading(false);
        // REDIRECT TO THE NEW REPO
        navigate(`/depots/${res.data.id}`);
      })
      .catch(() => {
        // CLEAR THE INPUT FIELDS
        setDepotName("");
        setDepotDescription("");
        setValues(new Set([]));
        setVisibility("");
        // REFETCH DEPOTS
        setRefetch(!refetch);
        // STOP LOADING
        setIsLoading(false);
        // ERROR MESSAGE
        toast.error("Sorry! Something went wrong");
      });
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 items-center">
        {/* Depot name */}
        <Input
          value={depotName}
          onChange={(e) => setDepotName(e.target.value)}
          isRequired
          type="text"
          label="Depot Name"
          defaultValue=""
          className=""
        />
        <div className="flex gap-2 items-center">
          {/* Depot tags */}
          <Select
            isRequired
            label="Tags"
            selectionMode="multiple"
            placeholder="Add Tags"
            selectedKeys={values}
            className=""
            onSelectionChange={setValues}
          >
            {depotTags.map((tag) => (
              <SelectItem className="" key={tag.key}>
                {tag.label}
              </SelectItem>
            ))}
          </Select>
          <div className="">
            <Button className="min-h-[55px] flex justify-center items-center text-[18px]">
              <TiPlus />
            </Button>
          </div>
        </div>
      </div>
      {/* Depot description */}
      <div className="w-full">
        <label htmlFor="depot-description" className="block ms-1">
          Depot Description
        </label>
        <Textarea
          value={depotDescription}
          onChange={(e) => setDepotDescription(e.target.value)}
          id="depot-description"
          placeholder="Enter description here"
          className="w-full"
        />
      </div>
      {/* Depot Visibility */}
      <RadioGroup label="Select depot visibility" isRequired>
        <Radio value="public" onChange={() => handleVisibilityChange("public")}>
          Public
        </Radio>
        <Radio
          value="private"
          onChange={() => handleVisibilityChange("private")}
        >
          Private
        </Radio>
      </RadioGroup>
      {/* Create depot button */}
      <div className="max-w-[250px] h-[50px]">
        <Button
          disabled={isLoading}
          type="submit"
          color="secondary"
          className="w-full h-full font-semibold text-white tracking-wide flex items-center gap-3"
        >
          {!isLoading && <RiGitRepositoryCommitsLine className="text-[22px]" />}
          {!isLoading ? <>Create New Depot</> : <Spinner color="white" />}
        </Button>
      </div>
    </form>
  );
};

export default NewDepotForm;
