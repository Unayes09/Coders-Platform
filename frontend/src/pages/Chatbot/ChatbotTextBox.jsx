import { Button, Input } from "@nextui-org/react";

const ChatbotTextBox = () => {
  return (
    <div className="flex items-center gap-2">
      {/* TODO: make it textarea instead of textbox */}
      <Input
        radius="md"
        type="text"
        placeholder="Enter your email"
        className="w-full"
      />
      <Button radius="md" color="secondary">
        X
      </Button>
    </div>
  );
};

export default ChatbotTextBox;
