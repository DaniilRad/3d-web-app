import { socket } from "@/main";
import { Sky, useHelper } from "@react-three/drei";
import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";

export interface LightProps {
  isHelper: boolean;
}


export const Light: React.FC<LightProps> = ({ isHelper }) => {
  const [lightIntensity, setLightIntensity] = useState(2);
  const [lightColor, setLightColor] = useState(0xbbbaaa);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  useEffect(() => {
    if (isHelper && lightRef.current) {
      useHelper(
        lightRef as React.RefObject<THREE.Object3D>,
        THREE.DirectionalLightHelper,
        4,
        "green"
      );
    }
  }, [isHelper, lightRef]);
  
  useEffect(() => {
    socket.on("settings_update", (data) => {
      // console.log("Settings updated:", data);
      setLightIntensity(data.lightIntensity);
      // Convert hex color to 0x format
      const color = parseInt(data.lightColor.replace("#", "0x"), 16);
      setLightColor(color);
    });
    return () => {
      socket.off("settings_update");
    };
  }, []);

  return (
    <>
      <ambientLight
        intensity={lightIntensity * 2}
        color={lightColor}
        castShadow />
      <directionalLight
        castShadow
        ref={lightRef}
        color={"#ffffff"}
        intensity={lightIntensity}
        position={[10, 10, 0]} />
      <Sky azimuth={0.9} inclination={0.5} rayleigh={2} />
    </>
  );
};
