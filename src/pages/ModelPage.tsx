import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { QRCodeSVG } from "qrcode.react";
import io from "socket.io-client";
import * as THREE from "three";
import LavaLampBackground from "../components/LavaBackground";

const socket = io("https://websocket-server-ucimr.ondigitalocean.app", {
  autoConnect: true,
  reconnection: true,
});

const ORIGINAL_CAMERA_POSITION = new THREE.Vector3(15, 15, 0); // Store original camera position
const ORIGINAL_DISTANCE = ORIGINAL_CAMERA_POSITION.length(); // Calculate original distance from [0,0,0]

interface ModelProps {
  url: string;
  preload?: boolean;
}

const Model: React.FC<ModelProps> = ({ url, preload = false }) => {
  const gltf = useLoader(GLTFLoader, url);
  const [scaledScene, setScaledScene] = useState<THREE.Object3D | null>(null);
  const TARGET_SIZE = 0.5; // The size of the reference bounding box (cube)

  useEffect(() => {
    if (!preload && gltf.scene) {
      const clonedScene = gltf.scene.clone();

      // ✅ Step 1: Reset scale to (1,1,1) to normalize models with different scales
      clonedScene.scale.set(0.1, 0.1, 0.1);
      clonedScene.updateMatrixWorld(true);

      // Compute bounding box of the model
      const newBounds = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      newBounds.getSize(size);
      const center = new THREE.Vector3();
      newBounds.getCenter(center);

      if (size.x === 0 || size.y === 0 || size.z === 0) return; // Prevent invalid bounding boxes

      // ✅ Step 2: Create a reference cube (pattern for scaling)
      const mainBounds = new THREE.Box3(
        new THREE.Vector3(-TARGET_SIZE / 2, -TARGET_SIZE / 2, -TARGET_SIZE / 2),
        new THREE.Vector3(TARGET_SIZE / 2, TARGET_SIZE / 2, TARGET_SIZE / 2),
      );

      // ✅ Step 3: Compute scale ratio based on the reference cube
      const lengthSceneBounds = {
        x: Math.abs(mainBounds.max.x - mainBounds.min.x),
        y: Math.abs(mainBounds.max.y - mainBounds.min.y),
        z: Math.abs(mainBounds.max.z - mainBounds.min.z),
      };

      const lengthMeshBounds = {
        x: Math.abs(newBounds.max.x - newBounds.min.x),
        y: Math.abs(newBounds.max.y - newBounds.min.y),
        z: Math.abs(newBounds.max.z - newBounds.min.z),
      };

      const lengthRatios = [
        lengthSceneBounds.x / lengthMeshBounds.x,
        lengthSceneBounds.y / lengthMeshBounds.y,
        lengthSceneBounds.z / lengthMeshBounds.z,
      ];

      // ✅ Step 4: Apply the smallest ratio to scale the model proportionally
      let minRatio = Math.min(...lengthRatios);
      let padding = 0.1; // Optional padding
      minRatio -= padding;

      clonedScene.scale.setScalar(minRatio);

      // ✅ Step 5: Recalculate bounding box and recenter model
      clonedScene.updateMatrixWorld(true);
      const newBox = new THREE.Box3().setFromObject(clonedScene);
      const newCenter = new THREE.Vector3();
      newBox.getCenter(newCenter);
      clonedScene.position.sub(newCenter);

      setScaledScene(clonedScene);
    }
  }, [gltf, preload]);

  if (!scaledScene) return null; // Prevent rendering if not ready

  return <primitive object={scaledScene} />;
};

