import { useLoader } from "@react-three/fiber";
import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export interface ModelProps {
  url: string;
  preload?: boolean;
}

export const Model: React.FC<ModelProps> = ({ url, preload = false }) => {
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

  if (!scaledScene) return null;
  return <primitive object={scaledScene} />;
};
