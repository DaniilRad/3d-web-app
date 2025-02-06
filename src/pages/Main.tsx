import { Route, Routes, HashRouter as Router } from "react-router";
import ModelPage from "./p3/ModelPage";
import UploadPage from "./p3/UploadPage";

const Main = () => {
  return (
    <Router>
      <Routes>
        //* 1. Prototyp 
        {/* <Route path="/" element={<MainPage />} />
        <Route path="/models" element={<ModelPage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/upload" element={<UploadPage />} />  */}

        //* 2. Prototyp
        <Route path="/" element={<ModelPage />} />
        <Route path="/upload" element={<UploadPage />} />
        {/* <Route path="/controller" element={} /> */}
        
      </Routes>
    </Router>
  );
};

export default Main;
