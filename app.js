
function ColorName(i) {
    let colorName = ["color1", "color2", "color3", "color4", "color5", "color6", "color7", "color8", "color9"]
    const colorSquareDiv = document.getElementById(colorName[i])
    return colorSquareDiv
}


var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d", { willReadFrequently: true });

var lineThickness = 1

let eraser = false
let pipette = false
let swapColor = false


var toolsSwap = 1
var lineSwap = 0
var linelength = 10
var linePosXYSave = { x: 0, y: 0 }
var linePos = []
var linePosXY = [{ x: 1, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }]
var lineStyle = ["background-image: url(img/line.svg)", "background-image: url(img/line2.svg)", "background-image: url(img/line3.svg)", "background-image: url(img/line4.svg)", "background-image: url(img/line5.svg)", "background-image: url(img/line6.svg)", "background-image: url(img/line7.svg)", "background-image: url(img/line8.svg)"]
var iline = 0

const pixelPos = [{ x: 1, y: 0 }]

function RemoveLastPixel() { //delite salt pixel

    info('faq: delete last drawn pixel')

    try {
        ctx.clearRect(pixelPos[pixelPos.length - 1].x, pixelPos[pixelPos.length - 1].y, pixelPos[pixelPos.length - 1].w, pixelPos[pixelPos.length - 1].h)

    } catch {
        console.log('Отменить нельзя(')
    }
    var popped = pixelPos.pop();
}

function RemoveLastLine() { //delite salt pixel

    try {

        for (let i = 1; i < linelength + 1; i++) {

            ctx.clearRect(linePos[linePos.length - i].x, linePos[linePos.length - i].y, 1, 1)
        }

        linePos.splice(0)

    } catch {
    }
}

var poxX = 0
var posY = 0

{ //draw
    function Draw(event) {
        if (event.buttons === 1) {

            if (toolsSwap == 1) {// tools pen

                { //save pixel pos
                    if (event.offsetX == poxX && event.offsetY == posY) {
                    }
                    else {
                        poxX = event.offsetX
                        posY = event.offsetY
                        const cord = { x: event.offsetX, y: event.offsetY, w: lineThickness, h: lineThickness }
                        pixelPos.push(cord)

                    }
                }

                ctx.fillRect(event.offsetX, event.offsetY, lineThickness, lineThickness) // изменить ширину
                ctx.fillStyle = colorInput.value
            }

            if (toolsSwap == 2) {// tools eraser

                ctx.clearRect(event.offsetX, event.offsetY, lineThickness, lineThickness)

                for (let i = 0; i < pixelPos.length; i++) {
                    if (pixelPos[i].x === event.offsetX && pixelPos[i].y === event.offsetY) {
                        let myIndex = pixelPos.indexOf(pixelPos[i]);
                        pixelPos.splice(myIndex, 1)
                    }
                }
            }

            if (toolsSwap == 3) {// tools pipette
                colorPix(event.offsetX, event.offsetY)
            }

            if (toolsSwap == 4) {// tools line
                DrawLine(event.offsetX - 1, event.offsetY + 1, linePosXY[lineSwap].x, linePosXY[lineSwap].y, linelength, true)
                linePosXYSave = { x: linePosXY[lineSwap].x, y: linePosXY[lineSwap].y }
            }
        }
    }

    c.onmousedown = function (event) { //draw



        if (event.buttons === 4) {
            colorPix(event.offsetX, event.offsetY)
        }

        c.onmousemove = function (event) {
            Draw(event)
        }
    }

    c.onmouseup = function (event) { //no draw onmousedown
        if (event.buttons === 4) {
            colorInput.value = '#fdf9f8'
        }

        c.onmousemove = null
    }

    c.addEventListener("mousedown", mouseDown) //draw onmousedown
    function mouseDown(event) {
        Draw(event)
    }
}

function info(text) {
    document.getElementById("info").textContent = text
}

