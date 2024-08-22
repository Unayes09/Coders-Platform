import { Button, Spinner } from "@nextui-org/react";
import JoditEditor from "jodit-react";
import { useContext, useRef, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

const AddAnswer = ({ reloadAnswers, qid }) => {
  const editor = useRef(null);

  const [answerPosting, setAnswerPosting] = useState(false);
  const [content, setContent] = useState("");

  const { user } = useContext(UserContext);

  console.log(user);

  const handlePostAnswer = (event) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please login first!");
      return;
    }

    if (!content) {
      toast.error("Please type something first!");
      return;
    }

    setAnswerPosting(true);

    axiosInstance
      .post(`/api/qna/answer?token=${user?.token}`, {
        name: user?.fullName,
        email: user?.email,
        picture: user?.image,
        questionId: qid,
        answer: content,
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Answer posted!");
        setAnswerPosting(false);
        setContent("");
        // refetch
        reloadAnswers();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error! Something went wrong");
        setAnswerPosting(false);
      });
  };

  return (
    <form onSubmit={handlePostAnswer} className="my-10 ">
      <h1 className="mb-4 text-xl">Your Answer</h1>
      <div className="no-tailwindcss">
        <JoditEditor
          // config={config}
          ref={editor}
          value={content}
          tabIndex={1} // tabIndex of textarea
          onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
          onChange={(newContent) => setContent(newContent)}
        />
      </div>
      <Button
        disabled={answerPosting}
        type="submit"
        color="primary"
        className="mt-4"
      >
        {answerPosting ? <Spinner color="white" /> : "Post Your Answer"}
      </Button>
    </form>
  );
};

export default AddAnswer;
