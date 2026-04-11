import { Editor } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useRef } from "react";

type JsonProp = {
  data: Record<string, unknown>;
};

const EditorRaw = ({ data }: JsonProp) => {
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
      <Editor
        options={{
          minimap: { enabled: false },
          lineNumbers: "off",
          readOnly: true,
          padding: { top: 10, bottom: 10 },
          scrollbar: { verticalScrollbarSize: 5 },
          wordWrap: "on",
        }}
        height="75vh"
        language="plaintext"
        onMount={onMount}
        value={JSON.stringify(data)}
      />
    </div>
  );
};

export default EditorRaw;
