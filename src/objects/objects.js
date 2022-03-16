import * as THREE from "three";

import material from "./material";

const sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), material);
sphere.position.x = -6;
sphere.position.z = -5;
sphere.position.y = 3;

const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material);
cube.position.z = -5;
cube.position.y = 1;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1.5, 0.75, 32, 64),
  material
);
torus.position.z = -3;
torus.position.x = 5;
torus.position.y = 2;

export const animateObjects = (elapsedTime) => {
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;
};

export default [sphere, cube, torus];
