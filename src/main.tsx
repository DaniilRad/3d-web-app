import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./pages/Main";
import { HashRouter } from "react-router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Main />
    </HashRouter>
  </React.StrictMode>
);
