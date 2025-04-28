import { Center, PerspectiveCamera, Preload, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  targetSize?: number;
  groundLevel?: number;
}

const Model: React.FC<ModelProps> = ({
  url,
  targetSize = 3.5,
  groundLevel = 0,
}) => {
  const [model, setModel] = useState<
    THREE.Object3D | THREE.BufferGeometry | null
  >(null);
  const [material] = useState(
    () => new THREE.MeshStandardMaterial({ color: "#fef" }),
  );
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let loader: any;
    let active = true;

    const loadModel = async () => {
      try {
        if (url.endsWith(".gltf") || url.endsWith(".glb")) {
          loader = new GLTFLoader();
          const gltf = await loader.loadAsync(url);
          if (!active) return;
          const processedModel = processModel(gltf.scene, targetSize);
          setModel(processedModel);
        } else if (url.endsWith(".stl")) {
          loader = new STLLoader();
          const geometry = await loader.loadAsync(url);
          if (!active) return;
          const processedGeometry = processGeometry(geometry, targetSize);
          setModel(processedGeometry);
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

  const processModel = useCallback(
    (model: THREE.Object3D, size: number) => {
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      const boxSize = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(boxSize);

      const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
      const scale = size / maxDim;

      // Calculate the lowest point of the model
      const lowestPoint = box.min.y * scale;
      const modelX = model.position.x;
      const modelZ = model.position.z;
      // Position model so its bottom sits exactly at groundLevel
      model.position.set(modelX, groundLevel - lowestPoint, modelZ);
      model.scale.set(scale, scale, scale);

      return model;
    },
    [groundLevel],
  );

  const processGeometry = useCallback(
    (geometry: THREE.BufferGeometry, size: number) => {
      const box = new THREE.Box3().setFromBufferAttribute(
        geometry.attributes.position as THREE.BufferAttribute,
      );
      const center = new THREE.Vector3();
      const boxSize = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(boxSize);

      const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
      const scale = size / maxDim;
      const lowestPoint = box.min.y * scale;

      // Clone geometry and apply scaling/positioning
      const scaledGeometry = geometry.clone();
      const position = scaledGeometry.attributes.position;

      for (let i = 0; i < position.count; i++) {
        position.setX(i, position.getX(i) * scale);
        position.setY(
          i,
          position.getY(i) * scale + (groundLevel - lowestPoint),
        );
        position.setZ(i, position.getZ(i) * scale);
      }
      position.needsUpdate = true;

      return scaledGeometry;
    },
    [groundLevel],
  );

  if (!model) return null;

  return (
    <group position-y={-0.5}>
      <Center>
        <Ground />
        <Preload />
        <group ref={groupRef}>
          {model instanceof THREE.BufferGeometry ? (
            <mesh
              geometry={model}
              material={material}
              castShadow
              receiveShadow
            />
          ) : (
            <primitive object={model} />
          )}
        </group>
      </Center>
    </group>
  );
};

const Light = React.memo(() => {
  const [lightIntensity, setLightIntensity] = useState(2);
  const [lightColor, setLightColor] = useState(0xbbbaaa);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  // useHelper(
  //   lightRef as React.RefObject<THREE.Object3D>,
  //   THREE.DirectionalLightHelper,
  //   4,
  //   "green",
  // );
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
    <>
      <ambientLight
        intensity={lightIntensity * 2}
        color={lightColor}
        castShadow
      />
      <directionalLight
        castShadow
        ref={lightRef}
        color={"#ffffff"}
        intensity={lightIntensity}
        position={[10, 10, 0]}
      />
      <Sky azimuth={0.9} inclination={0.5} rayleigh={2} />
    </>
  );
});

export default function ModelPage() {
  const cameraRef = useRef<any>(null);
  const [models, setModels] = useState<
    { url: string; author: string; name: string }[]
  >([]);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const switchInterval = 5000;

  if (cameraRef.current) {
    cameraRef.current.position.set(15, 15, 0); // Camera position
    cameraRef.current.lookAt(0, 0, 0); // Look at the origin where the model is centered
  }

  useEffect(() => {
    const handleModelUploaded = (file: {
      fileName: string;
      modelUrl: string;
      author: string; // Add author information here
    }) => {
      window.alert(`📥 New model uploaded: ${file.fileName}`);

      setAutoSwitch(false); // Stop auto-switching

      // ✅ Step 1: Request the updated list
      socket.emit("get_files");

      // ✅ Step 2: Wait for the updated list and then select the new model
      socket.once(
        "files_list",
        (fileList: { name: string; url: string; author: string }[]) => {
          const modelUrls = fileList
            .filter(
              (file) =>
                file.name.endsWith(".glb") ||
                file.name.endsWith(".gltf") ||
                file.name.endsWith(".stl"),
            )
            .map((file) => ({
              url: file.url, // The model's URL
              author: file.author, // The author name
              name: file.name, // The model's name
            }));

          if (modelUrls.length > 0) {
            setModels(modelUrls); // ✅ Update models list with both URL and author
            setLoading(false); // ✅ Stop loading

            // ✅ Find the newly uploaded model in the updated list
            const newIndex = modelUrls.findIndex(
              (model) => model.url === file.modelUrl, // Compare the URL
            );
            console.log(`🔍 Found index: ${newIndex}`);

            if (newIndex !== -1) {
              setCurrentModelIndex(newIndex); // ✅ Select the new model
            }
          }
        },
      );
    };

    socket.on("model_uploaded", handleModelUploaded);

    return () => {
      socket.off("model_uploaded", handleModelUploaded);
    };
  }, []);

  useEffect(() => {
    // ✅ Initial fetch when the page loads
    socket.emit("get_files");

    socket.on(
      "files_list",
      (fileList: { name: string; url: string; author: string }[]) => {
        const modelUrls = fileList
          .filter(
            (file) =>
              file.name.endsWith(".glb") ||
              file.name.endsWith(".gltf") ||
              file.name.endsWith(".stl"),
          )
          .map((file) => ({
            url: file.url,
            author: file.author,
            name: file.name,
          }));

        if (modelUrls.length > 0) {
          setModels(modelUrls); // Update models list with both URL and author info
          setLoading(false);
        }
      },
    );

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
      console.log("Auto switch:", data.autoSwitch);
      console.log("Model index:", data.currentModelIndex);
      setCurrentModelIndex(data.currentModelIndex);
    });
    return () => {
      socket.off("settings_update");
    };
  }, []);

  return (
    <div className="relative flex h-screen flex-col">
      <div className="font-tech-mono text-mediumGray absolute z-50 flex h-fit w-full flex-row items-center justify-center gap-10 bg-black/50 px-4 py-6 text-[2rem] backdrop-blur-[30px] backdrop-saturate-[120%]">
        <p>Author: {models[currentModelIndex]?.author || "Unknown"}</p>
        <p>Model: {models[currentModelIndex]?.name || "Unknown"}</p>
      </div>

      <div className="z-40 flex-1">
        <Canvas>
          <PerspectiveCamera ref={cameraRef} makeDefault zoom={1} />
          {/* <Sky azimuth={1} inclination={0.5} rayleigh={3} ref={skyRef} /> */}
          <Light />
          <Suspense fallback={<TorusLoad colors={TORUS_COMBINATIONS.color1} />}>
            {!loading && models.length > 0 ? (
              <Model url={models[currentModelIndex].url} />
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
