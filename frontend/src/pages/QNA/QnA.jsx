import { Button } from "@nextui-org/react";
import AllQuestions from "./AllQuestions";
import QnaSearch from "./QnaSearch";
import { Link } from "react-router-dom";

const QnA = () => {
  return (
    <div className="mx-6 mt-2 pt-2 pb-6">
      <QnaSearch />
      <div className="flex items-center justify-between my-6 border-b pb-4 border-b-[#333]">
        <h2 className="text-primary text-2xl font-bold">All Questions</h2>
        <Link to="/qna/ask">
          <Button size="lg" color="primary">
            Ask Question
          </Button>
        </Link>
      </div>
      <AllQuestions />
    </div>
  );
};

export default QnA;
