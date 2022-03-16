import * as THREE from "three";

import material from "./material";

const ground = new THREE.Mesh(new THREE.PlaneGeometry(25, 25), material);
ground.rotation.x = -Math.PI * 0.5;
ground.position.y = -0.65;

export default ground;
