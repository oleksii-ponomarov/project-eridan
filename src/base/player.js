import * as THREE from "three";
import gsap from "gsap";

import { debug, showResult } from "./gui";
import { cameraParameters, listener } from "./camera";
import scene from "./scene";
import Laser from "../objects/laser";
import { audioLoader } from "./loader";
import { setHp } from "./gui";
import { levelParameters } from "../objects/level";
import { showHit } from "./gui";

let jumpStartBuffer;
let jumpEndBuffer;
audioLoader.load("./sounds/jump-start.mp3", (buffer) => {
  jumpStartBuffer = buffer;
});
audioLoader.load("./sounds/jump-end.mp3", (buffer) => {
  jumpEndBuffer = buffer;
});

class Player {
  constructor(camera, handlers, game) {
    this.parameters = {
      flashlight: { color: 0xfff3a3, intensity: 0.75 },
    };

    this.handlers = handlers;
    this.game = game;

    this.walkingForward = false;
    this.walkingBackward = false;
    this.strifeLeft = false;
    this.strifeRight = false;
    this.sprint = false;
    this.crawl = false;
    this.inTheAir = false;

    this.hp = 100;

    const player = new THREE.Group();
    player.position.y = cameraParameters.playerHeight;

    const flashLight = new THREE.SpotLight(
      this.parameters.flashlight.color,
      this.parameters.flashlight.intensity,
      10,
      Math.PI * 0.2,
      0.2,
      1
    );
    flashLight.visible = true;
    flashLight.position.y = 0;
    flashLight.target.position.set(0, 0, -1);
    camera.add(flashLight, flashLight.target);
    this.flashLight = flashLight;

    this.camera = camera;

    const playerBoundaries = new THREE.Mesh(
      new THREE.BoxGeometry(1, cameraParameters.playerHeight, 1),
      new THREE.MeshBasicMaterial({ side: THREE.BackSide, wireframe: true })
    );
    playerBoundaries.visible = false;
    playerBoundaries.position.y = -cameraParameters.playerHeight / 2;
    playerBoundaries.name = "player";
    playerBoundaries.hp = 100;
    player.add(camera, playerBoundaries);
    player.position.x =
      levelParameters.size / 2 + levelParameters.corridorLength * 0.75;
    scene.add(player);
    this.object = player;
    this.boundaries = playerBoundaries;

    const playerFolder = debug.addFolder("Player");
    playerFolder
      .addColor(this.parameters.flashlight, "color")
      .name("Flashlight Color")
      .onChange(
        () =>
          (this.flashLight.color = new THREE.Color(
            this.parameters.flashlight.color
          ))
      );
    playerFolder
      .add(this.parameters.flashlight, "intensity")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange(
        () => (this.flashLight.intensity = this.parameters.flashlight.intensity)
      );

    return this;
  }

  sitDown() {
    if (this.inTheAir) {
      return;
    }
    this.crawl = true;
    gsap.to(this.object.position, {
      duration: 0.3,
      y: cameraParameters.playerCrawlHeight,
    });
    // this.boundaries.scale.y = 0.75;
  }

  standUp() {
    if (this.inTheAir) {
      return;
    }
    this.crawl = false;
    gsap.to(this.object.position, {
      duration: 0.3,
      y: cameraParameters.playerHeight,
    });
    // this.boundaries.scale.y = 1;
  }

  jump() {
    if (this.inTheAir) {
      return;
    }

    const jumpStartSound = new THREE.Audio(listener);
    jumpStartSound.setBuffer(jumpStartBuffer);
    jumpStartSound.setVolume(0.5);
    jumpStartSound.play();

    this.inTheAir = true;
    gsap.to(this.object.position, {
      duration: 0.3,
      ease: "power2.out",
      y: "+=2",
    });
    setTimeout(
      () =>
        gsap.to(this.object.position, {
          duration: 0.3,
          ease: "power2.in",
          y: "-=2",
          onComplete: () => {
            this.inTheAir = false;
            const jumpEndSound = new THREE.Audio(listener);
            jumpEndSound.setBuffer(jumpEndBuffer);
            jumpEndSound.setVolume(0.5);
            jumpEndSound.play();
          },
        }),
      300
    );
  }

