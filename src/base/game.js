import * as THREE from "three";

import scene from "./scene";
import Crate from "../objects/crate";
import camera, { cameraParameters } from "./camera";
import { debug, showMenu, hideMenu, initializeGui, showResult } from "./gui";
import Enemy from "../objects/enemy";
import Level, { levelParameters } from "../objects/level";
import Skybox from "../objects/skybox";
import Player from "./player";
import light from "./light";

const parameters = {
  attack: true,
  moveEnemies: false,
  enableMouse: true,
  enemiesNo: 3,
  objectsNo: 3,
};

const gameFolder = debug.addFolder("Game");
gameFolder.add(parameters, "attack");
gameFolder.add(parameters, "moveEnemies");
gameFolder.close();

class Game {
  constructor() {
    this.paused = true;
    this.started = false;

    scene.add(light, camera);
    const skybox = new Skybox();
    this.skybox = skybox;
    const raycaster = new THREE.Raycaster();
    this.raycaster = raycaster;
    this.currentIntersect = null;

    const level = new Level();
    this.level = level;

    this.cursor = { x: 0, y: 0 };
    window.addEventListener("mousemove", (e) =>
      this.handleMouseMove.call(this, e)
    );
    window.addEventListener("keydown", (e) => this.handleKeyDown.call(this, e));
    window.addEventListener("keyup", (e) => this.handleKeyUp.call(this, e));
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    // const enemiesNo = Math.random() * 4;
    this.enemies = [];
    for (let i = 0; i < parameters.enemiesNo; i++) {
      const enemy = new Enemy(
        {
          x: (0.5 - Math.random()) * 20,
          z: (0.5 - Math.random()) * 20,
        },
        {
          woundPlayer: () => this.player.wound(),
          pauseGame: () => this.pause(),
          blowObject: (id) => this.blowObject(id),
        },
        this
      );
      this.enemies.push(enemy);
    }

    this.objects = [];
    for (let i = 0; i < parameters.objectsNo; i++) {
      const arenaCrate = new Crate(
        {
          x: (0.5 - Math.random()) * (levelParameters.size / 2 - 2),
          z: (0.5 - Math.random()) * (levelParameters.size / 2 - 2),
        },
        Math.random() * Math.PI * 2
      );
      this.objects.push(arenaCrate);
    }
    const corridorCrate1 = new Crate(
      { x: levelParameters.size / 2 + 3, z: 2 },
      Math.random() * Math.PI * 2
    );
    const corridorCrate2 = new Crate(
      { x: levelParameters.size / 2 + 8, z: -3 },
      Math.random() * Math.PI * 2
    );
    this.objects.push(corridorCrate1, corridorCrate2);

    const player = new Player(
      camera,
      {
        killEnemy: (id) => this.killEnemy(id),
        blowObject: (id) => this.blowObject(id),
        pauseGame: () => this.pause(),
      },
      this
    );
    this.player = player;

    return this;
  }

  init() {
    scene.add(this.skybox, this.level.object, this.level.walls);
    for (const enemy of this.enemies) {
      scene.add(enemy.object);
    }
    for (const object of this.objects) {
      scene.add(object.object);
    }
    showMenu(
      {
        onStartGame: () => {
          initializeGui();
          this.start();
          window.addEventListener("click", () => this.handleClick.call(this));
          this.menuIsShown = false;
          this.started = true;
          window.onbeforeunload = (e) => {
            e.preventDefault();
            console.log("aaaa");
            e.returnValue = "Do you really want to quit the game?";
          };
        },
      },
      true
    );
    this.menuIsShown = true;
  }

  handleMouseMove(e) {
    this.cursor.x = e.clientX / window.innerWidth - 0.5;
    this.cursor.y = -(e.clientY / window.innerHeight - 0.5);
  }

  handleClick() {
    if (this.paused) {
      return;
    }
    this.player.shoot(this.currentIntersect);
  }

  handleKeyDown(e) {
    e.stopPropagation();
    const key = e.key.toLowerCase();
    if (key === "escape") {
      if (!this.menuIsShown) {
        this.menuIsShown = true;
        this.pause();
        showMenu({
          onStartGame: () => {
            this.start();
            this.menuIsShown = false;
          },
        });
      } else {
        this.menuIsShown = false;
        this.start();
        hideMenu();
      }
    }
    if (this.paused) {
      return;
    }
    if (["e", "у"].includes(key)) {
      if (
        this.currentIntersect &&
        this.currentIntersect[0].object.parent.name === "openDoor" &&
        this.currentIntersect[0].distance <= 2
      ) {
        this.level.clickButton();
      }
    }
    if (key === "z") {
      debug._hidden ? debug.show() : debug.hide();
    }
    if (key === "m") {
      parameters.enableMouse = !parameters.enableMouse;
    }
    if (["f", "а"].includes(key)) {
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
      if (this.player.strifeLeft || this.player.inTheAir) {
        return;
      }
      this.player.startMove("left");
      return;
    }
    if (["d", "в"].includes(key)) {
      e.preventDefault();
      if (this.player.strifeRight || this.player.inTheAir) {
        return;
      }
      this.player.startMove("right");
      return;
    }
  }

  handleKeyUp(e) {
    const key = e.key.toLowerCase();
    if (this.paused) {
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
      ...this.objects.map((object) => object.object),
      ...this.enemies.map((enemy) => enemy.object),
      this.level.object,
      this.level.walls,
      this.skybox,
    ]);

    if (intersects.length) {
      this.currentIntersect = intersects;
    } else {
      this.currentIntersect = null;
    }
  }

  updateCamera() {
    if (this.paused) {
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
    if (this.paused) {
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
    const enemyToKill = this.enemies.find((enemy) => enemy.id === id);
    scene.remove(enemyToKill.object);
    this.enemies = this.enemies.filter((enemy) => enemy.id !== id);
    if (!this.enemies.length) {
      this.pause();
      showResult(true);
    }
  }

  blowObject(id) {
    const objectToBlow = this.objects.find((object) => object.id === id);
    scene.remove(objectToBlow.object);
    this.objects = this.objects.filter((object) => object.id !== id);
  }

  pause() {
    this.player.endAllMoves();
    this.paused = true;
  }

  start() {
    this.paused = false;
  }
}

export default Game;
