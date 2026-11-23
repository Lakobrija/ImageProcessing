const canvas = document.getElementById("originalImage");
const ctx = canvas.getContext("2d");
const img = new Image();

const updatedCanvas = document.getElementById("updatedImage");
const updatedCtx = updatedCanvas.getContext("2d");

const secondCanvas = document.getElementById("secondImage");
const secondCtx = secondCanvas.getContext("2d");
const img2 = new Image();

const cleanCanvas = document.createElement("canvas");
const cleanCtx = cleanCanvas.getContext("2d");

function pickFile(onPicked) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function () {
        if (input.files[0]) onPicked(URL.createObjectURL(input.files[0]));
    };
    input.click();
}

function loadImage() {
    pickFile(function (url) {
        img.onload = function () {
            const scale = Math.min(1, 600 / img.width);
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);

            canvas.width = updatedCanvas.width = cleanCanvas.width = w;
            canvas.height = updatedCanvas.height = cleanCanvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            updatedCtx.drawImage(img, 0, 0, w, h);
            cleanCtx.drawImage(img, 0, 0, w, h);
            x1 = y1 = x2 = y2 = 0;
        };
        img.src = url;
    });
}

function loadSecondImage() {
    pickFile(function (url) {
        img2.onload = function () {
            const scale = Math.min(1, 600 / img2.width);
            const w = Math.round(img2.width * scale);
            const h = Math.round(img2.height * scale);

            secondCanvas.width = w;
            secondCanvas.height = h;
            secondCtx.drawImage(img2, 0, 0, w, h);
        };
        img2.src = url;
    });
}

function getSelection() {
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);

    if (w === 0 || h === 0) {
        return { x: 0, y: 0, w: canvas.width, h: canvas.height };
    }
    return { x: Math.min(x1, x2), y: Math.min(y1, y2), w, h };
}

function red() {
    const { x, y, w, h } = getSelection(); 
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;

    for(let i = 0; i < data.length; i += 4){
        data[i] = 255;
    }
    updatedCtx.putImageData(imgData, x, y);
}

function green() {
    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;

    for(let i = 1; i < data.length; i += 4){
        data[i] = 255;
    }
    updatedCtx.putImageData(imgData, x, y);
}

function blue() {
    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;

    for(let i = 2; i < data.length; i += 4){
        data[i] = 255;
    }
    updatedCtx.putImageData(imgData, x, y);
}

function pixelChange() {
    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;

    const mr = parseInt(document.getElementById("red").value);
    const mg = parseInt(document.getElementById("green").value);
    const mb = parseInt(document.getElementById("blue").value);

    for(let i = 0; i < data.length; i += 4){
        data[i] += mr;
        data[i + 1] += mg;
        data[i + 2] += mb;
    }
    updatedCtx.putImageData(imgData, x, y);
}

function greyscale() {
    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;

    for(let i = 0; i < data.length; i += 4){
        const grey = data[i] * 0.299
                   + data[i + 1] * 0.587
                   + data[i + 2] * 0.114;
        data[i] = data[i + 1] = data[i + 2] = grey;
    }
    updatedCtx.putImageData(imgData, x, y);
}

function negative() {
    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;

    for(let i = 0; i < data.length; i += 4){
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    updatedCtx.putImageData(imgData, x, y);
}

function gamma() {
    const gammaCorrection = parseFloat(prompt("Gamma value", 0.5));
    if (isNaN(gammaCorrection) || gammaCorrection <= 0) {
        return;
    }

    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 * Math.pow((data[i] / 255), gammaCorrection);
        data[i + 1] = 255 * Math.pow((data[i + 1] / 255), gammaCorrection);
        data[i + 2] = 255 * Math.pow((data[i + 2] / 255), gammaCorrection);
    }
    updatedCtx.putImageData(imgData, x, y);
}

function threshold() {
    const limit = parseInt(prompt("Threshold value", 128));
    if (isNaN(limit)) return;

    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;

    for(let i = 0; i < data.length; i += 4){
        const value = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2] >= limit) ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = value;
    }
    updatedCtx.putImageData(imgData, x, y);
}

