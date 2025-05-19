import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FileUpload from "./FileUpload";

import { Menu, X, MoveHorizontal, MoveVertical, Move } from "lucide-react";

import { Checkbox } from "../ui/checkbox";

import {
  AXIS_TRUCK,
  DEG2RAD,
  DEGREES_PHI,
  DEGREES_THETA,
  TEXTURES,
} from "../utils/Constants";
import { socket } from "@/main";
import { Slider } from "../ui/slider";
import { ColorPicker } from "../ui/color-picker";
import { SelectModels } from "./SeletModels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SidebarAndModal = ({
  hasControl,
  cameraControlsRef,
  onResetCamera,
}: {
  hasControl: boolean;
  cameraControlsRef: React.RefObject<any>;
  onResetCamera: () => void;
}) => {
  const [adminOn, setAdminOn] = useState<boolean>(false);
  const folders = ["user-models", "tuke-models"];
  const [folderIndex, setFolderIndex] = useState<number>(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [author, setAuthor] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [tukeModels, setTukeModels] = useState<
    { id: string; author: string; url: string; folder: string }[]
  >([]);
  const [userModels, setUserModels] = useState<
    { id: string; author: string; url: string; folder: string }[]
  >([]);

  // Camera control settings
  const [settings, setSettings] = useState({
    lightIntensity: 1,
    autoSwitch: true,
    lightColor: "#ffffff",
    txtrFolder: "grass",
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
      folder: folders[folderIndex],
    });

    socket.once("presigned_url", async ({ uploadUrl, fileName }) => {
      try {
        const folder = folders[folderIndex];
        const response = await fetch(uploadUrl, {
          method: "PUT",
          body: selectedFile,
          headers: { "Content-Type": selectedFile.type },
        });

        if (response.ok) {
          setUploadStatus("✅ Upload successful!");
          socket.emit("upload_complete", { fileName, author, folder });
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
    {
      !adminOn ? setFolderIndex(0) : setFolderIndex(1);
    }
  }, [adminOn]);

  useEffect(() => {
    socket.on("model_uploaded", () => {
      updateSetting("autoSwitch", false);

      socket.emit("get_files");

      socket.once("files_list", ({ tukeModels, userModels }) => {
        setTukeModels(tukeModels);
        setUserModels(userModels);
      });
    });

    return () => {
      socket.off("model_uploaded");
    };
  }, []);

  useEffect(() => {
    socket.emit("get_files");
    socket.on("files_list", ({ tukeModels, userModels }) => {
      setTukeModels(tukeModels);
      setUserModels(userModels);
    });

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
          className="bg-deepBlack/60 absolute top-0 left-0 z-40 m-6 rounded-md p-2 text-white backdrop-blur-[15px] backdrop-brightness-[60%] backdrop-saturate-[50%]"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} className="hover:text-neonBlue" />
        </button>
      )}
      {/* Settings Sidebar */}
      <div
        className={`text-lightGray font-tech-mono fixed inset-0 z-50 flex h-full flex-col gap-4 bg-black/50 py-6 backdrop-blur-[15px] backdrop-brightness-[60%] backdrop-saturate-[50%] transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-full sm:w-100`}
      >
        <div className="flex justify-between px-[1em]">
          <h2 className="text-lg font-semibold">Camera Controls</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} className="hover:text-neonBlue" />
          </button>
        </div>

        <div className="scrollbar-neon flex w-full flex-col items-center justify-start space-y-2 overflow-y-scroll">
          {/* Camera Control Buttons */}
          <div className="grid w-full grid-cols-1 gap-2">
            {/* Divider */}
            <div className="bg-mediumGray my-2 h-[1px] w-full md:block" />

            {/* Theta Controls */}
            <div className="flex w-full flex-col gap-2 text-center">
              <div className="flex w-full items-center justify-center gap-2">
                <MoveHorizontal size={16} color="#00FFFF" />
                <p className="text-sm text-gray-300">
                  THETA: <span className="text-neonBlue">Rotate</span> -
                  horizontal axis.
                </p>
              </div>
              <div className="flex justify-between">
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
              <div className="flex w-full items-center justify-center gap-2">
                <MoveVertical size={16} color="#00FFFF" />
                <p className="text-sm text-gray-300">
                  PHI: <span className="text-neonBlue">Rotate</span> - vertical
                  axis.
                </p>
              </div>
              <div className="flex justify-between">
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
              <div className="flex items-center justify-center gap-2">
                <Move size={16} color="#00FFFF" />
                <p className="text-sm text-gray-300">
                  TRUCK: <span className="text-neonBlue">Move</span> -
                  horizontal and vertical axis.
                </p>
              </div>
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
          <div className="my-2 flex w-full flex-col gap-4 text-center">
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
            <SelectModels
              tukeModels={tukeModels}
              userModels={userModels}
              hasControl={hasControl}
              disabled={!selectedFile}
              setAutoChange={updateSetting}
            />
            <Select
              value={settings.txtrFolder}
              onValueChange={(value) => updateSetting("txtrFolder", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Texture" />
              </SelectTrigger>
              <SelectContent>
                {TEXTURES.map((txtr) => (
                  <SelectItem key={txtr} value={txtr}>
                    {txtr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="bg-mediumGray my-2 h-[1px] w-full md:block" />
            <div className="flex flex-row items-center justify-center gap-4">
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
            <label className="flex flex-col items-center justify-center gap-2 text-white">
              Light Intensity: {settings.lightIntensity.toFixed(1)}
              <Slider
                min={0.5}
                max={3.5}
                step={0.1}
                value={[settings.lightIntensity]}
                onValueChange={(value) =>
                  updateSetting("lightIntensity", value[0])
                }
              />
            </label>
            <div className="bg-mediumGray mt-2 mb-4 h-[1px] w-full md:block" />
          </div>
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
          <Checkbox
            hidden
            id="adminOn"
            checked={!adminOn}
            onCheckedChange={() => {
              setAdminOn(!adminOn);
            }}
          />
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
              modelsName={userModels.map((model) => model.id)}
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
