import { Select, SelectItem, Avatar } from "@nextui-org/react";

const UserSelector = ({ users }) => {
  return (
    <Select
      items={users}
      label="Select user to chat"
      placeholder="Select a user"
      labelPlacement="outside"
      className="w-full"
    >
      {(user) => (
        <SelectItem key={user.id} textValue={user.username}>
          <div className="flex gap-2 items-center">
            <Avatar
              alt={user.username}
              className="flex-shrink-0"
              size="sm"
              src={user.image}
            />
            <div className="flex flex-col">
              <span className="text-small">{user.username}</span>
              <span className="text-tiny text-default-400">{user.email}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};

export default UserSelector;
