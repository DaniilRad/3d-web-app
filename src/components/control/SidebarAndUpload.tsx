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
import { socket } from "@/main";
import { Slider } from "../ui/slider";
import { ColorPicker } from "../ui/color-picker";
import { SelectModel } from "../model/SelectModel";

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
  const [author, setAuthor] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [models, setModels] = useState<
    { id: string; author: string; url: string }[]
  >([]);

  // Camera control settings
  const [settings, setSettings] = useState({
    lightIntensity: 2,
    autoSwitch: true,
    lightColor: "#ffffff",
    currentModelIndex: 0,
  });

  const [settingsCamera, setSettingsCamera] = useState({
    autoRotate: false,
    rotateSpeed: 0.005,
    minDistance: 10,
  });

  const updateCurrentModelIndex = (index: number) => {
    updateSetting("currentModelIndex", index);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateSettingCamera = (key: string, value: any) => {
    setSettingsCamera((prev) => ({ ...prev, [key]: value }));
  };

  const handleMetadata = (selectedFile: File | null, author: string) => {
    setSelectedFile(selectedFile);
    setAuthor(author);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
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
          socket.emit("upload_complete", { fileName, author });
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
    socket.on("update_index", (currentIndex) => {
      if (currentIndex) {
        updateCurrentModelIndex(currentIndex);
      }
    });

    return () => {
      socket.off("update_index"); // Cleanup event listener on unmount
    };
  }, [settings]);

  useEffect(() => {
    socket.on("model_uploaded", () => {
      updateSetting("autoSwitch", false);

      socket.emit("get_files");

      socket.once(
        "files_list",
        (modelsList: { id: string; author: string; url: string }[]) => {
          if (modelsList.length > 0) {
            setModels(modelsList);
          }
        },
      );
    });

    return () => {
      socket.off("model_uploaded");
    };
  }, []);

  useEffect(() => {
    socket.emit("get_files");
    socket.on(
      "files_list",
      (modelsList: { id: string; author: string; url: string }[]) => {
        setModels(modelsList);
      },
    );

    return () => {
      socket.off("files_list");
    };
  }, []);

  useEffect(() => {
    if (hasControl) {
      socket.emit("settings_update", settings);
    }
  }, [settings, hasControl]);

  useEffect(() => {
    if (hasControl) {
      socket.emit("settings_update_local", settingsCamera);
    }
  }, [settingsCamera, hasControl]);

  return (
    <>
      {/* Sidebar Toggle Button */}
      {!sidebarOpen && (
        <button
          className="bg-deepBlack/60 absolute top-4 left-4 z-40 rounded-md p-2 text-white backdrop-blur-[15px] backdrop-brightness-[60%] backdrop-saturate-[50%]"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}
      {/* Settings Sidebar */}
      <div
        className={`text-lightGray font-tech-mono fixed inset-0 z-50 flex h-full flex-col gap-4 bg-black/50 p-6 backdrop-blur-[15px] backdrop-brightness-[60%] backdrop-saturate-[50%] transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-full sm:w-100`}
      >
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Camera Controls</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex w-full flex-col items-center justify-center space-y-2">
          {/* Camera Control Buttons */}
          <div className="grid w-full grid-cols-1 gap-2">
            {/* Divider */}
            <div className="bg-mediumGray my-2 h-[1px] w-full md:block" />

            {/* Theta Controls */}
            <div className="flex w-full flex-col gap-2 text-center">
              <p className="text-sm text-gray-300">
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
            <div className="flex w-full flex-col gap-2 text-center">
              <p className="text-sm text-gray-300">
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
            <div className="flex w-full flex-col gap-2 text-center">
              <p className="text-sm text-gray-300">
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
          <div className="mt-2 w-full space-y-4 text-center">
            <div className="flex flex-row justify-around gap-2">
              <div className="flex flex-row-reverse items-center justify-end gap-4">
                <Checkbox
                  id="autoSwitch"
                  checked={settings.autoSwitch}
                  onCheckedChange={(checked) => {
                    updateSetting("autoSwitch", checked);
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
                  }}
                />
                <label
                  htmlFor="autoRotate"
                  className="text-lightGray leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Auto-Rotate
                </label>
              </div>
            </div>
            <label className="flex flex-col items-center justify-center gap-2 text-white">
              Rotate Speed: {settingsCamera.rotateSpeed.toFixed(3)}
              <Slider
                min={0.005}
                max={0.05}
                step={0.005}
                value={[settingsCamera.rotateSpeed]}
                onValueChange={(value) =>
                  updateSettingCamera("rotateSpeed", value[0])
                }
              />
            </label>
            <label className="flex flex-col items-center justify-center gap-2 text-white">
              Min Distance: {settingsCamera.minDistance.toFixed(1)}
              <Slider
                min={1}
                max={20}
                step={0.5}
                value={[settingsCamera.minDistance]}
                onValueChange={(value) =>
                  updateSettingCamera("minDistance", value[0])
                }
              />
            </label>
            <label className="flex flex-col items-center justify-center gap-2 text-white">
              Light Intensity: {settings.lightIntensity.toFixed(1)}
              <Slider
                min={0}
                max={10}
                step={0.1}
                value={[settings.lightIntensity]}
                onValueChange={(value) =>
                  updateSetting("lightIntensity", value[0])
                }
              />
            </label>
          </div>
          {/* Color picker */}
          <div className="flex flex-row gap-4">
            <label className="flex flex-row items-center justify-center gap-2 text-white">
              <p>Light Color: </p>
              <p style={{ color: `${settings.lightColor}` }}>
                {settings.lightColor}
              </p>
            </label>
            <ColorPicker
              value={settings.lightColor}
              onChange={(v) => {
                updateSetting("lightColor", v);
              }}
            />
          </div>
          <SelectModel
            modelsList={models}
            setCurrentModelIndex={updateCurrentModelIndex}
          />

          {/* Reset Camera Button */}
          <Button
            onClick={onResetCamera}
            className="hover:bg-lightGray w-full text-white hover:text-black"
            variant="outline"
          >
            Reset Camera
          </Button>

          {/* Upload Model Button */}
          <Button
            onClick={() => setUploadModalOpen(true)}
            className="hover:bg-lightGray mt-4 w-full text-white hover:text-black"
            variant="outline"
            disabled={!hasControl}
          >
            Upload Model
          </Button>
          {!hasControl && (
            <p className="mt-2 flex items-center justify-center text-sm">
              You do not have control over the camera.
            </p>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="font-tech-mono fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[15px] backdrop-saturate-[100%]">
          <div className="bg-deepBlack/90 border-lightGray w-[60%] max-w-md rounded-lg border p-6 shadow-lg">
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
            <FileUpload
              onFileSelect={handleMetadata}
              onFileRemove={handleFileRemove}
            />

            <Button
              variant="outline"
              onClick={handleUpload}
              disabled={!selectedFile}
              className="text-mediumGray w-full"
            >
              Upload
            </Button>
            {uploadStatus && (
              <p className="text-lightGray mt-2 flex items-center justify-center text-sm">
                {uploadStatus}
              </p>
            )}
            <Button
              variant="outline"
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
