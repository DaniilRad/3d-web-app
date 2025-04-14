import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FileUpload from "./FileUpload";

import { Menu, X } from "lucide-react";

import { Checkbox } from "../ui/checkbox";

import {
  AXIS_TRUCK,
  DEG2RAD,
  DEGREES_PHI,
  DEGREES_THETA,
} from "../utils/Constants";
import { socket } from "@/pages/ControlPage";

const SidebarAndModal = ({
  hasControl,
  cameraControlsRef,
  onResetCamera,
}: {
  hasControl: boolean;
  cameraControlsRef: React.RefObject<any>;
  onResetCamera: () => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  // Camera control settings
  const [settings, setSettings] = useState({
    lightIntensity: 2,
    autoSwitch: true,
  });

  const [settingsCamera, setSettingsCamera] = useState({
    autoRotate: false,
    rotateSpeed: 0.005,
    minDistance: 10,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateSettingCamera = (key: string, value: any) => {
    setSettingsCamera((prev) => ({ ...prev, [key]: value }));
  };

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
    if (hasControl) {
      socket.emit("settings_update", settings);
    }
  }, [settings, hasControl]);

  useEffect(() => {
    if (hasControl) {
      socket.emit("settings_update_local", settingsCamera);
      console.log("Settings local send");
    }
  }, [settingsCamera, hasControl]);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="absolute top-4 left-4 z-40 rounded-md bg-gray-700 p-2 text-white"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Settings Sidebar */}
      <div
        className={`text-lightGray font-tech-mono fixed inset-0 z-50 flex h-full flex-col gap-4 bg-gray-800/80 p-6 backdrop-blur-[15px] backdrop-saturate-[100%] transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-full sm:w-80`}
      >
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Camera Controls</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex w-full flex-col items-center justify-center space-y-4">
          {/* Camera Control Buttons */}
          <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
            {/* Divider */}
            <div className="bg-mediumGray my-2 h-[1px] w-full md:block" />

            {/* Theta Controls */}
            <div className="w-full text-center">
              <p className="mb-4 text-sm text-gray-300">
                THETA: Rotate - horizontal axis.
              </p>
              <div className="flex flex-wrap justify-between gap-2">
                {/* Replace DEGREES_THETA with your actual data */}
                {DEGREES_THETA.map((degree) => (
                  <Button
                    key={degree.id}
                    variant="outline"
                    onClick={() =>
                      cameraControlsRef.current?.rotate(
                        degree.value * DEG2RAD,
                        0,
                        true,
                      )
                    }
                  >
                    {degree.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* Divider */}
            <div className="bg-mediumGray my-2 h-[1px] w-full md:block" />

            {/* Phi Controls */}
            <div className="w-full text-center">
              <p className="mb-4 text-sm text-gray-300">
                PHI: Rotate - vertical axis.
              </p>
              <div className="flex flex-wrap justify-between gap-2">
                {/* Replace DEGREES_PHI with your actual data */}
                {DEGREES_PHI.map((degree) => (
                  <Button
                    key={degree.id}
                    variant="outline"
                    onClick={() =>
                      cameraControlsRef.current?.rotate(
                        0,
                        degree.value * DEG2RAD,
                        true,
                      )
                    }
                  >
                    {degree.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* Divider */}
            <div className="bg-mediumGray my-2 h-[1px] w-full md:block" />

            {/* Truck Controls */}
            <div className="w-full text-center">
              <p className="mb-4 text-sm text-gray-300">
                TRUCK: Move - horizontal and vertical axis.
              </p>
              <div className="flex flex-wrap justify-between gap-2">
                {/* Replace AXIS_TRUCK with your actual data */}
                {AXIS_TRUCK.map((side) => (
                  <Button
                    key={side.id}
                    variant="outline"
                    onClick={() =>
                      cameraControlsRef.current?.truck(
                        side.value1,
                        side.value2,
                        true,
                      )
                    }
                  >
                    {side.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* Divider */}
            <div className="bg-mediumGray my-2 h-[1px] w-full md:block" />
          </div>

          {/* Camera Settings */}
          <div className="mt-4 w-full space-y-2 text-center">
            <div className="flex flex-row-reverse items-center justify-end gap-4">
              <Checkbox
                id="autoSwitch"
                checked={settings.autoSwitch}
                onCheckedChange={(checked) => {
                  updateSetting("autoSwitch", checked);
                  console.log("Auto Switch:", checked);
                }}
              />
              <label
                htmlFor="autoSwitch"
                className="text-lightGray leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Auto-Change
              </label>
            </div>

            <div className="flex flex-row-reverse items-center justify-end gap-4">
              <Checkbox
                id="autoRotate"
                checked={settingsCamera.autoRotate}
                onCheckedChange={(checked) => {
                  updateSettingCamera("autoRotate", checked);
                  console.log("Auto Rotate:", checked);
                }}
              />
              <label
                htmlFor="autoRotate"
                className="text-lightGray leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Auto-Rotate
              </label>
            </div>

            <label className="flex items-center justify-center gap-2 text-white">
              Rotate Speed: {settingsCamera.rotateSpeed.toFixed(3)}
              <input
                type="range"
                min="0.005"
                max="0.05"
                step="0.005"
                value={settingsCamera.rotateSpeed}
                onChange={(e) =>
                  updateSettingCamera("rotateSpeed", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </label>
            <label className="flex items-center justify-center gap-2 text-white">
              Min Distance: {settingsCamera.minDistance.toFixed(1)}
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={settingsCamera.minDistance}
                onChange={(e) =>
                  updateSettingCamera("minDistance", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </label>
            <label className="flex items-center justify-center gap-2 text-white">
              Light Intensity: {settings.lightIntensity.toFixed(1)}
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={settings.lightIntensity}
                onChange={(e) =>
                  updateSetting("lightIntensity", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </label>
          </div>

          {/* Reset Camera Button */}
          <Button
            onClick={onResetCamera}
            className="mt-4 w-full bg-gray-500 text-white hover:bg-gray-600"
          >
            Reset Camera
          </Button>

          {/* Upload Model Button */}
          {hasControl && (
            <Button
              onClick={() => setUploadModalOpen(true)}
              className="mt-4 w-full"
            >
              Upload Model
            </Button>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="font-tech-mono fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[15px] backdrop-saturate-[100%]">
          <div className="w-[90%] max-w-md rounded-lg bg-gray-800/80 p-6 shadow-lg">
            <h1 className="text-mediumGray text-center text-lg font-semibold">
              Upload Model
            </h1>
            <div className="my-4">
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="text-mediumGray block w-full text-sm"
                hidden
              />
            </div>
            <FileUpload onFileSelect={setSelectedFile} />

            <Button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="text-mediumGray w-full"
            >
              Upload
            </Button>
            {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
            <Button
              onClick={() => {
                setUploadModalOpen(false);
                setSelectedFile(null);
                setUploadStatus("");
              }}
              className="text-mediumGray mt-4 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarAndModal;