{ // draw line options

    function DrawLine(num, num2, co, co2, length, drawe) {

        let i = 0;

        while (i < length) {
            i++
            if (co === 1) {
                num++
            }
            if (co === 2) {
                num--
            }

            if (co2 === 1) {
                num2++
            }
            if (co2 === 2) {
                num2--
            }

            if (drawe) {
                ctx.fillStyle = colorInput.value
                ctx.fillRect(num, num2, 1, 1)
                const cord = { x: num, y: num2, w: lineThickness, h: lineThickness }
                linePos.push(cord)
            }
            else { ctx.clearRect(num, num2, 1, 1) }
        }

    }

}

function maxPenDrive() {
    if (lineThickness <= 6) {
        lineThickness++
    }
}

function minPenDrive() {
    if (lineThickness > 1) {
        lineThickness--
    }
}

function downloadImage() {
    const dataUrl = c.toDataURL()
    document.getElementById("urlInput").value = dataUrl
}

function eraserClick() {
    toolsSwap = 2
}

function driweButton() {

    toolsSwap = 1
}

function pipetteActive() {
    toolsSwap = 3
}

function lineButton() {

    info('faq: you can delete the drawn line once')

    document.getElementById('lineButton').style = lineStyle[iline]

    if (lineSwap == 8) {
        iline = 0
        lineSwap = 0
    }

    lineSwap++
    iline++
    toolsSwap = 4
}

function maxLineDrive() {
    if (linelength <= 30) {
        linelength++
    }
}

function minLineDrive() {
    if (linelength > 1) {
        linelength--
    }
}

function rgbToHex(r, g, b) {// rgb в hex
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function colorPix(num, num2) {//цвет пикселя
    var imageData = ctx.getImageData(num, num2, 1, 1);
    var hex = "#" + ("000000" + rgbToHex(imageData.data[0], imageData.data[1], imageData.data[2])).slice(-6)
    colorInput.value = hex
}

{//color
    var col1, col2, col3, col4, col5, col6, col7, col8, col9

    function ColorSquare(one, two) {
        one.addEventListener('click', () => {
            if (swapColor) {
                one.style = "background-color:" + colorInput.value + ";"
                two = colorInput.value
            }
            else {
                colorInput.value = two
                info("hex:" + two)
            }
        })
    }

    ColorSquare(ColorName(0), col1)
    ColorSquare(ColorName(1), col2)
    ColorSquare(ColorName(2), col3)
    ColorSquare(ColorName(3), col4)
    ColorSquare(ColorName(4), col5)
    ColorSquare(ColorName(5), col6)
    ColorSquare(ColorName(6), col7)
    ColorSquare(ColorName(7), col8)
    ColorSquare(ColorName(8), col9)

}

function colorLoc() {
    if (swapColor) {
        info("'square' lock")
        document.getElementById('colorLoc').style = "background-image: url(img/colorLoc.svg);"
        swapColor = false
    }
    else {
        info("click 'square' to save color from color input")
        document.getElementById('colorLoc').style = "background-image: url(img/colorUnLoc.svg);"
        swapColor = true
    }
}

document.getElementById("max").addEventListener("click", maxPenDrive)
document.getElementById("min").addEventListener("click", minPenDrive)
document.getElementById("lineMax").addEventListener("click", maxLineDrive)
document.getElementById("lineMin").addEventListener("click", minLineDrive)
document.getElementById("eraserClick").addEventListener("click", eraserClick);
document.getElementById("driweButton").addEventListener("click", driweButton);
document.getElementById("redriweButton").addEventListener("click", RemoveLastPixel);
document.getElementById("pipetteButton").addEventListener("click", pipetteActive);
document.getElementById("lineButton").addEventListener("click", lineButton);
document.getElementById("RelineButton").addEventListener("click", RemoveLastLine);
document.getElementById("colorLoc").addEventListener("click", colorLoc);
document.getElementById("download").addEventListener("click", downloadImage);