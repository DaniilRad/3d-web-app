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
  color1: ["#EBEDF2", "#00FFFF", "#AACCAA"],
  color2: ["#FF2B34", "#00FFFF", "#AACCAA"],
};

export const TEXTURES = ["grass", "concrete", "chips", "sand"];
export const ENVIROMENTS = ["evening", "night", "overcast", "sunset"];

export const TXTR_MAP_PRESETS: Record<
  string,
  {
    displacementScale: number;
    displacementBias: number;
    aoMapIntensity?: number;
  }
> = {
  concrete: { displacementScale: 0.0, displacementBias: 0.0 },
  grass: { displacementScale: 0.5, displacementBias: -0.1 },
  sand: { displacementScale: 0.6, displacementBias: -0.2 },
  chipped: { displacementScale: 0.8, displacementBias: -0.3 },
};

export const ENV_LIGHT_PRESETS: Record<
  string,
  { spotIntensity: number; hemiIntensity: number; color: number }
> = {
  evening: { spotIntensity: 0.6, hemiIntensity: 0.2, color: 0xffd9a5 },
  night: { spotIntensity: 0.3, hemiIntensity: 0.1, color: 0x8899ff },
  overcast: { spotIntensity: 1.0, hemiIntensity: 0.6, color: 0xd8d8d8 },
  sunset: { spotIntensity: 0.8, hemiIntensity: 0.3, color: 0xffb07c },
};
