import React, { useState } from 'react';
import { FaJava, FaPython, FaJs, FaNodeJs, FaReact, FaCuttlefish } from 'react-icons/fa'; // Import icons from react-icons
import { TbBrandCpp } from "react-icons/tb";
import { BiLogoGoLang } from "react-icons/bi";

const topics = [
  { name: 'C', icon: <FaCuttlefish size={150} className='text-black'/>, url: '/skill-test/C' },
  { name: 'C++', icon: <TbBrandCpp size={150} className='text-blue-800'/>, url: '/skill-test/C++' },
  { name: 'Java', icon: <FaJava size={150} className='text-red-500'/>, url: '/skill-test/Java' },
  { name: 'Python', icon: <FaPython size={150} className='text-blue-800'/>, url: '/skill-test/Python' },
  { name: 'JavaScript', icon: <FaJs size={150} className='text-yellow-500'/>, url: '/skill-test/JavaScript' },
  { name: 'Node.js', icon: <FaNodeJs size={150} className='text-black'/>, url: '/skill-test/Node.js' },
  { name: 'React', icon: <FaReact size={150} className='text-blue-400'/>, url: '/skill-test/React' },
  { name: 'Go', icon: <BiLogoGoLang size={150} className='text-black'/>, url: '/skill-test/Go' },
  // More topics will come later
];

const SkillTest = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter topics based on search term
  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Skill Test</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search a topic..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 mb-8 border border-gray-300 rounded w-full max-w-md"
      />

      {/* Topic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => (
            <a
              href={topic.url}
              key={index}
              className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl hover:bg-blue-100 transition duration-300 transform hover:scale-105"
            >
              <div className="text-blue-500 mb-4">{topic.icon}</div> {/* Big Icon */}
              <h3 className="text-lg font-semibold text-black">{topic.name}</h3> {/* Topic Name */}
            </a>
          ))
        ) : (
          <p className="text-center col-span-full">No topics found. Try another search.</p>
        )}
      </div>

      <p className="mt-6 text-gray-600">More topics will come later!</p>
    </div>
  );
};

export default SkillTest;
