import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { Input, Spinner } from "@nextui-org/react";
import axiosInstance from "../../utils/axiosInstance";
import { GoPencil } from "react-icons/go";

const EditResume = () => {
  const { user, isUserLoading } = useContext(UserContext);

  const [personalInfo, setPersonalInfo] = useState(null);
  const [personalEmail, setPersonalEmail] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/api/cv/getByEmail?email=unayeskhan.0808@gmail.com`)
      .then((res) => {
        const personal = res.data[0];
        if (personal) {
          setPersonalInfo(...personal);

          console.log(...personal);
        }
        // setPersonalEmail(res.data[0]["0"]?.email ? res.data[0].email : "");
      });
  }, []);

  if (isUserLoading) {
    return (
      <div className="h-[300px] flex justify-center items-center">
        <Spinner color="white" />
      </div>
    );
  }

  if (!isUserLoading && !user) {
    return (
      <div className="h-[300px] flex justify-center items-start pt-[100px]">
        <h1 className="text-xl text-center text-red-500">Please login first</h1>
      </div>
    );
  }

  return (
    <div className="mx-6 mt-2 pt-2 pb-6">
      <h1 className="bg-[#30363d54] mt-8 text-3xl text-center border border-[#30363db3] rounded-t-lg p-4 text-primary">
        Resume
      </h1>
      <div className="border border-[#30363db3]">
        <h3 className="text-center py-4 text-gray-500">
          This is the resume companies will see when you apply
        </h3>
      </div>
      <div className="border border-[#30363db3] rounded-b-lg px-8 py-8">
        <h1 className="text-2xl font-semibold tracking-wide flex gap-4 items-center">
          <span>{personalInfo.name ? personalInfo.name : "Add Name"}</span>
          <GoPencil className="text-primary font-bold cursor-pointer" />
        </h1>
        <div className="text-gray-400 flex flex-col gap-1 mt-2">
          <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={personalEmail}
              onChange={(e) => setPersonalEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="border-t border-[#30363db3] my-8"></div>
      </div>
    </div>
  );
};

export default EditResume;
