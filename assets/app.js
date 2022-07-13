/////// declaring variables /////////////////////
let score, board, ctx
let mouse = false
let mouseX, mouseY
let howManyX, howManyY
let colorStorage = []
let selectedStorageX = []
let selectedStorageY = []
score = document.getElementById("score-number")
board = document.getElementById("gameboard")
ctx = board.getContext("2d")

howManyX = 10
howManyY = 10

/////// functions ///////////////////////////////
function givePoints(itemsX, itemsY) {
    let firstColor = colorStorage[itemsX[0]][itemsY[0]] // color we want to count
    let result = 0
    for (let x=0; x<itemsX.length; x++) {
        for (let y=0; y<itemsY.length; y++) {
            if (colorStorage[itemsX[x]][itemsY[y]] == firstColor) {
                result += 1
            }
        }
    }
    let points = result * 100
    if (points < 400) alert ("Połączyłeś za mało pól o tych samych kolorach")
    score.innerHTML = parseInt(score.innerHTML) + points
}

function drawRectangle(x, y, sizeX, sizeY, color) {
    ctx.fillStyle = "black"
    ctx.fillRect(x, y, sizeX, sizeY)
    ctx.fillStyle = color
    ctx.fillRect(x+2, y+2, sizeX-4, sizeY-4)
}
function drawHoverRectangle(x, y, sizeX, sizeY, color) {
    ctx.fillStyle = "gray"
    ctx.fillRect(x-2, y-2, sizeX+4, sizeY+4)
    ctx.fillStyle = color
    ctx.fillRect(x+2, y+2, sizeX-4, sizeY-4)
}

function getDate() {
    let date = new Date()
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
}

function hoverElement() {
    let sizeX = board.width / howManyX
    let sizeY = board.height / howManyY
    let boxX, boxY
    boxX = Math.floor(mouseX / sizeX)
    boxY = Math.floor(mouseY / sizeY)
    drawHoverRectangle(boxX*sizeX, boxY*sizeY, sizeX, sizeY, colorStorage[boxX][boxY])
    if (selectedStorageX.indexOf(boxX) == -1) selectedStorageX.push(boxX)
    if (selectedStorageY.indexOf(boxY) == -1) selectedStorageY.push(boxY)
}

function generateBoard(board, countX, countY, colors) {
    let beginningTime = new Date().getTime()
    let boardSizeX = board.width
    let boardSizeY = board.height
    let cubeSizeX = boardSizeX / countX
    let cubeSizeY = boardSizeY / countY
    for (let x=0; x<countX; x++) {
        colorStorage.push([])
        for (let y=0; y<countY; y++) {
            let color = colors[Math.round(Math.random()*(colors.length-1))]
            drawRectangle(x*cubeSizeX, y*cubeSizeY, cubeSizeX, cubeSizeY, color)
            colorStorage[x].push(color)
        }
    }
    selectedStorageX = []
    selectedStorageY = []
    console.log(`${getDate()} board generating finished in ${new Date().getTime()-beginningTime}ms!`)
}
function redrawBoard() {
    givePoints(selectedStorageX, selectedStorageY)
    let beginningTime = new Date().getTime()
    let boardSizeX = board.width
    let boardSizeY = board.height
    let cubeSizeX = boardSizeX / howManyX
    let cubeSizeY = boardSizeY / howManyY
    for (let x=0; x<howManyX; x++) {
        for (let y=0; y<howManyY; y++) {
            let color = colorStorage[x][y]
            drawRectangle(x*cubeSizeX, y*cubeSizeY, cubeSizeX, cubeSizeY, color)
        }
    }
    selectedStorageX = []
    selectedStorageY = []
    console.log(`${getDate()} board redraw finished in ${new Date().getTime()-beginningTime}ms!`)
}

generateBoard(board, howManyY, howManyX, ["red","green","orange", "blue", "purple"])

/////// events //////////////////////////////////
document.addEventListener('mousemove', (event) => {
    mouseX = event.pageX - board.offsetLeft
    mouseY = event.pageY - board.offsetTop
    if (mouse) {
        hoverElement()
    }
    
})
document.addEventListener('mousedown', () => {
    mouse = true;    
})
document.addEventListener('mouseup', () => {
    mouse = false;
    redrawBoard()
})