function boxBlur() {
	const matrix = [[1, 1, 1],
				    [1, 1, 1],
				    [1, 1, 1]];

    kernel(matrix, 9);         
}

function gaussBlur() {
	const matrix = [[1, 2, 1],
                    [2, 4, 2],
                    [1, 2, 1]];

    kernel(matrix, 16);
}

function laplaceOperator() {
	const matrix = [[0, 1, 0],
				    [1, -4, 1],
				    [0, 1, 0]];
	
    kernel(matrix, 1);
}

function sobelOperator() {
	const matrix = [[1, 0, -1],
                    [2, 0, -2],
                    [1, 0, -1]];

    const matrix2 = [[1, 2, 1],
                     [0, 0, 0],
                     [-1, -2, -1]];               
	
    kernel2(matrix, matrix2);
}

function sobelOperatorX() {
	const matrix = [[1, 0, -1],
                    [2, 0, -2],
                    [1, 0, -1]];
    
    kernel3(matrix);
}

function sobelOperatorY() {
	const matrix = [[1, 2, 1],
                    [0, 0, 0],
                    [-1, -2, -1]]; 
	
    kernel3(matrix);
}

function highPassFilter() {
	const matrix = [[0, -1, 0],
				    [-1, 8, -1],
				    [0, -1, 0]];
	
    kernel(matrix, 4);
}

// Kernel function for box blur, gauss blur, laplace operator and high pass filter
function kernel(matrix, p) {
    const { x, y, w, h } = getSelection(); 
    const imgData = cleanCtx.getImageData(x, y, w, h);
    imgData.data.set(convolveData(imgData.data, w, h, matrix, p));
	updatedCtx.putImageData(imgData, x, y);
}

// Kernel function for sobel operator
function kernel2(matrix, matrix2) {
    const { x, y, w, h } = getSelection(); 
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;
    const src = data.slice();

    for (let i = 0; i < src.length; i += 4) {
        const grey = src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114;
        src[i] = src[i + 1] = src[i + 2] = grey;
    }

	for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
            let g1 = 0, g2 = 0;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = Math.min(h - 1, Math.max(0, row + dy));
                    const nx = Math.min(w - 1, Math.max(0, col + dx));
                    const v = src[(ny * w + nx) * 4];

                    g1 += v * matrix[dy + 1][dx + 1];
                    g2 += v * matrix2[dy + 1][dx + 1];
                }
            }

            const out = (row * w + col) * 4;
            data[out] = data[out + 1] = data[out + 2] = Math.abs(g1) + Math.abs(g2);
        }
    }
	updatedCtx.putImageData(imgData, x, y);
}

// Kernel function for sobel operator x and y
function kernel3(matrix) {
    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;
    const src = data.slice();

    for (let i = 0; i < src.length; i += 4) {
        const grey = src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114;
        src[i] = src[i + 1] = src[i + 2] = grey;
    }

	for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
            let g = 0;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = Math.min(h - 1, Math.max(0, row + dy));
                    const nx = Math.min(w - 1, Math.max(0, col + dx));

                    g += src[(ny * w + nx) * 4] * matrix[dy + 1][dx + 1];
                }
            }

            const out = (row * w + col) * 4;
            data[out] = data[out + 1] = data[out + 2] = Math.abs(g);
        }
    }
    updatedCtx.putImageData(imgData, x, y);
}

function medianFilter() {
    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
    const data = imgData.data;
    const src = data.slice();

	const medr = new Array(9);
    const medg = new Array(9);
    const medb = new Array(9);
    const byValue = (a, b) => a - b;

    for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
            let n = 0;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = Math.min(h - 1, Math.max(0, row + dy));
                    const nx = Math.min(w - 1, Math.max(0, col + dx));
                    const idx = (ny * w + nx) * 4;

                    medr[n] = src[idx];
                    medg[n] = src[idx + 1];
                    medb[n] = src[idx + 2];
                    n++;
                }
            }

            medr.sort(byValue);
            medg.sort(byValue);
            medb.sort(byValue);

            const out = (row * w + col) * 4;
            data[out] = medr[4];
            data[out + 1] = medg[4];
            data[out + 2] = medb[4];
        }
    }
    updatedCtx.putImageData(imgData, x, y);
}

