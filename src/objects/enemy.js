import * as THREE from "three";

import Laser from "../objects/laser";

class Enemy {
  constructor(position, handlers, game) {
    this.game = game;
    this.handlers = handlers;
    const enemyHeight = 2;
    const object = new THREE.Mesh(new THREE.BoxGeometry(1, enemyHeight, 1));
    object.name = "enemy";
    object.position.set(position.x, enemyHeight / 2, position.z);
    object.hp = 100;
    this.object = object;
    this.id = object.uuid;
    this.shootInterval = 1 + 2 * Math.random();
    this.lastShotAt = 0;
    const raycaster = new THREE.Raycaster();
    this.raycaster = raycaster;
    this.moveX = Math.random() > 0.5 ? (0.5 - Math.random()) * 5 : 0;
    this.moveZ = Math.random() > 0.5 ? (0.5 - Math.random()) * 5 : 0;
    this.boundaries = new THREE.Box3().setFromObject(object);
    return this;
  }

  shoot(player, elapsedTime) {
    const direction = new THREE.Vector3();
    this.raycaster.set(
      this.object.position,
      direction
        .subVectors(player.object.position, this.object.position)
        .normalize()
    );
    const intersections = this.raycaster.intersectObjects([
      ...this.game.objects.map((object) => object.object),
      ...this.game.enemies.map((enemy) => enemy.object),
      this.game.level.walls,
      this.game.level.object,
      player.boundaries,
    ]);

    this.lastShotAt = elapsedTime;

    if (intersections[0]?.object.name !== "player") {
      return;
    }

    const laser = new Laser(this.object.position, true, this.handlers);
    laser.shoot(intersections);
  }

  move(elapsedTime) {
    this.object.position.x += this.moveX * Math.sin(elapsedTime);
    this.object.position.z += this.moveZ * Math.sin(elapsedTime);
  }
}

export default Enemy;
