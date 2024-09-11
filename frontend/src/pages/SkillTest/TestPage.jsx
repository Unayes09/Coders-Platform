import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../providers/UserProvider"; // Assuming you have UserContext for authentication
import {
  FaJava,
  FaPython,
  FaJs,
  FaNodeJs,
  FaReact,
  FaCuttlefish,
} from "react-icons/fa"; // Import icons from react-icons
import { TbBrandCpp } from "react-icons/tb";
import { BiLogoGoLang } from "react-icons/bi";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { Spinner } from "@nextui-org/react";
import { isPremiumUser } from "../../utils/dateCalculation";

// Icons for topics
const topicIcons = {
  C: <FaCuttlefish size={70} className="text-orange-500" />,
  "C++": <TbBrandCpp size={70} className="text-orange-500" />,
  Java: <FaJava size={70} className="text-orange-500" />,
  Python: <FaPython size={70} className="text-orange-500" />,
  JavaScript: <FaJs size={70} className="text-orange-500" />,
  "Node.js": <FaNodeJs size={70} className="text-orange-500" />,
  React: <FaReact size={70} className="text-orange-500" />,
  Go: <BiLogoGoLang size={70} className="text-orange-500" />,
};

const TestPage = () => {
  const { user, isUserLoading } = useContext(UserContext); // Check if user is logged in
  const { topic } = useParams(); // Get topic from URL params

  const [questions, setQuestions] = useState([{}]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes = 1800 seconds
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  let result = null;

  // Fetch questions when the page loads
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch questions based on the selected topic
        axiosInstance.get(`/api/skill/questions/${topic}`).then((res) => {
          setQuestions(res.data.questions);
        });
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (user) fetchQuestions();
    console.log(user);
  }, [topic, user]);

  // Timer countdown
  useEffect(() => {
    if (isTestStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [isTestStarted, timeLeft]);

  // Start the test
  const handleStartTest = () => {
    setIsTestStarted(true);
  };

  // Handle answer change
  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: e.target.value,
    });
  };

  // Submit the test
  const handleSubmit = async () => {
    setLoading(true);
    // Construct a string showing all questions and answers
    result = questions
      .map((question, index) => {
        const answer = answers[index] || "No answer";
        return `Q${index + 1}: ${question.question}\nAnswer: ${answer}\n`;
      })
      .join("\n");
    console.log(result);

    //call api
    result +=
      "Check the answer with the provided questions. If at least 60% is answered correctly then user will Pass ( in response give boolean true), else Fail (in response give boolean false). You just give the response as true or false. Don't add any punctuation, space, blank line or something else, just a word.";

    axiosInstance
      .post("/prompt", {
        prompt: result,
        geminiKey: import.meta.env.VITE_GEMINI_API_KEY,
      })
      .then((res) => {
        //console.log(res.data)
        const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        //const text="Fail"
        console.log(text);
        if (text == "true \n" || text == "true" || text == "true\n") {
          console.log("passed hurray");

          axiosInstance
            .post(
              `/api/skill/certificate?userEmail=${
                user.email
              }&type=${topic}&secretCode=${import.meta.env.VITE_SECRET_CODE}`
            )
            .then((res) => {
              let isPremium = false;

              if (user) {
                isPremium = isPremiumUser(user.premiumPackBuyDate, 30);
              }

              if (isPremium) {
                toast.success(
                  "Congratulations! Please check email to get the certificate"
                );
              } else {
                toast.success(
                  "Congratulations! You have passed. Please upgrade to premium to get certificate!"
                );
              }

              setLoading(false);
            })
            .catch(() => {
              toast.error("Sorry! Something went wrong");
              setLoading(false);
            });
        }
        if (text == "false \n" || text == "false") {
          console.log("failed hurray");
          toast.error("Sorry! You have failed. Please try again.");
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error("Sorry! Something went wrong");
        setLoading(false);
      });
  };

  // Render question and answers
  const renderQuestion = () => {
    if (questions.length === 0) {
      return <p>Loading questions...</p>;
    }

    const question = questions[currentQuestionIndex];

    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold">{question.type}</h2>{" "}
        {/* Question Type */}
        <p className="text-xl mt-4">{question.question}</p>{" "}
        {/* Question Text */}
        <textarea
          className="mt-4 p-2 border border-gray-300 rounded w-full max-w-md"
          rows="5"
          value={answers[currentQuestionIndex] || ""}
          onChange={handleAnswerChange}
          placeholder="Write your answer here..."
        />
        <div className="mt-4">
          {currentQuestionIndex > 0 && (
            <button
              className="px-4 py-2 mr-2 bg-gray-500 text-white rounded"
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Previous
            </button>
          )}
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    );
  };

  // If user is not logged in
  if (!isUserLoading && !user) {
    return (
      <div className="flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold mb-6">
          Please log in to take the test
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex items-center mb-4">
        {topicIcons[topic]}
        <h1 className="text-3xl font-bold ml-4">{topic} Skill Test</h1>
      </div>

      {!isTestStarted ? (
        <>
          <p className="text-lg mb-4">
            Note: You will have 30 minutes to complete this exam.
          </p>
          <button
            onClick={handleStartTest}
            className="px-6 py-3 bg-blue-600 text-white rounded mt-4"
          >
            Start Test
          </button>
        </>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="flex justify-between mb-4">
            <p className="text-lg">
              Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
            </p>
          </div>
          {renderQuestion()}
        </div>
      )}

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#333] p-6 rounded shadow-lg flex gap-2 items-center">
            <span>Generating Results</span>{" "}
            <Spinner className="text-2xl" color="white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
