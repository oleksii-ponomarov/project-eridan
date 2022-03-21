import * as THREE from "three";
import gsap from "gsap";

import scene from "../base/scene";
import { audioLoader } from "../base/loader";
import { listener } from "../base/camera";
import Explosion from "./explosion";

let enemyLaserSoundBuffer;
let laserSoundBuffer;
audioLoader.load("./sounds/laser.mp3", (buffer) => {
  enemyLaserSoundBuffer = buffer;
});
audioLoader.load("./sounds/laser2.mp3", (buffer) => {
  laserSoundBuffer = buffer;
});

class Laser {
  constructor(origin, enemy = false, killEnemyHandler) {
    this.killEnemyHandler = killEnemyHandler;
    this.origin = origin;
    const laser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.75, 16, 16),
      new THREE.MeshBasicMaterial({ color: enemy ? 0xff0000 : 0x00ff00 })
    );
    laser.rotation.order = "YXZ";
    laser.position.set(origin.x, enemy ? origin.y : origin.y - 0.15, origin.z);

    const laserSound = new THREE.PositionalAudio(listener);
    laserSound.setBuffer(enemy ? enemyLaserSoundBuffer : laserSoundBuffer);
    laserSound.setRefDistance(5);
    this.sound = laserSound;
    laser.add(laserSound);

    scene.add(laser);
    this.object = laser;
    this.enemy = enemy;

    return this;
  }

  shoot(targets) {
    if (!targets.length) {
      return;
    }
    this.sound.play();
    const shootLight = new THREE.PointLight(0xffffff, 0.5, 2);
    shootLight.position.set(this.origin.x, this.origin.y, this.origin.z);
    scene.add(shootLight);
    gsap.to(shootLight, {
      ease: "power2.out",
      duration: 0.2,
      intensity: 0,
      onComplete: () => {
        scene.remove(shootLight);
      },
    });
    this.object.lookAt(
      targets[0].point.x,
      targets[0].point.y,
      targets[0].point.z
    );
    this.object.rotation.x += Math.PI * 0.5;
    gsap.to(this.object.position, {
      ease: "none",
      duration: targets[0].distance * 0.01,
      x: targets[0].point.x,
      y: targets[0].point.y,
      z: targets[0].point.z,
      onComplete: () => {
        scene.remove(this.object);
        this.decideIfHit(targets);
      },
    });
  }

  decideIfHit(targets) {
    for (const target of targets) {
      let { min, max } = new THREE.Box3().setFromObject(target.object);
      const isHit =
        target.point.x >= min.x &&
        target.point.x <= max.x &&
        target.point.y >= min.y &&
        target.point.y <= max.y &&
        target.point.z >= min.z &&
        target.point.z <= max.z;

      if (isHit) {
        this.hit(target);
        break;
      }

      this.shoot(targets.slice(1));
    }
  }

  hit(target) {
    if (target.object.name === "skybox") {
      return;
    }
    const explosion = new Explosion(
      scene,
      0.1,
      target.point,
      target.face?.normal
    );
    explosion.bang();
    if (["object", "enemy"].includes(target.object.name)) {
      target.object.hp -= 10;
      if (target.object.hp <= 0) {
        const objectExplosion = new Explosion(scene, 5, target.object.position);
        target.object.name === "enemy" &&
          this.killEnemyHandler(target.object.uuid);
        objectExplosion.bang();
        scene.remove(target.object);
      }
    }
    if (target.object.name === "player") {
      target.object.hp -= 10;
      this.killEnemyHandler();
      if (target.object.hp <= 0) {
        console.log("you`re dead");
      }
    }
  }
}

export default Laser;
