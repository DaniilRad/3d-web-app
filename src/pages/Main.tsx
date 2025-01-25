import { BrowserRouter, Route, Routes } from "react-router";
import UploadPage from "./UploadPage";
import ViewerPage from "./ViewerPage";

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ViewerPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Main;
