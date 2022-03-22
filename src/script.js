import "./style.css";
import * as THREE from "three";

import camera, { sizes } from "./base/camera";
import Game from "./base/game";
import light from "./base/light";
import scene from "./base/scene";
import { onLoad, loadingManager } from "./base/loader";

// Canvas
const canvas = document.querySelector("canvas.webgl");

scene.add(light, camera);
const game = new Game();

loadingManager.onLoad = () => {
  onLoad();
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  game.updateAim();
  game.updateCamera();
  game.attackPlayer(elapsedTime);
  game.player.walk(deltaTime);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
