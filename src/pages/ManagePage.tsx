import "../styles/App.css";
import { fetchModels, handleDeleteModel } from "@/utils/api";
import { ThreeDMoveIcon } from "hugeicons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const ManagePage = () => {
  const [models, setModels] = useState<{ name: string; url: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleModelClick = (modelName: string) => {
    setSelectedModel((prevSelected) =>
      prevSelected === modelName ? null : modelName
    );
  };

  const handleDelete = async (file: string) => {
    if (!file) return;
    try {
      const message = await handleDeleteModel(file);
      console.log("Deleted model:", message);
      fetchModelsList();
    } catch (error) {
      console.error("Error deleting files:", error);
      alert("Error deleting files");
    }
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
  }, []);

  return (
    <div className="relative h-screen w-screen flex flex-col">
      <img
        className={"absolute inset-0 w-full h-full"}
        src="/vawe.png"
        alt="vawe"
      />
      {/* NavBar */}
      <div className="relative w-full flex justify-between items-center px-[50px] py-[28px]">
        <button
          onClick={() => navigate("/")}
          className="group flex flex-row gap-[10px] px-[10px] items-center cursor-pointer rounded-lg relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></span>
          <ThreeDMoveIcon
            className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300 "
            size={48}
          />
          <div className="relative z-10 text-2xl font-bold text-mediumGray group-hover:text-deepBlack transition-all duration-300 group-hover:font-semibold">
            3D Web App
          </div>
        </button>

        <div className="flex gap-[20px] px-[10px]">
          <button
            className="p-[10px] relative overflow-hidden rounded-xl bg-transparent text-xl transition-all duration-300 group"
            onClick={() => navigate("/models")}
          >
            <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
              View Models
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </button>
          <button
            className="p-[10px] relative overflow-hidden rounded-xl bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 text-xl transition-all duration-300 group"
            onClick={() => navigate("/manage")}
          >
            <span className="relative z-10 text-deepBlack">Manage Models</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-col w-full flex-grow flex gap-[20px] p-[20px]">
        <span className="flex items-center-center justify-center text-3xl text-mediumGray">
          Models
        </span>
        <div className="relative h-full p-[10px] items-center justify-center text-mediumGray text-lg cursor-pointer transition-all duration-300 overflow-hidden group backdrop-blur-2xl">
          {/* Gradient Dashed Border */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#12C2E9" />
                <stop offset="50%" stopColor="#C471ED" />
                <stop offset="100%" stopColor="#F64F59" />
              </linearGradient>
            </defs>
            <rect
              width="100%"
              height="100%"
              stroke="url(#gradient)"
              strokeWidth="6"
              fill="transparent"
              className="opacity-100 transition-all duration-300"
            />
          </svg>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {models.map((model, index) => (
              <div
                key={index}
                onClick={() => handleModelClick(model.name)}
                className={`flex flex-col items-center gap-2 p-4 backdrop-blur-3xl rounded-xl text-mediumGray text-center shadow-xl transition-all duration-300 cursor-pointer 
      ${
        selectedModel === model.name
          ? "bg-gradient-to-r from-[#12C2E9]/50 via-[#C471ED]/50 to-[#F64F59]/50" // Selected
          : "hover:bg-gradient-to-r hover:from-[#12C2E9]/50 hover:via-[#C471ED]/50 hover:to-[#F64F59]/50" // Hover effect
      }`}
              >
                <span className="font-semibold truncate w-full">
                  {model.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="p-[10px] relative overflow-hidden rounded-xl bg-transparent lg:text-xl sm:text-3xl transition-all duration-300 group"
            onClick={() => selectedModel && handleDelete(selectedModel)}
          >
            <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
              Delete
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9] via-[#C471ED] to-[#F64F59] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePage;
