import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import { memo } from "react";

export const Shadows = memo(() => (
  <AccumulativeShadows temporal frames={100} colorBlend={0.5} scale={20}>
    <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
  </AccumulativeShadows>
));
