// Restart
const restart = () => {
  window.location.reload();
};

// Mine & no mine arrays and counters
let gameScore = 0;
let mineCounter = 0;
let boardSize = 0;
let gameLevel = 0;
const mineArray = [];


// GAME MECHANICS ------------------------------------------------------- //

// Update score
const updateScore = () => {
  const htmlInfo = document.querySelector("h3");
  htmlInfo.innerText = "";
  htmlInfo.innerText = `Score: ${gameScore}`;
};

// Check if no mines left
const checkWin = () => {
  let unopened = document.querySelectorAll('.unopened').length;
  let questions = document.querySelectorAll('.question').length;
  const flagged = document.querySelectorAll('.flagged').length;
  if (unopened + flagged + questions === mineArray.length) {
    document.querySelectorAll('.unopened').forEach(item => item.classList.add("flagged"));
    document.querySelectorAll('.unopened').forEach(item => item.classList.remove("unopened"));
    document.querySelectorAll('.question').forEach(item => item.classList.add("flagged"));
    document.querySelectorAll('.question').forEach(item => item.classList.remove("questions"));
  }
  unopened = document.querySelectorAll('.unopened').length;
  questions = document.querySelectorAll('.question').length;
  if (unopened + questions === 0) {
    gameScore += flagged * gameLevel;
    updateScore();
    setTimeout(() => { alert(`You won with ${gameScore} points!`); }, 100);
    setTimeout(() => { restart(); }, 500);
  }
};

// Show mine burst
const mineBurst = (row, col) => {
  const tile = document.getElementById(`${row}-${col}`);
  tile.classList.remove("unopened");
  tile.classList.add("mine");
  updateScore();
  setTimeout(() => { alert(`You lost with ${gameScore} points!`); }, 100);
  setTimeout(() => { restart(); }, 500);
};

// Show result
const computeResult = (row, col) => {
  const tile = document.getElementById(`${row}-${col}`);
  tile.classList.remove("unopened");
  gameScore += gameLevel;
  if (mineCounter === 0) {
    tile.classList.add("opened");
  } else {
    tile.classList.add(`mine-neighbour-${mineCounter}`);
  }
  updateScore();
  checkWin();
};

// Mine count
const mineCount = (row, col) => {
  mineCounter = 0;
  for (let r = -1; r <= 1; r += 1) {
    for (let c = -1; c <= 1; c += 1) {
      if (mineArray.includes(`${row + r}-${col + c}`)) { mineCounter += 1; }
    }
  }
  computeResult(row, col);
  if (mineCounter === 0) {
    for (let r = -1; r <= 1; r += 1) {
      for (let c = -1; c <= 1; c += 1) {
        const calcRow = Math.min(Math.max(1, row + r), boardSize);
        const calcCol = Math.min(Math.max(1, col + c), boardSize);
        setTimeout(() => { document.getElementById(`${calcRow}-${calcCol}`).click(); }, 10);
      }
    }
  }
};

// Get left click
const leftClickTile = (row, col) => {
  // check if mine
  const burst = mineArray.includes(`${row}-${col}`);
  if (burst) {
    // show tile & end game
    mineBurst(row, col);
  } else {
    // show tile
    mineCount(row, col);
  }
};

// Get right click
const rightClickTile = (row, col) => {
  const tile = document.getElementById(`${row}-${col}`);
  if (tile.classList.contains("unopened")) {
    tile.classList.remove("unopened");
    tile.classList.add("flagged");
    checkWin();
  } else if (tile.classList.contains("flagged")) {
    tile.classList.remove("flagged");
    tile.classList.add("question");
  } else if (tile.classList.contains("question")) {
    tile.classList.remove("question");
    tile.classList.add("unopened");
  }
};

// SETUP ------------------------------------------------------- //

// Place mines
const placeMines = (size, diff) => {
  const mineCalc = 1 + (size ** 2) * (diff / 100);
  for (let m = 1; m <= mineCalc; m += 1) {
    let mineCoord = "";
    while (mineArray.join().includes(mineCoord) || mineCoord === "") {
      const randRow = 1 + Math.floor(Math.random() * size);
      const randCol = 1 + Math.floor(Math.random() * size);
      mineCoord = `${randRow}-${randCol}`;
    }
    mineArray.push(mineCoord);
  }
};

// Add event listener
const addListener = () => {
  const tiles = document.querySelectorAll("td");
  tiles.forEach((tile) => {
    tile.addEventListener('mousedown', (event) => {
      if (event.altKey) {
        const row = Number.parseInt(event.currentTarget.dataset.row, 10);
        const col = Number.parseInt(event.currentTarget.dataset.col, 10);
        rightClickTile(row, col);
      }
    });
    tile.addEventListener('click', (event2) => {
      if (event2.currentTarget.classList.contains("unopened") && event2.altKey === false) {
        const row = Number.parseInt(event2.currentTarget.dataset.row, 10);
        const col = Number.parseInt(event2.currentTarget.dataset.col, 10);
        leftClickTile(row, col);
      }
    });
  });
};

// Generate board
const generateBoard = (size, diff) => {
  const boardHtml = [];
  for (let r = 1; r <= size; r += 1) {
    boardHtml.push(`<tr>`);
    for (let c = 1; c <= size; c += 1) {
      boardHtml.push(`<td class="unopened" id="${r}-${c}" data-row=${r} data-col=${c}></td>`);
    }
    boardHtml.push('</tr>');
  }
  document.querySelector("#minesweeper tbody").insertAdjacentHTML('afterbegin', boardHtml.join(""));
  boardSize = size;
  addListener();
  placeMines(size, diff);
  updateScore();
};

// GAME RUNNER ------------------------------------------------------- //

const button = document.querySelector(".btn");
button.addEventListener('click', (event) => {
  event.preventDefault();
  event.currentTarget.disabled = true;
  boardSize = document.querySelector("#size").value * 1;
  gameLevel = document.querySelector("#diff").value * 1;
  generateBoard(boardSize, gameLevel);
});
