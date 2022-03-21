import * as THREE from "three";

import scene from "../base/scene";
import Laser from "../objects/laser";

class Enemy {
  constructor(position, updateUserHp) {
    this.updateUserHp = updateUserHp;
    const enemyHeight = 2;
    const object = new THREE.Mesh(new THREE.BoxGeometry(1, enemyHeight, 1));
    object.name = "enemy";
    object.position.set(position.x, enemyHeight / 2, position.z);
    object.hp = 100;
    this.object = object;
    this.id = object.uuid;
    scene.add(object);
    this.shootInterval = 1 + 2 * Math.random();
    this.lastShotAt = 0;
    const raycaster = new THREE.Raycaster();
    this.raycaster = raycaster;
    this.moveX = Math.random() > 0.5 ? (0.5 - Math.random()) * 5 : 0;
    this.moveZ = Math.random() > 0.5 ? (0.5 - Math.random()) * 5 : 0;
    return this;
  }

  shoot(player, elapsedTime) {
    const origin = new THREE.Vector3(
      this.object.position.x,
      this.object.position.y,
      this.object.position.z
    );
    const direction = new THREE.Vector3(
      player.object.position.x,
      player.object.position.y,
      player.object.position.z
    );
    this.lastShotAt = elapsedTime;
    const laser = new Laser(this.object.position, true, this.updateUserHp);
    laser.shoot([
      {
        distance: origin.distanceTo(direction),
        point: direction,
        object: player.boundaries,
      },
    ]);
  }

  move(elapsedTime) {
    this.object.position.x += this.moveX * Math.sin(elapsedTime);
    this.object.position.z += this.moveZ * Math.sin(elapsedTime);
  }
}

export default Enemy;
