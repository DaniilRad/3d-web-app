import { Center, PerspectiveCamera, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  FBXLoader,
  GLTFLoader,
  OBJLoader,
  STLLoader,
} from "three/examples/jsm/Addons.js";
import io from "socket.io-client";
import * as THREE from "three";

import { TORUS_COMBINATIONS } from "@/components/utils/Constants";

import Footer from "@/components/model/Footer";
import { TorusLoad } from "@/components/model/TorusLoad";

import { Ground } from "@/components/regular/Ground";

const socket = io("https://websocket-server-ucimr.ondigitalocean.app", {
  autoConnect: true,
  reconnection: true,
});

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const [model, setModel] = useState<
    THREE.Object3D | THREE.BufferGeometry | null
  >(null);
  const [material] = useState(
    () => new THREE.MeshStandardMaterial({ color: "#fef" }),
  );

  useEffect(() => {
    let loader: any;
    let active = true;

    const loadModel = async () => {
      try {
        if (url.endsWith(".gltf") || url.endsWith(".glb")) {
          loader = new GLTFLoader();
          const gltf = await loader.loadAsync(url);
          if (active) setModel(gltf.scene);
        } else if (url.endsWith(".stl")) {
          loader = new STLLoader();
          const geometry = await loader.loadAsync(url);
          if (active) setModel(geometry);
        } else if (url.endsWith(".obj")) {
          loader = new OBJLoader();
          const object = await loader.loadAsync(url);
          if (active) setModel(object);
        } else if (url.endsWith(".fbx")) {
          loader = new FBXLoader();
          const fbx = await loader.loadAsync(url);
          if (active) setModel(fbx);
        }
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadModel();

    return () => {
      active = false;
    };
  }, [url]);

  if (!model) return null;

  return (
    <group position-y={-0.5}>
      <Center>
        <Ground />
        <Preload />
        {model instanceof THREE.BufferGeometry ? (
          <mesh geometry={model} material={material} />
        ) : (
          <primitive object={model} />
        )}
      </Center>
    </group>
  );
};

const Light = React.memo(() => {
  const [lightIntensity, setLightIntensity] = useState(2);
  const [lightColor, setLightColor] = useState(0xbbbaaa);

  useEffect(() => {
    socket.on("settings_update", (data) => {
      // console.log("Settings updated:", data);
      setLightIntensity(data.lightIntensity);
      // Convert hex color to 0x format
      const color = parseInt(data.lightColor.replace("#", "0x"), 16);
      setLightColor(color);
    });
    return () => {
      socket.off("settings_update");
    };
  }, []);

  return (
    <directionalLight
      position={[15, 15, 0]}
      color={lightColor}
      intensity={lightIntensity}
    />
  );
});

export default function ModelPage() {
  const cameraRef = useRef<any>(null);
  const [models, setModels] = useState<string[]>([]);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const switchInterval = 5000;

  if (cameraRef.current) {
    cameraRef.current.position.set(15, 15, 0); // Camera position
    cameraRef.current.lookAt(0, 0, 0); // Look at the origin where the model is centered
  }

  // useEffect(() => {
  //   // Ensure the camera is facing the model (look at the center of the scene)
  //   if (cameraRef.current) {
  //     cameraRef.current.position.set(15, 15, 0); // Camera position
  //     cameraRef.current.lookAt(0, 0, 0); // Look at the origin where the model is centered
  //   }
  // }, [currentModelIndex]);

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
            (file) =>
              file.name.endsWith(".glb") ||
              file.name.endsWith(".gltf") ||
              file.name.endsWith(".stl"),
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
          (file) =>
            file.name.endsWith(".glb") ||
            file.name.endsWith(".gltf") ||
            file.name.endsWith(".stl"),
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
    // console.log("AS:", autoSwitch);
    if (models.length > 1 && autoSwitch) {
      const interval = setInterval(() => {
        setCurrentModelIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % models.length;
          return nextIndex;
        });
      }, switchInterval);

      return () => clearInterval(interval);
    }
  }, [models, autoSwitch]);

  useEffect(() => {
    socket.on("camera_update", (data) => {
      if (cameraRef.current) {
        const position = new THREE.Vector3(...data.position);
        cameraRef.current.position.copy(position);

        // Apply rotation
        const rotation = new THREE.Quaternion(...data.rotation);
        cameraRef.current.quaternion.copy(rotation);

        if (data.zoom !== undefined) {
          cameraRef.current.zoom = data.zoom;
          cameraRef.current.updateProjectionMatrix();
        }
      }
    });

    return () => {
      socket.off("camera_update");
    };
  }, []);

  useEffect(() => {
    socket.on("settings_update", (data) => {
      // console.log("Settings updated:", data);
      setAutoSwitch(data.autoSwitch);
      console.log("Model index:", data.currentModelIndex);
      setCurrentModelIndex(data.currentModelIndex);
    });
    return () => {
      socket.off("settings_update");
    };
  }, []);

  return (
    <div className="bg-deepBlack relative flex h-screen flex-col">
      <div className="z-40 flex-1">
        <Canvas>
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            // position={[15, 15, 0]}
            zoom={1}
          />
          <Light />
          <ambientLight />
          <Suspense fallback={<TorusLoad colors={TORUS_COMBINATIONS.color1} />}>
            {!loading && models.length > 0 ? (
              <Model url={models[currentModelIndex]} />
            ) : (
              <TorusLoad colors={TORUS_COMBINATIONS.color2} />
            )}
          </Suspense>
        </Canvas>
      </div>
      <Footer />
    </div>
  );
}
