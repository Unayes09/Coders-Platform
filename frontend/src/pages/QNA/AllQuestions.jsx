import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import axiosInstance from "../../utils/axiosInstance";

const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const reloadQuestions = () => {
    setRefetch(!refetch);
  };

  useEffect(() => {
    axiosInstance
      .get("/api/qna/questions")
      .then((res) => {
        console.log(res.data);
        setQuestions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refetch]);

  return (
    <div className="flex flex-col gap-6">
      {questions.map((q) => (
        <QuestionCard key={q.id} qData={q} />
      ))}
    </div>
  );
};

export default AllQuestions;
