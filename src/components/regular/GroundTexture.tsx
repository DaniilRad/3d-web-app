import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { Plane, useTexture } from "@react-three/drei";

export interface GroundTextureProps {
  textureUrl: string;
}

export const GroundTexture: React.FC<GroundTextureProps> = ({ textureUrl }) => {
  const [cm, dm, nm, rm, am] = useTexture([
    "/src/assets/Ground080_4K-JPG/Ground080_4K-JPG_Color.jpg",
    "/src/assets/Ground080_4K-JPG/Ground080_4K-JPG_Displacement.jpg",
    "/src/assets/Ground080_4K-JPG/Ground080_4K-JPG_NormalGL.jpg",
    "/src/assets/Ground080_4K-JPG/Ground080_4K-JPG_Roughness.jpg",
    "/src/assets/Ground080_4K-JPG/Ground080_4K-JPG_AmbientOcclusion.jpg",
  ]);

  return (
    <>
      {/* {Array.from({ length: 100 }, (_, i) =>
        Array.from({ length: 100 }, (_, j) => (
          <mesh
            key={`${i}-${j}`}
            position={[i * 10, 0, j * 10]}
            rotation-x={-Math.PI / 2}
          >
            <planeGeometry args={[10, 10, 100, 100]} />
            <meshStandardMaterial
              map={cm}
              displacementMap={dm}
              normalMap={nm}
              roughnessMap={rm}
              aoMap={am}
            />
          </mesh>
        )),
      )} */}
    </>
  );
};
