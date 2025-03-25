import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import ModelPage from "./pages/ModelPage";
import ControlPage from "./pages/ControlPage";
// import UploadPage from "./pages/UploadPage";
// import ControllerPage from "./pages/ControllerPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModelPage />} />
        <Route path="/control" element={<ControlPage />} />
        {/* <Route path="/control" element={<ControllerPage />} /> */}
        {/* <Route path="/upload" element={<UploadPage />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
