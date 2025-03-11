import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stage } from "@react-three/drei";
import { throttle } from "lodash";

const Model = () => {
  return (
    <mesh castShadow={false} receiveShadow={true}>
      <sphereGeometry args={[2, 30, 30]} />
      <meshStandardMaterial color="blue" wireframe={false} />
    </mesh>
  );
};

const socket = io("https://websocket-server-ucimr.ondigitalocean.app", {
  autoConnect: true,
  reconnection: true,
});

const CameraSync = ({ cameraRef }: { cameraRef: any }) => {
  const [hasControl, setHasControl] = useState(false);
  const hasRequestedControl = useRef(false); // Track if request was sent

  useEffect(() => {
    // Connect socket and send control request only once
    if (!hasRequestedControl.current) {
      socket.emit("request_control");
      hasRequestedControl.current = true;
    }
    socket.on("control_granted", () => {
      console.log("🎮 Control granted!");
      setHasControl(true);
    });

    socket.on("control_denied", () => {
      console.log("🚫 Control denied! Another controller is active.");
      setHasControl(false);
    });

    return () => {
      socket.off("control_granted");
      socket.off("control_denied");
    };
  }, []);

  const sendCameraUpdate = throttle(() => {
    if (hasControl && cameraRef.current) {
      const updateData = {
        position: cameraRef.current.position.toArray(),
        rotation: cameraRef.current.quaternion.toArray(),
      };
      socket.emit("camera_update", updateData);
    }
  }, 50); // Sends updates every 50ms

  useFrame(() => {
    if (hasControl) sendCameraUpdate();
  });

  return null;
};

export default function ControllerPage() {
  const navigate = useNavigate();
  const cameraRef = useRef<any>(null);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-row gap-4 bg-gray-100 p-4">
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
        >
          Model
        </button>
      </div>

      <Canvas className="flex-1 bg-gray-500">
        <PerspectiveCamera ref={cameraRef} makeDefault position={[15, 15, 0]} />
        <OrbitControls autoRotate={true} minDistance={10} />
        <pointLight
          position={[10, 10, 10]}
          castShadow={false}
          receiveShadow={false}
        />
        <Stage intensity={2} environment={"studio"} shadows={false}>
          <Suspense fallback={null}>
            <Model />
          </Suspense>
        </Stage>
        <CameraSync cameraRef={cameraRef} />
      </Canvas>
    </div>
  );
}
