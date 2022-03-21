import * as THREE from "three";

import { initializeGui } from "./gui";

const loading = document.createElement("div");
const loadingText = document.createElement("p");
const loadingProgress = document.createElement("div");
const loadingBar = document.createElement("div");

function initializeLoading() {
  loading.classList.add("loading");
  loadingText.textContent = "Loading...";
  loading.appendChild(loadingText);
  loadingProgress.classList.add("loading-progress");
  loadingBar.classList.add("loading-bar");
  loadingProgress.appendChild(loadingBar);
  loading.appendChild(loadingProgress);
}

initializeLoading();

export const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (data) => {
  document.body.appendChild(loading);
};

loadingManager.onProgress = (fileName, index, total) => {
  loadingBar.style.width = (index / total) * 100 + "%";
};

loadingManager.onError = (data) => {
  console.log("error while loading file", data);
};

export function onLoad() {
  loading.remove();
  initializeGui();
}

export const textureLoader = new THREE.TextureLoader(loadingManager);
export const audioLoader = new THREE.AudioLoader(loadingManager);
