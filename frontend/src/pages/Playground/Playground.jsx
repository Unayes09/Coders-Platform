import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import LanguageSelector from "./LanguageSelector";
import IO from "./IO";
import "./Playground.css";
import RunButton from "./RunButton";

const Playground = () => {
  const [value, setValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    console.log(selectedLanguage);
    console.log(value);
  }, [selectedLanguage, value]);

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
            <RunButton />
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
            <IO />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
