import { Route, Routes, HashRouter as Router } from "react-router";
import MainPage from "./MainPage";
import ModelPage from "./ModelPage";
import UploadPage from "./UploadPage2";

const Main = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<ViewerPage />} /> */}
        <Route path="/" element={<MainPage />} />
        <Route path="/models" element={<ModelPage />} />
        {/* <Route path="/manage" element={<ManagePage />} /> */}
        <Route path="/upload" element={<UploadPage />} /> 
      </Routes>
    </Router>
  );
};

export default Main;
