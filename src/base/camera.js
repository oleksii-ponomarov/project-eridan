import * as THREE from "three";

import { debug } from "./gui";

export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export let cameraParameters = {
  playerHeight: 1.86,
  playerCrawlHeight: 0.5,
  mouseSensitivity: 0.3,
  zeroZone: 0,
};

export const cursor = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  150
);
camera.rotation.order = "YXZ";
camera.rotation.y = Math.PI;

export const listener = new THREE.AudioListener();
camera.add(listener);

debug
  .add(cameraParameters, "playerHeight")
  .min(0.2)
  .max(2)
  .step(0.01)
  .onChange(() => (camera.position.y = parameters.playerHeight));
debug.add(cameraParameters, "mouseSensitivity").min(0.001).max(1).step(0.001);
debug.add(cameraParameters, "zeroZone").min(0).max(0.5).step(0.01);

export default camera;
