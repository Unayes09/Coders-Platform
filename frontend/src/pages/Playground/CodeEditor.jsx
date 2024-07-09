import Editor from "@monaco-editor/react";
import { useRef } from "react";

const CodeEditor = ({ value, setValue, selectedLanguage }) => {
  const editorRef = useRef();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <Editor
        height="110vh"
        language={selectedLanguage}
        theme="vs-dark"
        defaultValue="// write code here"
        value={value}
        onChange={(value) => setValue(value)}
        onMount={onMount}
      />
    </div>
  );
};

export default CodeEditor;
