import { Button, Chip, Spinner } from "@nextui-org/react";
import { timeAgo } from "../../utils/timeAgo";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import AnswerCard from "./AnswerCard";
import AddAnswer from "./AddAnswer";
import { v4 as uuidv4 } from "uuid";
import { Link, useParams } from "react-router-dom";

const SingleQuestion = () => {
  const { id } = useParams();

  const [loadingError, setLoadingError] = useState(false);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/api/qna/questions/${id}`)
      .then((res) => {
        console.log(res.data);
        setQuestion(res.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingError(true);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    axiosInstance
      .get(`/api/qna/answers/${question?.id}`)
      .then((res) => {
        console.log(res.data);
        setAnswers(res.data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setLoadingError(true);
      });
  }, [refetch, question]);

  const reloadAnswers = () => {
    setRefetch(!refetch);
  };

  return (
    <div className="mx-6 mt-2 pt-2 pb-6">
      {loading && (
        <div className="h-[100px] flex justify-center items-end">
          <Spinner color="white" />
        </div>
      )}
      {loadingError && (
        <div className="h-[100px] flex justify-center items-end">
          <h1 className="text-center text-red-500 text-xl">
            Ops! Something went wrong.
          </h1>
        </div>
      )}
      {!loading && !loadingError && (
        <>
          <div className="flex items-center justify-between gap-2 mt-6 pb-4 ">
            <div className="flex flex-col justify-between">
              <h1 className="text-primary text-2xl">{question?.title}</h1>
              <h3 className="text-sm text-slate-400">
                Asked: {timeAgo(question?.createdAt)}
              </h3>
            </div>
            <Link to="/qna/ask">
              <Button size="lg" color="primary">
                Ask Question
              </Button>
            </Link>
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

          <div
            dangerouslySetInnerHTML={{ __html: question?.question }}
            className="border mb-6 p-4 no-tailwindcss bg-white rounded-lg py-4 px-2"
          ></div>

          <div>
            <AddAnswer qid={question?.id} reloadAnswers={reloadAnswers} />
          </div>

          {answers && answers.length != 0 && (
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
        </>
      )}
    </div>
  );
};

export default SingleQuestion;
