import { Editor } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useRef } from "react";

type JsonProp = {
  data: Record<string, unknown>;
};

const JsonEditor = ({ data }: JsonProp) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const onMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    editorInstance.focus();
  };

  return (
    <div
      style={{
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <style>{`
        .scrollbar::-webkit-scrollbar { width: 5px; }
        .scrollbar::-webkit-scrollbar-thumb { background-color: #888; }
      `}</style>
      <Editor
        options={{
          minimap: { enabled: false },
          readOnly: true,
          padding: { top: 10, bottom: 10 },
          scrollbar: { verticalScrollbarSize: 5 },
          wordWrap: "on",
        }}
        height="75vh"
        language="json"
        onMount={onMount}
        value={JSON.stringify(data, null, 2)}
      />
    </div>
  );
};

export default JsonEditor;
