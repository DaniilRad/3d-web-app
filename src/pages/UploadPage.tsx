import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { useState } from "react";

const socket = io("https://websocket-server-ucimr.ondigitalocean.app", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5, // ✅ Retry 5 times before failing
  reconnectionDelay: 3000, // ✅ Wait 3 sec between retries
});

socket.on("connect", () => console.log("✅ WebSocket Connected:", socket.id));
socket.on("disconnect", (reason) =>
  console.warn("⚠ WebSocket Disconnected:", reason),
);

export default function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // 🔹 Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
      setSelectedFile(file);
      setUploadStatus(""); // Reset status on new file selection
    } else {
      setUploadStatus("❌ Invalid file type! Only .glb or .gltf allowed.");
      setSelectedFile(null);
    }
  };

  // 🔹 Handle file upload to the server via WebSocket
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadStatus("📤 Requesting pre-signed URL...");

    // ✅ Step 1: Request Pre-Signed URL
    socket.emit("request_presigned_url", {
      fileName: selectedFile.name,
      fileType: selectedFile.type,
    });

    socket.once("presigned_url", async ({ uploadUrl, fileName }) => {
      console.log("✅ Got pre-signed URL:", uploadUrl);
      setUploadStatus("⏳ Uploading to S3...");

      // ✅ Step 2: Upload File to S3
      try {
        const response = await fetch(uploadUrl, {
          method: "PUT",
          body: selectedFile,
          headers: { "Content-Type": selectedFile.type },
        });

        if (response.ok) {
          setUploadStatus("✅ Upload successful!");

          // ✅ Step 3: Notify server
          socket.emit("upload_complete", { fileName });
        } else {
          throw new Error("Failed to upload");
        }
      } catch (error) {
        console.error("❌ Upload Error:", error);
        setUploadStatus("❌ Upload failed!");
      }
    });

    socket.once("presigned_url_error", ({ message }) => {
      setUploadStatus(`❌ Error: ${message}`);
    });
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-row gap-4 bg-gray-100 p-4">
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
        >
          Model
        </button>

        {/* 🔹 File Upload Input */}
        <input
          type="file"
          accept=".glb,.gltf .stl"
          onChange={handleFileChange}
        />

        {/* 🔹 Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`rounded-lg px-4 py-2 transition ${
            selectedFile
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "cursor-not-allowed bg-gray-300 text-gray-500"
          }`}
        >
          Upload Model
        </button>

        {/* 🔹 Upload Status */}
        {uploadStatus && <span className="text-red-500">{uploadStatus}</span>}
      </div>
    </div>
  );
}
