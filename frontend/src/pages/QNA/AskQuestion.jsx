import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import JoditEditor from "jodit-react";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { timeAgo } from "../../utils/timeAgo";
import { v4 as uuidv4 } from "uuid";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import { useNavigate } from "react-router-dom";

const AskQuestion = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [postQuestionLoading, setPostQuestionLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = useState("inside");

  const { user } = useContext(UserContext);

  console.log(user);

  const navigate = useNavigate();

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please login first!");
      return;
    }

    setTitle("");
    setTags([]);

    const title = event.target.title.value;
    const tags = event.target.tags.value;

    setTitle(title);
    setTags(tags.split(","));

    if (!title || !tags || !content) {
      toast.error("Please fill-up all the fields!");
    } else {
      onOpen();
    }
  };

  const postQuestion = () => {
    setPostQuestionLoading(true);

    axiosInstance
      .post(`/api/qna/question?token=${user?.token}`, {
        name: user?.name,
        email: user?.email,
        picture: user?.image,
        topicTags: tags,
        title: title,
        question: content,
      })
      .then((res) => {
        console.log(res.data);
        setPostQuestionLoading(false);
        toast.success("Question posted successfully!");
        navigate("/qna");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error! Something went wrong");
      });
  };

  return (
    <div className="mx-6 mt-2 pt-2 pb-6">
      <h1 className="text-xl text-primary my-3 text-center">
        AskQuestion Here
      </h1>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
        <div>
          <Input
            isRequired
            type="text"
            label="Title"
            radius="sm"
            name="title"
          />
        </div>
        <div>
          <Input
            isRequired
            type="text"
            label="Tags"
            placeholder="AI, LLM, Python..."
            radius="sm"
            name="tags"
          />
        </div>
        <div className="no-tailwindcss">
          <JoditEditor
            ref={editor}
            value={content}
            tabIndex={1} // tabIndex of textarea
            onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
            onChange={(newContent) => setContent(newContent)}
          />
        </div>
        <Button
          disabled={postQuestionLoading}
          type="submit"
          color="primary"
          className="self-start"
        >
          {postQuestionLoading ? <Spinner color="white" /> : "Post Question"}
        </Button>
      </form>

      <Modal
        size="full"
        backdrop="opaque"
        className="dark text-foreground bg-background"
        classNames={{
          backdrop:
            "bg-gradient-to-r from-gray-500/10 via-gray-500/40 to-gray-500/10 backdrop-opacity-20",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={scrollBehavior}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Final View
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-between gap-2 pb-4 ">
                  <div className="flex flex-col justify-between">
                    <h1 className="text-primary text-2xl">{title}</h1>
                    <h3 className="text-sm text-slate-400">
                      Asked: {timeAgo(Date.now())}
                    </h3>
                  </div>
                </div>

                <div className="flex gap-2 wrap mb-8">
                  {tags.map((tag) => {
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
                  dangerouslySetInnerHTML={{ __html: content }}
                  className="no-tailwindcss bg-white rounded-lg py-4 px-2"
                ></div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    postQuestion();
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AskQuestion;
