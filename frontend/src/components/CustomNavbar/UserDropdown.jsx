import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";

import userAvatar from "../../assets/images/avatar.png";
import { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import { Link } from "react-router-dom";

const UserDropdown = ({ logoutHandler, refreshUser }) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Dropdown
        placement="bottom-start"
        className="bg-[#27272A] text-white hover:text-white drop-shadow-lg"
      >
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: userAvatar,
            }}
            className="transition-transform"
            name={user?.fullName}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem color="primary" key="profile">
            Profile
          </DropdownItem>
          <DropdownItem color="primary" key="resume">
            <Link to="/edit_resume">
              <div>Edit Resume</div>
            </Link>
          </DropdownItem>
          <DropdownItem color="primary" key="my_settings">
            My Settings
          </DropdownItem>
          <DropdownItem color="primary" key="team_settings">
            Team Settings
          </DropdownItem>
          <DropdownItem color="primary" key="analytics">
            Analytics
          </DropdownItem>
          <DropdownItem color="primary" key="system">
            System
          </DropdownItem>
          <DropdownItem color="primary" key="configurations">
            Configurations
          </DropdownItem>
          <DropdownItem color="primary" key="help_and_feedback">
            Help & Feedback
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              logoutHandler();
              refreshUser();
            }}
            key="logout"
            color="danger"
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;
