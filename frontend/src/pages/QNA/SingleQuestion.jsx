import { Button, Chip } from "@nextui-org/react";
import { timeAgo } from "../../utils/timeAgo";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import AnswerCard from "./AnswerCard";
import AddAnswer from "./AddAnswer";
import { v4 as uuidv4 } from "uuid";

const SingleQuestion = () => {
  const question = {
    id: "66c63c48d9951709b744bf58",
    name: "Unayes Ahmed Khan",
    email: "unayeskhan.0808@gmail.com",
    picture: "http://example.com/profile.jpg",
    topicTags: ["Java", "Spring Boot", "MongoDB"],
    question: "How can I integrate MongoDB with Spring Boot?",
    createdAt: "2024-08-21T19:12:36.934+00:00",
  };

  const [refetch, setRefetch] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/api/qna/answers/${question.id}`)
      .then((res) => {
        console.log(res.data);
        setAnswers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refetch]);

  const reloadAnswers = () => {
    setRefetch(!refetch);
  };

  return (
    <div className="mx-6 mt-2 pt-2 pb-6">
      <div className="flex items-center justify-between gap-2 mt-6 pb-4 ">
        <div className="flex flex-col justify-between">
          <h1 className="text-primary text-2xl">{question?.name}</h1>
          <h3 className="text-sm text-slate-400">
            Asked: {timeAgo(question?.createdAt)}
          </h3>
        </div>
        <Button size="lg" color="primary">
          Ask Question
        </Button>
      </div>

      <div className="flex gap-2 wrap mb-8">
        {question?.topicTags.map((tag) => {
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

      <div className="border mb-6 border-[#333] rounded-lg p-4">
        {question?.question}
      </div>

      <div>
        <AddAnswer />
      </div>

      {answers && answers.length !== 0 && (
        <div className="my-6 ">
          <p className="text-xl border-b pb-4 border-b-[#333]">
            {answers.length} Answers
          </p>

          {answers.map((ans) => {
            return (
              <div key={ans.id} className="mt-6">
                <AnswerCard answer={ans} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SingleQuestion;
