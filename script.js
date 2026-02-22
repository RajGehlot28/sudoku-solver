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

function showLoader() {
    loaderOverlay.classList.add('active');
}

function hideLoader() {
    loaderOverlay.classList.remove('active');
}

// for initializing the board
for(let i = 0; i < gridSize; i++) {
    puzzleBoard[i] = [];
    originalPuzzle[i] = [];
    for(let j = 0; j < gridSize; j++) {
        puzzleBoard[i][j] = 0;
        originalPuzzle[i][j] = 0;
    }
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

// this prints the grid
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
            }
            else {
                cell.textContent = value;
                
                if(originalPuzzle[row][col] !== 0) {
                    cell.classList.add('pre-filled');
                    cell.setAttribute('contenteditable', false);
                }
                else {
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
        }
        else {
            puzzleBoard[row][col] = 0;
        }
    }
}

function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = type + ' visible';
    setTimeout(function() {
        messageBox.classList.remove('visible');
    }, 3000);
}

function getPuzzle() {
    showLoader();
    fetch('https://sugoku.onrender.com/board?difficulty=easy')
        .then(response => {
            if (!response.ok) {
                throw new Error('API Error');
            }
            return response.json();
        })
        .then(data => {
            for(let i = 0; i < gridSize; i++) {
                for(let j = 0; j < gridSize; j++) {
                    puzzleBoard[i][j] = data.board[i][j];
                    originalPuzzle[i][j] = data.board[i][j];
                }
            }

            let isApiBoardValid = true;
            for(let r = 0; r < gridSize; r++) {
                for(let c = 0; c < gridSize; c++) {
                    let num = puzzleBoard[r][c];
                    if(num !== 0) {
                        puzzleBoard[r][c] = 0;
                        if(!isNumberValid(puzzleBoard, r, c, num)) {
                            isApiBoardValid = false;
                        }
                        puzzleBoard[r][c] = num;
                    }
                    if(!isApiBoardValid) break;
                }
                if(!isApiBoardValid) break;
            }

            if(!isApiBoardValid) {
                showMessage('API returned an invalid puzzle!', 'error');
                clearBoard();
            }
            else {
                if(validateBtn) {
                    showGrid();
                }
                showMessage('New puzzle loaded!', 'success');
            }
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

function isNumberValid(board, row, col, num) {
    for(let i = 0; i < gridSize; i++) {
        if(board[row][i] === num) {
            return false;
        }
    }
    for(let i = 0; i < gridSize; i++) {
        if(board[i][col] === num) {
            return false;
        }
    }
    let boxStartRow = row - row%3;
    let boxStartCol = col - col%3;
    for(let r = 0; r < 3; r++) {
        for(let c = 0; c < 3; c++) {
            if(board[boxStartRow + r][boxStartCol + c] === num) {
                return false;
            }
        }
    }
    return true;
}

function getBestEmptyCell(board) {
    let bestChoice = null;
    let minChoice = 10;
    for(let r = 0; r < gridSize; r++) {
        for(let c = 0; c < gridSize; c++) {
            if(board[r][c] == 0) {
                let choices = 0;
                for(let num = 1; num <= 9; num++) {
                    if(isNumberValid(board, r, c, num)) choices++;
                }
                if(choices < minChoice) {
                    minChoice = choices;
                    bestChoice = [r, c];
                }
                if(choices == 1) {
                    return [r, c];
                }
            }
        }
    }
    return bestChoice;
}

function solveSudoku() {
    let emptyCell = getBestEmptyCell(puzzleBoard);
    if(emptyCell === null) {
        return true;
    }
    let row = emptyCell[0];
    let col = emptyCell[1];
    for(let num = 1; num <= 9; num++) {
        if(isNumberValid(puzzleBoard, row, col, num)) {
            puzzleBoard[row][col] = num;
            if(solveSudoku()) {
                return true;
            }
            puzzleBoard[row][col] = 0;
        }
    }
    return false;
}

function clickSolveButton() {
    readGridFromScreen();
    let boardIsGood = true;
    for(let r = 0; r < gridSize; r++) {
        for(let c = 0; c < gridSize; c++) {
            let num = puzzleBoard[r][c];
            if(num !== 0) {
                puzzleBoard[r][c] = 0;
                if(!isNumberValid(puzzleBoard, r, c, num)) {
                    boardIsGood = false;
                }
                puzzleBoard[r][c] = num;
            }
        }
    }
    if(!boardIsGood) {
        showMessage('Current board has mistakes. Cannot solve.', 'error');
        return;
    }
    if(solveSudoku()) {
        showGrid();
        showMessage('Puzzle solved!', 'success');
    }
    else {
        showMessage('No solution exists for this puzzle.', 'error');
    }
}

function clickValidateButton() {
    readGridFromScreen();
    let emptyCell = getBestEmptyCell(puzzleBoard);
    if(emptyCell !== null) {
        showMessage('Board is not complete!', 'info');
        return ;
    }
    let boardIsCorrect = true;
    for(let r = 0; r < gridSize; r++) {
        for(let c = 0; c < gridSize; c++) {
            let num = puzzleBoard[r][c];
            puzzleBoard[r][c] = 0;
            if(!isNumberValid(puzzleBoard, r, c, num)) {
                boardIsCorrect = false;
            }
            puzzleBoard[r][c] = num;
        }
    }
    if(boardIsCorrect) {
        showMessage('Congratulations! The solution is valid.', 'success');
    }
    else {
        showMessage('Solution is not valid.', 'error');
    }
}

getPuzzleBtn.addEventListener('click', function() {
    getPuzzle();
});

solvePuzzleBtn.addEventListener('click', function() {
    clickSolveButton();
});

validateBtn.addEventListener('click', function() {
    clickValidateButton();
});

clearBtn.addEventListener('click', function() {
    clearBoard();
});

gridContainer.addEventListener('keydown', function(e) {
    let cell = e.target;
    if(!cell.classList.contains('cell')) {
        return;
    }
    let isNumber = e.key >= '1' && e.key <= '9';
    let isBackspace = e.key === 'Backspace';
    let isDelete = e.key === 'Delete';
    if(!isNumber && !isBackspace && !isDelete) {
        e.preventDefault();
    }
});

gridContainer.addEventListener('input', function(e) {
    let cell = e.target;
    if(!cell.classList.contains('cell')) {
        return;
    }
    if(cell.textContent.length > 1) {
        cell.textContent = cell.textContent.slice(0, 1);
    }
});

makeGrid();
showGrid();
