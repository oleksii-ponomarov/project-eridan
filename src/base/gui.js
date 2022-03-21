import * as dat from "lil-gui";

const debug = new dat.GUI();
debug.hide();

function initializeGui() {
  const gui = document.querySelector(".gui");
  const hp = document.createElement("span");
  hp.classList.add("hp");
  hp.textContent = 100;
  gui.append(hp);
}

function setHp(value) {
  const hp = document.querySelector(".hp");
  hp.textContent = value;
}

function showHit() {
  const existingOverlay = document.querySelector(".hit-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }
  const hitOverlay = document.createElement("div");
  hitOverlay.classList.add("hit-overlay");
  document.body.append(hitOverlay);
  setTimeout(() => hitOverlay.classList.add("hidden"), 500);
  setTimeout(() => hitOverlay.remove(), 1000);
}

export { debug, initializeGui, setHp, showHit };
