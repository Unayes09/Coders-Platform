import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@nextui-org/react";
import { UserTwitterCard } from "./UserTwitterCard";
import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";

const AnswerCard = ({ answer }) => {
  return (
    <div className="flex gap-6 items-start border-b pb-6 border-b-[#333]">
      <Popover showArrow placement="bottom">
        <PopoverTrigger>
          <User
            as="button"
            name={answer?.name}
            description="Product Designer"
            className="transition-transform"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            }}
          />
        </PopoverTrigger>
        <PopoverContent className="p-1">
          <UserTwitterCard />
        </PopoverContent>
      </Popover>
      <div className="flex flex-col justify-between">
        <p className="">{answer?.answer}</p>
        <div>
          <h4 className="text-sm mt-3 text-slate-400">
            {timeAgo(answer?.createdAt)}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
