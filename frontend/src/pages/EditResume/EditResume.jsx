import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { Button, Input, Spinner, Textarea } from "@nextui-org/react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const EditResume = () => {
  const { user, isUserLoading } = useContext(UserContext);

  const [refetch, setRefetch] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [projectsInfo, setProjectsInfo] = useState([]);
  const [skillsInfo, setSkillsInfo] = useState([]);

  const [personalInfoLoading, setPersonalInfoLoading] = useState(false);
  const [projectsInfoLoading, setProjectsInfoLoading] = useState(false);
  const [skillsInfoLoading, setSkillsInfoLoading] = useState(false);

  const [newProjectForm, setNewProjectForm] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDetails, setNewProjectDetails] = useState("");
  const [newProjectTechnologies, setNewProjectTechnologies] = useState("");
  const [newProjectDuration, setNewProjectDuration] = useState("");
  const [newProjectLink, setNewProjectLink] = useState("");

  const [newSkillForm, setNewSkillForm] = useState(false);
  const [newTechs, setNewTechs] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("");

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
    });
  }, [user, refetch]);

  useEffect(() => {
    console.log(projectsInfo);
  }, [projectsInfo]);

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

  const handleUpdatePersonalInfo = () => {
    setPersonalInfoLoading(true);
    axiosInstance
      .put(
        `/api/cv/personal?token=${user?.token}&email=${user?.email}`,
        personalInfo
      )
      .then((res) => {
        console.log(res.data);
        setRefetch(!refetch);
        setPersonalInfoLoading(false);
        toast.success("Saved");
      })
      .catch((err) => {
        console.log(err);
        setPersonalInfoLoading(false);
        toast.error("Error! Please try again.");
      });
  };

  const handleUpdateProjectInfo = (id) => {
    setProjectsInfoLoading(true);

    const project = projectsInfo.find((p) => p.id == id);

    axiosInstance
      .put(`/api/cv/project?token=${user?.token}&Id=${id}`, project)
      .then(() => {
        setRefetch(!refetch);
        toast.success("Saved");
        setProjectsInfoLoading(false);
      })
      .catch(() => {
        toast.error("Error! Please try again.");
        setProjectsInfoLoading(false);
      });
  };

  const handleUpdateSkillInfo = (id) => {
    setSkillsInfoLoading(true);

    const skill = skillsInfo.find((s) => s.id == id);

    axiosInstance
      .put(`/api/cv/technology?token=${user?.token}&Id=${id}`, skill)
      .then(() => {
        toast.success("Saved");
        setRefetch(!refetch);
        setSkillsInfoLoading(false);
      })
      .catch(() => {
        toast.error("Error! Please try again.");
        setSkillsInfoLoading(false);
      });
  };

  const handleAddNewSkill = () => {
    setSkillsInfoLoading(true);

    axiosInstance
      .post(`/api/cv/technology?token=${user?.token}`, {
        userEmail: user?.email,
        tech: newTechs,
        skillLevel: newSkillLevel,
      })
      .then(() => {
        toast.success("Skill Added");
        setSkillsInfoLoading(false);
        setNewTechs("");
        setNewSkillLevel("");
        setNewSkillForm(false);
        setRefetch(!refetch);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error! Please try again.");
        setSkillsInfoLoading(false);
      });
  };

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
        <div className="text-gray-400 flex flex-col gap-1 mt-2">
          {/* Personal Info */}
          <h1 className="text-gray-400 text-center text-xl mb-2">
            Personal Info
          </h1>
          <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center">
            <Input
              label="Name"
              placeholder="Enter your name"
              value={personalInfo?.name}
              onChange={(e) => {
                const newName = e.target.value;
                setPersonalInfo({ ...personalInfo, name: newName });
              }}
            />
          </div>
          <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={personalInfo?.email}
              disabled={true}
            />
          </div>
          <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
            <Input
              label="LinkedIn"
              placeholder="Enter your LinkedIn URL"
              value={personalInfo?.linkedin}
              onChange={(e) => {
                const newURL = e.target.value;
                setPersonalInfo({
                  ...personalInfo,
                  linkedin: newURL,
                });
              }}
            />
          </div>
          <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
            <Input
              label="GitHub"
              placeholder="Enter your GitHub URL"
              value={personalInfo?.github}
              onChange={(e) => {
                const newURL = e.target.value;
                setPersonalInfo({
                  ...personalInfo,
                  github: newURL,
                });
              }}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="my-4 flex justify-end">
          <Button
            disabled={personalInfoLoading}
            onClick={handleUpdatePersonalInfo}
            color="secondary"
          >
            {!personalInfoLoading && <span>Save</span>}
            {personalInfoLoading && <Spinner color="white" />}
          </Button>
        </div>

        <div className="border-t border-[#30363db3] my-8"></div>

        {/* Projects Info */}
        <h1 className="text-gray-400 text-center text-xl mb-2">
          Projects Info
        </h1>

        <div className="my-4 flex justify-end">
          <Button
            // disabled={}
            onClick={() => {
              setNewProjectForm(!newProjectForm);
              setNewProjectTitle("");
              setNewProjectDetails("");
              setNewProjectTechnologies("");
              setNewProjectDuration("");
              setNewProjectLink("");
            }}
            color="success"
          >
            {!newProjectForm && <span>Add New Project</span>}
            {newProjectForm && <span>Hide Project Form</span>}
          </Button>
        </div>

        {newProjectForm && (
          <div className="flex flex-col gap-3 border border-[#30363db3] rounded-lg px-3 py-6">
            <h1 className="text-gray-400 text-center my-2">Add Project</h1>
            <div>
              <Input
                label="Title"
                placeholder="Enter project title"
                value={newProjectTitle}
                onChange={(e) => {
                  setNewProjectTitle(e.target.value);
                }}
              />
            </div>
            <div>
              <Textarea
                label="Description"
                placeholder="Enter project description"
                value={newProjectDetails}
                onChange={(e) => {
                  setNewProjectDetails(e.target.value);
                }}
              />
            </div>
            <div>
              <Input
                label="Technologies"
                placeholder="Enter Project Technologies"
                value={newProjectTechnologies}
                onChange={(e) => {
                  setNewProjectTechnologies(e.target.value);
                }}
              />
            </div>
            <div>
              <Input
                label="Duration"
                placeholder="Enter Project Duration"
                value={newProjectDuration}
                onChange={(e) => {
                  setNewProjectDuration(e.target.value);
                }}
              />
            </div>
            <div>
              <Input
                label="Link"
                placeholder="Enter Project Link"
                value={newProjectLink}
                onChange={(e) => {
                  setNewProjectLink(e.target.value);
                }}
              />
            </div>

            <div className="flex justify-end">
              <Button
                disabled={projectsInfoLoading}
                onClick={() => {
                  setProjectsInfoLoading(true);
                  axiosInstance
                    .post(`/api/cv/project?token=${user?.token}`, {
                      userEmail: user?.email,
                      startEndDate: newProjectDuration,
                      title: newProjectTitle,
                      details: newProjectDetails,
                      link: newProjectLink,
                      tech: newProjectTechnologies,
                    })
                    .then(() => {
                      setProjectsInfoLoading(false);
                      toast.success("Project Added");
                      setNewProjectForm(false);
                      setNewProjectTitle("");
                      setNewProjectDetails("");
                      setNewProjectTechnologies("");
                      setNewProjectDuration("");
                      setNewProjectLink("");
                      setRefetch(!refetch);
                    })
                    .catch(() => {
                      setProjectsInfoLoading(false);
                      toast.error("Error! Please try again");
                    });
                }}
                color="success"
              >
                {!skillsInfoLoading && <span>Add</span>}
                {skillsInfoLoading && <Spinner color="white" />}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6"></div>
        {projectsInfo.map((project, idx) => {
          return (
            <div className="flex flex-col gap-1" key={project.id}>
              <h2 className="text-gray-400 ml-1 mt-2">
                {idx + 1 + " - " + project.title}
              </h2>
              <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
                <Input
                  label="Title"
                  placeholder="Enter your Project Title"
                  value={project.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;

                    let oldProject = projectsInfo.find(
                      (p) => p.id == project.id
                    );
                    oldProject.title = newTitle;

                    let unchangedProjects = projectsInfo.filter(
                      (p) => p.id != project.id
                    );

                    setProjectsInfo([oldProject, ...unchangedProjects]);
                  }}
                />
              </div>
              <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
                <Textarea
                  label="Description"
                  placeholder="Enter project description"
                  value={project.details}
                  onChange={(e) => {
                    const details = e.target.value;

                    let oldProject = projectsInfo.find(
                      (p) => p.id == project.id
                    );
                    oldProject.details = details;

                    let unchangedProjects = projectsInfo.filter(
                      (p) => p.id != project.id
                    );

                    setProjectsInfo([oldProject, ...unchangedProjects]);
                  }}
                />
              </div>
              <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
                <Input
                  label="Technologies"
                  placeholder="Enter Project Technologies"
                  value={project.tech}
                  onChange={(e) => {
                    const newTechs = e.target.value;

                    let oldProject = projectsInfo.find(
                      (p) => p.id == project.id
                    );
                    oldProject.tech = newTechs;

                    let unchangedProjects = projectsInfo.filter(
                      (p) => p.id != project.id
                    );

                    setProjectsInfo([oldProject, ...unchangedProjects]);
                  }}
                />
              </div>
              <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
                <Input
                  label="Duration"
                  placeholder="Enter Project Duration"
                  value={project.startEndDate}
                  onChange={(e) => {
                    const newDuration = e.target.value;

                    let oldProject = projectsInfo.find(
                      (p) => p.id == project.id
                    );
                    oldProject.startEndDate = newDuration;

                    let unchangedProjects = projectsInfo.filter(
                      (p) => p.id != project.id
                    );

                    setProjectsInfo([oldProject, ...unchangedProjects]);
                  }}
                />
              </div>
              <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
                <Input
                  label="Link"
                  placeholder="Enter Project Link"
                  value={project.link}
                  onChange={(e) => {
                    const newLink = e.target.value;

                    let oldProject = projectsInfo.find(
                      (p) => p.id == project.id
                    );
                    oldProject.link = newLink;

                    let unchangedProjects = projectsInfo.filter(
                      (p) => p.id != project.id
                    );

                    setProjectsInfo([oldProject, ...unchangedProjects]);
                  }}
                />
              </div>
              {/* Delete & Save Button */}
              <div className="my-4 flex justify-end gap-3">
                <Button
                  disabled={skillsInfoLoading}
                  onClick={() => {
                    setProjectsInfoLoading(true);
                    axiosInstance
                      .delete(
                        `/api/cv/project/${project.id}?token=${user?.token}`
                      )
                      .then(() => {
                        toast.success("Deleted Successfully");
                        setRefetch(!refetch);
                        setProjectsInfoLoading(false);
                      })
                      .catch(() => {
                        toast.error("Error! Please try again");
                        setProjectsInfoLoading(false);
                      });
                  }}
                  color="danger"
                >
                  {!skillsInfoLoading && <span>Delete</span>}
                  {skillsInfoLoading && <Spinner color="white" />}
                </Button>
                <Button
                  disabled={projectsInfoLoading}
                  onClick={() => handleUpdateProjectInfo(project.id)}
                  color="secondary"
                >
                  {!projectsInfoLoading && <span>Save</span>}
                  {projectsInfoLoading && <Spinner color="white" />}
                </Button>
              </div>
            </div>
          );
        })}

        <div className="border-t border-[#30363db3] my-8"></div>

        {/* Projects Info */}
        <h1 className="text-gray-400 text-center text-xl mb-2">Skills Info</h1>
        <div className="my-4 flex justify-end">
          <Button
            onClick={() => {
              setNewSkillForm(!newSkillForm);
              setNewTechs("");
              setNewSkillLevel("");
            }}
            color="success"
          >
            {!newSkillForm && <span>Add New Skills</span>}
            {newSkillForm && <span>Hide Skill Form</span>}
          </Button>
        </div>

        {newSkillForm && (
          <div className="flex flex-col gap-3 border border-[#30363db3] rounded-lg px-3 py-6">
            <h1 className="text-gray-400 text-center my-2">Add Skill</h1>
            <div>
              <Input
                label="Technologies"
                placeholder="Enter technologies"
                value={newTechs}
                onChange={(e) => {
                  setNewTechs(e.target.value);
                }}
              />
            </div>
            <div>
              <Input
                label="Skill Level"
                placeholder="'Beginner' or 'Comfortable' or 'Expert'"
                value={newSkillLevel}
                onChange={(e) => {
                  setNewSkillLevel(e.target.value);
                }}
              />
            </div>

            <div className="flex justify-end">
              <Button
                disabled={skillsInfoLoading}
                onClick={handleAddNewSkill}
                color="success"
              >
                {!skillsInfoLoading && <span>Add</span>}
                {skillsInfoLoading && <Spinner color="white" />}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6"></div>
        {skillsInfo.map((skill, idx) => {
          return (
            <div className="flex flex-col gap-1" key={skill.id}>
              <h2 className="text-gray-400 ml-1 mt-2">Skill No: {idx + 1}</h2>
              <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
                <Input
                  label="Technologies"
                  placeholder="Enter technologies"
                  value={skill.tech}
                  onChange={(e) => {
                    const newTechs = e.target.value;

                    let oldSkill = skillsInfo.find((s) => s.id == skill.id);
                    oldSkill.tech = newTechs;

                    let unchangedSkills = skillsInfo.filter(
                      (s) => s.id != skill.id
                    );

                    setSkillsInfo([oldSkill, ...unchangedSkills]);
                  }}
                />
              </div>
              <div className="text-2xl font-semibold tracking-wide flex gap-4 items-center mt-2">
                <Input
                  label="Skill Level"
                  placeholder="'Beginner' or 'Comfortable' or 'Expert'"
                  value={skill.skillLevel}
                  onChange={(e) => {
                    const newSkillLevel = e.target.value;

                    let oldSkill = skillsInfo.find((s) => s.id == skill.id);
                    oldSkill.skillLevel = newSkillLevel;

                    let unchangedSkills = skillsInfo.filter(
                      (s) => s.id != skill.id
                    );

                    setSkillsInfo([oldSkill, ...unchangedSkills]);
                  }}
                />
              </div>
              <div className="my-4 flex justify-end gap-3">
                <Button
                  disabled={skillsInfoLoading}
                  onClick={() => {
                    setSkillsInfoLoading(true);
                    axiosInstance
                      .delete(
                        `/api/cv/technology/${skill.id}?token=${user?.token}`
                      )
                      .then(() => {
                        toast.success("Deleted Successfully");
                        setRefetch(!refetch);
                        setSkillsInfoLoading(false);
                      })
                      .catch(() => {
                        toast.error("Error! Please try again");
                        setSkillsInfoLoading(false);
                      });
                  }}
                  color="danger"
                >
                  {!skillsInfoLoading && <span>Delete</span>}
                  {skillsInfoLoading && <Spinner color="white" />}
                </Button>
                <Button
                  disabled={skillsInfoLoading}
                  onClick={() => handleUpdateSkillInfo(skill.id)}
                  color="secondary"
                >
                  {!skillsInfoLoading && <span>Save</span>}
                  {skillsInfoLoading && <Spinner color="white" />}
                </Button>
              </div>
            </div>
          );
        })}

        <div className="border-t border-[#30363db3] my-8"></div>
      </div>
    </div>
  );
};

export default EditResume;
