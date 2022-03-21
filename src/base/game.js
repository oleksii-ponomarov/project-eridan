import * as THREE from "three";

import scene from "./scene";
import objects from "../objects/objects";
import camera, { cameraParameters } from "./camera";
import { debug } from "./gui";
import Enemy from "../objects/enemy";
import Level from "../objects/level";
import Skybox from "../objects/skybox";
import Player from "./player";

const parameters = {
  attack: true,
  moveEnemies: false,
  enableMouse: true,
  paused: false,
};

debug.add(parameters, "attack");
debug.add(parameters, "moveEnemies");

class Game {
  constructor() {
    for (const object of objects) {
      object.name = "object";
      object.hp = 100;
    }
    const skybox = new Skybox();
    this.skybox = skybox;
    const raycaster = new THREE.Raycaster();
    this.raycaster = raycaster;
    this.currentIntersect = null;
    scene.add(skybox);

    const level = new Level();
    scene.add(level);
    this.level = level;

    this.cursor = { x: 0, y: 0 };
    window.addEventListener("mousemove", (e) =>
      this.handleMouseMove.call(this, e)
    );
    window.addEventListener("keydown", (e) => this.handleKeyDown.call(this, e));
    window.addEventListener("keyup", (e) => this.handleKeyUp.call(this, e));
    window.addEventListener("click", () => this.handleClick.call(this));
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    const enemiesNo = Math.random() * 4;
    this.enemies = [];
    for (let i = 0; i < enemiesNo; i++) {
      const enemy = new Enemy(
        {
          x: (0.5 - Math.random()) * 20,
          z: (0.5 - Math.random()) * 20,
        },
        {
          woundPlayer: () => this.player.wound(),
          pauseGame: () => this.pause(),
        }
      );
      this.enemies.push(enemy);
    }

    const player = new Player(camera, {
      killEnemy: (id) => this.killEnemy(id),
    });
    this.player = player;

    return this;
  }

  handleMouseMove(e) {
    this.cursor.x = e.clientX / window.innerWidth - 0.5;
    this.cursor.y = -(e.clientY / window.innerHeight - 0.5);
  }

  handleClick() {
    if (parameters.paused) {
      return;
    }
    this.player.shoot(this.currentIntersect);
  }

  handleKeyDown(e) {
    e.stopPropagation();
    const key = e.key.toLowerCase();
    if (parameters.paused) {
      return;
    }
    if (key === "z") {
      debug._hidden ? debug.show() : debug.hide();
    }
    if (key === "m") {
      parameters.enableMouse = !parameters.enableMouse;
    }
    if (key === "f") {
      this.player.toogleFlashlight();
    }
    if (key === " ") {
      this.player.jump();
    }
    if (key === "control") {
      if (this.player.crawl) {
        return;
      }
      this.player.sitDown();
    }
    if (key === "shift") {
      if (this.player.sprint || this.player.crawl) {
        return;
      }
      this.player.startMove("sprint");
    }
    if (["w", "ц"].includes(key)) {
      e.preventDefault();
      if (this.player.walkingForward) {
        return;
      }
      this.player.startMove("forward");
      return;
    }
    if (["s", "ы", "і"].includes(key)) {
      e.preventDefault();
      if (this.player.walkingBackward) {
        return;
      }
      this.player.startMove("backward");
      return;
    }
    if (["a", "ф"].includes(key)) {
      e.preventDefault();
      if (this.player.strifeLeft) {
        return;
      }
      this.player.startMove("left");
      return;
    }
    if (["d", "в"].includes(key)) {
      e.preventDefault();
      if (this.player.strifeRight) {
        return;
      }
      this.player.startMove("right");
      return;
    }
  }

  handleKeyUp(e) {
    const key = e.key.toLowerCase();
    if (parameters.paused) {
      return;
    }
    if (key === "shift") {
      this.player.endMove("sprint");
    }
    if (key === "control") {
      this.player.standUp();
    }
    if (["w", "ц"].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
      this.player.endMove("forward");
      this.player.endMove("sprint");
      return;
    }
    if (["s", "ы", "і"].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
      this.player.endMove("backward");
      this.player.endMove("sprint");
      return;
    }
    if (["a", "ф"].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
      this.player.endMove("left");
      this.player.endMove("sprint");
      return;
    }
    if (["d", "в"].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
      this.player.endMove("right");
      this.player.endMove("sprint");
      return;
    }
  }

  updateAim() {
    this.raycaster.setFromCamera({ x: 0, y: 0 }, this.player.camera);

    const intersects = this.raycaster.intersectObjects([
      ...scene.children.filter((mesh) => mesh.name === "object"),
      ...this.enemies.map((enemy) => enemy.object),
      this.level,
      this.skybox,
    ]);

    if (intersects.length) {
      this.currentIntersect = intersects;
    } else {
      this.currentIntersect = null;
    }
  }

  updateCamera() {
    if (parameters.paused) {
      return;
    }
    if (parameters.enableMouse) {
      if (
        this.cursor.x > cameraParameters.zeroZone ||
        this.cursor.x < -cameraParameters.zeroZone
      ) {
        this.player.camera.rotation.y -=
          this.cursor.x * cameraParameters.mouseSensitivity;
        this.player.camera.rotation.y =
          this.player.camera.rotation.y % (Math.PI * 2);
      }

      if (
        this.cursor.y > cameraParameters.zeroZone ||
        this.cursor.y < -cameraParameters.zeroZone
      ) {
        const newRotationX =
          this.player.camera.rotation.x +
          this.cursor.y * cameraParameters.mouseSensitivity;
        if (newRotationX < Math.PI * 0.5 && newRotationX > -Math.PI * 0.5) {
          this.player.camera.rotation.x = newRotationX;
        }
      }
    }
  }

  attackPlayer(elapsedTime) {
    if (parameters.paused) {
      return;
    }
    if (parameters.attack) {
      for (const enemy of this.enemies) {
        if (elapsedTime > enemy.lastShotAt + enemy.shootInterval) {
          enemy.shoot(this.player, elapsedTime);
        }
      }
    }
  }

  killEnemy(id) {
    this.enemies = this.enemies.filter((enemy) => enemy.id !== id);
  }

  pause() {
    this.player.endAllMoves();
    parameters.paused = true;
  }

  resume() {
    parameters.paused = false;
  }
}

export default Game;
