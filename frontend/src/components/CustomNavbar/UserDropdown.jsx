import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";

const UserDropdown = () => {
  return (
    <div>
      <Dropdown
        placement="bottom-start"
        className="bg-black text-white hover:text-white drop-shadow-lg"
      >
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            }}
            className="transition-transform"
            description="@tonyreichert"
            name="Tony Reichert"
          />
        </DropdownTrigger>
        <DropdownMenu className="" aria-label="User Actions" variant="flat">
          <DropdownItem
            color="primary"
            className="hover:bg-[#27272A] "
            key="settings"
          >
            Profile
          </DropdownItem>
          <DropdownItem
            color="primary"
            className="hover:bg-[#27272A] "
            key="settings"
          >
            My Settings
          </DropdownItem>
          <DropdownItem
            color="primary"
            className="hover:bg-[#27272A] "
            key="team_settings"
          >
            Team Settings
          </DropdownItem>
          <DropdownItem
            color="primary"
            className="hover:bg-[#27272A] "
            key="analytics"
          >
            Analytics
          </DropdownItem>
          <DropdownItem
            color="primary"
            className="hover:bg-[#27272A] "
            key="system"
          >
            System
          </DropdownItem>
          <DropdownItem
            color="primary"
            className="hover:bg-[#27272A] "
            key="configurations"
          >
            Configurations
          </DropdownItem>
          <DropdownItem
            color="primary"
            className="hover:bg-[#27272A] "
            key="help_and_feedback"
          >
            Help & Feedback
          </DropdownItem>
          <DropdownItem
            className="hover:bg-[#27272A]"
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
