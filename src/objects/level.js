import * as THREE from "three";

import { textureLoader } from "../base/loader";

const wallsColorTexture = textureLoader.load("./textures/metall/color.jpg");
const wallsAmbientOcclusionTexture = textureLoader.load(
  "./textures/metall/ambientOcclusion.jpg"
);
const wallsMetalnessTexture = textureLoader.load(
  "./textures/metall/metalness.jpg"
);
const wallsRoughnessTexture = textureLoader.load(
  "./textures/metall/roughness.jpg"
);
const wallsNormalTexture = textureLoader.load("./textures/metall/normal.jpg");
const wallsHeightTexture = textureLoader.load("./textures/metall/height.png");

wallsColorTexture.repeat.set(3, 1);
wallsAmbientOcclusionTexture.repeat.set(3, 1);
wallsMetalnessTexture.repeat.set(3, 1);
wallsRoughnessTexture.repeat.set(3, 1);
wallsNormalTexture.repeat.set(3, 1);
wallsHeightTexture.repeat.set(3, 1);
wallsColorTexture.wrapS = THREE.RepeatWrapping;
wallsAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
wallsMetalnessTexture.wrapS = THREE.RepeatWrapping;
wallsRoughnessTexture.wrapS = THREE.RepeatWrapping;
wallsNormalTexture.wrapS = THREE.RepeatWrapping;
wallsHeightTexture.wrapS = THREE.RepeatWrapping;

const floorColorTexture = textureLoader.load("./textures/floor/color.jpg");
const floorAmbientOcclusionTexture = textureLoader.load(
  "./textures/floor/ambientOcclusion.jpg"
);
const floorMetalnessTexture = textureLoader.load(
  "./textures/floor/metalness.jpg"
);
const floorRoughnessTexture = textureLoader.load(
  "./textures/floor/roughness.jpg"
);
const floorNormalTexture = textureLoader.load("./textures/floor/normal.jpg");

floorColorTexture.repeat.set(2, 2);
floorAmbientOcclusionTexture.repeat.set(2, 2);
floorMetalnessTexture.repeat.set(2, 2);
floorRoughnessTexture.repeat.set(2, 2);
floorNormalTexture.repeat.set(2, 2);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
floorMetalnessTexture.wrapS = THREE.RepeatWrapping;
floorRoughnessTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
floorMetalnessTexture.wrapT = THREE.RepeatWrapping;
floorRoughnessTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

export const levelParameters = {
  size: 30,
  wallHeight: 4,
};

class Level {
  constructor() {
    const wallsMaterial = new THREE.MeshStandardMaterial({
      map: wallsColorTexture,
      aoMap: wallsAmbientOcclusionTexture,
      normalMap: wallsNormalTexture,
      metalnessMap: wallsMetalnessTexture,
      roughnessMap: wallsRoughnessTexture,
      displacementMap: wallsHeightTexture,
    });
    wallsMaterial.displacementScale = 0.1;

    const floorGeometry = new THREE.PlaneGeometry(
      levelParameters.size,
      levelParameters.size,
      32,
      32
    );
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorColorTexture,
      aoMap: floorAmbientOcclusionTexture,
      normalMap: floorNormalTexture,
      metalnessMap: floorMetalnessTexture,
      roughnessMap: floorRoughnessTexture,
    });
    const wallsGeometry = new THREE.PlaneGeometry(
      levelParameters.size,
      levelParameters.wallHeight,
      32,
      32
    );
    wallsGeometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(wallsGeometry.attributes.uv.array, 2)
    );

    const level = new THREE.Group();

    const wall1 = new THREE.Mesh(wallsGeometry, wallsMaterial);
    wall1.position.z = -levelParameters.size / 2;
    wall1.position.y = levelParameters.wallHeight / 2;

    const wall2 = new THREE.Mesh(wallsGeometry, wallsMaterial);
    wall2.rotation.y = Math.PI;
    wall2.position.z = levelParameters.size / 2;
    wall2.position.y = levelParameters.wallHeight / 2;

    const wall3 = new THREE.Mesh(wallsGeometry, wallsMaterial);
    wall3.rotation.y = Math.PI * 0.5;
    wall3.position.x = -levelParameters.size / 2;
    wall3.position.y = levelParameters.wallHeight / 2;

    const wall4 = new THREE.Mesh(wallsGeometry, wallsMaterial);
    wall4.rotation.y = -Math.PI * 0.5;
    wall4.position.x = levelParameters.size / 2;
    wall4.position.y = levelParameters.wallHeight / 2;

    const ground = new THREE.Mesh(floorGeometry, floorMaterial);
    ground.rotation.x = -Math.PI * 0.5;
    ground.receiveShadow = true;

    level.add(ground, wall1, wall2, wall3, wall4);

    return level;
  }
}

export default Level;
