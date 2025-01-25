import { Route, Routes } from "react-router";
import UploadPage from "./UploadPage";
import App from "../App";

const Main = () => {
    return (
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      );
};

export default Main;
