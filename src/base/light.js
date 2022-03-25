import * as THREE from "three";

import { debug } from "./gui";
import { levelParameters } from "../objects/level";

const light = new THREE.Group();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

const lightFolder = debug.addFolder("Light");
lightFolder.add(ambientLight, "intensity").min(0).max(1).step(0.01);

const directionalLight = new THREE.DirectionalLight(0xaaaaff, 0.5);
directionalLight.position.set(5, 12, -12);
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.bottom = -15;
directionalLight.shadow.camera.left = -levelParameters.size;
directionalLight.shadow.camera.right = levelParameters.size;
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);

lightFolder.add(directionalLight.position, "x").name("Directional Light x").min(-20).max(20).step(0.01);
lightFolder.add(directionalLight.position, "y").name("Directional Light y").min(-20).max(20).step(0.01);
lightFolder.add(directionalLight.position, "z").name("Directional Light z").min(-20).max(20).step(0.01);
lightFolder.close();

light.add(directionalLight, ambientLight);

export default light;
