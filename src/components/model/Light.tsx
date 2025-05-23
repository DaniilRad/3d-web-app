import { socket } from "@/main";
import { Environment, useHelper } from "@react-three/drei";
import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { ENV_LIGHT_PRESETS } from "../utils/Constants";
import { EXRLoader } from "three/examples/jsm/Addons.js";

export interface LightProps {
  isHelper: boolean;
  envFolder: string;
}

export const Light: React.FC<LightProps> = ({ isHelper, envFolder }) => {
  const [lightSettings, setLightSettings] = useState({
    intensity: 1.2,
    color: 0xfff4e6,
    hemiIntesity: 1,
  });
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null);

  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  const updateSetting = (key: string, value: any) => {
    setLightSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const preset = ENV_LIGHT_PRESETS[envFolder];
    if (preset) {
      updateSetting("intensity", preset.spotIntensity);
      updateSetting("color", preset.color);
      updateSetting("hemiIntensity", preset.hemiIntensity);
    }
    socket;
  }, [envFolder]);

  // useEffect(() => {
  //   const loader = new THREE.TextureLoader();
  //   const jpgUrl = `https://3d-web-models-bucket.s3.eu-north-1.amazonaws.com/enviroment/${envFolder}/${envFolder}.jpg`;

  //   loader.load(jpgUrl, (texture) => {
  //     texture.mapping = THREE.EquirectangularReflectionMapping;
  //     setEnvMap(texture);
  //   });
  // }, []);

  // useEffect(() => {
  //   const loader = new THREE.TextureLoader();
  //   const jpgUrl = `https://3d-web-models-bucket.s3.eu-north-1.amazonaws.com/enviroment/${envFolder}/${envFolder}.jpg`;
  //   console.log("used env: " + jpgUrl);

  //   loader.load(jpgUrl, (texture) => {
  //     texture.mapping = THREE.EquirectangularReflectionMapping;
  //     setEnvMap(texture);
  //   });
  // }, [envFolder]);

  useEffect(() => {
    const texturePath = `https://3d-web-models-bucket.s3.eu-north-1.amazonaws.com/enviroment/${envFolder}/${envFolder}`;
    const exrUrl = `${texturePath}.exr`;
    const jpgUrl = `${texturePath}.jpg`;

    const exrLoader = new EXRLoader();
    const textureLoader = new THREE.TextureLoader();

    const tryLoadEnvironment = async () => {
      try {
        const exr = await exrLoader.loadAsync(exrUrl);
        exr.mapping = THREE.EquirectangularReflectionMapping;
        setEnvMap(exr);
        console.log("✅ Loaded EXR HDRI:", exrUrl);
      } catch (exrErr) {
        console.warn("⚠️ EXR not found, falling back to JPG:", exrErr);

        try {
          const jpg = await textureLoader.loadAsync(jpgUrl);
          jpg.mapping = THREE.EquirectangularReflectionMapping;
          setEnvMap(jpg);
          console.log("✅ Loaded JPG HDRI:", jpgUrl);
        } catch (jpgErr) {
          console.error("❌ Failed to load both EXR and JPG:", jpgErr);
        }
      }
    };

    tryLoadEnvironment();
  }, [envFolder]);

  const lightRef = useRef<THREE.DirectionalLight>(null);
  useEffect(() => {
    if (isHelper && lightRef.current) {
      useHelper(
        lightRef as React.RefObject<THREE.Object3D>,
        THREE.DirectionalLightHelper,
        4,
        "green",
      );
    }
  }, [isHelper, lightRef]);

  useEffect(() => {
    socket.on("settings_update", (data) => {
      updateSetting("intensity", data.lightIntensity);
      const color = parseInt(data.lightColor.replace("#", "0x"), 16);
      updateSetting("color", color);
    });
    return () => {
      socket.off("settings_update");
    };
  }, []);

  return (
    <>
      <spotLight
        ref={directionalLightRef}
        position={[5, 10, 7]}
        angle={Math.PI / 6}
        penumbra={0.5}
        castShadow
        intensity={lightSettings.intensity}
        color={lightSettings.color}
      />
      <hemisphereLight
        color={lightSettings.color}
        groundColor={lightSettings.color}
        intensity={lightSettings.hemiIntesity}
      />

      {envMap && <Environment map={envMap} background />}
    </>
  );
};
