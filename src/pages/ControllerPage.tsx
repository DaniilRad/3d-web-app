import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stage } from "@react-three/drei";

const Model = () => {
  const [size, setSize] = useState(2); // Default sphere size

  useEffect(() => {
    // Function to calculate sphere size based on screen width
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 600)
        setSize(1); // Small devices
      else if (width < 1024)
        setSize(1.5); // Tablets
      else setSize(2); // Larger screens
    };

    updateSize(); // Run on mount
    window.addEventListener("resize", updateSize); // Listen for changes

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <mesh castShadow={false} receiveShadow={true}>
      <sphereGeometry args={[size, 30, 30]} />
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

  const sendCameraUpdate = () => {
    if (hasControl && cameraRef.current) {
      const updateData = {
        position: cameraRef.current.position.toArray(),
        rotation: cameraRef.current.quaternion.toArray(),
      };
      socket.emit("camera_update", updateData);
    }
  };

  useFrame(() => {
    if (hasControl) sendCameraUpdate();
  });

  return null;
};

export default function ControllerPage() {
  const navigate = useNavigate();
  const cameraRef = useRef<any>(null);

  return (
    <div className="bg-deepBlack relative flex h-screen flex-col">
      {/* <LavaLampBackground /> */}
      <div className="text-mediumGray font-tech-mono absolute top-0 left-0 z-50 flex w-full items-center justify-start gap-4 px-4 py-6 backdrop-blur-[15px] backdrop-saturate-[100%]">
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
        >
          Model
        </button>
      </div>

      <Canvas className="z-40 flex-1">
        <PerspectiveCamera ref={cameraRef} makeDefault position={[15, 15, 0]} />
        <OrbitControls
          autoRotate={true}
          enableZoom={false}
          enablePan={false}
          minDistance={10}
          minPolarAngle={Math.PI / 6} // 30° minimum angle (prevents under-floor views)
          maxPolarAngle={Math.PI / 2} // 90° maximum angle (prevents top-down views)
        />
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
