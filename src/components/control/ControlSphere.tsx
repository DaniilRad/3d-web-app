import { GradientTexture, GradientType } from "@react-three/drei";

export const ControlSphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial toneMapped={false}>
        <GradientTexture
          stops={[0.2, 0.6, 0.9]}
          colors={["#ff00ff", "#66ffcc", "#00ffff"]}
          size={1024}
          type={GradientType.Radial}
        />
      </meshBasicMaterial>
    </mesh>
  );
};
