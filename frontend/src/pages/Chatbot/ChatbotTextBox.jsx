import { Button, Spinner, Textarea } from "@nextui-org/react";
import { useContext, useState } from "react";
import { BsSendArrowUp } from "react-icons/bs";
import { getChatbotPrompt } from "../../utils/getAiPrompts";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { UserContext } from "../../providers/UserProvider";

const ChatbotTextBox = ({
  conversation,
  setConversation,
  chatId,
  reloadConversation,
}) => {
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const { user } = useContext(UserContext);

  const handlePromptSubmit = (event) => {
    event.preventDefault();

    if (prompt === "") {
      toast.error("Please type something");
      return;
    }

    const finalPrompt = getChatbotPrompt(prompt, conversation.slice(-2));
    // console.log(finalPrompt);

    setIsChatLoading(true);
    axiosInstance
      .post("/prompt", {
        prompt: finalPrompt,
        geminiKey: import.meta.env.VITE_GEMINI_API_KEY,
      })
      .then((res) => {
        const aiResponse =
          res?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        console.log(aiResponse);

        axiosInstance
          .post(`/api/bot/responses?token=${user?.token}`, {
            chatId: chatId,
            ownerEmail: user?.email,
            from: "user",
            to: "bot",
            message: prompt,
            isPinned: false,
          })
          .then(() => {
            axiosInstance
              .post(`/api/bot/responses?token=${user?.token}`, {
                chatId: chatId,
                ownerEmail: user?.email,
                from: "bot",
                to: "user",
                message: aiResponse,
                isPinned: false,
              })
              .then(() => {
                // insert the responses to the conversation array
                // setConversation([...conversation, prompt, aiResponse]);
                reloadConversation();
                setIsChatLoading(false);
                setPrompt("");
              })
              .catch((err) => {
                console.log(err);
                toast.error("Error! Something went wrong");
              });
          })
          .catch(() => {
            toast.error("Error! Something went wrong");
          });
      })
      .catch(() => {
        toast.error("Error! Something went wrong");
        setIsChatLoading(false);
      });
  };

  return (
    <form onSubmit={handlePromptSubmit} className="flex items-center gap-2">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        minRows={4}
        maxRows={4}
        radius="md"
        placeholder="Enter your description"
        className="w-full"
      />

      <Button
        disabled={isChatLoading}
        type="submit"
        className="h-[50px]"
        radius="md"
        color="secondary"
      >
        {isChatLoading ? (
          <Spinner className="text-2xl" color="white" />
        ) : (
          <BsSendArrowUp className="text-2xl" />
        )}
      </Button>
    </form>
  );
};

export default ChatbotTextBox;
