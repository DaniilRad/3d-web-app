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
    ambientIntensity: 0.4,
    shadowIntensity: 0.3,
  });

  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const hemisphereLightRef = useRef<THREE.HemisphereLight>(null);

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
      <ambientLight
        intensity={lightSettings.ambientIntensity}
        color={0xffffff}
      />

      {/* Natural environment light */}
      <hemisphereLight
        ref={hemisphereLightRef}
        color={0xffffbb} // Sky color
        groundColor={0xffffbb} // Ground reflection
        intensity={0.4}
      />

      {/* Main directional light (sun) */}
      <directionalLight
        ref={directionalLightRef}
        color={lightSettings.color}
        intensity={lightSettings.intensity - 1}
        position={[5, 10, 7]}
        castShadow
      />

      {/* Soft backlight to reduce contrast */}
      <directionalLight
        color={0xffffff}
        intensity={lightSettings.shadowIntensity - 1}
        position={[-5, 5, -5]}
      />

      {/* Subtle rim light for model definition */}
      <directionalLight
        color={0xffffff}
        intensity={lightSettings.intensity - 0.3}
        position={[0, 5, -10]}
      />

      {/* Sky for natural lighting */}
      <Sky
        distance={1000}
        sunPosition={[5, 5, 7]} // Keep sun position consistent with your lights
        inclination={0.55} // Slightly higher makes the horizon darker
        azimuth={0.15} // Controls sun rotation (keep as is)
        mieCoefficient={0.008} // Increased for more atmospheric scattering
        mieDirectionalG={0.92} // Increased for sharper sun glow
        rayleigh={0.6} // Reduced to darken the blue sky
        turbidity={5} // Added for more atmospheric haze
      />
    </>
  );
};
