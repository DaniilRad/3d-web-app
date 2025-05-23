import { Grid } from "@react-three/drei";

export const Ground = () => {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: "#6f6f6f",
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: "#9d4b4b",
    fadeDistance: 200,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };
  return (
    <>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[200, 64]} />
        <meshPhongMaterial color="black" />
      </mesh>
      <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
    </>
  );
};
