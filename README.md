# 🧩 Sudoku Solver

A clean and interactive web-based Sudoku application that lets users fetch new puzzles, solve them manually, validate their solution, or instantly solve the board using a backtracking algorithm.

---

## 🚀 Features

- **Fetch Puzzle**  
  Load an **Easy** difficulty Sudoku puzzle from the Sugoku API.

- **Manual Play**  
  Fill empty cells directly with input validation (**1–9 only**).

- **Auto Solve**  
  Instantly solves the puzzle using a **DFS backtracking algorithm**.

- **Validation**  
  Checks whether the completed board follows all Sudoku rules.

- **Visual Styling**  
  - Bold borders for **3×3 subgrids**  
  - Clear distinction between **pre-filled** and **user-filled** cells

- **Responsive Design**  
  Works smoothly on both **desktop and mobile devices**.

---

## 🛠️ Technology Stack

- **HTML5** – Semantic structure  
- **CSS3** – Grid layout, Flexbox, Inter font, and hover effects  
- **JavaScript (Vanilla)** – DOM manipulation, Fetch API, and recursive backtracking  

---

📂 Project Structure
  ```
  ├── index.html   # Main UI and structure
  ├── style.css    # Styling for grid, buttons, and layout
  └── script.js    # Puzzle logic, validation, and solver
  ```

## 🧩 How to Use

- **Get Puzzle** – Fetches a new Sudoku board (pre-filled cells are locked).  
- **Play** – Click an empty cell and enter a number from **1 to 9**.  
- **Validate** – Checks whether your filled board is a valid solution.  
- **Solve It** – Automatically completes the puzzle using the solver.  
- **Clear** – Resets the board to an empty state.

---

## 💡 Algorithm Details

The auto-solver uses a **Depth-First Search (DFS) backtracking approach**:

- Finds the next empty cell  
- Tries numbers from **1 to 9**  
- Checks validity for:
  - Current row  
  - Current column  
  - Current **3×3 subgrid**
- Recursively proceeds or backtracks on conflict  

This guarantees a correct solution if one exists.
