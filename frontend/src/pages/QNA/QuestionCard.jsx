import {
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@nextui-org/react";
import { UserTwitterCard } from "./UserTwitterCard";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { timeAgo } from "../../utils/timeAgo";

const QuestionCard = ({ qData }) => {
  return (
    <div className="flex gap-6 items-start border-b pb-6 border-b-[#333]">
      <Popover showArrow placement="bottom">
        <PopoverTrigger>
          <User
            as="button"
            name="Zoe Lang"
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
      <div>
        <Link className="text-primary text-xl hover:text-blue-400 transition-all duration-20">
          {qData?.name}
        </Link>
        <p className="my-3">
          {qData?.question.substring(0, 100) === qData?.question
            ? qData?.question
            : qData?.question.substring(0, 100) + "..."}
        </p>
        <div>
          <div className="flex gap-2 items-center flex-wrap">
            {qData?.topicTags.map((tag) => {
              return (
                <Chip
                  size="sm"
                  className="bg-[#121D2F] cursor-default hover:bg-blue-600"
                  key={uuidv4()}
                >
                  {tag}
                </Chip>
              );
            })}
          </div>
          <h4 className="text-sm mt-3 text-slate-400">
            {timeAgo(qData?.createdAt)}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