export default function ModelPage() {
  const cameraRef = useRef<any>(null);
  const directionalLightRef = useRef(null);
  const [models, setModels] = useState<string[]>([]);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const switchInterval = 5000;
  const [preloadedModel, setPreloadedModel] = useState<string | null>(null);

  useEffect(() => {
    const handleModelUploaded = (file: {
      fileName: string;
      modelUrl: string;
    }) => {
      window.alert(`📥 New model uploaded: ${file.fileName}`);

      setAutoSwitch(false); // Stop auto-switching

      // ✅ Step 1: Request the updated list
      socket.emit("get_files");

      // ✅ Step 2: Wait for the updated list and then select the new model
      socket.once("files_list", (fileList: { name: string; url: string }[]) => {
        const modelUrls = fileList
          .filter(
            (file) => file.name.endsWith(".glb") || file.name.endsWith(".gltf"),
          )
          .map((file) => file.url);

        if (modelUrls.length > 0) {
          setModels(modelUrls); // ✅ Update models list
          setLoading(false); // ✅ Stop loading

          // ✅ Find the newly uploaded model in the updated list
          const newIndex = modelUrls.findIndex(
            (model) => model === file.modelUrl,
          );
          console.log(`🔍 Found index: ${newIndex}`);

          if (newIndex !== -1) {
            setCurrentModelIndex(newIndex); // ✅ Select the new model
          }
        }
      });
    };

    socket.on("model_uploaded", handleModelUploaded);

    return () => {
      socket.off("model_uploaded", handleModelUploaded);
    };
  }, []);

  useEffect(() => {
    // ✅ Initial fetch when the page loads
    socket.emit("get_files");

    socket.on("files_list", (fileList: { name: string; url: string }[]) => {
      const modelUrls = fileList
        .filter(
          (file) => file.name.endsWith(".glb") || file.name.endsWith(".gltf"),
        )
        .map((file) => file.url);

      if (modelUrls.length > 0) {
        setModels(modelUrls);
        setLoading(false);
      }
    });

    return () => {
      socket.off("files_list");
    };
  }, []);

  useEffect(() => {
    if (models.length > 1 && autoSwitch) {
      const interval = setInterval(() => {
        setCurrentModelIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % models.length;
          setPreloadedModel(models[nextIndex]);
          return nextIndex;
        });
      }, switchInterval);

      return () => clearInterval(interval);
    }
  }, [models, autoSwitch]);

  useEffect(() => {
    socket.on("camera_update", (data) => {
      if (cameraRef.current) {
        const recievePosition = new THREE.Vector3(...data.position);
        recievePosition.normalize().multiplyScalar(ORIGINAL_DISTANCE);
        cameraRef.current.position.copy(recievePosition);

        if (data.rotation.length === 4) {
          cameraRef.current.quaternion.set(...data.rotation);
        }
      }
    });

    return () => {
      socket.off("camera_update");
    };
  }, []);

  useEffect(() => {
    socket.on("settings_update", (data) => {
      let enableZoom,
        enablePan = { data };
      console.log("Enable Zoom: " + enableZoom);
      console.log("Enable Pan: " + enablePan);
    });

    return () => {
      socket.off("camera_update");
    };
  }, []);

  return (
    <div className="relative flex h-screen flex-col">
      <div className="text-lightGray font-tech-mono absolute top-0 left-0 z-50 flex w-full items-center justify-start gap-4 px-4 py-6 backdrop-blur-[15px] backdrop-saturate-[100%]">
        <button
          onClick={() =>
            window.open(window.location.href + "control", "_blank")
          }
          className="rounded-lg bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
        >
          Controls
        </button>
        <select
          className="rounded-lg border border-gray-400 p-2"
          value={currentModelIndex}
          onChange={(e) => setCurrentModelIndex(Number(e.target.value))}
        >
          {models.map((_model, index) => (
            <option key={index} value={index}>
              Model {index + 1}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoSwitch}
            onChange={() => setAutoSwitch(!autoSwitch)}
          />
          Auto-Switch
        </label>
      </div>
      <LavaLampBackground />
      <div className="z-40 flex-1">
        <Canvas>
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={[15, 15, 0]}
          />
          <OrbitControls
            autoRotate
            enablePan={false}
            enableRotate={false}
            enableDamping={false}
            enableZoom={false}
            minDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
          <ambientLight />
          <directionalLight
            ref={directionalLightRef}
            position={[15, 15, 0]}
            color={0xffffff}
            intensity={5}
          />
          {directionalLightRef.current && (
            <directionalLightHelper
              args={[directionalLightRef.current, 2, 0xff0000]}
            />
          )}
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
            {preloadedModel && <Model url={preloadedModel} preload />}
          </Suspense>
        </Canvas>
      </div>
      <div className="text-mediumGray font-tech-mono absolute bottom-0 left-0 z-50 flex w-full items-center justify-around px-4 py-6 backdrop-blur-[15px] backdrop-saturate-[100%]">
        {/* QR Code Gradient */}
        <div className="relative">
          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="qr-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#12C2E9" />
                <stop offset="50%" stopColor="#C471ED" />
                <stop offset="100%" stopColor="#F64F59" />
              </linearGradient>
            </defs>
          </svg>

          <QRCodeSVG
            value={window.location.href + "control"}
            size={80}
            level="H"
            fgColor="url(#qr-gradient)"
            bgColor="transparent"
          />
        </div>
        <span className="w-[65vw] text-left text-sm font-bold">
          Scan the QR code to quickly upload your 3D models directly from your
          device. No complicated steps—just scan, select your file, and upload
          it instantly. Your model will be processed and available for viewing
          in the 3D web app.
        </span>
      </div>
    </div>
  );
}
