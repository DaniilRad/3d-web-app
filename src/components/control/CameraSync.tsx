import { useThree, useFrame } from "@react-three/fiber";
import { socket } from "../../pages/ControlPage";

export const CameraSync = ({ hasControl }: { hasControl: boolean }) => {
  const { camera } = useThree();
  useFrame(() => {
    if (hasControl) {
      socket.emit("camera_update", {
        position: camera.position.toArray(),
        rotation: camera.quaternion.toArray(),
        zoom: camera.zoom,
      });
    }
  });
  return null;
};
