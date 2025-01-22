import React from "react";
import ReactDOM from "react-dom/client";
import ModifiedApp from "./ModifiedApp";
import * as ort from "onnxruntime-web";
import * as vad from "@ricky0123/vad-web";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ModifiedApp />
  </React.StrictMode>
);

