import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { Button, Input, Spinner, Textarea } from "@nextui-org/react";
import { PiCertificateDuotone } from "react-icons/pi";
import { Link, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Resume = () => {
  const [searchParams] = useSearchParams();

  const paramValue = searchParams.get('email');

  console.log(paramValue)
    
  const { user, isUserLoading } = useContext(UserContext);

  const [refetch, setRefetch] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [projectsInfo, setProjectsInfo] = useState([]);
  const [skillsInfo, setSkillsInfo] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [experience, setExperience] = useState([]);

  

  useEffect(() => {
    axiosInstance.get(`/api/cv/getByEmail?email=${user?.email}`).then((res) => {
      console.log(res.data);

      const personal = res.data[0];
      if (personal) {
        setPersonalInfo(...personal);
      }

      const projects = res.data[1];
      if (projects) {
        setProjectsInfo(projects);
      }

      const skills = res.data[2];
      if (skills) {
        setSkillsInfo(skills);
      }

      const certificates = res.data[3];
      if (certificates) {
        setCertificates(certificates);
      }

      const experience = res.data[4];
      if (experience) {
        setExperience(experience);
      }
    });
  }, [user, refetch]);

  useEffect(() => {
    console.log(experience);
  }, [experience]);

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
      
      <div className="border border-[#30363db3] rounded-b-lg px-8 py-8">
        <div className="text-gray-400 flex flex-col gap-1 mt-2">
          {/* Personal Info */}
          <h1 className="text-gray-400 text-center text-xl mb-2">
            Personal Info
          </h1>
          <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center text-white">
            <h1>
              {personalInfo?.name}
              
            </h1>
          </div>
          <div className="text-md tracking-wide flex gap-4 items-center mt-2">
            <h1>{personalInfo?.email}</h1>
          </div>
          <div className="text-lg tracking-wide flex gap-4 items-center mt-2 text-green-500">
            <a
              href={personalInfo?.linkedin}
              target="_blank"
            >LinkedIn</a>
          </div>
          <div className="text-lg tracking-wide flex gap-4 items-center mt-2 text-green-500">
            <a 
              href={personalInfo?.github}
              target="_blank"
            >GitHub</a>
          </div>
          
        </div>

        
        <div className="border-t border-[#30363db3] my-8"></div>

        {/* Projects Info */}
        <h1 className="text-gray-400 text-center text-xl mb-2">
          Projects Info
        </h1>

        <div className="mt-6 grid grid-cols-2">
        {projectsInfo.map((project, idx) => {
          return (
            <div className="flex flex-col gap-1" key={project.id}>
              <h2 className="text-gray-400 ml-1 mt-2">
                {idx + 1 + " - " + project.title}
              </h2>
              <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2 text-white">
                <h1>{project.title}</h1>
              </div>
              <div className="text-xl tracking-wide flex gap-4 items-center mt-2">
                <p>{project.details}</p>
                  
              </div>
              <div className="text-md tracking-wide flex gap-4 items-center mt-2 text-green-300">
                <h1>
                <span className="text-white">Technologies used: </span>
                 {project.tech}
                </h1>  
                
              </div>
              <div className="text-md tracking-wide flex gap-4 items-center mt-2 text-green-300">
                <span className="text-white">Start End Date: </span>
                <h1>{project.startEndDate}</h1>
              </div>
              <div className="text-xl tracking-wide flex gap-4 items-center mt-2 text-yellow-100">
                <a
                  
                  src={project.link}
                  
                >Project Link</a>
              </div>
              
            </div>
          );
        })}
        </div>

        <div className="border-t border-[#30363db3] my-8"></div>

        {/* Projects Info */}
        <h1 className="text-gray-400 text-center text-xl mb-2">Skills Info</h1>
        
        </div>

        

        <div className="mt-6"></div>
        {skillsInfo.map((skill, idx) => {
          return (
            <div className="flex flex-col gap-1" key={skill.id}>
              <h2 className="text-gray-400 ml-1 mt-2">Skill No: {idx + 1}</h2>
              <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
                <h1>
                {skill.skillLevel} at {skill.tech}
                  
                </h1>
              </div>
              
              
            </div>
          );
        })}

        <div className="border-t border-[#30363db3] my-8"></div>

        {/* Certification */}
        <h1 className="text-gray-400 text-center text-xl mb-2">
          Certifications
        </h1>
        
        {certificates.map((c) => {
          return (
            <div className="flex items-center justify-between gap-3" key={c.id}>
              <div className="flex items-center gap-3">
                <PiCertificateDuotone className="text-amber-500 text-2xl" />
                <Link to={c.credential}>
                  <h3 className="cursor-pointer text-2xl">
                    <span>{c.title}</span> By {c.org}
                  </h3>
                </Link>
              </div>
              
            </div>
          );
        })}

        <div className="border-t border-[#30363db3] my-8 mt-16"></div>

        {/* Experience */}
        <h1 className="text-gray-400 text-center text-xl mb-2">Experiences</h1>
        

        {experience.map((c, idx) => {
          return (
            <div className="flex items-center justify-between gap-6" key={c.id}>
              <div>
                <h3 className="cursor-pointer text-2xl">
                  <span>
                    {idx + 1}. {c.title}
                  </span>{" "}
                  at {c.org}
                </h3>
                <h4 className="text-gray-500 ms-4">{c.startEndDate}</h4>
              </div>
              
            </div>
          );
        })}

        <div className="my-8"></div>
      </div>
    
  );
};

export default Resume;
