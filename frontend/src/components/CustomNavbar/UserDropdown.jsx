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
            <Link to={`/profile/${user?.id}`}>
              <div>Profile</div>
            </Link>
          </DropdownItem>
          <DropdownItem color="primary" key="resume">
            <Link to="/edit_resume">
              <div>Edit Resume</div>
            </Link>
          </DropdownItem>
          <DropdownItem color="primary" key="subscribe">
            <Link to="/subscribe">
              <div>Subscribe</div>
            </Link>
          </DropdownItem>
          <DropdownItem color="primary" key="news">
            <Link to="/news">
              <div>News</div>
            </Link>
          </DropdownItem>
          <DropdownItem color="primary" key="schedule">
            <Link to="/schedule">
              <div>Personalized Learning Schedule</div>
            </Link>
          </DropdownItem>
          <DropdownItem color="primary" key="event">
            <Link to="/event">
              <div>Events</div>
            </Link>
          </DropdownItem>
          <DropdownItem color="primary" key="story">
            <Link to="/story">
              <div>Social Story</div>
            </Link>
          </DropdownItem>
          <DropdownItem color="primary" key="jobs">
            <Link to="/jobs">
              <div>Jobs and Works</div>
            </Link>
          </DropdownItem>
          <DropdownItem color="primary" key="chat">
            <Link to="/chat">
              <div>Connect with Coders</div>
            </Link>
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
