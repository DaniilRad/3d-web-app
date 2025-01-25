import { Route, Routes, HashRouter as Router } from "react-router";
import UploadPage from "./UploadPage";
import ViewerPage from "./ViewerPage";

const Main = () => {
  return (
    <Router basename="/3d-web-app">
      <Routes>
        <Route path="/" element={<ViewerPage />} />
        <Route path="/upload" element={<UploadPage />} /> 
      </Routes>
    </Router>
  );
};

export default Main;
