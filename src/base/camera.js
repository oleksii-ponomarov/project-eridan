import * as THREE from "three";

import gui from "./gui";

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
camera.position.y = cameraParameters.playerHeight;
camera.position.z = 2;

gui
  .add(cameraParameters, "playerHeight")
  .min(0.2)
  .max(2)
  .step(0.01)
  .onChange(() => (camera.position.y = parameters.playerHeight));
gui.add(cameraParameters, "mouseSensitivity").min(0.001).max(1).step(0.001);
gui.add(cameraParameters, "zeroZone").min(0).max(0.5).step(0.01);

export const updateCamera = () => {
  if (
    cursor.x > cameraParameters.zeroZone ||
    cursor.x < -cameraParameters.zeroZone
  ) {
    camera.rotation.y -= cursor.x * cameraParameters.mouseSensitivity;
    camera.rotation.y = camera.rotation.y % (Math.PI * 2);
  }

  if (
    cursor.y > cameraParameters.zeroZone ||
    cursor.y < -cameraParameters.zeroZone
  ) {
    const newRotationX =
      camera.rotation.x + cursor.y * cameraParameters.mouseSensitivity;
    if (newRotationX < Math.PI * 0.5 && newRotationX > -Math.PI * 0.5) {
      camera.rotation.x = newRotationX;
    }
  }
};

export default camera;
