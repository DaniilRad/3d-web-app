import "../styles/App.css";
import Uploader from "../components/Uploader";
import Viewer from "../components/Viewer";
import { useEffect, useState } from "react";
import { fetchModels } from "../utils/api";
import ModelList from "../components/ModelList";
import { useNavigate } from "react-router";

function ViewerPage() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [models, setModels] = useState<{ name: string; url: string }[]>([]);

  const navigate = useNavigate();

  const handleUploadSuccess = (uploadedUrl: string) => {
    console.log("Uploaded model URL:", uploadedUrl);
    setModelUrl(uploadedUrl);
    fetchModelsList();
  };

  const handleChangeModel = (url: string) => {
    setModelUrl(url);
  };

  const fetchModelsList = async () => {
    try {
      const data = await fetchModels();
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  useEffect(() => {
    fetchModelsList();

    const ws = new WebSocket("wss://web-service-6nps.onrender.com");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "UPLOAD") {
        console.log("New model uploaded:", message.url);
        fetchModelsList();
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <div className="relative h-screen w-full flex flex-row">
        {/* menu sidebar under comment - change */}

        <div className="absolute right-0 flex flex-col h-full z-10 p-4 backdrop-blur-lg bg-slate-500/20 shadow-lg border border-white/20">
          <div className="flex flex-1 flex-col items-center justify-start">
            <h1 className="text-lg font-bold text-center text-primary ">
              3D Model Viewer
            </h1>
            <button onClick={() => navigate('/upload')}>About</button>
            <ModelList
              models={models}
              onModelsListChange={fetchModelsList}
              onModelChange={handleChangeModel}
            />
          </div>
          <Uploader
            onUpload={handleUploadSuccess}
            onModelsChange={fetchModelsList}
          />
        </div>
        {/* <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 z-20 px-3 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          {isSidebarVisible ? "Hide Menu" : "Show Menu"}
        </button> */}
        {/*  */}
        <div className="h-full w-full">
          <Viewer key={modelUrl} modelUrl={modelUrl} />
        </div>
      </div>
    </>
  );
}

export default ViewerPage;