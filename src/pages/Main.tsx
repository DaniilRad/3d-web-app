import { Route, Routes } from "react-router";
import UploadPage from "./UploadPage";
import ViewerPage from "./ViewerPage";

const Main = () => {
    return (
        <Routes>
          <Route path="/" element={<ViewerPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      );
};


export default Main;
