import { BrowserRouter, Route, Routes } from "react-router";
import UploadPage from "./UploadPage";
import ViewerPage from "./ViewerPage";

const Main = () => {
  return (
    <BrowserRouter basename="/3d-web-app">
      <Routes>
        <Route path="/" element={<ViewerPage />} />
        <Route path="upload" element={<UploadPage />} /> {/* No leading slash */}
      </Routes>
    </BrowserRouter>
  );
};

export default Main;
