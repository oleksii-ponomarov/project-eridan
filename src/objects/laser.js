import * as THREE from "three";
import gsap from "gsap";

import scene from "../base/scene";

const laserGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 16, 16);
const laserMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

class Laser {
  constructor(origin) {
    this.origin = origin;
    const laser = new THREE.Mesh(laserGeometry, laserMaterial);
    laser.rotation.order = "YXZ";
    laser.position.set(origin.x, origin.y - 0.15, origin.z);
    scene.add(laser);
    this.object = laser;
    return this;
  }

  shoot(direction, target) {
    const shootLight = new THREE.PointLight(0xffffff, 0.6, 5);
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
    this.direction = direction;
    this.object.rotation.x = direction.x + Math.PI * 0.5;
    this.object.rotation.y = direction.y;
    gsap.to(this.object.position, {
      ease: "none",
      duration: target.distance * 0.01,
      x: target.point.x,
      y: target.point.y,
      z: target.point.z,
      onComplete: () => {
        scene.remove(this.object);
        this.createExplosion(target);
      },
    });
  }

  createExplosion(target) {
    const explosion = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        depthWrite: false,
      })
    );
    explosion.position.set(target.point.x, target.point.y, target.point.z);
    const explosionLight = new THREE.PointLight(0xffffff, 0.6, 5);
    explosionLight.position.set(target.point.x, target.point.y, target.point.z);
    scene.add(explosion, explosionLight);
    const scale = 2 + Math.random() * 2;
    const explosionDuration = 0.2;
    gsap.to(explosion.scale, {
      ease: "power2.out",
      duration: explosionDuration,
      x: scale,
      y: scale,
      z: scale,
    });
    gsap.to(explosionLight, {
      ease: "power2.out",
      duration: explosionDuration,
      intensity: 0,
    });
    gsap.to(explosion.material, {
      ease: "power2.out",
      duration: explosionDuration,
      opacity: 0,
      onComplete: () => {
        scene.remove(explosion, explosionLight);
      },
    });
    if (target.object.name === "object") {
      target.object.hp -= 10;
      if (target.object.hp <= 0) {
        scene.remove(target.object);
      }
    }
  }
}

export default Laser;
