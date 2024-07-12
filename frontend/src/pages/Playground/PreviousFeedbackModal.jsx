import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import FeedbackContainer from "./FeedbackContainer";

const PreviousFeedbackModal = ({ text }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const size = "5xl";
  const scrollBehavior = "outside";

  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          color="primary"
          variant="ghost"
          isDisabled={text === ""}
          onPress={() => handleOpen()}
          className="w-full"
        >
          Show Previous Feedback
        </Button>
      </div>
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
              <ModalHeader className="flex flex-col gap-1">
                AI Feedback
              </ModalHeader>
              <ModalBody>
                <FeedbackContainer text={text} />
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
    </>
  );
};

export default PreviousFeedbackModal;
