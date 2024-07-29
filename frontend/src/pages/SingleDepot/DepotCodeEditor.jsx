import CodeEditor from "../Playground/CodeEditor";

const DepotCodeEditor = ({ value, setValue, selectedLanguage }) => {
  return (
    <div>
      <CodeEditor
        value={value}
        setValue={setValue}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
};

export default DepotCodeEditor;
