import { OrbitControls, PerspectiveCamera, Stage } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import io from "socket.io-client";
import * as THREE from "three";

const socket = io("https://websocket-server-ucimr.ondigitalocean.app", {
  autoConnect: true,
  reconnection: true,
});

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  const { camera } = useThree();

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Move camera back based on model size
    const maxDimension = Math.max(size.x, size.y, size.z);
    camera.position.set(0, maxDimension * 1.5, maxDimension * 2); // Adjust scaling
  }, [gltf, camera]);

  return <primitive object={gltf.scene} />;
};

export default function ModelPage() {
  const cameraRef = useRef<any>(null);
  const [models, setModels] = useState<string[]>([]);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const switchInterval = 20000; // Switch models every 5 seconds

  useEffect(() => {
    // Fetch available models from S3 via WebSocket
    socket.emit("get_files");
    console.log("📡 Emitting get_files request");

    socket.on("files_list", (fileList: { name: string; url: string }[]) => {
      console.log("📥 Received file list:", fileList);

      if (!fileList || fileList.length === 0) {
        console.warn("⚠ No models found in S3");
        return;
      }

      const modelUrls = fileList
        .filter(
          (file) => file.name.endsWith(".glb") || file.name.endsWith(".gltf"),
        )
        .map((file) => file.url);

      console.log("🔗 Extracted model URLs:", modelUrls);

      if (modelUrls.length > 0) {
        setModels(modelUrls);
        setLoading(false);
      } else {
        console.warn("⚠ No valid models found!");
      }
    });

    return () => {
      socket.off("files_list");
      console.log("🔌 Disconnected from files_list event");
    };
  }, []);

  useEffect(() => {
    if (models.length > 1) {
      console.log("🔄 Starting model switch every", switchInterval, "ms");
      const interval = setInterval(() => {
        setCurrentModelIndex((prevIndex) => (prevIndex + 1) % models.length);
        console.log("➡ Switched to model index:", currentModelIndex);
      }, switchInterval);

      return () => clearInterval(interval);
    } else {
      console.warn("⚠ Not enough models to switch");
    }
  }, [models]);

  useEffect(() => {
    socket.on("camera_update", (data) => {
      if (cameraRef.current) {
        cameraRef.current.position.set(...data.position);
        if (data.rotation.length === 4) {
          cameraRef.current.quaternion.set(...data.rotation);
        } else {
          console.warn("⚠ Invalid quaternion received:", data.rotation);
        }
      }
    });

    return () => {
      socket.off("camera_update");
    };
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-row gap-4 bg-gray-100 p-4">
        <button
          onClick={() =>
            window.open(window.location.href + "control", "_blank")
          }
          className="rounded-lg bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
        >
          Controls
        </button>
        <div className="flex items-center justify-center">
          <h1 className="font-mono text-red-500">
            Current Model Index: {currentModelIndex} | Loaded Models:{" "}
            {models.length}
          </h1>
        </div>
      </div>
      <Canvas className="flex-1">
        <PerspectiveCamera ref={cameraRef} makeDefault position={[15, 15, 0]} />
        <OrbitControls
          autoRotate={true}
          enablePan={false}
          enableRotate={false}
          enableDamping={false}
          enableZoom={false}
          minDistance={10}
        />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Stage preset={"upfront"} intensity={2} environment={"city"}>
          <Suspense
            fallback={
              <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            }
          >
            {!loading && models.length > 0 ? (
              <Model url={models[currentModelIndex]} />
            ) : (
              <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="red" />
              </mesh>
            )}
          </Suspense>
        </Stage>
      </Canvas>
    </div>
  );
}
