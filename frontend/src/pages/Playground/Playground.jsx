import { useState } from "react";
import CodeEditor from "./CodeEditor";
import LanguageSelector from "./LanguageSelector";
import IO from "./IO";
import "./Playground.css";
import RunButton from "./RunButton";
import axios from "axios";
import { LANGUAGE_VERSIONS } from "./LanguageVersions";
import AiFeedback from "./AiFeedback";
import FeedbackModal from "./FeedbackContainer";
import PreviousFeedbackModal from "./PreviousFeedbackModal";

const Playground = () => {
  const [value, setValue] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [previousFeedbackText, setPreviousFeedbackText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
  });

  const executeCode = async (lang, code, inp) => {
    const response = await API.post("/execute", {
      language: lang,
      version: LANGUAGE_VERSIONS[lang],
      files: [
        {
          content: code,
        },
      ],
      stdin: inp,
    });

    return response.data;
  };

  return (
    <div className="mx-6 mt-2 pb-4">
      <div className="mt-2">
        <div className="grid grid-cols-2 items-center">
          <LanguageSelector
            className="w-full"
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            setValue={setValue}
          />
          <div className="flex justify-end">
            <RunButton
              executeCode={executeCode}
              sourceCode={value}
              input={input}
              setOutput={setOutput}
              selectedLanguage={selectedLanguage}
              setIsError={setIsError}
            />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-4">
            <CodeEditor
              value={value}
              setValue={setValue}
              selectedLanguage={selectedLanguage}
            />
          </div>
          <div className="col-span-2">
            <div className="flex flex-col gap-4">
              <IO
                input={input}
                setInput={setInput}
                output={output}
                isError={isError}
              />
              <AiFeedback
                language={selectedLanguage}
                sourceCode={value}
                input={input}
                output={output}
                isError={isError}
                setFeedbackText={setFeedbackText}
                setPreviousFeedbackText={setPreviousFeedbackText}
              />
              <PreviousFeedbackModal text={previousFeedbackText} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
