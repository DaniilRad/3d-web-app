import { Grid } from "@react-three/drei";

export const Ground = () => {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: "#AACCAA",
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: "#00FFFF",
    fadeDistance: 100,
    fadeStrength: 1,
    fadeFrom: 1,
    followCamera: false,
    infiniteGrid: true,
  };
  return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />;
};
