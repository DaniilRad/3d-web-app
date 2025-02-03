import { useNavigate } from "react-router";
import "../styles/App.css";
import { ThreeDMoveIcon } from "hugeicons-react";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <img
        className={"absolute inset-0 w-full h-full"}
        src="/vawe.png"
        alt="vawe"
      />
      {/* NavBar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-[50px] py-[28px] ">
        <button
          onClick={() => navigate("/")}
          className="group flex flex-row gap-[10px] px-[10px] items-center cursor-pointer rounded-xl relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></span>
          <ThreeDMoveIcon
            className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300"
            size={48}
          />
          <div className="relative z-10 text-2xl font-bold text-mediumGray group-hover:text-deepBlack transition-all duration-300 group-hover:font-semibold">
            3D Web App
          </div>
        </button>

        <div className="flex gap-[20px] px-[10px]">
          <button className="p-[10px] relative overflow-hidden rounded-xl bg-transparent text-xl transition-all duration-300 group" onClick={() => navigate("/models")}>
            <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
              View Models
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </button>
          <button className="p-[10px] relative overflow-hidden rounded-xl bg-transparent text-xl transition-all duration-300 group" onClick={() => navigate("/upload")}>
            <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
              Manage Models
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="relative flex flex-col h-full justify-center items-center gap-[10px]">
        <span className="text-5xl">Welcome</span>
        <span className="w-[30vw] text-base text-center">
          An interactive web application for uploading and viewing 3D models.
          Simply upload your model and explore it directly in your browser—no
          extra software needed. Perfect for students, designers, and developers
          to showcase their projects.
        </span>
      </div>
    </div>
  );
};

export default MainPage;
