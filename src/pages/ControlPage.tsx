import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";

// import { io } from "socket.io-client";
import { socket } from "@/main";

import { Scene } from "@/components/control/Scene";
import SidebarAndUpload from "@/components/control/SidebarAndUpload";
import { ControlsModal } from "@/components/model/ControlsModal";

import img from "@/assets/logo.svg";
import { MonitorCheck, MonitorOff } from "lucide-react";

// export const socket = io("https://websocket-server-ucimr.ondigitalocean.app", {
//   autoConnect: true,
//   reconnection: true,
// });

export default function ControllerPage() {
  const [hasControl, setHasControl] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const hasRequestedControl = useRef(false);

  const cameraControlsRef = useRef<any>(null);

  const resetCamera = () => {
    cameraControlsRef.current?.reset(true);
  };

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
    <div className="h-full w-full">
      {/* {showModal && <ControlsModal setShowModal={setShowModal} />} */}
      <SidebarAndUpload
        hasControl={hasControl}
        cameraControlsRef={cameraControlsRef}
        onResetCamera={resetCamera}
      />
      <div className="absolute top-0 right-0 z-10 flex flex-row items-center justify-center gap-4 p-6">
        {hasControl ? (
          <MonitorCheck size={28} className="text-lightGray" />
        ) : (
          <MonitorOff size={28} className="text-red-500" />
        )}
        <img src={img} alt="logo" className="w-[6rem] sm:w-[8rem]" />
      </div>

      <div className="bg-deepBlack relative h-[90vh] touch-none overflow-hidden sm:h-[100vh]">
        <Canvas shadows camera={{ position: [15, 15, 0], fov: 60 }}>
          <Scene
            hasControl={hasControl}
            cameraControlsRef={cameraControlsRef}
          />
        </Canvas>
      </div>
    </div>
  );
}
