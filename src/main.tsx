import React from "react";
import ReactDOM from "react-dom/client";
import ModifiedApp from "./ModifiedApp";
import "./main.css";
import HomePage from "./pages/old-HomePage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ModifiedApp />
);

