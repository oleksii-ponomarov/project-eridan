import * as THREE from "three";
import gsap from "gsap";

import { textureLoader } from "../base/loader";
import { debug } from "../base/gui";
import { audioLoader } from "../base/loader";
import { listener } from "../base/camera";

const wallsColorTexture = textureLoader.load("./textures/wall/color.jpg");
const wallsAmbientOcclusionTexture = textureLoader.load(
  "./textures/wall/ambientOcclusion.jpg"
);
const wallsMetalnessTexture = textureLoader.load(
  "./textures/wall/metalness.jpg"
);
const wallsRoughnessTexture = textureLoader.load(
  "./textures/wall/roughness.jpg"
);
const wallsNormalTexture = textureLoader.load("./textures/wall/normal.jpg");
const wallsEmissiveTexture = textureLoader.load("./textures/wall/emissive.jpg");

const smallWallsColorTexture = textureLoader.load("./textures/wall/color.jpg");
const smallWallsAmbientOcclusionTexture = textureLoader.load(
  "./textures/wall/ambientOcclusion.jpg"
);
const smallWallsMetalnessTexture = textureLoader.load(
  "./textures/wall/metalness.jpg"
);
const smallWallsRoughnessTexture = textureLoader.load(
  "./textures/wall/roughness.jpg"
);
const smallWallsNormalTexture = textureLoader.load(
  "./textures/wall/normal.jpg"
);
const smallWallsEmissiveTexture = textureLoader.load(
  "./textures/wall/emissive.jpg"
);

wallsColorTexture.repeat.set(3, 1);
wallsAmbientOcclusionTexture.repeat.set(3, 1);
wallsMetalnessTexture.repeat.set(3, 1);
wallsRoughnessTexture.repeat.set(3, 1);
wallsNormalTexture.repeat.set(3, 1);
wallsEmissiveTexture.repeat.set(3, 1);
wallsColorTexture.wrapS = THREE.RepeatWrapping;
wallsAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
wallsMetalnessTexture.wrapS = THREE.RepeatWrapping;
wallsRoughnessTexture.wrapS = THREE.RepeatWrapping;
wallsNormalTexture.wrapS = THREE.RepeatWrapping;
wallsEmissiveTexture.wrapS = THREE.RepeatWrapping;

const ceilingColorTexture = textureLoader.load("./textures/ceiling/color.jpg");
const ceilingMetalnessTexture = textureLoader.load(
  "./textures/ceiling/metalness.jpg"
);
const ceilingAmbientOcclusionTexture = textureLoader.load(
  "./textures/ceiling/ambientOcclusion.jpg"
);
const ceilingNormalTexture = textureLoader.load(
  "./textures/ceiling/normal.jpg"
);
const ceilingRoughnessTexture = textureLoader.load(
  "./textures/ceiling/roughness.jpg"
);

const floorColorTexture = textureLoader.load("./textures/floor/color.jpg");
const floorAmbientOcclusionTexture = textureLoader.load(
  "./textures/floor/ambientOcclusion.jpg"
);
const floorMetalnessTexture = textureLoader.load(
  "./textures/floor/metalness.jpg"
);
const floorRoughnessTexture = textureLoader.load(
  "./textures/floor/roughness.jpg"
);
const floorNormalTexture = textureLoader.load("./textures/floor/normal.jpg");

floorColorTexture.repeat.set(2, 2);
floorAmbientOcclusionTexture.repeat.set(2, 2);
floorMetalnessTexture.repeat.set(2, 2);
floorRoughnessTexture.repeat.set(2, 2);
floorNormalTexture.repeat.set(2, 2);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
floorMetalnessTexture.wrapS = THREE.RepeatWrapping;
floorRoughnessTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
floorMetalnessTexture.wrapT = THREE.RepeatWrapping;
floorRoughnessTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

const metalColorTexture = textureLoader.load("./textures/metal/color.jpg");
const metalNormalTexture = textureLoader.load("./textures/metal/normal.jpg");
const metalRoughnessTexture = textureLoader.load(
  "./textures/metal/roughness.jpg"
);

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");

const buttonColorTexture = textureLoader.load("./textures/button/color.jpg");
const buttonAlphaTexture = textureLoader.load("./textures/button/alpha.jpg");
const buttonClosedEmissiveTexture = textureLoader.load(
  "./textures/button/closed/emissive.jpg"
);
const buttonOpenEmissiveTexture = textureLoader.load(
  "./textures/button/open/emissive.jpg"
);

