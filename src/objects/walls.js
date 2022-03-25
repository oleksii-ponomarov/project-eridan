import * as THREE from "three";

import { textureLoader } from "../base/loader";

const wallsColorTexture = textureLoader.load("./textures/wall/color.jpg");
const wallsAmbientOcclusionTexture = textureLoader.load(
  "./textures/wall/ambientOcclusion.jpg"
);
const wallsMetalnessTexture = textureLoader.load(
  "./textures/wall/metalness.jpg"
);
const wallsRoughnessTexture = textureLoader.load(
  "./textures/wall/roughness.jpg"
);
const wallsNormalTexture = textureLoader.load("./textures/wall/normal.jpg");
const wallsEmissiveTexture = textureLoader.load("./textures/wall/emissive.jpg");

const smallWallsColorTexture = textureLoader.load("./textures/wall/color.jpg");
const smallWallsAmbientOcclusionTexture = textureLoader.load(
  "./textures/wall/ambientOcclusion.jpg"
);
const smallWallsMetalnessTexture = textureLoader.load(
  "./textures/wall/metalness.jpg"
);
const smallWallsRoughnessTexture = textureLoader.load(
  "./textures/wall/roughness.jpg"
);
const smallWallsNormalTexture = textureLoader.load(
  "./textures/wall/normal.jpg"
);
const smallWallsEmissiveTexture = textureLoader.load(
  "./textures/wall/emissive.jpg"
);

wallsColorTexture.repeat.set(3, 1);
wallsAmbientOcclusionTexture.repeat.set(3, 1);
wallsMetalnessTexture.repeat.set(3, 1);
wallsRoughnessTexture.repeat.set(3, 1);
wallsNormalTexture.repeat.set(3, 1);
wallsEmissiveTexture.repeat.set(3, 1);
wallsColorTexture.wrapS = THREE.RepeatWrapping;
wallsAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
wallsMetalnessTexture.wrapS = THREE.RepeatWrapping;
wallsRoughnessTexture.wrapS = THREE.RepeatWrapping;
wallsNormalTexture.wrapS = THREE.RepeatWrapping;
wallsEmissiveTexture.wrapS = THREE.RepeatWrapping;

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

const smallWallsGeometry = new THREE.PlaneGeometry(
  levelParameters.size / 3,
  levelParameters.wallHeight,
  32,
  32
);
smallWallsGeometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(smallWallsGeometry.attributes.uv.array, 2)
);

export const doorGeometry = new THREE.BoxGeometry(
  levelParameters.corridorLength / 2,
  levelParameters.wallHeight,
  0.2
);
doorGeometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(doorGeometry.attributes.uv.array, 2)
);

export const doorMaterial = new THREE.MeshStandardMaterial({
  map: doorColorTexture,
  normalMap: doorNormalTexture,
  roughnessMap: doorRoughnessTexture,
  metalnessMap: doorMetalnessTexture,
  aoMap: doorAmbientOcclusionTexture,
});

export const doorSideMaterial = new THREE.MeshStandardMaterial({
  map: metalColorTexture,
  normalMap: metalNormalTexture,
  roughnessMap: metalRoughnessTexture,
});

const wallsMaterial = new THREE.MeshStandardMaterial({
  map: wallsColorTexture,
  aoMap: wallsAmbientOcclusionTexture,
  normalMap: wallsNormalTexture,
  metalnessMap: wallsMetalnessTexture,
  roughnessMap: wallsRoughnessTexture,
  emissiveMap: wallsEmissiveTexture,
});
wallsMaterial.emissive = new THREE.Color(0xffffff);
wallsMaterial.emissiveIntensity = 0.75;

const smallWallsMaterial = new THREE.MeshStandardMaterial({
  map: smallWallsColorTexture,
  aoMap: smallWallsAmbientOcclusionTexture,
  normalMap: smallWallsNormalTexture,
  metalnessMap: smallWallsMetalnessTexture,
  roughnessMap: smallWallsRoughnessTexture,
  emissiveMap: smallWallsEmissiveTexture,
});
smallWallsMaterial.emissive = new THREE.Color(0xffffff);
smallWallsMaterial.emissiveIntensity = 0.75;

const corridorWallsMaterial = smallWallsMaterial.clone();
corridorWallsMaterial.emissiveIntensity = 0;

const walls = new THREE.Group();

const wall1 = new THREE.Mesh(wallsGeometry, wallsMaterial);
wall1.position.z = -levelParameters.size / 2;
wall1.castShadow = true;
wall1.receiveShadow = true;

const wall2 = new THREE.Mesh(wallsGeometry, wallsMaterial);
wall2.rotation.y = Math.PI;
wall2.position.z = levelParameters.size / 2;
wall2.castShadow = true;
wall2.receiveShadow = true;

const wall3 = new THREE.Mesh(wallsGeometry, wallsMaterial);
wall3.rotation.y = Math.PI * 0.5;
wall3.position.x = -levelParameters.size / 2;
wall3.castShadow = true;
wall3.receiveShadow = true;

const wall4 = new THREE.Mesh(smallWallsGeometry, smallWallsMaterial);
wall4.rotation.y = -Math.PI * 0.5;
wall4.position.x = levelParameters.size / 2;
wall4.position.z = levelParameters.size / 3;
wall4.castShadow = true;
wall4.receiveShadow = true;

const wall5 = new THREE.Mesh(smallWallsGeometry, smallWallsMaterial);
wall5.rotation.y = -Math.PI * 0.5;
wall5.position.x = levelParameters.size / 2;
wall5.position.z = -levelParameters.size / 3;
wall5.castShadow = true;
wall5.receiveShadow = true;

const corridorWallDoor1 = new THREE.Mesh(doorGeometry, doorMaterial);
corridorWallDoor1.rotation.y = (3 * Math.PI) / 2;
corridorWallDoor1.position.x =
  levelParameters.size / 2 + levelParameters.corridorLength;
corridorWallDoor1.position.z = levelParameters.corridorLength / 4;
corridorWallDoor1.castShadow = true;
corridorWallDoor1.receiveShadow = true;

const corridorWallDoor2 = new THREE.Mesh(doorGeometry, doorMaterial);
corridorWallDoor2.rotation.y = (3 * Math.PI) / 2;
corridorWallDoor2.position.x =
  levelParameters.size / 2 + levelParameters.corridorLength;
corridorWallDoor2.position.z = -levelParameters.corridorLength / 4;
corridorWallDoor2.castShadow = true;
corridorWallDoor2.receiveShadow = true;

walls.add(
  wall1,
  wall2,
  wall3,
  wall4,
  wall5,
  corridorWallDoor1,
  corridorWallDoor2
);
walls.position.y = levelParameters.wallHeight / 2;

const corridorWalls = new THREE.Group();

const corridorWall1 = new THREE.Mesh(smallWallsGeometry, corridorWallsMaterial);
corridorWall1.position.x =
  levelParameters.size / 2 + levelParameters.corridorLength / 2;
corridorWall1.position.z = -levelParameters.corridorLength / 2;
corridorWall1.castShadow = true;
corridorWall1.receiveShadow = true;

const corridorWall2 = new THREE.Mesh(smallWallsGeometry, corridorWallsMaterial);
corridorWall2.rotation.y = Math.PI;
corridorWall2.position.x =
  levelParameters.size / 2 + levelParameters.corridorLength / 2;
corridorWall2.position.z = levelParameters.corridorLength / 2;
corridorWall2.castShadow = true;
corridorWall2.receiveShadow = true;

corridorWalls.add(corridorWall1, corridorWall2);

export { walls, corridorWalls };
