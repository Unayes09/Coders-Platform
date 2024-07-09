import { Textarea } from "@nextui-org/react";

const IO = ({ input, setInput, output, isError }) => {
  return (
    <div className="h-full flex flex-col gap-6">
      <Textarea
        maxRows={10}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        label="Input"
        placeholder="Enter your input"
        className="w-full"
      />
      <Textarea
        maxRows={15}
        isInvalid={isError}
        value={output}
        isReadOnly
        label="Output"
        placeholder="Please run the code to see output"
        className="w-full"
      />
    </div>
  );
};

export default IO;
