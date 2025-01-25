import * as React from "react";
import { ReactThreeFiber } from "@react-three/fiber";
import { Vector3 } from "three";
import { Sky } from "@react-three/drei";

type Props = {
  distance?: number;
  sunPosition?: ReactThreeFiber.Vector3;
  inclination?: number;
  azimuth?: number;
  mieCoefficient?: number;
  mieDirectionalG?: number;
  rayleigh?: number;
  turbidity?: number;
  lightDistance?: number;
};

export function calcPosFromAngles(
  inclination: number,
  azimuth: number,
  vector: Vector3 = new Vector3()
) {
  const theta = Math.PI * (inclination - 0.45);
  const phi = 2 * Math.PI * (azimuth - 0.45);

  vector.x = Math.cos(phi);
  vector.y = Math.sin(theta);
  vector.z = Math.sin(phi);

  return vector;
}

export function calcScaledSunPosition(
  inclination: number,
  azimuth: number,
  distance: number,
  vector: Vector3 = new Vector3()
) {
  calcPosFromAngles(inclination, azimuth, vector);
  vector.multiplyScalar(distance);
  return vector;
}

export const CustomSky: React.FC<Props> = ({
  inclination = 0.6,
  azimuth = 0.3,
  distance = 450000,
  mieCoefficient = 0.005,
  mieDirectionalG = 0.7,
  rayleigh = 0.1,
  turbidity = 0.5,
  lightDistance = 100,
  ...props
}) => {
  // const lightRef = React.useRef<THREE.DirectionalLight>(null);

  // Use the helper unconditionally, but it won't throw an error if `lightRef.current` is null.
  // useHelper(
  //   lightRef as React.MutableRefObject<THREE.DirectionalLight>,
  //   DirectionalLightHelper,
  //   5,
  //   "red"
  // );

  const sunPosition = calcPosFromAngles(inclination, azimuth);
  const scaledSunPosition = calcScaledSunPosition(inclination, azimuth, lightDistance);


  return (
    <>
      <Sky
        inclination={inclination}
        azimuth={azimuth}
        distance={distance}
        mieCoefficient={mieCoefficient}
        mieDirectionalG={mieDirectionalG}
        rayleigh={rayleigh}
        turbidity={turbidity}
        sunPosition={sunPosition}
        {...props}
      />
      <directionalLight
        // ref={lightRef}
        position={scaledSunPosition}
        intensity={5}
        castShadow
        receiveShadow
      />
    </>
  );
};
