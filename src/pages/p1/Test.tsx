import "../styles/App.css";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// const API_BASE = "https://backend-3d-web-app.vercel.app/api"; // Replace with your actual backend URL
const API_BASE = "http://localhost:5000/api"; // Replace with your actual backend URL

interface Model {
  name: string;
  url: string;
}

export default function ModelManager() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const testCORS = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const data = await response.json();
      console.log("Test response:", data);
    } catch (error) {
      console.error("CORS test failed:", error);
    }
  };

  // Fetch the list of models
  const fetchModels = async () => {
    try {
      const response = await fetch(`${API_BASE}/load`);
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  // Load a model when clicked
  const loadModel = async (filename: string) => {
    const response = await fetch(`${API_BASE}/uploads/${filename}`);
    const data = await response.json();

    if (!data.url) throw new Error("Invalid model URL received");

    setSelectedModel(data.url);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!uploadFile) return alert("No file selected");

    setUploading(true);
    const formData = new FormData();
    formData.append("model", uploadFile);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");

      alert("Upload successful!");
      setUploadFile(null);
      fetchModels(); // Refresh list
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // Handle model deletion
  const deleteModel = async (filename: string) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
      const response = await fetch(`${API_BASE}/uploads/${filename}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete model");

      alert("Model deleted successfully!");
      fetchModels(); // Refresh list
    } catch (error) {
      console.error("Error deleting model:", error);
      alert("Delete failed!");
    }
  };

  useEffect(() => {
    fetchModels();
    testCORS();
  }, []);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold">3D Model Manager</h1>

        {/* Model List */}
        <div className="flex flex-row justify-around items-center gap-2 mt-4 w-full">
          <h2 className="text-lg font-semibold">Models:</h2>
          <ul className="border rounded p-2">
            {models.length === 0 && <p>No models available.</p>}
            {models.map((model) => (
              <li
                key={model.name}
                className="flex justify-between items-center p-2 gap-2 border-b"
              >
                <button
                  className="text-blue-500 underline"
                  onClick={() => loadModel(model.name)}
                >
                  {model.name}
                </button>
                <button
                  className="text-red-500"
                  onClick={() => deleteModel(model.name)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
          {/* Upload Section */}
          <div className="flex flex-col mt-4 w-full max-w-md justify-center items-center">
            <h2 className="text-lg font-semibold">Upload Model:</h2>
            <input
              type="file"
              accept=".glb"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />
            <button
              className={`mt-2 px-4 py-2 bg-green-500 text-white rounded ${
                uploading ? "opacity-50" : ""
              }`}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {/* Model Viewer */}
        <div className="mt-6 w-full h-[400px] border rounded">
          {selectedModel ? (
            <Canvas
              className="w-full h-full rounded-sm border-2"
              camera={{ position: [3, 3, 3] }}
            >
              <OrbitControls />
              <ambientLight intensity={0.5} />
              <ModelViewer url={selectedModel} />
            </Canvas>
          ) : (
            <p className="text-center p-4">Click a model to view it here.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Model Viewer Component
const ModelViewer = ({ url }: { url: string }) => {
  if (!url) return null; // Avoid errors

  const { scene } = useGLTF(url); // Load from blob URL

  return <primitive object={scene} />;
};
