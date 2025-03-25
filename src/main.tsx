import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import ModelPage from "./pages/ModelPage";
import ControllerPage from "./pages/ControllerPage";
import UploadPage from "./pages/UploadPage";

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