export const levelParameters = {
  size: 30,
  wallHeight: 4,
  corridorLength: 30 / 3,
  doorOpenDuration: 1,
  buttonSize: 1.5,
};

class Level {
  constructor() {
    const wallsMaterial = new THREE.MeshStandardMaterial({
      map: wallsColorTexture,
      aoMap: wallsAmbientOcclusionTexture,
      normalMap: wallsNormalTexture,
      metalnessMap: wallsMetalnessTexture,
      roughnessMap: wallsRoughnessTexture,
      emissiveMap: wallsEmissiveTexture,
    });
    wallsMaterial.emissive = new THREE.Color(0xffffff);
    wallsMaterial.emissiveIntensity = 0.75;
    this.wallsMaterial = wallsMaterial;

    const smallWallsMaterial = new THREE.MeshStandardMaterial({
      map: smallWallsColorTexture,
      aoMap: smallWallsAmbientOcclusionTexture,
      normalMap: smallWallsNormalTexture,
      metalnessMap: smallWallsMetalnessTexture,
      roughnessMap: smallWallsRoughnessTexture,
      emissiveMap: smallWallsEmissiveTexture,
    });
    smallWallsMaterial.emissive = new THREE.Color(0xffffff);
    smallWallsMaterial.emissiveIntensity = 0.75;
    this.smallWallsMaterial = smallWallsMaterial;

    const corridorWallsMaterial = smallWallsMaterial.clone();
    corridorWallsMaterial.emissiveIntensity = 0;
    this.corridorWallsMaterial = corridorWallsMaterial;

    const levelFolder = debug.addFolder("Level");
    levelFolder
      .add(this.corridorWallsMaterial, "emissiveIntensity")
      .min(0)
      .max(1)
      .step(0.01);
    levelFolder.close();

    const ceilingGeometry = new THREE.PlaneGeometry(
      levelParameters.corridorLength,
      levelParameters.corridorLength
    );
    ceilingGeometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(ceilingGeometry.attributes.uv.array, 2)
    );
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      map: ceilingColorTexture,
      normalMap: ceilingNormalTexture,
      aoMap: ceilingAmbientOcclusionTexture,
      roughnessMap: ceilingRoughnessTexture,
      metalnessMap: ceilingMetalnessTexture,
    });

    const floorGeometry = new THREE.PlaneGeometry(
      levelParameters.size + levelParameters.corridorLength,
      levelParameters.size,
      32,
      32
    );

    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorColorTexture,
      aoMap: floorAmbientOcclusionTexture,
      normalMap: floorNormalTexture,
      metalnessMap: floorMetalnessTexture,
      roughnessMap: floorRoughnessTexture,
    });

    const wallsGeometry = new THREE.PlaneGeometry(
      levelParameters.size,
      levelParameters.wallHeight,
      32,
      32
    );
    wallsGeometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(wallsGeometry.attributes.uv.array, 2)
    );

    const smallWallsGeometry = new THREE.PlaneGeometry(
      levelParameters.size / 3,
      levelParameters.wallHeight,
      32,
      32
    );
    smallWallsGeometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(
        smallWallsGeometry.attributes.uv.array,
        2
      )
    );

    const doorGeometry = new THREE.BoxGeometry(
      levelParameters.corridorLength / 2,
      levelParameters.wallHeight,
      0.2
    );
    doorGeometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(doorGeometry.attributes.uv.array, 2)
    );

    const doorMaterial = new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      normalMap: doorNormalTexture,
      roughnessMap: doorRoughnessTexture,
      metalnessMap: doorMetalnessTexture,
      aoMap: doorAmbientOcclusionTexture,
    });

    const doorSideMaterial = new THREE.MeshStandardMaterial({
      map: metalColorTexture,
      normalMap: metalNormalTexture,
      roughnessMap: metalRoughnessTexture,
    });

    const level = new THREE.Group();
    level.name = "level";

    const walls = new THREE.Group();

    const wall1 = new THREE.Mesh(wallsGeometry, wallsMaterial);
    wall1.position.z = -levelParameters.size / 2;
    wall1.castShadow = true;
    wall1.receiveShadow = true;

    const wall2 = new THREE.Mesh(wallsGeometry, wallsMaterial);
    wall2.rotation.y = Math.PI;
    wall2.position.z = levelParameters.size / 2;
    wall2.castShadow = true;
    wall2.receiveShadow = true;

    const wall3 = new THREE.Mesh(wallsGeometry, wallsMaterial);
    wall3.rotation.y = Math.PI * 0.5;
    wall3.position.x = -levelParameters.size / 2;
    wall3.castShadow = true;
    wall3.receiveShadow = true;

    const wall4 = new THREE.Mesh(smallWallsGeometry, smallWallsMaterial);
    wall4.rotation.y = -Math.PI * 0.5;
    wall4.position.x = levelParameters.size / 2;
    wall4.position.z = levelParameters.size / 3;
    wall4.castShadow = true;
    wall4.receiveShadow = true;

    const wall5 = new THREE.Mesh(smallWallsGeometry, smallWallsMaterial);
    wall5.rotation.y = -Math.PI * 0.5;
    wall5.position.x = levelParameters.size / 2;
    wall5.position.z = -levelParameters.size / 3;
    wall5.castShadow = true;
    wall5.receiveShadow = true;

    const corridorWall1 = new THREE.Mesh(
      smallWallsGeometry,
      corridorWallsMaterial
    );
    corridorWall1.position.x =
      levelParameters.size / 2 + levelParameters.corridorLength / 2;
    corridorWall1.position.z = -levelParameters.corridorLength / 2;
    corridorWall1.castShadow = true;
    corridorWall1.receiveShadow = true;

    const corridorWall2 = new THREE.Mesh(
      smallWallsGeometry,
      corridorWallsMaterial
    );
    corridorWall2.rotation.y = Math.PI;
    corridorWall2.position.x =
      levelParameters.size / 2 + levelParameters.corridorLength / 2;
    corridorWall2.position.z = levelParameters.corridorLength / 2;
    corridorWall2.castShadow = true;
    corridorWall2.receiveShadow = true;

    const corridorWallDoor1 = new THREE.Mesh(doorGeometry, doorMaterial);
    corridorWallDoor1.rotation.y = (3 * Math.PI) / 2;
    corridorWallDoor1.position.x =
      levelParameters.size / 2 + levelParameters.corridorLength;
    corridorWallDoor1.position.z = levelParameters.corridorLength / 4;
    corridorWallDoor1.castShadow = true;
    corridorWallDoor1.receiveShadow = true;

    const corridorWallDoor2 = new THREE.Mesh(doorGeometry, doorMaterial);
    corridorWallDoor2.rotation.y = (3 * Math.PI) / 2;
    corridorWallDoor2.position.x =
      levelParameters.size / 2 + levelParameters.corridorLength;
    corridorWallDoor2.position.z = -levelParameters.corridorLength / 4;
    corridorWallDoor2.castShadow = true;
    corridorWallDoor2.receiveShadow = true;

    walls.add(
      wall1,
      wall2,
      wall3,
      wall4,
      wall5,
      corridorWall1,
      corridorWall2,
      corridorWallDoor1,
      corridorWallDoor2
    );
    walls.position.y = levelParameters.wallHeight / 2;

    const corridorCeiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    corridorCeiling.rotation.x = Math.PI / 2;
    corridorCeiling.position.x =
      levelParameters.size / 2 + levelParameters.corridorLength / 2;
    corridorCeiling.position.y = levelParameters.wallHeight;
    corridorCeiling.castShadow = true;

    const door1 = new THREE.Mesh(doorGeometry, [
      doorSideMaterial,
      doorSideMaterial,
      doorSideMaterial,
      doorSideMaterial,
      doorMaterial,
      doorMaterial,
    ]);
    door1.rotation.y = Math.PI / 2;
    door1.position.x = levelParameters.size / 2 + 0.3;
    door1.position.z = levelParameters.corridorLength / 4;
    door1.receiveShadow = true;

    const door2 = new THREE.Mesh(doorGeometry, [
      doorSideMaterial,
      doorSideMaterial,
      doorSideMaterial,
      doorSideMaterial,
      doorMaterial,
      doorMaterial,
    ]);
    door2.rotation.y = Math.PI / 2;
    door2.position.x = levelParameters.size / 2 + 0.3;
    door2.position.z = -levelParameters.corridorLength / 4;
    door2.receiveShadow = true;

    audioLoader.load("./sounds/door.mp3", (buffer) => {
      const door1Sound = new THREE.PositionalAudio(listener);
      door1Sound.setBuffer(buffer);
      door1Sound.setRefDistance(3);
      this.door1Sound = door1Sound;
      door1.add(door1Sound);
      const door2Sound = new THREE.PositionalAudio(listener);
      door2Sound.setBuffer(buffer);
      door2Sound.setRefDistance(3);
      this.door2Sound = door2Sound;
      door2.add(door2Sound);
    });

    this.door1 = door1;
    this.door2 = door2;
    this.doorsOpen = false;

    const ground = new THREE.Mesh(floorGeometry, floorMaterial);
    ground.rotation.x = -Math.PI * 0.5;
    ground.receiveShadow = true;
    ground.position.x = levelParameters.corridorLength / 2;

    const corridorLight = new THREE.PointLight(0xffffff, 0.6, 7, 0.75);
    corridorLight.position.x =
      levelParameters.size / 2 + levelParameters.corridorLength / 2;
    corridorLight.position.y = levelParameters.wallHeight / 2;

    const doorButton = new THREE.Group();
    doorButton.name = "openDoor";

    const doorButtonLight = new THREE.PointLight(0xff0000, 0.3, 4);
    this.doorButtonLight = doorButtonLight;
    doorButtonLight.position.z = 1;

    const buttonClosedMaterial = new THREE.MeshStandardMaterial({
      map: buttonColorTexture,
      emissiveMap: buttonClosedEmissiveTexture,
      alphaMap: buttonAlphaTexture,
      transparent: true,
    });
    buttonClosedMaterial.emissive = new THREE.Color(0xff0000);
    buttonClosedMaterial.emissiveIntensity = 0.75;

    const openDoorsButtonZone = new THREE.Mesh(
      new THREE.BoxGeometry(
        levelParameters.buttonSize + 1,
        levelParameters.buttonSize + 1,
        0.2
      ),
      new THREE.MeshStandardMaterial({ color: "green", wireframe: true })
    );
    openDoorsButtonZone.visible = false;

    const openDoorsButton = new THREE.Mesh(
      new THREE.PlaneGeometry(
        levelParameters.buttonSize,
        levelParameters.buttonSize
      ),
      buttonClosedMaterial
    );
    doorButton.add(openDoorsButtonZone, openDoorsButton, doorButtonLight);
    this.doorButton = openDoorsButton;

    doorButton.position.x =
      levelParameters.size / 2 + levelParameters.corridorLength / 2;
    doorButton.position.y = levelParameters.wallHeight / 2;
    doorButton.position.z = -levelParameters.corridorLength / 2 + 0.01;

    audioLoader.load("./sounds/beep.mp3", (buffer) => {
      const buttonSound = new THREE.PositionalAudio(listener);
      buttonSound.setBuffer(buffer);
      buttonSound.setRefDistance(5);
      this.buttonSound = buttonSound;
      openDoorsButton.add(buttonSound);
    });

    walls.add(door1, door2);
    level.add(ground, corridorCeiling, doorButton);

    for (const mesh of [...level.children, ...walls.children]) {
      mesh.boundaries = new THREE.Box3().setFromObject(mesh);
    }

    this.object = level;
    this.walls = walls;

    return this;
  }

  clickButton() {
    this.buttonSound.play();
    this.openDoors();
  }

  openDoors() {
    if (this.doorsOpen) {
      return;
    }
    this.door1Sound.play();
    this.door2Sound.play();
    gsap.to(this.door1.position, {
      duration: levelParameters.doorOpenDuration,
      ease: "power2.in",
      z: `+=${this.door1.geometry.parameters.width - 0.5}`,
    });
    gsap.to(this.door2.position, {
      duration: levelParameters.doorOpenDuration,
      ease: "power2.in",
      z: `-=${this.door2.geometry.parameters.width - 0.5}`,
      onComplete: () => {
        this.doorsOpen = true;
        const buttonOpenMaterial = new THREE.MeshStandardMaterial({
          map: buttonColorTexture,
          alphaMap: buttonAlphaTexture,
          emissiveMap: buttonOpenEmissiveTexture,
          transparent: true,
        });
        buttonOpenMaterial.emissive = new THREE.Color(0x00ff00);
        buttonOpenMaterial.emissiveIntensity = 0.75;
        this.doorButton.material = buttonOpenMaterial;
        this.doorButtonLight.color = new THREE.Color(0x00ff00);
        this.door1.boundaries = new THREE.Box3().setFromObject(this.door1);
        this.door2.boundaries = new THREE.Box3().setFromObject(this.door2);
      },
    });
  }
}

export default Level;
