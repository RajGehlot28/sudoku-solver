let arr = [[], [], [], [], [], [], [], [], []];
let board = [[], [], [], [], [], [], [], [], []];

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        const id = i * 9 + j;
        arr[i][j] = document.getElementById(id);
        arr[i][j].contentEditable = true;
        board[i][j] = 0;
    }
}

const messageBox = document.getElementById('messageBox');

function showMessage(text, type) {
    messageBox.innerText = text;
    messageBox.className = 'message-box ' + type;
    setTimeout(function() {
        messageBox.innerText = '';
        messageBox.className = 'message-box';
    }, 3000);
}

function fillBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const val = board[i][j];
            arr[i][j].innerText = val !== 0 ? val : '';
        }
    }
}

function readBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const text = arr[i][j].innerText;
            const num = parseInt(text);
            board[i][j] = isNaN(num) ? 0 : num;
        }
    }
}

function hasInvalidInput() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const val = board[i][j];
            if (val < 0 || val > 9) {
                return true;
            }
        }
    }
    return false;
}

function isBoardEmpty() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                return false;
            }
        }
    }
    return true;
}

function isBoardComplete() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

const getBtn = document.getElementById('GetPuzzle');
const solveBtn = document.getElementById('SolvePuzzle');
const validateBtn = document.getElementById('Validate');
const clearBtn = document.getElementById('Clear');

getBtn.onclick = function() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        const response = JSON.parse(xhr.response);
        board = response.board;
        fillBoard();
        showMessage('Puzzle loaded successfully!', 'success');
    };
    xhr.onerror = function() {
        showMessage('Failed to load puzzle. Please try again.', 'error');
    };
    xhr.open('GET', 'https://sugoku.onrender.com/board?difficulty=easy');
    xhr.send();
};

solveBtn.onclick = function() {
    readBoard();
    
    if (isBoardEmpty()) {
        showMessage('Board is empty! Please get a puzzle or enter numbers.', 'error');
        return;
    }
    
    if (hasInvalidInput()) {
        showMessage('Invalid input! Please enter numbers between 1-9 only.', 'error');
        return;
    }
    
    if (!isBoardValid()) {
        showMessage('Board has conflicts! Cannot solve.', 'error');
        return;
    }
    
    if (solveSudoku(0, 0)) {
        fillBoard();
        showMessage('Puzzle solved successfully!', 'success');
    } else {
        showMessage('No solution exists for this puzzle.', 'error');
    }
};

validateBtn.onclick = function() {
    readBoard();
    
    if (isBoardEmpty()) {
        showMessage('Board is empty! Please enter some numbers.', 'error');
        return;
    }
    
    if (hasInvalidInput()) {
        showMessage('Invalid input! Please enter numbers between 1-9 only.', 'error');
        return;
    }
    
    if (!isBoardComplete()) {
        showMessage('Board is incomplete! Please fill all cells.', 'error');
        return;
    }
    
    if (isBoardValid()) {
        showMessage('Board is valid! No conflicts found.', 'success');
        highlightCells('green');
    } else {
        showMessage('Board has conflicts! Please check your entries.', 'error');
        highlightCells('red');
    }
};

clearBtn.onclick = function() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j] = 0;
        }
    }
    fillBoard();
    showMessage('Board cleared!', 'info');
};

function isBoardValid() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const num = board[i][j];
            if (num !== 0) {
                board[i][j] = 0;
                if (!isSafe(i, j, num)) {
                    board[i][j] = num;
                    return false;
                }
                board[i][j] = num;
            }
        }
    }
    return true;
}

function isSafe(row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (board[r][c] === num) {
                return false;
            }
        }
    }
    return true;
}

function solveSudoku(row, col) {
    if (row === 9) {
        return true;
    }
    if (col === 9) {
        return solveSudoku(row + 1, 0);
    }
    if (board[row][col] !== 0) {
        return solveSudoku(row, col + 1);
    }
    for (let num = 1; num <= 9; num++) {
        if (isSafe(row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(row, col + 1)) {
                return true;
            }
            board[row][col] = 0;
        }
    }
    return false;
}

function highlightCells(color) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            arr[i][j].style.borderColor = color;
        }
    }
    setTimeout(function() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                arr[i][j].style.borderColor = '';
            }
        }
    }, 1000);
}