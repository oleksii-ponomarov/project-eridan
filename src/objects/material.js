import * as THREE from "three";

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
material.side = THREE.DoubleSide;

export default material;
