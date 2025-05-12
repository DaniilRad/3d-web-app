import { Ground } from "@/components/regular/Ground";
import { Center, Preload } from "@react-three/drei";
import React, { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import {
  GLTFLoader,
  STLLoader,
  OBJLoader,
  FBXLoader,
} from "three/examples/jsm/Addons.js";

export interface ModelProps {
  url: string;
  targetSize?: number;
  groundLevel?: number;
}

export const Model: React.FC<ModelProps> = ({
  url,
  targetSize = 3.5,

  groundLevel = 0,
}) => {
  const [model, setModel] = useState<
    THREE.Object3D | THREE.BufferGeometry | null
  >(null);
  const [groundMaterial, setGroundMaterial] =
    useState<THREE.MeshStandardMaterial | null>(null);

  const [material] = useState(
    () => new THREE.MeshStandardMaterial({ color: "#fef" }),
  );
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const texturePath = "/src/assets/Grass005_1K-JPG/";

    // Load all PBR textures
    Promise.all([
      loader.loadAsync(`${texturePath}Grass005_1K-JPG_Color.jpg`),
      loader.loadAsync(`${texturePath}Grass005_1K-JPG_NormalGL.jpg`),
      loader.loadAsync(`${texturePath}Grass005_1K-JPG_Roughness.jpg`),
      loader.loadAsync(`${texturePath}Grass005_1K-JPG_AmbientOcclusion.jpg`),
      loader.loadAsync(`${texturePath}Grass005_1K-JPG_Displacement.jpg`),
    ])
      .then(([colorMap, normalMap, roughnessMap, aoMap, displacementMap]) => {
        // Configure all textures
        [colorMap, normalMap, roughnessMap, aoMap, displacementMap].forEach(
          (map) => {
            map.wrapS = map.wrapT = THREE.RepeatWrapping;
            map.repeat.set(100, 100);
            map.anisotropy = 16; // Improves texture quality at oblique angles
          },
        );

        // Create material with all maps
        const material = new THREE.MeshStandardMaterial({
          map: colorMap, // Base color
          normalMap: normalMap, // Surface details
          normalScale: new THREE.Vector2(1, 1), // Adjust normal intensity
          roughnessMap: roughnessMap, // Surface smoothness
          roughness: 2, // Default roughness
          aoMap: aoMap, // Ambient occlusion
          aoMapIntensity: 1, // AO strength
          displacementMap: displacementMap, // Height displacement
          displacementScale: 0.2, // Increased for more visible grass variation
          displacementBias: -0.1,
          metalness: 0, // Non-metallic surface
          side: THREE.DoubleSide, // Render both sides
        });

        setGroundMaterial(material);
      })
      .catch((error) => {
        console.error("Error loading PBR textures:", error);
      });
  }, []);

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
        {/* <Ground /> */}
        {groundMaterial && (
          <mesh
            position={[0, groundLevel, 0]}
            rotation={[-Math.PI / 2, groundLevel, 0]}
            receiveShadow
            castShadow
          >
            <planeGeometry args={[500, 500, 128, 128]} />
            <primitive object={groundMaterial} attach="material" />
          </mesh>
        )}
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
