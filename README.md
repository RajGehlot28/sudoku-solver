
Sudoku Solver
A clean, interactive web-based Sudoku application that allows users to fetch new puzzles from an API, solve them manually, validate their progress, or solve them instantly using a backtracking algorithm.

🚀 Features
Fetch Puzzle: Pulls "Easy" difficulty puzzles from an external API (Sugoku).

Manual Play: Edit empty cells directly with built-in input validation (1-9 only).

Auto-Solve: Uses a backtracking algorithm to find a solution instantly.

Validation: Checks if your completed board follows all Sudoku rules.

Visual Styling: Bold borders for 3×3 subgrids and distinct styling for pre-filled vs. user-filled cells.

Responsive Design: Mobile-friendly layout using CSS Grid and Flexbox.

🛠️ Technology Stack
HTML5: Semantic structure.

CSS3: Modern styling with Inter font, Grid, and Hover effects.

JavaScript (Vanilla): DOM manipulation, Fetch API, and Recursive Backtracking.

📂 Project Structure
index.html: The main structure and UI elements.

style.css: All layout rules, including the 9×9 grid and button themes.

script.js: Logic for puzzle management, validation, and the solving algorithm.

🧩 How to Use
Get Puzzle: Click to load a new board. Pre-filled numbers will be locked.

Play: Click on any empty cell and type a number from 1 to 9.

Validate: Once the grid is full, click to see if your solution is correct.

Solve It: Stuck? Click this to let the algorithm finish the board for you.

Clear: Resets the entire grid to empty.

💡 Algorithm Details
The auto-solver uses a Depth-First Search (DFS) backtracking approach. It:

Searches for the next empty cell.

Tries numbers 1–9 sequentially.

Checks validity against the current row, column, and 3×3 subgrid.

Recursively moves to the next cell or backtracks if a conflict is found.
