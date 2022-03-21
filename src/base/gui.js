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

export { debug, initializeGui, setHp };
