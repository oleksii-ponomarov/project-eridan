import * as THREE from "three";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";

import material from "./material";

const sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), material);
sphere.position.x = -6;
sphere.position.z = 5;
sphere.position.y = 3;
sphere.geometry.computeVertexNormals();

const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material);
cube.position.z = 5;
cube.position.y = 3;
cube.geometry.computeVertexNormals();

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1.5, 0.75, 32, 64),
  material
);
torus.position.z = 10;
torus.position.x = 5;
torus.position.y = 3;
torus.geometry.computeVertexNormals();

export const animateObjects = (elapsedTime) => {
  // sphere.rotation.y = 0.1 * elapsedTime;
  // cube.rotation.y = 0.1 * elapsedTime;
  // torus.rotation.y = 0.1 * elapsedTime;
  // torus.position.x = 10 * Math.sin(elapsedTime);

  // sphere.rotation.x = 0.15 * elapsedTime;
  // cube.rotation.x = 0.15 * elapsedTime;
  // torus.rotation.x = 0.15 * elapsedTime;
};

export default [sphere, cube, torus];
