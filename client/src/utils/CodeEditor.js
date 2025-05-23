import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/snippets/css";


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

export default function CodeEditor(prop) {
  const {
    value,
    language,
    setValue,
    displayName,
    theme,
    fontSize,
    handleBodyChange,
  } = prop;
  const [width, setWidth] = useState(window.innerWidth / 3);

  function handleSizeChange() {
    if (window.innerWidth >= 768) {
      setWidth(window.innerWidth / 3);
    } else {
      setWidth(window.innerWidth);
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleSizeChange);
  }, []);

  return (
    <div className="h-full" style={{ width: width }}>
      <h3 className="w-full text-white text-center">{displayName}</h3>
      <AceEditor
        mode={language}
        theme={theme}
        onChange={handleBodyChange}
        value={value}
        width="auto"
        height="50vh"
        fontSize={fontSize ? (isNaN(+fontSize) ? 12 : +fontSize) : 12}
        name="UNIQUE_ID_OF_DIV"
        showGutter={true}
        setOptions={{
          useWorker: false,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
    </div>
  );
}
