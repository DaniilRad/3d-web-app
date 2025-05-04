import { Ground } from "@/components/regular/Ground";
import { Center, Preload } from "@react-three/drei";
import React, { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader, STLLoader, OBJLoader, FBXLoader } from "three/examples/jsm/Addons.js";

export interface ModelProps {
  url: string;
  targetSize?: number;
  groundLevel?: number;
}

export const Model: React.FC<ModelProps> = ({
  url, targetSize = 3.5, groundLevel = 0,
}) => {
  const [model, setModel] = useState<
    THREE.Object3D | THREE.BufferGeometry | null
  >(null);
  const [material] = useState(
    () => new THREE.MeshStandardMaterial({ color: "#fef" })
  );
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let loader: any;
    let active = true;
    console.log("Loading model from URL:", url);
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
        console.log("Loader used:", loader.constructor.name);
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
    [groundLevel]
  );

  const processGeometry = useCallback(
    (geometry: THREE.BufferGeometry, size: number) => {
      const box = new THREE.Box3().setFromBufferAttribute(
        geometry.attributes.position as THREE.BufferAttribute
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
          position.getY(i) * scale + (groundLevel - lowestPoint)
        );
        position.setZ(i, position.getZ(i) * scale);
      }
      position.needsUpdate = true;

      return scaledGeometry;
    },
    [groundLevel]
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
              receiveShadow />
          ) : (
            <primitive object={model} />
          )}
        </group>
      </Center>
    </group>
  );
};
