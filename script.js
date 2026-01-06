let gridSize = 9;
let puzzleBoard = [];
let originalPuzzle = [];

let gridContainer = document.getElementById('sudoku-grid');
let getPuzzleBtn = document.getElementById('get-puzzle-btn');
let solvePuzzleBtn = document.getElementById('solve-puzzle-btn');
let validateBtn = document.getElementById('validate-btn');
let clearBtn = document.getElementById('clear-btn');
let messageBox = document.getElementById('message-box');

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

            if(value === 0) { // if there is empty cell -> print 0
                cell.textContent = '';
                cell.classList.remove('pre-filled');
                cell.setAttribute('contenteditable', true);
            }
            else {
                cell.textContent = value;
                
                if(originalPuzzle[row][col] !== 0) { // if this is from originalPizzle -> non-editable
                    cell.classList.add('pre-filled');
                    cell.setAttribute('contenteditable', false);
                }
                else { // it is from editable section -> user can hack the numbers here
                    cell.classList.remove('pre-filled');
                    cell.setAttribute('contenteditable', true);
                }
            }
        }
    }
}

// this function updates user input on puzzleBoard array
function readGridFromScreen() {
    let cells = gridContainer.children;
    for (let i = 0; i < cells.length; i++) {
        let row = Math.floor(i/gridSize);
        let col = i%gridSize;
        let value = cells[i].textContent.trim();
        // taking the value if and only if it is a number
        if(value >= '1' && value <= '9') {
            puzzleBoard[row][col] = parseInt(value);
        }
        else { // else the cell remains empty
            puzzleBoard[row][col] = 0;
        }
    }
}

// this function prints the messages in message box
function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = type + ' visible';

    // and remove the message after 3 second
    setTimeout(function() {
        messageBox.classList.remove('visible');
    }, 3000);
}

// this function fetches data(sudoku) from api and update our puzzleBoard and originalBoard according to the board
function getPuzzle() {
    fetch('https://sugoku.onrender.com/board?difficulty=easy')
        .then(response => {
            if (!response.ok) {
                throw new Error('API Error');
            }
            return response.json();
        })
        .then(data => {
            // board loaded -> update puzzleBoard and originalPuzzle
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    puzzleBoard[i][j] = data.board[i][j];
                    originalPuzzle[i][j] = data.board[i][j];
                }
            }
            showGrid();
            showMessage('New puzzle loaded!', 'success');
        })
        .catch(() => {
            showMessage('Could not fetch puzzle. Try again.', 'error');
        });
}

// this function clears the board by changing all values to 0 and print a message
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

// this function is used to check whether a number is valid or not
function isNumberValid(board, row, col, num) {
    // checking for each column
    for(let i = 0; i < gridSize; i++) {
        if(board[row][i] === num) {
            return false;
        }
    }
    
    // checking for rows
    for(let i = 0; i < gridSize; i++) {
        if(board[i][col] === num) {
            return false;
        }
    }
    
    // checking for the subgrid if this don't have the num
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

// it is finding empty cell where value has to be filled
function getBestEmptyCell(board) {
    // returning MRV(minimum remaining values) cell -> cell with minimum choices left
    let bestChoice = null;
    let minChoice = 10;
    for(let r = 0; r < gridSize; r++) {
        for(let c = 0; c < gridSize; c++) {
            if(board[r][c] == 0) {
                // return minimum choices cell such that tree would have less child at beginning
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

// this function solves the sudoku by self
function solveSudoku() {
    // providing the cell with less choices of numbers
    let emptyCell = getBestEmptyCell(puzzleBoard);
    // if there are no empty cell left -> sudoku completed
    if(emptyCell === null) {
        return true;
    }
    let row = emptyCell[0];
    let col = emptyCell[1];

    // trying each number from 1 to 9 for that empty cell
    for(let num = 1; num <= 9; num++) {
        // checking if the number is valid to insert
        if(isNumberValid(puzzleBoard, row, col, num)) {
            puzzleBoard[row][col] = num;
            //  going for recursive call with this number for board[row][col]
            if(solveSudoku()) {
                return true;
            }
            // backtracking, if no solution found with this number -> try to insert another number at that place
            puzzleBoard[row][col] = 0;
        }
    }
    // returning false if no matches found for the sudoku
    return false;
}

// this function first check for user input, if this is correct -> there is no conflict and then solves it
function clickSolveButton() {
    readGridFromScreen();
    
    // checking for each user input number if it is valid or not
    let boardIsGood = true;
    for(let r = 0; r < gridSize; r++) {
        for(let c = 0; c < gridSize; c++) {
            let num = puzzleBoard[r][c];
            if(num !== 0) {
                // we are changing value to 0 first because in our isNumberValid we checks the current position also
                // so replace that element to 0 and then check for its validity
                puzzleBoard[r][c] = 0;
                if(!isNumberValid(puzzleBoard, r, c, num)) { // wrong number is placed by user
                    boardIsGood = false;
                }
                // again place the value of that element
                puzzleBoard[r][c] = num;
            }
        }
    }
    
    // mistake found in sudoku
    if(!boardIsGood) {
        showMessage('Current board has mistakes. Cannot solve.', 'error');
        return;
    }

    // sudoku is correct(no conflicts) so solve it
    if(solveSudoku()) {
        showGrid();
        showMessage('Puzzle solved!', 'success');
    }
    else { // by chance if the sudoku can't be solve then print that no solution exist
        showMessage('No solution exists for this puzzle.', 'error');
    }
}

// this function checks if the board is valid or not
function clickValidateButton() {
    readGridFromScreen();
    
    // first it checks if there is an empty cell exist or not
    let emptyCell = getBestEmptyCell(puzzleBoard);
    if(emptyCell !== null) {
        // empty cell exist -> first complete the board
        showMessage('Board is not complete!', 'info');
        return ;
    }
    
    // checking if the solution is valid or not
    let boardIsCorrect = true;
    for(let r = 0; r < gridSize; r++) {
        for(let c = 0; c < gridSize; c++) {
            let num = puzzleBoard[r][c];
            // again make the value to zero(due to function - isNumberValid()) and check for the row, col and subgrid
            puzzleBoard[r][c] = 0;
            if(!isNumberValid(puzzleBoard, r, c, num)) {
                boardIsCorrect = false;
            }
            puzzleBoard[r][c] = num;
        }
    }
    
    // sudoku is valid
    if(boardIsCorrect) {
        showMessage('Congratulations! The solution is valid.', 'success');
    }
    else {
        showMessage('Solution is not valid.', 'error');
    }
}

// connecting all the buttons with their functions
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

// this functions are used to valid input -> the input can only be number
gridContainer.addEventListener('keydown', function(e) {
    let cell = e.target;
    // it ensures that user has typed on cell only not any other place
    if(!cell.classList.contains('cell')) {
        // not typed on cell so return
        return;
    }

    let isNumber = e.key >= '1' && e.key <= '9';
    let isBackspace = e.key === 'Backspace';
    let isDelete = e.key === 'Delete';

    // if the key press is not a number, backspace or delete don't take actions for that    
    if(!isNumber && !isBackspace && !isDelete) {
        e.preventDefault();
    }
});

gridContainer.addEventListener('input', function(e) {
    let cell = e.target;
    // it ensures that user has typed on cell only
    if(!cell.classList.contains('cell')) {
        // not typed on cell so return
        return;
    }
    
    // if the number is more than one digit number then consider only the first digit
    if(cell.textContent.length > 1) {
        cell.textContent = cell.textContent.slice(0, 1);
    }
});

// creates sudoku grid and print when the page is loaded
makeGrid();
showGrid();
