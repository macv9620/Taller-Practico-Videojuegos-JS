const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
let canvasSize;
let elementsSize;
const upBtn = document.querySelector("#up");
const leftBtn = document.querySelector("#left");
const rightBtn = document.querySelector("#right");
const downBtn = document.querySelector("#down");
let playerPosition = { x: undefined, y: undefined };

/* Se recomienda para efectos de que el CANVAS funcione sin problemas encapsular el código en funciones y ejecutarlas desde un inicio cuando la página cargue asignando un addEventListener a window, para que cuando el HTML acabe de cargar se ejecute*/
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
upBtn.addEventListener("click", moveUp);
leftBtn.addEventListener("click", moveLeft);
rightBtn.addEventListener("click", moveRight);
downBtn.addEventListener("click", moveDown);
window.addEventListener("keydown", moveByKeyBoard);

function setCanvasSize() {
  //se hace esto para garantizar que no haya scroll vertical u horizontal cuando el alto o ancho son muy grandes

  playerPosition = { x: undefined, y: undefined };

  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
  elementsSize = canvasSize * 0.1;

  startGame();
}

function startGame() {
  //el texto puede ser un emoji
  //al ser texto, el tamaño se controla con la propiedad font
  //la sintaxis de .font es 10px fuente--- por eso se hace esta concatenación, para enviar el valor del parámetro de acuerdo con su sintaxis.
  game.font = elementsSize + "px Verdana";
  game.textAlign = "end";

  const map = maps[0];
  const mapRows = map.trim().split("\n");
  const mapCols = mapRows.map((element) => element.trim().split(""));

  game.clearRect(0, 0, canvasSize, canvasSize);

  mapCols.forEach((row, i) => {
    row.forEach((col, j) => {
      const emoji = emojis[col];
      const posX = (j + 1) * elementsSize;
      const posY = (i + 1) * elementsSize;
      game.fillText(emoji, posX, posY);

      if (col == "O") {
        if (playerPosition.x == undefined || playerPosition.y == undefined) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      }
    });
  });

  movePlayer();
}

function movePlayer() {
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function moveByKeyBoard(event) {
  switch (event.key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowDown":
      moveDown();
      break;
  }
}

function moveUp() {
  console.log("Up");
  if (playerPosition.y > elementsSize) {
    playerPosition.y -= elementsSize;
    startGame();
  }
}

function moveLeft() {
  console.log("Left");
  if (playerPosition.x >= 2*elementsSize) {
    playerPosition.x -= elementsSize;
    startGame();
  }
}

function moveRight() {
  console.log("Right");

  if (playerPosition.x < 10*elementsSize) {
    playerPosition.x += elementsSize;
    startGame();
  }
}

function moveDown() {
  console.log("Down");
  if (playerPosition.y < 10 * elementsSize) {
    playerPosition.y += elementsSize;
    startGame();
  }
}
