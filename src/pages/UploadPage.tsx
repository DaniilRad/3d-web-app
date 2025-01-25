import React, { useState } from "react";
import { uploadModel } from "../utils/api";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { InputFile } from "@/components/ui/inputfile";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-1/4 max-w-xl flex flex-col items-center">
        <CardHeader>
          <CardTitle>Upload Model</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col w-[90%] gap-4 min-w-fit">
          <InputFile
            type="file"
            onChange={handleFileChange}
            variant={"default"}
            filename={file || undefined}
          />
          <Button onClick={handleUpload} className="w-full">
            Upload
          </Button>
          {status && <p className="text-center">{status}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