function convolveData(src, w, h, matrix, p) {
    const out = new Float32Array(src.length);

    for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
            let r = 0, g = 0, b = 0;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = Math.min(h - 1, Math.max(0, row + dy));
                    const nx = Math.min(w - 1, Math.max(0, col + dx));
                    const idx = (ny * w + nx) * 4;
                    const k = matrix[dy + 1][dx + 1];

                    r += src[idx] * k;
                    g += src[idx + 1] * k;
                    b += src[idx + 2] * k;
                }
            }

            const o = (row * w + col) * 4;
            out[o] = r / p;
            out[o + 1] = g / p;
            out[o + 2] = b / p;
            out[o + 3] = src[o + 3];
        }
    }
    return out;
}

function sharpening() {
    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
	const data = imgData.data;

    const laplace = [[0, 1, 0],
                     [1, -4, 1],
                     [0, 1, 0]];

    const edges = convolveData(data, w, h, laplace, 1);

    const amount = 0.5;
	for (let i = 0; i < data.length; i += 4) {
        data[i] -= edges[i] * amount;
        data[i + 1] -= edges[i + 1] * amount;
        data[i + 2] -= edges[i + 2] * amount;
    }
	updatedCtx.putImageData(imgData, x, y);
}

function unsharpMasking() {
    const { x, y, w, h } = getSelection();
    const imgData = cleanCtx.getImageData(x, y, w, h);
	const data = imgData.data;

    const gauss = [[1, 2, 1],
                   [2, 4, 2],
                   [1, 2, 1]];

	const blurred = convolveData(data, w, h, gauss, 16);

    const amount = 1;
    for (let i = 0; i < data.length; i += 4) {
        data[i] += (data[i] - blurred[i]) * amount;
        data[i + 1] += (data[i + 1] - blurred[i + 1]) * amount;
        data[i + 2] += (data[i + 2] - blurred[i + 2]) * amount;
    }
    updatedCtx.putImageData(imgData, x, y);
}

function hybridImage() {
    const w = canvas.width;
    const h = canvas.height;

    if (secondCanvas.width !== w || secondCanvas.height !== h) {
        alert("Both images must have the same dimensions.");
        return;
    }

    const imgData = cleanCtx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const data2 = secondCtx.getImageData(0, 0, w, h).data;

    const gauss = [[1, 2, 1],
                   [2, 4, 2],
                   [1, 2, 1]];

    let blur1 = data;
    for (let n = 0; n < 10; n++) {
        blur1 = convolveData(blur1, w, h, gauss, 16);
    }

    let blur2 = data2;
    for (let n = 0; n < 50; n++) {
        blur2 = convolveData(blur2, w, h, gauss, 16);
    }

    const detail = 1.5;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = (data[i] - blur1[i]) * detail + blur2[i];
        data[i + 1] = (data[i + 1] - blur1[i + 1]) * detail + blur2[i + 1];
        data[i + 2] = (data[i + 2] - blur1[i + 2]) * detail + blur2[i + 2];
    }
    updatedCtx.putImageData(imgData, 0, 0);
}

function updatedImage(){
    ctx.drawImage(updatedCanvas, 0, 0);
    cleanCtx.drawImage(updatedCanvas, 0, 0);
}

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top)
    };
}

let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
let mousedown = false;

$(canvas).on('mousedown', function(e) {
    mousedown = true;
    const p = getPos(e);
    x2 = x1 = p.x;
    y2 = y1 = p.y;
});

$(canvas).on('mouseup', function(e) {
    mousedown = false;

    if (x1 === x2 || y1 === y2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(cleanCanvas, 0, 0);
    }
});

$(canvas).on('mousemove', function(e) {
    if (!mousedown) return;
    const p = getPos(e);
    x1 = p.x;
    y1 = p.y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cleanCanvas, 0, 0);
    ctx.beginPath();
    ctx.rect(x2, y2, x1 - x2, y1 - y2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    //$('#output').html('current: '+ x1 +', '+ y1 +'<br/>last: '+ x2 +', ' + y2 +'<br/>mousedown: ' + mousedown);
});
