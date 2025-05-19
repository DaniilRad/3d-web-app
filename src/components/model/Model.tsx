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
  textureFolder: string;
}

export const Model: React.FC<ModelProps> = ({
  url,
  targetSize = 3.5,
  groundLevel = 0,
  textureFolder = "grass",
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

  // useEffect(() => {
  //   const loader = new THREE.TextureLoader();
  //   const texturePath = `/src/assets/${groundFolder}/`;

  //   // Load all PBR textures
  //   Promise.all([
  //     loader.loadAsync(`${texturePath}color.jpg`),
  //     loader.loadAsync(`${texturePath}nrml.jpg`),
  //     loader.loadAsync(`${texturePath}rough.jpg`),
  //     loader.loadAsync(`${texturePath}ao.jpg`),
  //     loader.loadAsync(`${texturePath}disp.jpg`),
  //     loader.loadAsync(`${texturePath}metal.jpg`),
  //   ])
  //     .then(([colorMap, normalMap, roughnessMap, aoMap, displacementMap, metalness]) => {
  //       // Configure all textures
  //       [colorMap, normalMap, roughnessMap, aoMap, displacementMap, metalness].forEach(
  //         (map) => {
  //           map.wrapS = map.wrapT = THREE.RepeatWrapping;
  //           map.repeat.set(50, 50);
  //           map.anisotropy = 16;
  //           map.needsUpdate = true;
  //         },
  //       );

  //       // Create material with all maps
  //       const material = new THREE.MeshStandardMaterial({
  //         map: colorMap,
  //         normalMap: normalMap,
  //         normalScale: new THREE.Vector2(1, 1),
  //         roughnessMap: roughnessMap,
  //         roughness: 5,
  //         aoMap: aoMap,
  //         aoMapIntensity: 3,
  //         displacementMap: displacementMap,
  //         displacementScale: 0.8,
  //         displacementBias: -0.1,
  //         metalness: 0,
  //         side: THREE.DoubleSide,
  //       });
  //       setGroundMaterial(material);
  //     })
  //     .catch((error) => {
  //       console.error("Error loading PBR textures:", error);
  //     });
  // }, []);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    // const texturePath = `/src/assets/${textureFolder}/`;
    const texturePath = `https://3d-web-models-bucket.s3.eu-west-1.amazonaws.com/textures/${textureFolder}/`;

    // Define expected maps with keys matching material options
    const textureFiles: Record<string, string[]> = {
      map: ["color.jpg"],
      normalMap: ["nrml.jpg"],
      roughnessMap: ["rough.jpg"],
      aoMap: ["ao.jpg"],
      displacementMap: ["disp.jpg", "disp.tiff"],
      metalnessMap: ["metal.jpg"],
    };

    const loadedTextures: Record<string, THREE.Texture> = {};

    const loadTextureIfExists = async (
      key: string,
      filenames: string[],
    ): Promise<void> => {
      for (const filename of filenames) {
        try {
          const url = `${texturePath}${filename}`;
          const res = await fetch(url);
          if (!res.ok) continue;

          const texture = await loader.loadAsync(url);
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(50, 50);
          texture.anisotropy = 16;
          texture.needsUpdate = true;

          loadedTextures[key] = texture;
          break; // Stop after first valid texture
        } catch (err) {
          console.warn(`Skipping ${key} (${filename}) - ${err}`);
        }
      }
    };

    (async () => {
      await Promise.all(
        Object.entries(textureFiles).map(([key, filenames]) =>
          loadTextureIfExists(key, filenames),
        ),
      );

      const material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        metalness: 0.2,
        roughness: 1,
        ...loadedTextures,
        displacementScale: 0.8,
        displacementBias: -0.35,
        aoMapIntensity: 3,
      });

      setGroundMaterial(material);
    })();
  }, [textureFolder]);

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

      for (let i = 0; i < position.count; i++) {
        position.setX(i, position.getX(i) - center.x); // Vycentruje geometriu
        position.setY(i, position.getY(i) - center.y); // Vycentruje geometriu
        position.setZ(i, position.getZ(i) - center.z); // Vycentruje geometriu
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
            <planeGeometry args={[500, 500, 1024, 1024]} />
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