  startMove(direction) {
    switch (direction) {
      case "sprint":
        this.sprint = true;
        break;
      case "forward":
        this.walkingForward = true;
        break;
      case "backward":
        this.walkingBackward = true;
        break;
      case "left":
        this.strifeLeft = true;
        break;
      case "right":
        this.strifeRight = true;
        break;
      default:
    }
  }

  endMove(direction) {
    switch (direction) {
      case "sprint":
        this.sprint = false;
        break;
      case "forward":
        this.walkingForward = false;
        break;
      case "backward":
        this.walkingBackward = false;
        break;
      case "left":
        this.strifeLeft = false;
        break;
      case "right":
        this.strifeRight = false;
        break;
      default:
    }
  }

  endAllMoves() {
    this.sprint = false;
    this.walkingForward = false;
    this.walkingBackward = false;
    this.strifeLeft = false;
    this.strifeRight = false;
  }

  doMove(deltaTime, offset, speed) {
    const newPositionX =
      this.object.position.x +
      Math.sin(this.camera.rotation.y + offset) * speed * deltaTime;
    const newPositionZ =
      this.object.position.z +
      Math.cos(this.camera.rotation.y + offset) * speed * deltaTime;

    const isEnemiesConflict = this.game.enemies.some(
      ({ boundaries }) =>
        newPositionX >= boundaries.min.x - 0.5 &&
        newPositionX <= boundaries.max.x + 0.5 &&
        newPositionZ >= boundaries.min.z - 0.5 &&
        newPositionZ <= boundaries.max.z + 0.5
    );
    const isObjectsConflict = this.game.objects.some(
      ({ boundaries }) =>
        newPositionX >= boundaries.min.x - 0.2 &&
        newPositionX <= boundaries.max.x + 0.2 &&
        newPositionZ >= boundaries.min.z - 0.2 &&
        newPositionZ <= boundaries.max.z + 0.2
    );
    const isLevelConflict = this.game.level.walls.children.some(
      ({ boundaries }) =>
        newPositionX >= boundaries.min.x - 0.5 &&
        newPositionX <= boundaries.max.x + 0.5 &&
        newPositionZ >= boundaries.min.z - 0.5 &&
        newPositionZ <= boundaries.max.z + 0.5
    );

    if (!isEnemiesConflict && !isObjectsConflict && !isLevelConflict) {
      this.object.position.x = newPositionX;
      this.object.position.z = newPositionZ;
    }
  }

  shoot(targets) {
    const laser = new Laser(this.object.position, false, this.handlers);
    laser.shoot(targets);
  }

  toogleFlashlight() {
    this.flashLight.visible = !this.flashLight.visible;
  }

  walk(deltaTime) {
    let speed = this.sprint ? 10 : this.crawl ? 2.5 : 5;
    if (this.walkingForward) {
      this.doMove(deltaTime, Math.PI, speed);
    }
    if (this.walkingBackward) {
      this.doMove(deltaTime, 0, speed);
    }
    if (this.strifeLeft) {
      this.doMove(deltaTime, Math.PI * 1.5, speed);
    }
    if (this.strifeRight) {
      this.doMove(deltaTime, Math.PI * 0.5, speed);
    }
  }

  wound() {
    showHit();
    gsap.to(this.camera.rotation, {
      duration: 0.1,
      ease: "power2.in",
      x: "+=0.3",
      onComplete: () => {
        gsap.to(this.camera.rotation, {
          duration: 0.3,
          ease: "power2.out",
          x: "-=0.3",
        });
      },
    });
    this.hp -= 10;
    setHp(this.hp);
    if (this.hp <= 0) {
      this.handlers.pauseGame();
      showResult(false);
    }
  }
}

export default Player;
