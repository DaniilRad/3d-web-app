import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { CustomSky } from "./CustomSky";
import { Suspense, useEffect, useState } from "react";
import { Box3, Vector3 } from "three";
import { handleLoadModel } from "../utils/api";

const Viewer = ({ modelUrl }: { modelUrl: string | null }) => {
  const [awsUrl, setAwsUrl] = useState("");
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!modelUrl) return; // Prevent fetching if modelUrl is null

    const fetchModel = async () => {
      try {
        const loadedUrl = await handleLoadModel(modelUrl);
        if (loadedUrl) {
          setPreviousUrl(awsUrl); // Store the current model before updating
          setAwsUrl(loadedUrl);
        }
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    fetchModel();

    return () => {
      if (previousUrl) {
        useGLTF.clear(previousUrl); // ✅ Clear only the old model after switching
      }
    };
  }, [modelUrl]);

  return (
    <Canvas
      key={modelUrl}
      shadows
      className="bg-transparent"
      camera={{ near: 0.1, far: 1000, position: [15, 8, 15] }}
    >
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={3.0}
        target={[0, 5, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.15}
      />
      <CustomSky />
      <Stage preset={"upfront"} intensity={2} environment={"city"}>
        <Suspense>
          {!awsUrl ? <mesh /> : <Model key={awsUrl} url={awsUrl} />}
        </Suspense>
      </Stage>
    </Canvas>
  );
};

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);

  const box = new Box3().setFromObject(scene);
  const size = new Vector3();
  box.getSize(size);

  const maxDimension = Math.max(size.x, size.y, size.z);
  const scaleFactor = 10 / maxDimension;
  scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
  scene.position.set(0, -size.y / 2, 0);

  return <primitive object={scene} />;
};

export default Viewer;
