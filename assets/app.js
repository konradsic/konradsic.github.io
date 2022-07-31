/////// declaring variables /////////////////////
let score, board, ctx, addedPoints;
let mouse = false;
let mouseX, mouseY;
let howManyX, howManyY;
let colorStorage = [];
let selectedStorageX = [];
let selectedStorageY = [];
let colors = ["aquamarine", "violet", "yellow", "lightgreen", "orange"];
score = document.getElementById("score-number");
board = document.getElementById("gameboard");
addedPoints = document.getElementById("score-points-added");
ctx = board.getContext("2d");

howManyX = 10;
howManyY = 10;
let firstColor = -1;
/////// functions ///////////////////////////////
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function givePoints(itemsX, itemsY) {
  firstColor = colorStorage[itemsX[0]][itemsY[0]];
  let result = 0;
  let beforeElementCoordsX = -1;
  let beforeElementCoordsY = -1;
  let otherColorCounter = 0;
  for (let x = 0; x < itemsX.length; x++) {
    for (let y = 0; y < itemsY.length; y++) {
      console.log(
        x,
        y,
        colorStorage[itemsX[x]][itemsY[y]],
        itemsX[x],
        itemsY[y],
        result
      );
      colorStorage[itemsX[x]][itemsY[y]] = null;
      if (colorStorage[itemsX[x]][itemsY[y]] == firstColor) {
        if (x == 0 && y == 0) {
          result++;
          console.log(" -> result+");
          beforeElementCoordsX = itemsX[x];
          beforeElementCoordsY = itemsY[y];
          //colorStorage[itemsX[x]][itemsY[y]] = null;
          continue;
        } else if (
          Math.abs(beforeElementCoordsX - itemsX[x]) == 1 ||
          Math.abs(beforeElementCoordsY - itemsY[y]) == 1
        ) {
          result++;
          console.log(" -> result+");
          beforeElementCoordsX = itemsX[x];
          beforeElementCoordsY = itemsY[y];
          //colorStorage[itemsX[x]][itemsY[y]] = null;
          continue;
        }
      }
      otherColorCounter++;
    }
  }
  let points = result * 100;
  if (points < 399) {
    addedPoints.innerHTML = "(Połączono zbyt mało pól o tym samym kolorze)";
    return;
  } else if (points > 399) {
    score.innerHTML = parseInt(score.innerHTML) + points;
    addedPoints.innerHTML = `(+${points})`;
    return;
  }
}

function drawRectangle(x, y, sizeX, sizeY, color) {
  ctx.fillStyle = "black";
  ctx.fillRect(x, y, sizeX, sizeY);
  ctx.fillStyle = color;
  ctx.fillRect(x + 2, y + 2, sizeX - 4, sizeY - 4);
}
function drawHoverRectangle(x, y, sizeX, sizeY, color) {
  ctx.fillStyle = "gray";
  ctx.fillRect(x - 2, y - 2, sizeX + 4, sizeY + 4);
  ctx.fillStyle = color;
  ctx.fillRect(x + 2, y + 2, sizeX - 4, sizeY - 4);
}

function getDate() {
  let date = new Date();
  return `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
}

function hoverElement() {
  let sizeX = board.width / howManyX;
  let sizeY = board.height / howManyY;
  let boxX, boxY;
  boxX = Math.floor(mouseX / sizeX);
  boxY = Math.floor(mouseY / sizeY);
  // return if out of range (because it causes an error at ln. 98)
  if (boxX * sizeX > board.width || boxY * sizeY > board.height) {
    return;
  }
  if (boxX * sizeX > board.width && boxY * sizeY > board.height) {
    return;
  }
  if (boxX >= howManyX || boxX < 0) {
    return;
  }
  if (boxY >= howManyX || boxY < 0) {
    return;
  }
  ////// end /////////////////////////////////////////////////////
  let color = colorStorage[boxX][boxY];
  drawHoverRectangle(
    boxX * sizeX,
    boxY * sizeY,
    sizeX,
    sizeY,
    colorStorage[boxX][boxY]
  );
  if (selectedStorageX.indexOf(boxX) == -1) selectedStorageX.push(boxX);
  if (selectedStorageY.indexOf(boxY) == -1) selectedStorageY.push(boxY);
}

function generateBoard(board, countX, countY) {
  let beginningTime = new Date().getTime();
  let boardSizeX = board.width;
  let boardSizeY = board.height;
  let cubeSizeX = boardSizeX / countX;
  let cubeSizeY = boardSizeY / countY;
  for (let x = 0; x < countX; x++) {
    colorStorage.push([]);
    for (let y = 0; y < countY; y++) {
      let color = colors[Math.round(Math.random() * (colors.length - 1))];
      drawRectangle(x * cubeSizeX, y * cubeSizeY, cubeSizeX, cubeSizeY, color);
      colorStorage[x].push(color);
    }
  }
  selectedStorageX = [];
  selectedStorageY = [];
  console.log(
    `${getDate()} board generating finished in ${
      new Date().getTime() - beginningTime
    }ms!`
  );
}
function redrawBoard() {
  givePoints(selectedStorageX, selectedStorageY);
  let beginningTime = new Date().getTime();
  let boardSizeX = board.width;
  let boardSizeY = board.height;
  let cubeSizeX = boardSizeX / howManyX;
  let cubeSizeY = boardSizeY / howManyY;

  /*for (let j = 0; j < howManyX; j++) {
    for (let i = 0; i < howManyY-1; i++) {
      let belowSquare = colorStorage[i][j+1]
      if (belowSquare == null) {
        colorStorage[i][j+1] = colorStorage[i][j]
      }
    }
  }*/
  for (let x = 0; x < howManyX; x++) {
    for (let y = 0; y < howManyY; y++) {
      let color = colorStorage[x][y];
      /*if (color == null) {
        color = colors[Math.round(Math.random() * (colors.length - 1))];
        colorStorage[x][y] = color;
      }*/
      drawRectangle(x * cubeSizeX, y * cubeSizeY, cubeSizeX, cubeSizeY, color);
    }
  }
  selectedStorageX = [];
  selectedStorageY = [];
  console.log(
    `${getDate()} board redraw finished in ${
      new Date().getTime() - beginningTime
    }ms!`
  );
}

generateBoard(board, howManyY, howManyX);

/////// events //////////////////////////////////
document.addEventListener("mousemove", (event) => {
  mouseX = event.pageX - board.offsetLeft;
  mouseY = event.pageY - board.offsetTop;
  if (mouse) {
    hoverElement();
  }
});
document.addEventListener("mousedown", () => {
  mouse = true;
  mouseX = event.pageX - board.offsetLeft;
  mouseY = event.pageY - board.offsetTop;
  hoverElement();
});
document.addEventListener("mouseup", () => {
  mouse = false;
  firstColor = -1;
  redrawBoard();
});
