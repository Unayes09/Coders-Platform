import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { rolesData, interestsData, skillsData } from "./constants";

const FinishSignUp = (props) => {
  const {
    role,
    setRole,
    interests,
    setInterests,
    skills,
    setSkills,
    handleRegistration,
    loading,
  } = props;

  const handleSignUp = (event) => {
    event.preventDefault();

    handleRegistration();
  };

  function stringToArray(str) {
    return str.split(",").map((item) => item.trim());
  }

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleInterestsChange = (event) => {
    setInterests(stringToArray(event.target.value));
    console.log(stringToArray(event.target.value));
  };

  const handleSkillsChange = (event) => {
    setSkills(stringToArray(event.target.value));
    console.log(stringToArray(event.target.value));
  };

  return (
    <div className="w-[230px] sm:w-[300px] md:w-[350px] flex flex-col gap-4 min-w-[250px]">
      <form onSubmit={handleSignUp} className="flex flex-col gap-2 mt-4">
        <Select
          isRequired
          label="Join As"
          placeholder=""
          onChange={handleRoleChange}
        >
          {rolesData.map((role) => (
            <SelectItem key={role.key}>{role.label}</SelectItem>
          ))}
        </Select>

        <Select
          isRequired
          label="Interests"
          placeholder=""
          selectionMode="multiple"
          onChange={handleInterestsChange}
        >
          {interestsData.map((interest) => (
            <SelectItem key={interest.key}>{interest.label}</SelectItem>
          ))}
        </Select>

        <Select
          isRequired
          label="Skills"
          placeholder=""
          selectionMode="multiple"
          onChange={handleSkillsChange}
        >
          {skillsData.map((skill) => (
            <SelectItem key={skill.key}>{skill.label}</SelectItem>
          ))}
        </Select>

        <Button
          disabled={loading}
          type="submit"
          radius="full"
          className="mt-4 bg-gradient-to-r from-[#39393F] via-[#47474e] to-[#39393F] text-white shadow-lg"
        >
          {!loading && <span>Sign Up</span>}
          {loading && <Spinner color="white" />}
        </Button>
        <h5 className="text-[13px] text-center mt-4 flex gap-2 justify-center">
          <span>Already have an account?</span>
          <Link
            to="/auth/login"
            className="flex items-center gap-1 text-blue-400"
          >
            Login
          </Link>
        </h5>
      </form>
    </div>
  );
};

export default FinishSignUp;
