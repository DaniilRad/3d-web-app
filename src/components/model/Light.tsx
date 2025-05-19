import { socket } from "@/main";
import { Sky, useHelper } from "@react-three/drei";
import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";

export interface LightProps {
  isHelper: boolean;
}

export const Light: React.FC<LightProps> = ({ isHelper }) => {
  const [lightSettings, setLightSettings] = useState({
    intensity: 1.2,
    color: 0xfff4e6, // Warm white with slight orange tint
  });

  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  const updateSetting = (key: string, value: any) => {
    setLightSettings((prev) => ({ ...prev, [key]: value }));
  };

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
      // console.log("Settings updated:", data);
      updateSetting("intensity", data.lightIntensity);
      // Convert hex color to 0x format
      const color = parseInt(data.lightColor.replace("#", "0x"), 16);
      updateSetting("color", color);
    });
    return () => {
      socket.off("settings_update");
    };
  }, []);

  return (
    <>
      {/* Base ambient fill light */}
      {/* <ambientLight intensity={3} color={lightSettings.color} castShadow /> */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 10, 7]}
        castShadow
        color={lightSettings.color}
        intensity={lightSettings.intensity}
      />
      <hemisphereLight castShadow color={lightSettings.color} />
      <Sky azimuth={0.9} inclination={0.5} rayleigh={2} />
    </>
  );
};
