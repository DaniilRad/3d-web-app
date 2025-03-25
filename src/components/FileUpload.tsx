import { useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const MAX_SIZE_MB = 25;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const fileSizeMB = selectedFile.size / 1024 / 1024;

      if (fileSizeMB > MAX_SIZE_MB) {
        setError(`❌ File too large! Max size: ${MAX_SIZE_MB}MB`);
        setFile(null);
      } else if (
        !selectedFile.name.endsWith(".glb") &&
        !selectedFile.name.endsWith(".gltf")
      ) {
        setError("❌ Invalid file type! Only .glb or .gltf allowed.");
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
        onFileSelect(selectedFile); // ✅ Correctly using the function passed as a prop
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {file ? (
        <p className="text-sm text-gray-700">
          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      ) : (
        <p className="text-sm text-gray-500">
          Select a .glb or .gltf file (Max 25MB)
        </p>
      )}

      <input
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />

      <label
        htmlFor="fileInput"
        className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition hover:bg-blue-600"
      >
        Select File
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
