import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ModelPage from "./pages/ModelPage";
import UploadPage from "./pages/UploadPage";
import { BrowserRouter, Route, Routes } from "react-router";
import ControllerPage from "./pages/ControllerPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModelPage />} />
        <Route path="/control" element={<ControllerPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
