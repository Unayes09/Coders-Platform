import toast from "react-hot-toast";
import { Spinner } from "@nextui-org/react";
import { useState } from "react";

const RunButton = (props) => {
  const {
    executeCode,
    sourceCode,
    input,
    setOutput,
    selectedLanguage,
    setIsError,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleRunCode = async () => {
    if (!selectedLanguage) {
      toast.error("Please select a language first");
      return;
    }
    if (!sourceCode) {
      toast.error("Please write some code to run");
      return;
    }

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(
        selectedLanguage,
        sourceCode,
        input
      );

      setOutput(result.output);
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleRunCode}
      className="glow-run-on-hover flex justify-center items-center"
    >
      {isLoading && <Spinner />}
      {!isLoading && <span>Run</span>}
    </button>
  );
};

export default RunButton;
