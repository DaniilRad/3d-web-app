import * as THREE from "three";

import { useLoader } from "@react-three/fiber";

export interface GroundTextureProps {
  textureUrl: string;
}

export const GroundTexture: React.FC<GroundTextureProps> = ({ textureUrl }) => {
  // const [cm, dm, nm, rm, am] = useTexture(
  console.log(textureUrl);
  const texture = useLoader(
    THREE.TextureLoader,
    "/src/assets/Ground080_4K-JPG/Ground080_4K-JPG_Color.jpg",
  );
  //   "/src/assets/Ground080_4K-JPG/Ground080_4K-JPG_Displacement.jpg",
  //   "/src/assets/Ground080_4K-JPG/Ground080_4K-JPG_NormalGL.jpg",
  //   "/src/assets/Ground080_4K-JPG/Ground080_4K-JPG_Roughness.jpg",
  //   "/src/assets/Ground080_4K-JPG/Ground080_4K-JPG_AmbientOcclusion.jpg",
  // ]);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  texture.repeat.set(50, 50);

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[100, 100]} /> {/* large plane */}
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};
