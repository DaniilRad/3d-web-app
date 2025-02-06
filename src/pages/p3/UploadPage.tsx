import { getPresignedPost, uploadFileToS3 } from "@/utils/api";
import { useState } from "react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log("file: " + event.target.files[0]);
      console.log("file type: " + event.target.files[0].type);
      setFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    let fileType = file.type;

    // 🛠 If fileType is missing (e.g., `.glb` files), create a new file with the correct MIME type
    const updatedFile = (!fileType || file.name.endsWith(".glb"))
      ? new File([file], file.name, { type: "model/gltf-binary" }) // ✅ Create a copy
      : file; // ✅ Use the original file if type is valid
  
    console.log("Uploading file:", updatedFile.name, "Type:", updatedFile.type);

    try {
      setStatus("Requesting pre-signed URL...");
      const presignedPost = await getPresignedPost(updatedFile);

      setStatus("Uploading to S3...");
      const fileUrl = await uploadFileToS3(updatedFile, presignedPost);

      setStatus(`Upload successful! File URL: ${fileUrl}`);

      setFile(null);
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading model:", error);
      setStatus("Upload failed. Please try again.");
    }

    setTimeout(() => {
      setStatus("");
    }, 3000);
  };

  return (
    <div className="relative min-h-screen w-screen flex flex-col">
      <img
        className="absolute inset-0 w-full h-full sm:object-cover mm:object-cover"
        src="/vawe.png"
        alt="vawe"
      />

      {/* 🏠 Navbar */}
      {/* <div className="relative w-full flex items-center justify-between px-[50px] py-[28px] lg:justify-between sm:justify-center mm:justify-center">
       
        <button
          onClick={() => navigate("/")}
          className="group flex flex-row gap-[10px] px-[10px] items-center cursor-pointer rounded-lg relative overflow-hidden sm:pointer-events-none mm:pointer-events-none lg:pointer-events-auto"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></span>
          <ThreeDMoveIcon
            className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300"
            size={48}
          />
          <div className="relative z-10 lg:text-2xl sm:text-6xl mm:text-3xl font-bold text-mediumGray group-hover:text-deepBlack transition-all duration-300 group-hover:font-semibold">
            3D Web App
          </div>
        </button>

        
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
            className="p-[10px] relative overflow-hidden rounded-xl bg-transparent text-xl transition-all duration-300 group"
            onClick={() => navigate("/manage")}
          >
            <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
              Manage Models
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9] via-[#C471ED] to-[#F64F59] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </button>
        </div>
      </div> */}

      {/* 📌 Main Content */}
      <div className="relative flex flex-col mm:gap-6 sm:gap-6 items-center justify-center flex-grow px-4">
        <span className="text-3xl text-mediumGray lg:text-3xl sm:text-5xl sm:text-center mm:text-center">
          Upload Your 3D Model
        </span>

        {/* ✅ Desktop: Show Drag & Drop */}
        <div
          className="relative lg:w-[60vw] lg:h-[30vh] sm:w-[50vh] sm:h-[15vh] mm:w-[60vw] mm:h-[60vw] p-[10px] rounded-lg items-center justify-center text-mediumGray text-lg cursor-pointer transition-all duration-300 overflow-hidden group backdrop-blur-2xl flex"
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

          <p className="relative z-10 text-center mm:hidden lg:inline">
            {file ? (
              <span>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            ) : (
              "Drag & Drop"
            )}
          </p>
          <p className="relative z-10 text-center lg:hidden sm:text-3xl mm:text-lg">
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
          <label className="inline-block px-[10px] py-2 rounded-xl bg-transparent lg:text-xl sm:text-3xl text-mediumGray hover:text-deepBlack cursor-pointer relative overflow-hidden group transition-all duration-300">
            <span className="relative z-10">Choose File</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              id="file-upload"
            />
          </label>
          <button
            className="p-[10px] relative overflow-hidden rounded-xl bg-transparent lg:text-xl sm:text-3xl transition-all duration-300 group"
            onClick={handleUpload}
          >
            <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
              Upload
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9] via-[#C471ED] to-[#F64F59] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </button>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-center">
        <span className="text-center text-3xl">{status}</span>
      </div>
    </div>
  );
};

export default UploadPage;
