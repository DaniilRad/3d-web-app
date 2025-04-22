import { X } from "lucide-react";
import { useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File, author: string) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [author, setAuthor] = useState<string>(""); // Store the author name
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
        !selectedFile.name.endsWith(".gltf") &&
        !selectedFile.name.endsWith(".stl")
      ) {
        setError("❌ Invalid file type! Only .glb/.gltf/.stl allowed.");
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
        onFileSelect(selectedFile, author || "Anonymous"); // Pass author as "Anonymous" if empty
      }
    }
  };

  return (
    <div className="mb-4 flex flex-col items-center space-y-4">
      {file ? (
        <div className="flex w-full items-center justify-between">
          <p className="text-mediumGray text-sm">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
          <button
            onClick={() => {
              setFile(null);
              setError(null);
            }}
            className="flex h-full items-center justify-center"
          >
            <X color="red" size={22} />
          </button>
        </div>
      ) : (
        <p className="text-mediumGray text-sm">
          Select a .glb/.gltf/.stl file (Max 25MB)
        </p>
      )}

      <input
        type="file"
        accept=".glb,.gltf,.stl"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />

      <label
        htmlFor="fileInput"
        className="text-mediumGray w-full cursor-pointer rounded-lg border-[1px] px-3 py-2 text-center text-sm transition"
      >
        Select File
      </label>

      {/* Author Input */}
      <input
        type="text"
        placeholder="Enter Author Name (optional)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="text-mediumGray mt-2 w-full rounded border p-2 text-sm"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
