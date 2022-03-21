import * as THREE from "three";

const light = new THREE.Group();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.25);
directionalLight.position.x = 2;

light.add(
  directionalLight,
  ambientLight,
);

export default light;
