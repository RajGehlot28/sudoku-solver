let gridSize = 9;
let puzzleBoard = [];
let originalPuzzle = [];

let gridContainer = document.getElementById('sudoku-grid');
let getPuzzleBtn = document.getElementById('get-puzzle-btn');
let solvePuzzleBtn = document.getElementById('solve-puzzle-btn');
let validateBtn = document.getElementById('validate-btn');
let clearBtn = document.getElementById('clear-btn');
let messageBox = document.getElementById('message-box');
let loaderOverlay = document.getElementById('loader-overlay');
let loaderText = document.getElementById('loader-text');

// Initialize board
for(let i = 0; i < gridSize; i++) {
    puzzleBoard[i] = [];
    originalPuzzle[i] = [];
    for(let j = 0; j < gridSize; j++) {
        puzzleBoard[i][j] = 0;
        originalPuzzle[i][j] = 0;
    }
}

function showLoader(text = "Loading Sudoku...") {
    loaderText.textContent = text;
    loaderOverlay.classList.add('active');
    toggleButtons(true);
}

function hideLoader() {
    loaderOverlay.classList.remove('active');
    toggleButtons(false);
}

function toggleButtons(disabled) {
    getPuzzleBtn.disabled = disabled;
    solvePuzzleBtn.disabled = disabled;
    validateBtn.disabled = disabled;
    clearBtn.disabled = disabled;
}

function makeGrid() {
    gridContainer.innerHTML = '';
    for(let i = 0; i < 81; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('contenteditable', true);
        gridContainer.appendChild(cell);
    }
}

function showGrid() {
    let cells = gridContainer.children;
    for(let row = 0; row < gridSize; row++) {
        for(let col = 0; col < gridSize; col++) {
            let cellIndex = row * gridSize + col;
            let cell = cells[cellIndex];
            let value = puzzleBoard[row][col];

            if(value === 0) {
                cell.textContent = '';
                cell.classList.remove('pre-filled');
                cell.setAttribute('contenteditable', true);
            } else {
                cell.textContent = value;
                if(originalPuzzle[row][col] !== 0) {
                    cell.classList.add('pre-filled');
                    cell.setAttribute('contenteditable', false);
                } else {
                    cell.classList.remove('pre-filled');
                    cell.setAttribute('contenteditable', true);
                }
            }
        }
    }
}

function readGridFromScreen() {
    let cells = gridContainer.children;
    for(let i = 0; i < cells.length; i++) {
        let row = Math.floor(i/gridSize);
        let col = i%gridSize;
        let value = cells[i].textContent.trim();
        if(value >= '1' && value <= '9') {
            puzzleBoard[row][col] = parseInt(value);
        } else {
            puzzleBoard[row][col] = 0;
        }
    }
}

function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = type + ' visible';
    setTimeout(() => {
        messageBox.classList.remove('visible');
    }, 3000);
}

function getPuzzle() {
    showLoader("Fetching Sudoku from server...");

    fetch('https://sugoku.onrender.com/board?difficulty=easy')
        .then(response => {
            if (!response.ok) throw new Error('API Error');
            return response.json();
        })
        .then(data => {
            for(let i = 0; i < gridSize; i++) {
                for(let j = 0; j < gridSize; j++) {
                    puzzleBoard[i][j] = data.board[i][j];
                    originalPuzzle[i][j] = data.board[i][j];
                }
            }
            showGrid();
            showMessage('New puzzle loaded!', 'success');
        })
        .catch(() => {
            showMessage('Could not fetch puzzle. Try again.', 'error');
        })
        .finally(() => {
            hideLoader();
        });
}

function clearBoard() {
    for(let i = 0; i < gridSize; i++) {
        for(let j = 0; j < gridSize; j++) {
            puzzleBoard[i][j] = 0;
            originalPuzzle[i][j] = 0;
        }
    }
    showGrid();
    showMessage('Board cleared.', 'info');
}

getPuzzleBtn.addEventListener('click', getPuzzle);
clearBtn.addEventListener('click', clearBoard);

makeGrid();
showGrid();
