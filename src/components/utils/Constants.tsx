import * as THREE from "three";

export const { DEG2RAD } = THREE.MathUtils;
export const DEGREES_THETA = [
  {
    id: "45",
    value: 45,
    label: "+45º",
  },
  {
    id: "-45",
    value: -45,
    label: "-45º",
  },
  {
    id: "90",
    value: 90,
    label: "+90º",
  },
  {
    id: "-90",
    value: -90,
    label: "-90º",
  },
];
export const DEGREES_PHI = [
  {
    id: "20",
    value: 20,
    label: "+20º",
  },
  {
    id: "-20",
    value: -20,
    label: "-20º",
  },
  {
    id: "40",
    value: 40,
    label: "+40º",
  },
  {
    id: "-40",
    value: -40,
    label: "-40º",
  },
];
export const AXIS_TRUCK = [
  {
    id: "right",
    value1: 1,
    value2: 0,
    label: "RIGHT",
  },
  {
    id: "left",
    value1: -1,
    value2: 0,
    label: "LEFT",
  },
  {
    id: "up",
    value1: 0,
    value2: -1,
    label: "UP",
  },
  {
    id: "down",
    value1: 0,
    value2: 1,
    label: "DOWN",
  },
];

const ORIGINAL_CAMERA_POSITION = new THREE.Vector3(15, 15, 0); // Store original camera position
export const ORIGINAL_DISTANCE = ORIGINAL_CAMERA_POSITION.length(); // Calculate original distance from [0,0,0]

export const TORUS_COMBINATIONS = {
  color1: ["#FF00FF", "#66FFCC", "#00FFFF"],
  color2: ["#FF2B34", "#82D5B8", "#EED7CB"],
};
