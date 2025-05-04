import { useThree, useFrame } from "@react-three/fiber";
import { socket } from "@/main";
import { useRef } from "react";

export const CameraSync = ({ hasControl }: { hasControl: boolean }) => {
  const { camera } = useThree();
  const prevState = useRef({
    position: camera.position.toArray(),
    rotation: camera.quaternion.toArray(),
    zoom: camera.zoom,
  });

  useFrame(() => {
    const currentState = {
      position: camera.position.toArray(),
      rotation: camera.quaternion.toArray(),
      zoom: camera.zoom,
    };

    if (
      hasControl &&
      (JSON.stringify(prevState.current.position) !== JSON.stringify(currentState.position) ||
        JSON.stringify(prevState.current.rotation) !== JSON.stringify(currentState.rotation) ||
        prevState.current.zoom !== currentState.zoom)
    ) {
      socket.emit("camera_update", currentState);
      prevState.current = currentState;
    }
  });
  
  return null;
};
