import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../providers/UserProvider";
import {
  FaJava,
  FaPython,
  FaJs,
  FaNodeJs,
  FaReact,
  FaCuttlefish,
} from "react-icons/fa";
import { TbBrandCpp } from "react-icons/tb";
import { BiLogoGoLang } from "react-icons/bi";
import { GiTrophy } from "react-icons/gi"; // Import trophy icon
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon";

const topics = [
  {
    name: "C",
    icon: <FaCuttlefish size={150} className="text-black" />,
    url: "/skill-test/C",
  },
  {
    name: "C++",
    icon: <TbBrandCpp size={150} className="text-blue-800" />,
    url: "/skill-test/Cpp",
  },
  {
    name: "Java",
    icon: <FaJava size={150} className="text-red-500" />,
    url: "/skill-test/Java",
  },
  {
    name: "Python",
    icon: <FaPython size={150} className="text-blue-800" />,
    url: "/skill-test/Python",
  },
  {
    name: "JavaScript",
    icon: <FaJs size={150} className="text-yellow-500" />,
    url: "/skill-test/JavaScript",
  },
  {
    name: "Node.js",
    icon: <FaNodeJs size={150} className="text-black" />,
    url: "/skill-test/Node.js",
  },
  {
    name: "React",
    icon: <FaReact size={150} className="text-blue-400" />,
    url: "/skill-test/React",
  },
  {
    name: "Go",
    icon: <BiLogoGoLang size={150} className="text-black" />,
    url: "/skill-test/Go",
  },
];

const SkillTest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [passedTopics, setPassedTopics] = useState([]);
  const { user } = useContext(UserContext); // Check if user is logged in

  // Fetch the list of topics the user has passed
  useEffect(() => {
    const fetchPassedTopics = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/skill/certificate/${user.email}`
        );
        setPassedTopics(response.data); // Assuming response.data is an array of passed topics
      } catch (error) {
        console.error("Error fetching passed topics:", error);
      }
    };

    fetchPassedTopics();
  }, []);

  // Filter topics based on search term
  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Skill Test</h1>

      {/* Search Bar */}
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        label="Search a topic"
        radius="lg"
        className="max-w-lg mb-8"
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-xl",
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focus=true]:bg-default-200/50",
            "dark:group-data-[focus=true]:bg-default/60",
            "!cursor-text",
          ],
        }}
        placeholder="Type to search..."
        startContent={
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
      />

      {/* Topic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => (
            <Link
              to={topic.url}
              key={index}
              className="relative flex flex-col items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl hover:bg-blue-100 transition duration-300 transform hover:scale-105"
            >
              {passedTopics.includes(topic.name) && (
                <GiTrophy
                  size={30}
                  className="absolute top-2 left-2 text-yellow-500"
                />
              )}
              <div className="text-blue-500 mb-4">{topic.icon}</div>{" "}
              {/* Big Icon */}
              <h3 className="text-lg font-semibold text-black">
                {topic.name}
              </h3>{" "}
              {/* Topic Name */}
            </Link>
          ))
        ) : (
          <p className="text-center col-span-full">
            No topics found. Try another search.
          </p>
        )}
      </div>

      <p className="mt-6 text-gray-600">More topics are coming soon!</p>
    </div>
  );
};

export default SkillTest;
