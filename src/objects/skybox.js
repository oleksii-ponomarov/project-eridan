import * as THREE from "three";

import { textureLoader } from "../base/loader";

const skyboxTexture = textureLoader.load("./textures/skybox.jpg");

class Skybox {
  constructor() {
    const skybox = new THREE.Mesh(
      new THREE.SphereGeometry(100, 16, 16),
      new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide })
    );
    skybox.name = "skybox";
    return skybox;
  }
}

export default Skybox;
