import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./pages/Main";
import { HashRouter } from "react-router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter basename="/3d-web-app/">
      <Main />
    </HashRouter>
  </React.StrictMode>
);
