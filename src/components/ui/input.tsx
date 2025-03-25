import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface CustomFileInputProps {
  className?: string;
  onFileSelect?: (file: File | null) => void;
}

export function Input({ className, onFileSelect }: CustomFileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileInfo, setFileInfo] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      setFileInfo(`${file.name} (${sizeMB} MB)`);
      onFileSelect?.(file);
    } else {
      setFileInfo(null);
      onFileSelect?.(null);
    }
  };

  const clearFile = () => {
    setFileInfo(null);
    inputRef.current!.value = "";
    onFileSelect?.(null);
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".glb,.gltf,.stl"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Custom trigger button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group bg-lightGray rounded-lg border border-gray-400 px-0 py-0 text-sm font-medium transition"
      >
        {!fileInfo ? (
          <div className="rounded-lg px-4 py-2 hover:bg-gray-400">
            <p className="text-deepBlack truncate text-base">Vybrať súbor</p>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 rounded-lg px-4 py-2 hover:bg-gray-400">
            <span className="text-deepBlack truncate text-base">
              {fileInfo}
            </span>
            <X
              size={22}
              className="pointer-events-auto cursor-pointer text-red-600 hover:text-red-800"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
            />
          </div>
        )}
      </button>
    </div>
  );
}
