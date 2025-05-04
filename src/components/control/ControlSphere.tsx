import { GradientTexture, GradientType } from "@react-three/drei";

export const ControlSphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial toneMapped={false}>
        <GradientTexture
          stops={[0.2, 0.5, 0.8]}
          colors={["#EBEDF2", "#00FFFF", "#AACCAA"]}
          size={1024}
          type={GradientType.Linear}
        />
      </meshBasicMaterial>
    </mesh>
  );
};
