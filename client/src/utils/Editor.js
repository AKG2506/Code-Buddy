import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/snippets/rust";
import "ace-builds/src-noconflict/snippets/kotlin";


import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow_night_blue";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-solarized_light";

const Editor = ({
  language,
  theme,
  body,
  height,
  readOnly,
  width,
  fontSize,
  handleBodyChange,
  handleInputChange,
  handleOutputChange,
  type,
}) => {
  return (
    <div>
      <AceEditor
        mode={language}
        theme={theme}
        onChange={
          type === "body"
            ? handleBodyChange
            : type === "input"
            ? handleInputChange
            : handleOutputChange
        }
        value={body}
        width={width ? width : "100%"}
        height={height ? height : "73vh"}
        readOnly={readOnly ? readOnly : false}
        fontSize={fontSize ? (isNaN(+fontSize) ? 12 : +fontSize) : 12}
        name="UNIQUE_ID_OF_DIV"
        showGutter={true}
        editorProps={{ $blockScrolling: true }}
        showPrintMargin={false}
        setOptions={{
          useWorker: false,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
    </div>
  );
};

export default Editor;
