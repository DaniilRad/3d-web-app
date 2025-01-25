import React, { useEffect, useState } from "react";
import { uploadModel } from "../utils/api";
import { Button } from "./ui/button";
import { InputFile } from "./ui/inputfile";
import { Upload05Icon } from "hugeicons-react";
import QRCode from "react-qr-code";

const Uploader = ({
  onUpload,
  onModelsChange,
}: {
  onUpload: (url: string) => void;
  onModelsChange: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string>("");

  useEffect(() => {
    setUploadUrl("https://daniilrad.github.io/3d-web-app/upload");
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const uploadedUrl = await uploadModel(file);
        console.log("Uploaded model URL:", uploadedUrl);
        onUpload(uploadedUrl);
        setFile(null);
        onModelsChange();
      } catch (error) {
        console.error("Error uploading model:", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <QRCode value={uploadUrl} />
      </div>
      <InputFile
        onChange={handleFileChange}
        variant={"default"}
        filename={file || undefined}
      />
      <Button variant={"default"} onClick={handleUpload}>
        <span>Upload</span>
        <Upload05Icon />
      </Button>
    </div>
  );
};

export default Uploader;
