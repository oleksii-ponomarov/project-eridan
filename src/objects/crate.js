import * as THREE from "three";

import { textureLoader } from "../base/loader";

const crateColorTexture = textureLoader.load("./textures/crate/color.jpg");
const crateMetalnessTexture = textureLoader.load(
  "./textures/crate/metalness.jpg"
);
const crateAmbientOcclusionTexture = textureLoader.load(
  "./textures/crate/ambientOcclusion.jpg"
);
const crateNormalTexture = textureLoader.load("./textures/crate/normal.jpg");
const crateRoughnessTexture = textureLoader.load(
  "./textures/crate/roughness.jpg"
);

const crateParameters = {
  size: 2,
};

class Crate {
  constructor(position, rotation) {
    const crateGeometry = new THREE.BoxGeometry(
      crateParameters.size,
      crateParameters.size,
      crateParameters.size,
      32,
      32,
      32
    );
    crateGeometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(crateGeometry.attributes.uv.array, 2)
    );
    const crateMaterial = new THREE.MeshStandardMaterial({
      map: crateColorTexture,
      metalnessMap: crateMetalnessTexture,
      aoMap: crateAmbientOcclusionTexture,
      normalMap: crateNormalTexture,
      roughnessMap: crateRoughnessTexture,
    });
    const crate = new THREE.Mesh(crateGeometry, crateMaterial);
    crate.position.x = position.x;
    crate.position.y = crateParameters.size / 2;
    crate.position.z = position.z;
    crate.rotation.y = rotation;
    crate.castShadow = true;
    crate.hp = 100;
    crate.name = "object";
    crate.geometry.computeBoundingBox();
    this.boundaries = new THREE.Box3().setFromObject(crate);
    this.object = crate;
    this.id = crate.uuid;
    return this;
  }
}

export default Crate;
