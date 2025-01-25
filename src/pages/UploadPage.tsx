import React, { useState } from "react";
import { uploadModel } from "../utils/api";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadModel(file);
      setStatus("Upload successful!");
    } catch (error) {
      console.error("Error uploading model:", error);
      setStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h1>Upload Model</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default UploadPage;
