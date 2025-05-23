import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import ModelPage from "./pages/ModelPage";
import ControlPage from "./pages/ControlPage";
import { io } from "socket.io-client";
import AdminPage from "./pages/AdminPage";

// export const socket = io("https://websocket-server-ucimr.ondigitalocean.app", {
export const socket = io("http://localhost:8080", {
  autoConnect: true,
  reconnection: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModelPage />} />
        <Route path="/control" element={<ControlPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
