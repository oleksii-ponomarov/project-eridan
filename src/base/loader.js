import * as THREE from "three";

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

function initializeGui() {
  const statusBar = document.createElement("div");
  statusBar.classList.add("status-bar");
  const actualInfo = document.createElement("p");
  const statusText = document.createElement("span");
  statusText.textContent = "Рівень: ";
  const statusLevel = document.createElement("span");
  statusLevel.classList.add("level");
  actualInfo.append(statusText, statusLevel);
  statusBar.append(actualInfo);

  const info = document.createElement("a");
  info.setAttribute("href", "./info");
  info.classList.add("info");
  info.textContent = "Info";

  document.body.append(statusBar, info);
}

initializeLoading();

export const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (data) => {
  document.body.appendChild(loading);
  console.log(data);
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
