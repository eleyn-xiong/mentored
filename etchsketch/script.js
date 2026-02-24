// make the buttons interactive

const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
    button.addEventListener('click')
})

const gridContainer = document.getElementById('grid-container');
const sizeInput = document.getElementById('tileSize');
const btnReset = document.getElementById('reset');
const btnRainbow = document.getElementById('rainbow');
const btnEraser = document.getElementById('eraser');
const btnColor = document.getElementById('color');

let currentMode = 'color';
let isDrawing = false;
let gridSize = parseInt(sizeInput.value);

let cursorX = 0;
let cursorY = 0;

document.body.onmousedown = () => (isDrawing = true);
document.body.onmouseup = () => (isDrawing = false);

function createGrid(size) {
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = 'repeat(' + size + ', 1fr)';
    gridContainer.style.gridTemplateRows = 'repeat(' + size + ', 1fr)';

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        //give each cell an x and y coordinate for keyboard drawing
        cell.dataset.x = i % size;
        cell.dataset.y = Math.floor(i/size);

        //event listener for mouse drawing
        cell.addEventListener('mouseover', drawMouse);
        cell.addEventListener('mousedown', drawMouse);

        gridContainer.appendChild(cell);
    }

    //reset cursor position to center
    cursorX = Math.floor(size/2);
    cursorY = Math.floor(size/2);
    updateCursor();
}

function drawMouse(e) {
    //only draw when mouse is down or if mouseover event triggered by mousedown
    if (e.type === 'mouseover' && !isDrawing) return;
    applyColor(e.target);
}

function applyColor(cell) {
    if (currentMode === 'color') {
        cell.style.backgroundColor = 'black';
    } else if (currentMode === 'rainbow') {
        const randomR = Math.floor(Math.random() * 256);
        const randomG = Math.floor(Math.random() * 256);
        const randomB = Math.floor(Math.random() * 256);
        cell.style.backgroundColor = 'rgb(' + randomR + ',' + randomG + ',' + randomB + ')';
    } else if (currentMode === 'eraser'){
        cell.style.backgroundColor = 'white';
    }
}

function updateCursor() {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('cursor'));
    const cell = document.querySelector('.cell[data-x="' + cursorX + '"][data-y="' + cursorY + '"]');
    if (cell) cell.classList.add('cursor'); // find cell with matching coordinates and add cursor class
}

window.addEventListener('keydown', (e) => {

    //check if arrow key is pressed and update cursor position accordingly, then apply color to new cell
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();

        if (e.key === 'ArrowUp' && cursorY > 0) cursorY--;
        if (e.key === 'ArrowDown' && cursorY < gridSize - 1) cursorY++;
        if (e.key === 'ArrowLeft' && cursorX > 0) cursorX--;
        if (e.key === 'ArrowRight' && cursorX < gridSize - 1) cursorX++;
        updateCursor();

        const currentCell = document.querySelector('.cell[data-x = "' + cursorX + '"][data-y="' + cursorY + '"]');
        if (currentCell) applyColor(currentcell);
    }
})

btnReset.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.backgroundColor = 'white';
    });
});

btnColor.addEventListener('click', () => currentMode = 'color');
btnRainbow.addEventListener('click', () => currentMode = 'rainbow');
btnEraser.addEventListener('click', () => currentMode = 'eraser');

sizeInput.addEventListener('change', (e) => {
    let newSize = parseInt(e.target.value);

    if (newSize < 1) newSize = 1;
    if (newSize > 100) newSize = 100;

    gridSize = newSize;
    createGrid(gridSize);
})

createGrid(gridSize);