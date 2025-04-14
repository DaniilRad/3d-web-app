import { GradientTexture, GradientType } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const TorusLoad = ({ colors }: { colors: string[] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    // Rotate the torus knot
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.08;
      meshRef.current.rotation.y += 0.08;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[0.7, 0.25, 64, 64]} />
      <meshBasicMaterial toneMapped={false}>
        <GradientTexture
          stops={[0.2, 0.6, 0.9]}
          colors={[colors[0], colors[1], colors[2]]}
          size={1024}
          type={GradientType.Radial}
        />
      </meshBasicMaterial>
    </mesh>
  );
};
