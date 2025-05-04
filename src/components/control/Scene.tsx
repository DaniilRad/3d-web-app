import { CameraSync } from "@/components/control/CameraSync";

import { Center, CameraControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { Ground } from "../regular/Ground";
import { Shadows } from "../regular/Shadows";
import { ControlSphere } from "./ControlSphere";
import { socket } from "@/main";
import { useFrame } from "@react-three/fiber";

export const Scene = ({
  hasControl,
  cameraControlsRef,
}: {
  hasControl: boolean;
  cameraControlsRef: React.RefObject<any>;
}) => {
  const isDraggingRef = useRef(false);
  const [settings, setSettings] = useState({
    autoRotate: false,
    rotateSpeed: 1,
    minDistance: 10,
  });

  useEffect(() => {
    socket.on("settings_update_local", (data) => {
      setSettings(data);
    });
    return () => {
      socket.off("settings_update_local");
    };
  }, []);

  useFrame(() => {
    if (settings.autoRotate == true && cameraControlsRef.current) {
      cameraControlsRef.current.rotate(settings.rotateSpeed, 0, true);
    }
  });

  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.minDistance = settings.minDistance;
    }
  }, [settings.minDistance]);

  return (
    <>
      <group position-y={-0.5}>
        <Center top>
          <ControlSphere />
        </Center>
        <Ground />
        <Shadows />
        <CameraControls
          ref={cameraControlsRef}
          minDistance={settings.minDistance}
          maxDistance={80}
          enabled={true}
          dollyToCursor={false}
          onStart={() => (isDraggingRef.current = true)}
          onEnd={() => (isDraggingRef.current = false)}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </group>
      <CameraSync hasControl={hasControl} />
    </>
  );
};
