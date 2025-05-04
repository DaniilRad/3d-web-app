import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";

// import { io } from "socket.io-client";
import { socket } from "@/main";

import { Scene } from "@/components/control/Scene";
import SidebarAndUpload from "@/components/control/SidebarAndUpload";
import { ControlsModal } from "@/components/model/ControlsModal";

import img from "@/assets/logo.svg";

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
    <div className="bg-deepBlack relative flex h-screen">
      <div className="absolute top-[50%] -right-0 z-50 h-20 w-20 bg-amber-300 sm:bg-amber-600 md:bg-amber-900 lg:bg-blue-300 xl:bg-blue-600 2xl:bg-blue-900" />

      {/* {showModal && <ControlsModal setShowModal={setShowModal} />} */}
      <SidebarAndUpload
        hasControl={hasControl}
        cameraControlsRef={cameraControlsRef}
        onResetCamera={resetCamera}
      />
      <div className="absolute top-0 right-0 z-10 p-6">
        <img src={img} alt="logo" className="w-[6rem] sm:w-[8rem]" />
      </div>

      <Canvas shadows camera={{ position: [15, 15, 0], fov: 60 }}>
        <Scene hasControl={hasControl} cameraControlsRef={cameraControlsRef} />
      </Canvas>
    </div>
  );
}
