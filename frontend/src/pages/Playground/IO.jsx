import { Textarea } from "@nextui-org/react";

const IO = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      <Textarea
        label="Input"
        placeholder="Enter your input"
        className="w-full"
      />
      <Textarea
        isDisabled
        label="Output"
        placeholder="Please run the code to see output"
        className="w-full"
      />
    </div>
  );
};

export default IO;
