const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
let canvasSize;
let elementsSize;
const upBtn = document.querySelector("#up");
const leftBtn = document.querySelector("#left");
const rightBtn = document.querySelector("#right");
const downBtn = document.querySelector("#down");
const showLives = document.querySelector("#lives");
const gameTime = document.querySelector("#time");
const record = document.querySelector("#record");
const mensajes = document.querySelector("#mensajes");

let playerPosition = { x: undefined, y: undefined };
let objColisionPosition = {
  X: [],
  I: [],
};
let controlX = 0; //cuando se cambie de mapa se debe setear de nuevo en 0
let levelUpDown = 0;
let lives = 3;
let printTime;
let recordLocalStorage = Number(localStorage.getItem("recordTime"));
let timePlayed;

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
  controlX = 0;

  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
  elementsSize = canvasSize * 0.1;

  if (localStorage.getItem("recordTime")) {
    record.innerText = recordLocalStorage;
  }

  startGame();
}

function startGame() {
  //el texto puede ser un emoji
  //al ser texto, el tamaño se controla con la propiedad font
  //la sintaxis de .font es 10px fuente--- por eso se hace esta concatenación, para enviar el valor del parámetro de acuerdo con su sintaxis.
  game.font = elementsSize + "px Verdana";
  game.textAlign = "end";
  printLives();

  if (!printTime) {
    timeCounter();
  }

  const map = maps[0 + levelUpDown];
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
      } else if (col == "I") {
        if (!objColisionPosition.I[0]) {
          objColisionPosition.I.push({ x: posX, y: posY });
        }
      } else if (col == "X") {
        if (controlX === 0) {
          objColisionPosition.X.push({ x: posX, y: posY });
        }
      }
    });
  });

  movePlayer();
  controlX += 1;
}

function movePlayer() {
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
  giftColision();
  bombColision();
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

function giftColision() {
  if (
    playerPosition.x.toFixed(3) === objColisionPosition.I[0].x.toFixed(3) &&
    playerPosition.y.toFixed(3) === objColisionPosition.I[0].y.toFixed(3)
  ) {
    console.log("Choqué con regalo");
    levelUpDown += 1;
    console.log(levelUpDown);
    objColisionPosition = {
      X: [],
      I: [],
    };
    controlX = 0;
    if (levelUpDown == maps.length) {
      gameWin();
    } else {
      startGame();
    }
  }
}

function gameWin() {
  console.log("No hay más niveles...");
  clearInterval(printTime);
  printRecord();

  //console.log(localStorage.getItem("recordTime"));
  //console.log(timePlayed);

  levelUpDown = 0;
  //console.log(levelUpDown);
  lives = 3;

  printTime = undefined; //REVISAR
  gameTime.innerText = " ";
  playerPosition = { x: undefined, y: undefined };

  startGame();
}

function bombColision() {
  const bombPosition = objColisionPosition.X;
  //console.log(bombPosition);
  const thereIsABomb = bombPosition.find((bomb) => {
    return (
      bomb.x.toFixed(3) === playerPosition.x.toFixed(3) &&
      bomb.y.toFixed(3) === playerPosition.y.toFixed(3)
    );
  });

  if (thereIsABomb) {
    console.log("Choqué con una bomba");
    playerPosition = { x: undefined, y: undefined };
    objColisionPosition = {
      X: [],
      I: [],
    };

    controlX = 0;
    lives -= 1;

    if (lives === 0) {
      console.log("Perdiste el juego");
      levelUpDown = 0;
      lives = 3;
      clearInterval(printTime);
      printTime = undefined;
      gameTime.innerText = " ";
    }

    if (levelUpDown === 0) {
      //startGame();
      startGame();
    } else {
      //levelUpDown -= 1;
      playerPosition = { x: undefined, y: undefined };
      startGame();
    }
  }
}

function printLives() {
  //showLives.innerText = `${lives}`;
  showLives.innerText = emojis["HEARTH"].repeat(lives);
}

function moveUp() {
  console.log("Up");
  if (playerPosition.y > elementsSize) {
    playerPosition.y -= elementsSize;
    //console.log(playerPosition);
    startGame();
  }
}

function moveLeft() {
  console.log("Left");
  if (playerPosition.x > elementsSize) {
    playerPosition.x -= elementsSize;
    //console.log(playerPosition);
    startGame();
  }
}

function moveRight() {
  console.log("Right");
  if (playerPosition.x < 10 * elementsSize) {
    playerPosition.x += elementsSize;
    //console.log(playerPosition);
    startGame();
  }
}

function moveDown() {
  console.log("Down");
  if (playerPosition.y < 10 * elementsSize) {
    playerPosition.y += elementsSize;
    //console.log(playerPosition);
    startGame();
  }
}

function timeCounter() {
  let i = 0;
  printTime = setInterval(() => {
    timePlayed = (i++ / 10).toFixed(1);
    gameTime.innerText = timePlayed;
  }, 100);
}

function printRecord(){
  if (!localStorage.getItem("recordTime")) {
    console.log("Estoy entrando");
    localStorage.setItem("recordTime", timePlayed);
    recordLocalStorage = localStorage.getItem("recordTime");
    mensajes.innerText = "¡Este será tu record inicial!";
  } else if (Number(timePlayed) < Number(localStorage.getItem("recordTime"))) {
    console.log(typeof timePlayed);
    console.log(localStorage.getItem("recordTime"));
    console.log(timePlayed);

    localStorage.setItem("recordTime", timePlayed);
    recordLocalStorage = localStorage.getItem("recordTime");
    mensajes.innerText = "¡¡¡Superaste el record!!!";
  } else {
    mensajes.innerText = "No superaste el record pero ¡sigue intentando!";
  }
  //recordLocalStorage = localStorage.getItem("recordTime");
  console.log(recordLocalStorage);
  record.innerText = recordLocalStorage;
}
