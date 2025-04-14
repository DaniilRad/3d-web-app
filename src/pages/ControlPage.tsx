import { io } from "socket.io-client";
import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";

import SidebarAndUpload from "@/components/control/SidebarAndUpload";
import { Scene } from "@/components/control/Scene";

export const socket = io("https://websocket-server-ucimr.ondigitalocean.app", {
  autoConnect: true,
  reconnection: true,
});

export default function ControllerPage() {
  const [hasControl, setHasControl] = useState(false);
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
      <SidebarAndUpload
        hasControl={hasControl}
        cameraControlsRef={cameraControlsRef}
        onResetCamera={resetCamera}
      />

      <Canvas shadows camera={{ position: [15, 15, 0], fov: 60 }}>
        <Scene hasControl={hasControl} cameraControlsRef={cameraControlsRef} />
      </Canvas>
    </div>
  );
}
