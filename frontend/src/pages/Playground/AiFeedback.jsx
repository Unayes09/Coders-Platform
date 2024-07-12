import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { getAiFeedbackPrompt } from "../../utils/getAiPrompts";
import axiosInstance from "../../utils/axiosInstance";
import FeedbackContainer from "./FeedbackContainer";

const AiFeedback = (props) => {
  const [aiResponseText, setAiResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const size = "5xl";
  const scrollBehavior = "outside";

  const { language, sourceCode, input, output, isError, setFeedbackText } =
    props;

  const handleAiFeedback = () => {
    setIsLoading(true);

    if (!language) {
      toast.error("Please select a language first");
      setIsLoading(false);
      return;
    }

    const prompt = getAiFeedbackPrompt(
      language,
      sourceCode,
      input,
      output,
      isError
    );

    try {
      axiosInstance
        .get("/prompt", {
          params: {
            prompt: prompt,
            geminiKey: import.meta.env.VITE_GEMINI_API_KEY,
          },
        })
        .then((res) => {
          const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            setFeedbackText(text);
            setAiResponseText(text);
            // show the modal
            onOpen();
            // disable loading
            setIsLoading(false);
          } else {
            toast.error("An error occurred!");
            // disable loading
            setIsLoading(false);
          }
        });
    } catch (error) {
      toast.error("An error occurred!");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <>
        <div className="wrap-warning">
          <div className="flex flex-wrap gap-3">
            <Button
              color="secondary"
              isDisabled={isLoading}
              className="w-full"
              onPress={() => handleAiFeedback()}
            >
              {!isLoading && <span>Show AI Feedback</span>}
              {isLoading && <Spinner color="success" />}
            </Button>
          </div>
        </div>

        {aiResponseText && (
          <Modal
            className="dark text-foreground bg-background"
            scrollBehavior={scrollBehavior}
            size={size}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalContent className="">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-[#9353D3]">
                    AI Feedback
                  </ModalHeader>
                  <ModalBody>
                    <FeedbackContainer text={aiResponseText} />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </>
    </div>
  );
};

export default AiFeedback;
