import * as THREE from "three";

import scene from "./scene";
import objects from "../objects/objects";
import ground from "../objects/ground";

class Game {
  constructor(player) {
    for (const object of objects) {
      object.name = "object";
      object.hp = 100;
    }
    const skybox = new THREE.Mesh(
      new THREE.SphereGeometry(100, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x0000, side: THREE.BackSide })
    );
    this.skybox = skybox;
    const raycaster = new THREE.Raycaster();
    this.raycaster = raycaster;
    this.currentIntersect = null;
    scene.add(skybox);
    this.player = player;
    window.addEventListener("keydown", (e) => this.handleKeyDown.call(this, e));
    window.addEventListener("keyup", (e) => this.handleKeyUp.call(this, e));
    window.addEventListener("click", () => this.handleClick.call(this));
    return this;
  }

  handleClick() {
    this.player.shoot(this.currentIntersect);
  }

  handleKeyDown(e) {
    e.stopPropagation();
    const key = e.key.toLowerCase();
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
      if (this.player.sprint) {
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
      ground,
      this.skybox,
    ]);

    if (intersects.length) {
      this.currentIntersect = intersects[0];
    } else {
      this.currentIntersect = null;
    }
  }
}

export default Game;
