// import { ThreeDMoveIcon } from "hugeicons-react";
// import { useState } from "react";
// import { useNavigate } from "react-router";

// const UploadPage = () => {
//   const navigate = useNavigate();
//   const [file, setFile] = useState<File | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//       setFile(event.dataTransfer.files[0]);
//     }
//   };

//   return (
//     <div className="relative h-screen w-screen flex flex-col">
//       <img
//         className={"absolute inset-0 w-full h-full"}
//         src="/vawe.png"
//         alt="vawe"
//       />
//       {/* NavBar */}
//       <div className="w-full flex justify-between items-center px-[50px] py-[28px]">
//         <button
//           onClick={() => navigate("/")}
//           className="group flex flex-row gap-[10px] px-[10px] items-center cursor-pointer rounded-lg relative overflow-hidden"
//         >
//           <span className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></span>
//           <ThreeDMoveIcon
//             className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300 "
//             size={48}
//           />
//           <div className="relative z-10 text-2xl font-bold text-mediumGray group-hover:text-deepBlack transition-all duration-300 group-hover:font-semibold">
//             3D Web App
//           </div>
//         </button>

//         <div className="flex gap-[20px] px-[10px]">
//           <button
//             className="p-[10px] relative overflow-hidden rounded-xl bg-transparent text-xl transition-all duration-300 group"
//             onClick={() => navigate("/models")}
//             disabled
//           >
//             <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
//               View Models
//             </span>
//             <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
//           </button>
//           <button
//             className="p-[10px] relative overflow-hidden rounded-xl bg-transparent text-xl transition-all duration-300 group"
//             onClick={() => navigate("/models")}
//             disabled
//           >
//             <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
//               Manage Models
//             </span>
//             <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative flex flex-col items-center justify-center flex-grow px-4">
//         <span className="text-3xl text-mediumGray mb-6">
//           Upload Your 3D Model
//         </span>

//         <div
//           className="relative w-[60vw] h-[30vh] rounded-lg flex items-center justify-center text-mediumGray text-lg cursor-pointer transition-all duration-300 overflow-hidden group backdrop-blur-2xl"
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={handleDrop}
//         >
//           {/* Gradient Dashed Border */}
//           <svg className="absolute inset-0 w-full h-full">
//             <defs>
//               <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" stopColor="#12C2E9" />
//                 <stop offset="50%" stopColor="#C471ED" />
//                 <stop offset="100%" stopColor="#F64F59" />
//               </linearGradient>
//             </defs>
//             <rect
//               width="100%"
//               height="100%"
//               stroke="url(#gradient)"
//               strokeWidth="6"
//               fill="transparent"
//               strokeDasharray="10, 8" // Controls the dashes
//               className="opacity-100 transition-all duration-300"
//             />
//           </svg>

//           {/* Content Inside */}
//           <p className="relative z-10">
//             {file ? (
//               <span>
//                 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//               </span>
//             ) : (
//               "Drag & Drop"
//             )}
//           </p>
//         </div>

//         <div className="w-full flex flex-row justify-center items-center gap-[20px] py-[10px]">
//           <label className="inline-block px-[10px] py-2 rounded-xl bg-transparent text-xl text-mediumGray hover:text-deepBlack cursor-pointer relative overflow-hidden group transition-all duration-300">
//             <span className="relative z-10">Choose File</span>
//             <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
//             <input type="file" className="hidden" onChange={handleFileChange} />
//           </label>
//           <button
//             className="p-[10px] relative overflow-hidden rounded-xl bg-transparent text-xl transition-all duration-300 group"
//             onClick={() => navigate("/models")}
//           >
//             <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
//               Upload{" "}
//             </span>
//             <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
//           </button>
//         </div>
//       </div>

//       {/* Footer */}
//     </div>
//   );
// };

// export default UploadPage;


import { ThreeDMoveIcon } from "hugeicons-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex flex-col">
      <img className="absolute inset-0 w-full h-full sm:object-cover mm:object-cover" src="/vawe.png" alt="vawe" />

      {/* 🏠 Navbar */}
      <div className="relative w-full flex items-center justify-between px-[50px] py-[28px] lg:justify-between sm:justify-center mm:justify-center">
        {/* ✅ Desktop: Clickable Logo, Mobile: Centered Logo */}
        <button
          onClick={() => navigate("/")}
          className="group flex flex-row gap-[10px] px-[10px] items-center cursor-pointer rounded-lg relative overflow-hidden sm:pointer-events-none mm:pointer-events-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></span>
          <ThreeDMoveIcon className="relative z-10 text-mediumGray" size={48} />
          <div className="relative z-10 text-2xl sm:text-6xl mm:text-3xl font-bold text-mediumGray">3D Web App</div>
        </button>

        {/* ✅ Desktop: Show Buttons, Mobile: Hide Buttons */}
        <div className="hidden lg:flex sm:hidden mm:hidden  gap-[20px] px-[10px]  ">
          <button
            className="p-[10px] relative overflow-hidden rounded-xl bg-transparent text-xl transition-all duration-300 group"
            onClick={() => navigate("/models")}
          >
            <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
              View Models
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9] via-[#C471ED] to-[#F64F59] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </button>
          <button
            className="p-[10px] relative overflow-hidden rounded-xl bg-gradient-to-r from-[#12C2E9] via-[#C471ED] to-[#F64F59] text-xl transition-all duration-300 group"
            onClick={() => navigate("/upload")}
          >
            <span className="relative z-10 text-deepBlack">Manage Models</span>
          </button>
        </div>
      </div>

      {/* 📌 Main Content */}
      <div className="relative flex flex-col mm:gap-6 sm:gap-6 items-center justify-center flex-grow px-4">
        <span className="text-3xl text-mediumGray lg:text-3xl sm:text-5xl sm:text-center mm:text-center">
          Upload Your 3D Model
        </span>

        {/* ✅ Desktop: Show Drag & Drop */}
        <div
          className="relative w-[60vw] sm:h-[15vh] h-[30vh] rounded-lg items-center justify-center text-mediumGray text-lg cursor-pointer transition-all duration-300 overflow-hidden group backdrop-blur-2xl flex"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
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
              strokeDasharray="10, 8"
              className="opacity-100 transition-all duration-300"
            />
          </svg>

          <p className="relative z-10 text-center mm:hidden">
            {file ? (
              <span>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            ) : (
              "Drag & Drop"
            )}
          </p>
          <p className="relative z-10 text-center lg:hidden">
            {file ? (
              <span>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            ) : (
              "Empty"
            )}
          </p>
        </div>

        {/* ✅ Mobile: Only Show File Upload & Upload Button */}
        <div className="w-full flex flex-row justify-center items-center gap-[20px] lg:py-[10px]">
          <label className="inline-block px-[10px] py-2 rounded-xl bg-transparent text-xl sm:text-3xl text-mediumGray hover:text-deepBlack cursor-pointer relative overflow-hidden group transition-all duration-300">
            <span className="relative z-10">Choose File</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
          <button
            className="p-[10px] relative overflow-hidden rounded-xl bg-transparent text-xl sm:text-3xl transition-all duration-300 group"
            onClick={() => navigate("/models")}
          >
            <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
              Upload
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9] via-[#C471ED] to-[#F64F59] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
