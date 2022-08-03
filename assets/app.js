/////// declaring variables /////////////////////
let score, board, ctx, addedPoints;
let mouse = false;
let mouseX, mouseY;
let colorStorage = [];
let selectedStorageX = [];
let selectedStorageY = [];
// const
const howManyX = 13;
const howManyY = 13;
const colors = ["red","orange","rgb(255, 251, 0)","rgb(34, 206, 0)","rgb(0, 204, 255)"]; //red and orange + yellow, green, blue (rgb colors not defaults)
const engagements = [
  "Dobrze!",
  "Świetnie ci idzie!",
  "Super!",
  "Wow!",
  "Cóż za kombo!",
  "Bombastycznie!",
  "Idealnie!",
  "Jak ty to robisz?",
  "Ja bym tak nie potrafił",
  "Zaskoczenie!",
  "hacker???",
  "Smerfastycznie!",
  "Kapitalistycznie!",
];
score = document.getElementById("score-number");
board = document.getElementById("gameboard");
addedPoints = document.getElementById("score-points-added");
ctx = board.getContext("2d");

let firstColor = -1;
/////// functions ///////////////////////////////

// utils
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function copy(arr) {
  return arr.map((x) => x);
}
function sameArray2d(a1, a2) {
  // we believe that arrays have the same length when we are comparing them else it WILL throw an error
  for (let i = 0; i < a1.length; i++) {
    for (let j = 0; j < a1[0].length; j++) {
      let arr1Element = a1[i][j];
      let arr2Element = a2[i][j];
      if (arr1Element == arr2Element) {
        continue;
      }
      return false;
    }
  }
  return true;
}
function duplicateExsists(dup1, dup2, list1, list2) {
  for (let i = 0; i < list1.length; i++) {
    let x = list1[i];
    let y = list2[i];
    if (x == dup1 && y == dup2) {
      return true;
    }
  }
  return false;
}

function convertPoints(p) {
  res = 0
  for (let i = 1; i <= p; i++) {
    res += 100;
    if (i >= 5) {
      res *= 1.05;
    }
    if (i%6 == 0) {
      let bonus_i = (i/5)/2
      res *= (1+bonus_i)
    }
  }
  return Math.round(res)
}

// game
function givePoints(itemsX, itemsY) {
  //console.log(itemsX, itemsY);
  firstColor = colorStorage[itemsX[0]][itemsY[0]];
  let result = 0;
  let beforeElementCoordsX = -1;
  let beforeElementCoordsY = -1;
  let otherColorCounter = 0;
  let nullCounter = [];
  for (let x = 0; x < itemsX.length; x++) {
    let y = x;
    if (colorStorage[itemsX[x]][itemsY[y]] == firstColor) {
      if (x == 0 && y == 0) {
        result++;
        beforeElementCoordsX = itemsX[x];
        beforeElementCoordsY = itemsY[y];
        nullCounter.push([itemsX[x], itemsY[y]]);
        continue;
      } else if (
        Math.abs(beforeElementCoordsX - itemsX[x]) == 1 ||
        Math.abs(beforeElementCoordsY - itemsY[y]) == 1
      ) {
        result++;
        beforeElementCoordsX = itemsX[x];
        beforeElementCoordsY = itemsY[y];
        nullCounter.push([itemsX[x], itemsY[y]]);
        continue;
      }
    }
    otherColorCounter++;
  }
  let points = convertPoints(result)
  if (otherColorCounter >= 1) {
    let minusPoints = 200 * otherColorCounter * -1;
    score.innerHTML = parseInt(score.innerHTML) + minusPoints;
    addedPoints.innerHTML = `(<b class="points red">${minusPoints}</b> - zaznaczono pola o innym kolorze)`;
    let finalPoints = parseInt(score.innerHTML);
    if (finalPoints < 0) {
      alert("Przegrałeś :(");
      generateBoard(board, howManyX, howManyY);
      return;
    }
  } else if (points < 399) {
    addedPoints.innerHTML = "(Połączono zbyt mało pól o tym samym kolorze)";
    return;
  } else if (points > 399) {
    score.innerHTML = parseInt(score.innerHTML) + points;
    addedPoints.innerHTML = `(<b class="points green">+${points}</b> - ${
      engagements[Math.round(Math.random() * (engagements.length - 1))]
    })`;
    let finalPoints = parseInt(score.innerHTML);
    if (finalPoints >= 10000) {
      alert("Gratulacje! Wygrałeś!");
      generateBoard(board, howManyX, howManyY);
      return;
    }
    for (let i = 0; i < nullCounter.length; i++) {
      let element = nullCounter[i];
      let selectX = element[0];
      let selectY = element[1];
      colorStorage[selectX][selectY] = null;
    }
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
  ctx.fillStyle = "darkgray";
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
  // return if out of range (because it causes an error)
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
  drawHoverRectangle(boxX * sizeX, boxY * sizeY, sizeX, sizeY, color);
  if (!duplicateExsists(boxX, boxY, selectedStorageX, selectedStorageY)) {
    selectedStorageX.push(boxX);
    selectedStorageY.push(boxY);
  }
}

function generateBoard(board, countX, countY) {
  colorStorage = [];
  score.innerHTML = 0;
  addedPoints.innerHTML = "(Zaczynamy!)";
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
async function redrawBoard() {
  givePoints(selectedStorageX, selectedStorageY);
  let beginningTime = new Date().getTime();
  let boardSizeX = board.width;
  let boardSizeY = board.height;
  let cubeSizeX = boardSizeX / howManyX;
  let cubeSizeY = boardSizeY / howManyY;
  let colorStorageCopy = [];
  // the whole mechanic i messed up, "falling blocks" B) but like 80% done edit: wow it actually works!
  for (let ctrl = 0; ctrl < 10; ctrl++) {
    for (let i = 0; i < howManyX; i++) {
      for (let j = howManyY - 1; j >= 0; j--) {
        let curBlock = colorStorage[i][j];
        //drawHoverRectangle(i * cubeSizeX, j * cubeSizeY, cubeSizeX, cubeSizeY, curBlock);
        //await sleep(1)
        if (curBlock == null) {
          //console.log("null detected at " + i +", " + j + " replacing...")
          for (let y_replace = j - 1; y_replace >= 0; y_replace--) {
            colorStorage[i][y_replace + 1] = colorStorage[i][y_replace];
            colorStorage[i][y_replace] = null;
          }
        }
        //drawRectangle(i * cubeSizeX, j * cubeSizeY, cubeSizeX, cubeSizeY, curBlock);
      }
    }
    /*let res = sameArray2d(colorStorageCopy, colorStorage)
    console.log(res)
    if (res) {
      break
    }
    colorStorageCopy = copy(colorStorage)*/
  }
  ///////////////////////////////////////////////////////////////
  for (let x = 0; x < howManyX; x++) {
    for (let y = 0; y < howManyY; y++) {
      let color = colorStorage[x][y];
      if (color == null) {
        color = colors[Math.round(Math.random() * (colors.length - 1))];
        colorStorage[x][y] = color;
      }
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
