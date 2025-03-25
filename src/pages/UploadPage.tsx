import { io } from "socket.io-client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // 🔹 Handle file selection
  const handleFileChange = (file: File | null) => {
    if (!file) {
      // User cleared the file – don't show error
      setSelectedFile(null);
      setUploadStatus("");
      return;
    }

    const isValid =
      file.name.endsWith(".glb") ||
      file.name.endsWith(".gltf") ||
      file.name.endsWith(".stl");

    if (isValid) {
      setSelectedFile(file);
      setUploadStatus("");
    } else {
      setUploadStatus(
        "❌ Invalid file type! Only .glb or .gltf or .stl allowed.",
      );
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
    <div className="font-tech-mono bg-deepBlack text-lightGray flex h-screen flex-col items-center justify-center">
      <div className="m-10 flex w-[50%] flex-col gap-4">
        {/* 🔹 File Upload Input */}
        <Input onFileSelect={handleFileChange} />

        {/* 🔹 Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`rounded-lg px-4 py-2 transition ${
            selectedFile
              ? "rounded-lg border border-gray-400 px-4 py-2 text-white transition hover:border-gray-700"
              : "cursor-not-allowed rounded-lg border border-gray-800 px-4 py-2 text-gray-800 transition"
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
