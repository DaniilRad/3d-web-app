import { Route, Routes } from "react-router";
import ViewerPage from "./Temp2";
import UploadPage from "./Temp1";

const Main = () => {
    return (
        <Routes>
          <Route path="/upload" element={<ViewerPage />} />
          <Route path="/" element={<UploadPage />} />
        </Routes>
      );
};

export default Main;
