import * as THREE from "three";

const levelParameters = {
  size: 30,
  wallHeight: 2,
};

class Level {
  constructor() {
    const wallsMaterial = new THREE.MeshStandardMaterial({ color: 0x55ff88 });
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x33fa46 });
    const wallsGeometry = new THREE.PlaneGeometry(
      levelParameters.size,
      levelParameters.wallHeight
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

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(levelParameters.size, levelParameters.size),
      floorMaterial
    );
    ground.rotation.x = -Math.PI * 0.5;

    level.add(ground, wall1, wall2, wall3, wall4);

    return level;
  }
}

export default Level;
