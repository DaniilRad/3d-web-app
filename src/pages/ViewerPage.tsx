import "../styles/App.css";
import Uploader from "../components/Uploader";
import Viewer from "../components/Viewer";
import { useEffect, useState } from "react";
import { fetchModels, testCORS } from "../utils/api";
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
    console.log("Changing model to:", url);
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
    testCORS();
    // const ws = new WebSocket("ws://localhost:5000");
  
    // ws.onopen = () => {
    //   console.log("WebSocket connection established");
    // };
  
    // ws.onmessage = (event) => {
    //   try {
    //     const message = JSON.parse(event.data);
    //     if (message.type === "UPLOAD") {
    //       console.log("New model uploaded:", message.url);
    //       fetchModelsList();
    //     }
    //   } catch (error) {
    //     console.error("Error parsing WebSocket message:", error);
    //   }
    // };
  
    // ws.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    // };
  
    // ws.onclose = (event) => {
    //   console.log("WebSocket connection closed:", {
    //     wasClean: event.wasClean,
    //     code: event.code,
    //     reason: event.reason,
    //   });
    // };
  
    // return () => {
    //   console.log("Closing WebSocket connection");
    //   if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
    //     console.log("Closing WebSocket connection");
    //   }
    // };
  }, []);
  

  return (
    <>
      <div className="relative h-screen w-full flex flex-row">
        <div className="absolute right-0 flex flex-col h-full z-10 p-4 backdrop-blur-lg bg-slate-500/20 shadow-lg border border-white/20">
          <div className="flex flex-1 flex-col items-center justify-start">
            <h1 className="text-lg font-bold text-center text-primary ">
              3D Model Viewer
            </h1>
            <ModelList
              models={models}
              onModelsListChange={fetchModelsList}
              onModelChange={handleChangeModel}
            />
          </div>
          <button
            className="text-lg font-bold text-center text-primary"
            onClick={() => navigate("/upload")}
          >
            Link
          </button>
          <Uploader
            onUpload={handleUploadSuccess}
            onModelsChange={fetchModelsList}
          />
        </div>
        <div className="h-full w-full">
          <Viewer key={modelUrl} modelUrl={modelUrl} />
        </div>
      </div>
    </>
  );
}

export default ViewerPage;
