import { OrbitControls, PerspectiveCamera, Stage } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import io from "socket.io-client";
import * as THREE from "three";

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

const socket = io("http://localhost:8080", {
  autoConnect: true,
  reconnection: true,
});

export default function ModelPage() {
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    socket.on("camera_update", (data) => {
      // console.log("📥 Received camera update:", data);
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
          <Suspense fallback={null}>
            <Model url="/camel.glb" />
            {/* <Model /> */}
          </Suspense>
        </Stage>
      </Canvas>
    </div>
  );
}
