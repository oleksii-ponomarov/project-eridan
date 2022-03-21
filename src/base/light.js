import * as THREE from "three";

import { debug } from "./gui";

const light = new THREE.Group();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

const directionalLight = new THREE.DirectionalLight(0xaaaaff, 0.5);
directionalLight.position.set(2, 6, -6);

const lightFolder = debug.addFolder("Light");
lightFolder.add(directionalLight.position, "x").min(-10).max(10).step(0.01);
lightFolder.add(directionalLight.position, "y").min(-10).max(10).step(0.01);
lightFolder.add(directionalLight.position, "z").min(-10).max(10).step(0.01);
lightFolder.close()

light.add(directionalLight, ambientLight);

export default light;
