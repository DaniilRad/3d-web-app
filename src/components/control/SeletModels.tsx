import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { socket } from "@/main";

export const SelectModels = ({
  tukeModels,
  userModels,
  hasControl,
  disabled,
  setAutoChange,
}: {
  tukeModels: { id: string; author: string; url: string; folder: string }[];
  userModels: { id: string; author: string; url: string; folder: string }[];
  hasControl: boolean;
  disabled: boolean;
  setAutoChange: (key: string, value: any) => void;
}) => {
  const [modelSettings, setModelSettings] = useState({
    currentModelIndex: 0,
    activeModelSource: "user-model",
  });
  const [canSend, setCanSend] = useState(false);

  const [activeList, setActiveList] = useState("user-models");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const modelsList = activeList === "tuke-models" ? tukeModels : userModels;
  const modelsListSource =
    modelSettings.activeModelSource === "tuke-models" ? tukeModels : userModels;

  const togglePopover = () => setIsPopoverOpen(!isPopoverOpen);

  const updateModelSetting = (key: string, value: any) => {
    setModelSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    socket.on("update_index", (currentIndex) => {
      if (currentIndex && !hasControl) {
        updateModelSetting("currentModelIndex", currentIndex);
      }
    });

    return () => {
      socket.off("update_index");
    };
  }, []);

  useEffect(() => {
    if (hasControl && canSend) {
      socket.emit("model_settings_update", modelSettings);
      setCanSend(false);
    }
  }, [canSend]);

  return (
    <>
      {/* Button to trigger popover */}
      <Button
        onClick={togglePopover}
        variant={"outline"}
        className="mt-2 mb-2 w-full"
        disabled={!disabled}
      >
        Select Models
      </Button>
      {/* Full-screen Popover */}
      <div
        className={`bg-deepBlack/80 backdrop-brightness-[10%] backdrop-saturate-[150%] transition-all duration-300 ${isPopoverOpen ? "translate-x-0" : "-translate-x-full"} fixed top-0 left-0 z-50 flex h-full w-full flex-col gap-4 px-4 py-6 backdrop-blur-[2px] sm:w-100`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select a Model</h2>
          <button
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="text-lg font-bold text-white"
          >
            <X size={24} className="hover:text-neonBlue" />
          </button>
        </div>

        {/* Button to switch between tukeModels and userModels */}
        <div className="flex justify-center gap-4">
          <Button
            variant={"outline"}
            onClick={() => setActiveList("tuke-models")}
            className={
              activeList === "tuke-models" ? "bg-lightGray text-deepBlack" : ""
            }
          >
            Tuke Models
          </Button>
          <Button
            variant={"outline"}
            onClick={() => setActiveList("user-models")}
            className={
              activeList === "user-models" ? "bg-lightGray text-deepBlack" : ""
            }
          >
            User Models
          </Button>
        </div>
        {/* <div className="bg-mediumGray h-[1px] w-full md:block" /> */}
        <div className="flex h-[60%] flex-col justify-start">
          {/* Model List */}
          <div className="grid grid-cols-1 gap-4 overflow-y-scroll text-sm">
            {modelsList.map((model, index) => (
              <Button
                variant={"outline"}
                className={`flex h-fit flex-col justify-between p-4 text-white ${
                  modelSettings.currentModelIndex === index &&
                  model.folder === modelSettings.activeModelSource
                    ? "bg-lightGray text-deepBlack" // Apply neon blue to the selected model
                    : ""
                }`}
                key={model.id}
                onClick={() => {
                  updateModelSetting("activeModelSource", activeList);
                  updateModelSetting("currentModelIndex", index);
                  if (modelsList.length < 2) {
                    setAutoChange("autoSwitch", false);
                  }
                  setCanSend(true);
                }}
              >
                <h3 className="text-sm font-bold">{model.id}</h3>
                <p className="text-sm">Author: {model.author}</p>
              </Button>
            ))}
          </div>

          {/* Currently selected model details */}
        </div>
        <div className="bg-mediumGray h-[1px] w-full md:block" />
        <div className="rounded-md border-[1px] p-2 text-center">
          <h3 className="text-lg">Current Model Details</h3>
          <div className="mt-2 text-sm">
            <p>
              <strong>Name:</strong>{" "}
              {modelsListSource[modelSettings.currentModelIndex]?.id}
            </p>
            <p>
              <strong>Author:</strong>{" "}
              {modelsListSource[modelSettings.currentModelIndex]?.author}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
