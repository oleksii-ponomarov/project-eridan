import * as THREE from "three";

const light = new THREE.Group();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
directionalLight.position.x = 2;

const pointLight = new THREE.PointLight(0xff8800, 0.8, 3);
pointLight.position.set(1, -0.5, 1);
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
const rectAreaLight = new THREE.RectAreaLight(0x003388, 5, 1, 1);
rectAreaLight.position.z = 1;
rectAreaLight.position.x = -1;

const spotLight = new THREE.SpotLight(0xff7800, 0.5, 10, Math.PI * 0.1, 0.2, 1);
spotLight.position.x = 1;
spotLight.position.z = 2;

spotLight.target.position.x = 1;

light.add(
  directionalLight,
  pointLight,
  rectAreaLight,
  ambientLight,
  spotLight,
  spotLight.target
);

export default light;
