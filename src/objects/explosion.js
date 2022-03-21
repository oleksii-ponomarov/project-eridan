import * as THREE from "three";
import gsap from "gsap";

import { listener } from "../base/camera";
import { audioLoader } from "../base/loader";

let smallExplosionBuffer;
let largeExplosionBuffer;
audioLoader.load("./sounds/small-explosion.mp3", (buffer) => {
  smallExplosionBuffer = buffer;
});
audioLoader.load("./sounds/big-explosion.mp3", (buffer) => {
  largeExplosionBuffer = buffer;
});

class Explosion {
  constructor(scene, size = 0.1, position, normal) {
    const explosion = new THREE.Mesh(
      new THREE.SphereGeometry(size, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        depthWrite: false,
      })
    );

    this.scene = scene;
    const offset = 0.3;

    let explosionLightX = position.x;
    let explosionLightY = position.y;
    let explosionLightZ = position.z;

    if (normal) {
      explosionLightX += offset * normal.x;
      explosionLightY += offset * normal.y;
      explosionLightZ += offset * normal.z;
    }

    explosion.position.set(position.x, position.y, position.z);
    const explosionLight = new THREE.PointLight(0xffffff, 0.6, 5);
    explosionLight.position.set(
      explosionLightX,
      explosionLightY,
      explosionLightZ
    );
    this.light = explosionLight;
    this.scale = 2 + Math.random() * 2;

    const explosionSound = new THREE.PositionalAudio(listener);
    explosionSound.setBuffer(
      size < 1 ? smallExplosionBuffer : largeExplosionBuffer
    );
    explosionSound.setRefDistance(5);
    explosion.add(explosionSound);
    this.sound = explosionSound;

    this.object = explosion;
  }

  bang() {
    this.scene.add(this.object, this.light);
    const explosionDuration = 0.2;
    this.sound.play();
    gsap.to(this.object.scale, {
      ease: "power2.out",
      duration: explosionDuration,
      x: this.scale,
      y: this.scale,
      z: this.scale,
    });
    gsap.to(this.light, {
      ease: "power2.out",
      duration: explosionDuration,
      intensity: 0,
    });
    gsap.to(this.object.material, {
      ease: "power2.out",
      duration: explosionDuration,
      opacity: 0,
      onComplete: () => {
        this.scene.remove(this.object, this.light);
      },
    });
  }
}

export default Explosion;
