import { Route, Routes, HashRouter as Router } from "react-router";
import UploadPage from "./UploadPage";
import ViewerPage from "./ViewerPage";
// import ModelManager from "./Test";

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ViewerPage />} />
        <Route path="/upload" element={<UploadPage />} /> 
      </Routes>
    </Router>
  );
};

export default Main;
