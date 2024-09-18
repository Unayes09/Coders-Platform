import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@nextui-org/react";
import { UserTwitterCard } from "./UserTwitterCard";
import { timeAgo } from "../../utils/timeAgo";

const AnswerCard = ({ answer }) => {
  return (
    <div className="flex flex-col gap-6 items-start sm:grid sm:grid-cols-3 md:grid-cols-4 border-b pb-6 border-b-[#333]">
      <Popover showArrow placement="bottom">
        <PopoverTrigger>
          <User
            as="button"
            name={answer?.name}
            description={answer?.email}
            className="transition-transform"
            avatarProps={{
              src: answer?.picture,
            }}
          />
        </PopoverTrigger>
        <PopoverContent className="p-1">
          <UserTwitterCard />
        </PopoverContent>
      </Popover>
      <div className="sm:col-span-2 md:col-span-3 flex flex-col justify-between">
        <div
          className="no-tailwindcss bg-white rounded-lg py-4 px-2"
          dangerouslySetInnerHTML={{ __html: answer?.answer }}
        ></div>
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
