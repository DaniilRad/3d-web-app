import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { CustomSky } from "./CustomSky";
import { Suspense } from "react";
import { Box3, Vector3 } from "three";

const Viewer = ({ modelUrl }: { modelUrl: string | null }) => {
  console.log("Model URL in Viewer:", modelUrl);

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
        <Suspense>{!modelUrl ? <mesh /> : <Model url={modelUrl} />}</Suspense>
      </Stage>
    </Canvas>
  );
};

const Model = ({ url }: { url: string }) => {
  // try {
  const gltf = useGLTF(url);

  console.log("GLTF:", gltf);

  // console.log("GLTF successfully loaded:", gltf);

  // Calculate the bounding box and adjust scale
  const box = new Box3().setFromObject(gltf.scene);
  const size = new Vector3();
  box.getSize(size);

  const maxDimension = Math.max(size.x, size.y, size.z);
  const scaleFactor = 10 / maxDimension; // Scale to a max dimension of 10
  gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

  gltf.scene.position.set(0, -size.y / 2, 0); // Center the model vertically

  return <primitive object={gltf.scene} />;
};

export default Viewer;
