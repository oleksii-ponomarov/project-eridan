import gsap from "gsap";

import { cameraParameters } from "./camera";
import Laser from "../objects/laser";

class Player {
  constructor(camera) {
    this.camera = camera;
    this.walkingForward = false;
    this.walkingBackward = false;
    this.strifeLeft = false;
    this.strifeRight = false;
    this.sprint = false;
    this.crawl = false;
    this.inTheAir = false;
    return this;
  }

  sitDown() {
    if (this.inTheAir) {
      return;
    }
    gsap.to(this.camera.position, {
      duration: 0.3,
      y: cameraParameters.playerCrawlHeight,
    });
  }

  standUp() {
    if (this.inTheAir) {
      return;
    }
    gsap.to(this.camera.position, {
      duration: 0.3,
      y: cameraParameters.playerHeight,
    });
  }

  jump() {
    if (this.inTheAir) {
      return;
    }
    this.inTheAir = true;
    gsap.to(this.camera.position, {
      duration: 0.3,
      ease: "power2.out",
      y: "+=2",
    });
    setTimeout(
      () =>
        gsap.to(this.camera.position, {
          duration: 0.3,
          ease: "power2.in",
          y: "-=2",
          onComplete: () => (this.inTheAir = false),
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

  doMove(deltaTime, offset, speed) {
    this.camera.position.x +=
      Math.sin(this.camera.rotation.y + offset) * speed * deltaTime;
    this.camera.position.z +=
      Math.cos(this.camera.rotation.y + offset) * speed * deltaTime;
  }

  shoot(target) {
    const laser = new Laser(this.camera.position);
    laser.shoot(this.camera.rotation, target);
  }

  walk(deltaTime) {
    let speed = this.sprint ? 10 : 5;
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
}

export default Player;
