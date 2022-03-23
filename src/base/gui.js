import * as dat from "lil-gui";

const debug = new dat.GUI();
debug.hide();

function showMenu({ onStartGame }, newGame = false) {
  document.body.classList.remove("game-active");
  const menu = document.createElement("div");
  menu.classList.add("menu");
  const menuBody = document.createElement("ul");
  const menuItems = [
    {
      label: newGame ? "Start Game" : "Resume Game",
      handler: (e) => {
        e.stopPropagation();
        onStartGame();
        hideMenu();
      },
    },
    { label: "Info", link: "/info" },
  ];
  for (const item of menuItems) {
    const menuItem = document.createElement("li");
    let menuButton;
    if (item.link) {
      menuButton = document.createElement("a");
      menuButton.setAttribute("href", item.link);
    } else {
      menuButton = document.createElement("button");
      menuButton.addEventListener("click", item.handler);
    }
    menuButton.classList.add("menu-button");
    menuButton.textContent = item.label;
    menuItem.append(menuButton);
    menuBody.append(menuItem);
  }
  menu.append(menuBody);
  document.body.append(menu);
}

function hideMenu() {
  document.body.classList.add("game-active");
  const menu = document.querySelector(".menu");
  if (menu) {
    menu.remove();
  }
}

function showInfo() {}

function initializeGui() {
  const gui = document.querySelector(".gui");
  gui.classList.remove("gui-disabled");
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

export { debug, initializeGui, setHp, showHit, showMenu, hideMenu };
