import { Chip } from "@nextui-org/react";
import { Link } from "react-router-dom";

const CodeDepoCard = ({ depo }) => {
  const { id, repoName, repoDescription, repoTopicTags, userId } = depo;

  return (
    <div className="border-b-1 border-[#30363db3] py-3 flex flex-col gap-3">
      <h1>
        <Link
          to={`/depots/${id}`}
          className="text-primary font-bold text-[18px] hover:underline"
        >
          {repoName}
        </Link>
      </h1>

      <p>{repoDescription}</p>

      <div className="flex gap-2 items-center">
        {repoTopicTags.map((repo) => (
          <Chip
            key={repo}
            size="sm"
            className="bg-[#121D2F] cursor-default hover:bg-blue-600"
          >
            {repo}
          </Chip>
        ))}
      </div>
    </div>
  );
};

export default CodeDepoCard;
