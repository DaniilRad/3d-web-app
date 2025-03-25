import { io } from "socket.io-client";
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stage } from "@react-three/drei";
import { Menu, X } from "lucide-react";
import FileUpload from "../components/FileUpload";
import { Button } from "@/components/ui/button";

const socket = io("https://websocket-server-ucimr.ondigitalocean.app", {
  autoConnect: true,
  reconnection: true,
});

const Model = () => {
  return (
    <mesh castShadow={false} receiveShadow={true}>
      <sphereGeometry args={[2, 30, 30]} />
      <meshStandardMaterial color="blue" wireframe={false} />
    </mesh>
  );
};

const CameraSync = ({
  cameraRef,
  hasControl,
}: {
  cameraRef: any;
  hasControl: boolean;
}) => {
  useFrame(() => {
    if (hasControl && cameraRef.current) {
      socket.emit("camera_update", {
        position: cameraRef.current.position.toArray(),
        rotation: cameraRef.current.quaternion.toArray(),
      });
    }
  });

  return null;
};

const SidebarAndModal = ({ hasControl }: { hasControl: boolean }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [autoChange, setAutoChange] = useState<boolean>(true);
  const [orbitControls, setOrbitControls] = useState({
    enableZoom: false,
    enablePan: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadStatus("📤 Uploading...");

    socket.emit("request_presigned_url", {
      fileName: selectedFile.name,
      fileType: selectedFile.type,
    });

    socket.once("presigned_url", async ({ uploadUrl, fileName }) => {
      try {
        const response = await fetch(uploadUrl, {
          method: "PUT",
          body: selectedFile,
          headers: { "Content-Type": selectedFile.type },
        });

        if (response.ok) {
          setUploadStatus("✅ Upload successful!");
          socket.emit("upload_complete", { fileName });
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        setUploadStatus("❌ Upload failed!");
      }
    });

    socket.once("presigned_url_error", ({ message }) => {
      setUploadStatus(`❌ Error: ${message}`);
    });
  };

  useEffect(() => {
    console.log("Emiting settings");
    if (hasControl) {
      socket.emit("settings_update", {
        autoChange,
        orbitControls,
      });
    }
  }, [autoChange, orbitControls]);

  return (
    <>
      {/* 🔹 Sidebar (Overlay without affecting Canvas) */}
      <div
        className={`text-lightGray font-tech-mono fixed inset-0 z-50 flex h-full flex-col gap-4 p-6 backdrop-blur-[15px] backdrop-saturate-[100%] transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ✅ Close Sidebar Button */}
        <button className="self-end" onClick={() => setSidebarOpen(false)}>
          <X size={24} />
        </button>

        <h2 className="text-lg font-semibold">Settings</h2>

        {/* ✅ Auto-Rotate Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoChange}
            onChange={() => setAutoChange(!autoChange)}
            className="cursor-pointer"
          />
          Auto-Change
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={orbitControls.enableZoom}
            onChange={() =>
              setOrbitControls((prev) => ({
                ...prev,
                enableZoom: !prev.enableZoom,
              }))
            }
            className="cursor-pointer"
          />
          Enable Zoom
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={orbitControls.enablePan}
            onChange={() =>
              setOrbitControls((prev) => ({
                ...prev,
                enablePan: !prev.enablePan,
              }))
            }
            className="cursor-pointer"
          />
          Enable Pan
        </label>

        {/* ✅ Open Upload Modal Button */}
        <Button
          variant={"outline"}
          size={"lg"}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload Model
        </Button>
      </div>

      {/* 🔹 Sidebar Toggle Button */}
      <button
        className="absolute top-4 left-4 z-40 rounded-md bg-gray-700 p-2 text-white"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[15px] backdrop-saturate-[100%]">
          <div className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">
              Upload Model
            </h2>

            {/* ✅ File Upload Component */}
            <FileUpload onFileSelect={setSelectedFile} />

            {/* ✅ Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`mt-4 w-full rounded-lg px-4 py-2 transition ${
                selectedFile
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "cursor-not-allowed bg-gray-600 text-gray-300"
              }`}
            >
              Upload
            </button>

            {/* ✅ Upload Status */}
            {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}

            {/* ✅ Close Modal Button */}
            <button
              className="mt-4 w-full rounded-lg bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
              onClick={() => setUploadModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default function ControllerPage() {
  const cameraRef = useRef<any>(null);
  const [hasControl, setHasControl] = useState(false);
  const hasRequestedControl = useRef(false);

  useEffect(() => {
    if (!hasRequestedControl.current) {
      socket.emit("request_control");
      hasRequestedControl.current = true;
    }
    socket.on("control_granted", () => setHasControl(true));
    socket.on("control_denied", () => setHasControl(false));

    return () => {
      socket.off("control_granted");
      socket.off("control_denied");
    };
  }, []);

  return (
    <div className="bg-deepBlack relative flex h-screen">
      <SidebarAndModal hasControl={hasControl} />
      {/* ✅ Model Viewer (Canvas Won’t Reset) */}
      <div className="relative z-10 flex-1">
        <Canvas>
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={[15, 15, 0]}
          />
          <OrbitControls
            autoRotate={true}
            enableZoom={false}
            enablePan={false}
            minDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
          <pointLight position={[10, 10, 10]} />
          <Stage intensity={2} environment={"studio"} shadows={false}>
            <Suspense fallback={null}>
              <Model />
            </Suspense>
          </Stage>
          <CameraSync cameraRef={cameraRef} hasControl={hasControl} />
        </Canvas>
      </div>

      {/* ✅ Upload Modal (No Impact on Canvas) */}
    </div>
  );
}
