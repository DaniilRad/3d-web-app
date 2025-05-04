import { GroundTexture } from "./GroundTexture";

type GroundPreset = "grass" | "sand" | "concrete";

export interface GroundPresetProps {
  preset: GroundPreset;
}

export const GroundPreset: React.FC<GroundPresetProps> = ({ preset }) => {
  const presetTextures: Record<GroundPreset, string> = {
    grass: "/src/assets/Grass005_1K-JPG/Grass005_1K-JPG_Color.jpg",
    sand: "/textures/sand.jpg",
    concrete: "/textures/concrete.jpg",
  };

  const textureUrl = presetTextures[preset] || presetTextures["grass"];

  console.log(textureUrl);

  return <GroundTexture textureUrl={""} />;
};
