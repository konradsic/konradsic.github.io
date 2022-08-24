// functions for getting GET parameters from website
function getSearchParameters() {
  var prmstr = window.location.search.substr(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}
/////// declaring variables /////////////////////
let listOfGoodColors = [];
let indexOfGoodColors = [];
let countDownTime = 0;
let score, board, ctx, addedPoints;
let mouse = false;
let mouseX, mouseY;
let colorStorage = [];
let selectedStorageX = [];
let selectedStorageY = [];
let howManyX, howManyY, colors;
let timerFunc = () => {};
////////////////////////////////
let timer = document.getElementById("time-left");
let statsEasy = document.getElementById("stats-easy");
let statsMedium = document.getElementById("stats-medium");
let statsHard = document.getElementById("stats-hard");
if (document.cookie.length == 0) {
  document.cookie = "levelData=0,0,0;";
}
// const
const level = getSearchParameters().level;
if (level == "easy") {
  colors = ["red","orange","rgb(255, 251, 0)","rgb(34, 206, 0)","rgb(0, 204, 255)"];
  howManyX = 16;
  howManyY = 16;
} else if (level == "medium") {
  colors = ["red","orange","rgb(255, 251, 0)","rgb(34, 206, 0)","rgb(0, 204, 255)", "purple"];
  howManyX = 15;
  howManyY = 15;
  countDownTime = 270000} 
else if (level == "hard") {
  colors = ["red","orange","rgb(255, 251, 0)","rgb(34, 206, 0)","rgb(0, 204, 255)", "purple", "rgb(252, 3, 236)"];
  howManyX = 15;
  howManyY = 15;
}
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

function elementInArray(arr, elem) {
  for (let i=0; i < arr.length; i++) {
    if (arr[i] == elem) {
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
function recursiveCheck(x, y, board, currentColor, currentCount,listOfGoodColors) {
  let color = board[x][y]
  console.log(x,y,currentColor,currentCount, color)
  if (currentColor == -1) currentColor = color;
  if (board[x][y+1] == currentColor) {
    if (!elementInArray(indexOfGoodColors, `${x}, ${y+1}`)) {
      indexOfGoodColors.push(`${x}, ${y+1}`)
      currentCount++;
      listOfGoodColors.push(color)
      if (currentCount == 4) return true;
    }
  } else if (board[x+1][y] == currentColor) {
    if (!elementInArray(indexOfGoodColors, `${x}, ${y+1}`)) {
      indexOfGoodColors.push(`${x+1}, ${y}`)
      currentCount++;
      listOfGoodColors.push(color)
      if (currentCount == 4) return true;
    }
  } else {
    currentColor = -1;
    currentCount = 1;
    listOfGoodColors = [];
  }
  try {
    return recursiveCheck(x+1,y,board,currentColor,currentCount,listOfGoodColors) || recursiveCheck(x,y+1, board,currentColor,currentCount,listOfGoodColors)
  } catch(err) {
    try {
      return recursiveCheck(x, y+1, board,currentColor,currentCount,listOfGoodColors)
    } catch(err) {
      return recursiveCheck(x+1, y, board,currentColor,currentCount,listOfGoodColors)
    }
  }
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
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
      clearInterval(timerFunc)
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

function endGame() {
  let points = score.innerHTML;
  alert("Koniec czasu! Wynik: " + points);
  cookieScore = getCookie("levelData");
  levelStats = cookieScore.split(",");
  if (level == "easy") {
    if (levelStats[0] < parseInt(points)) {
      levelStats[0] = parseInt(points);
    }
  } else if (level == "medium") {
    if (levelStats[1] < parseInt(points)) {
      levelStats[1] = parseInt(points);
    }
  } else if (level == "hard") {
    if (levelStats[2] < parseInt(points)) {
      levelStats[2] = parseInt(points);
    }
  }
  resultData = levelStats[0] + "," + levelStats[1] + "," + levelStats[2];
  completeCookie = "levelData=" + resultData + ";";
  document.cookie = completeCookie;
  generateBoard(board, howManyX, howManyY);
}
function startTimer() {
  let countDown = new Date().getTime() + countDownTime;
  timerFunc = setInterval(function() {
    let now = new Date().getTime();
    let distance = countDown - now;
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timer.innerHTML = minutes + ":" + seconds;
    if (minutes == 0 && seconds == 0) {
      clearInterval(timerFunc)
      endGame();
      return;
    }
  }, 1000);
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
  // high score load //
  let cookieData = getCookie("levelData");
  let splitLevelData = cookieData.split(",");
  statsEasy.innerHTML = splitLevelData[0];
  statsMedium.innerHTML = splitLevelData[1];
  statsHard.innerHTML = splitLevelData[2];

  // generating the board //
  colorStorage = [];
  score.innerHTML = 0;
  addedPoints.innerHTML = "(Zaczynamy!)";
  let beginningTime = new Date().getTime();
  let boardSizeX = board.width;
  let boardSizeY = board.height;
  let cubeSizeX = boardSizeX / countX;
  let cubeSizeY = boardSizeY / countY;
  if (level == "easy") {
    countDownTime = 300000;
  } else if (level == "medium") {
    countDownTime = 270000;
  } else if (level == "hard") {
    countDownTime = 240000;
  }
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
  startTimer();
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
  let finalPoints = parseInt(score.innerHTML);
  listOfGoodColors = [];
  indexOfGoodColors = [];
  if ((recursiveCheck(0,0,colorStorage,-1,0,listOfGoodColors) == undefined) || (recursiveCheck(0,0,colorStorage,-1,0,listOfGoodColors) == false)) {
    alert("Gratulacje, wygrałeś! Wynik: " + finalPoints);
    generateBoard(board, howManyX, howManyY);
    return;
  }
  // high score load //
  let cookieData = getCookie("levelData");
  let splitLevelData = cookieData.split(",");
  statsEasy.innerHTML = splitLevelData[0];
  statsMedium.innerHTML = splitLevelData[1];
  statsHard.innerHTML = splitLevelData[2];
  
  // rest of redrawing //
  console.log(listOfGoodColors)
  selectedStorageX = [];
  selectedStorageY = [];
  console.log(
    `${getDate()} board redraw finished in ${
      new Date().getTime() - beginningTime
    }ms!`
  );
}
async function startGame() {
  sleep(500);
  generateBoard(board, howManyY, howManyX);
}
startGame();

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