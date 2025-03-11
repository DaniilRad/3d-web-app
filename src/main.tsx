import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ModelPage2 from "./pages/ModelPage2";
import ControllerPage from "./pages/ControllerPage";
import { BrowserRouter, Route, Routes } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModelPage2 />} />
        <Route path="/control" element={<ControllerPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
