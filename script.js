// YOINKED FROM THE WEB
// https://www.geeksforgeeks.org/deque-in-javascript/
// DEQUE bc built-in js is apparently trash!
class Deque {
  constructor() {
    this.deque = [];
  }

  addFront(element) {
    this.deque.unshift(element);
  }

  addRear(element) {
    this.deque.push(element);
  }

  removeFront() {
    if (!this.isEmpty()) {
      return this.deque.shift();
    }
    return null;
  }

  removeRear() {
    if (!this.isEmpty()) {
      return this.deque.pop();
    }
    return null;
  }

  getFront() {
    if (!this.isEmpty()) {
      return this.deque[0];
    }
    return null;
  }

  getRear() {
    if (!this.isEmpty()) {
      return this.deque[this.size() - 1];
    }
    return null;
  }

  isEmpty() {
    return this.deque.length === 0;
  }

  size() {
    return this.deque.length;
  }
}

// // Create a e
// const deque = new Deque();

// // Adding 10, 20 to end of deque
// deque.addRear(10);
// deque.addRear(20);

// // Adding 5 to the front of deque
// deque.addFront(5);

// // Accessing deque array from deque object

// // Get first element of deque

// // Get last element of deque

// // Removing item at the front of array
// deque.removeFront();

// // Removing item at the end of array
// deque.removeRear();
// obtain necessary elements
const mainGrid = document.getElementById("main-box");
let foodSquare = document.querySelector("food");
let headSquare = document.querySelector("head");
// start food at (30, 10)
let prevX = 0;
let prevY = 0;
// start snake at (10,30)
let headX = 0;
let headY = 0;
// for resetting the food reset interval
let foodInterval;
let snakeInterval;

const initBoard = () => {
  // coordinates for squares
  let rowIndex = 0;
  let columnIndex = 0;

  // create rows...
  mainGrid.replaceChildren(
    ...[...Array(40)].map(() => {
      // reset column# for each row
      columnIndex = 0;
      const row = document.createElement("div");

      row.setAttribute("class", "row");
      row.setAttribute("id", `row-${rowIndex++}`);
      // create columns
      row.replaceChildren(
        ...[...Array(40)].map(() => {
          const column = document.createElement("div");

          column.setAttribute("class", "column");
          column.setAttribute("id", `column-${columnIndex++}`);
          return column;
        })
      );
      return row;
    })
  );
};

const generateApple = (
  // randomizes the apple coordinates for every call
  x = Math.floor(Math.random() * 40),
  y = Math.floor(Math.random() * 40)
) => {
  // makes sure that new coord != most recent/last coord
  // TODO: logic has to account for snake body
  while (x === prevX && y === prevY) {
    x = Math.floor(Math.random() * 40);
    y = Math.floor(Math.random() * 40);
  }
  // keeps track of what the previous coord was!
  prevX = x;
  prevY = y;

  // just the base case
  // there has to be a better way to handle this
  if (foodSquare !== null) {
    foodSquare.classList.remove("food");
    currentRow = document.querySelector(`#row-${y}`);
    foodSquare = currentRow.querySelector(`#column-${x}`);
    foodSquare.setAttribute("class", "column food");
  } else {
    currentRow = document.querySelector(`#row-${y}`);
    foodSquare = currentRow.querySelector(`#column-${x}`);
    foodSquare.setAttribute("class", "column food");
  }
};

// stores snake data
let playerData = {
  head: [],
  length: 1,
  orientation: null,
  tempOrientation: null,
  // body is going to be an arr of xy values
  body: new Deque(),
  currScore: 0,
  highScore: 0,
};

const generateSnake = (x, y) => {
  // base case again
  // again there has to be a better way to do base case
  if (headSquare !== null) {
    headSquare.classList.remove("head");
    currentRow = document.querySelector(`#row-${y}`);
    headSquare = currentRow.querySelector(`#column-${x}`);
    // holy shit how do i handle collision
    if (headSquare.classList[1] === "food") {
      updateCurrScore();

      // append to body
      playerData.body.addRear([x, y]);

      // resets the food
      clearInterval(foodInterval);
      generateApple();
      foodInterval = setInterval(generateApple, 5000);
    }
    headSquare.setAttribute("class", "column head");
    playerData.head[0] = x;
    playerData.head[1] = y;
  } else {
    currentRow = document.querySelector(`#row-${y}`);
    headSquare = currentRow.querySelector(`#column-${x}`);
    // holy shit how do i handle collision
    headSquare.setAttribute("class", "column head");
    playerData.head[0] = x;
    playerData.head[1] = y;
  }
};

const generateBody = (coords) => {
  for (const val of coords.deque) {
    currentRow = document.querySelector(`#row-${val[1]}`);
    let body = currentRow.querySelector(`#column-${val[0]}`);
    // holy shit how do i handle collision
    body.setAttribute("class", "column body");
  }
};

const clearTile = (coord) => {
  currentRow = document.querySelector(`#row-${coord[1]}`);
  let body = currentRow.querySelector(`#column-${coord[0]}`);

  body.setAttribute("class", "column");
};

const updateCurrScore = () => {
  document.getElementById(
    "current-score-box"
  ).textContent = `current score: ${++playerData.currScore}`;
};

const updateHighScore = () => {
  document.getElementById(
    "current-score-box"
  ).textContent = `current score: ${playerData.currScore}`;
  document.getElementById(
    "high-score-box"
  ).textContent = `high score: ${playerData.highScore}`;
};

const moveSnake = () => {
  playerData.orientation = playerData.tempOrientation;
  // how the fuck do i track the body?
  // can't be just a fade
  // i want to off myself

  let rearHolder = null;
  let prevHead = null;
  if (playerData.orientation === "Left") {
    prevHead = playerData.head;
    playerData.head[0]--;
    if (playerData.currScore > 0) {
      playerData.body.addFront([playerData.head[0], playerData.head[1]]);
      rearHolder = playerData.body.removeRear();
    }
  } else if (playerData.orientation === "Right") {
    prevHead = playerData.head;
    playerData.head[0]++;
    if (playerData.currScore > 0) {
      playerData.body.addFront([playerData.head[0], playerData.head[1]]);
      rearHolder = playerData.body.removeRear();
    }
  } else if (playerData.orientation === "Down") {
    prevHead = playerData.head;
    playerData.head[1]++;
    if (playerData.currScore > 0) {
      playerData.body.addFront([playerData.head[0], playerData.head[1]]);
      rearHolder = playerData.body.removeRear();
    }
  } else if (playerData.orientation === "Up") {
    prevHead = playerData.head;
    playerData.head[1]--;
    if (playerData.currScore > 0) {
      playerData.body.addFront([playerData.head[0], playerData.head[1]]);
      rearHolder = playerData.body.removeRear();
    }
  } else {
    // all other keypresses just ignore
  }

  try {
    generateSnake(playerData.head[0], playerData.head[1]);
    // if (prevHead) {
    //   playerData.body.addFront(prevHead);
    // }
    if (playerData.body.size() > 0) {
      generateBody(playerData.body);
    }
    if (rearHolder) {
      clearTile(rearHolder);
    }
  } catch (err) {
    console.log(err);
    terminateGame();
  }
};

// flag to check if game has already started
let gameStarted = false;
// starts game
onkeydown = (e) => {
  // makes sure generate doesn't happen more than once naturally
  if (!gameStarted) {
    gameStarted = true;
    foodInterval = setInterval(generateApple, 5000);
  }
  const keypress = e.key.slice(5);
  if (playerData.orientation === null) {
    snakeInterval = setInterval(moveSnake, 50);
    playerData.orientation = keypress;
    playerData.tempOrientation = keypress;
    // moveSnake();
    return;
  }
  // do keypress all conditions and stop
  // if the same as last. and if polar opposite
  // removes the 'Arrow'- prefix onkeydown event
  if (keypress === "Left") {
    if (
      keypress !== playerData.orientation &&
      playerData.orientation !== "Right"
    ) {
      playerData.tempOrientation = keypress;
    }
  } else if (keypress === "Right") {
    if (
      keypress !== playerData.orientation &&
      playerData.orientation !== "Left"
    ) {
      playerData.tempOrientation = keypress;
    }
  } else if (keypress === "Down") {
    if (
      keypress !== playerData.orientation &&
      playerData.orientation !== "Up"
    ) {
      playerData.tempOrientation = keypress;
    }
  } else if (keypress === "Up") {
    if (
      keypress !== playerData.orientation &&
      playerData.orientation !== "Down"
    ) {
      playerData.tempOrientation = keypress;
    }
  }
};

const terminateGame = () => {
  prevX = 0;
  prevY = 0;
  headX = 0;
  headY = 0;
  playerData.orientation = null;
  playerData.tempOrientation = null;
  playerData.head.length = 0;
  playerData.highScore = Math.max(playerData.currScore, playerData.highScore);
  playerData.currScore = 0;
  playerData.body = new Deque();
  gameStarted = false;
  updateHighScore();
  clearInterval(snakeInterval);
  clearInterval(foodInterval);
  initBoard();
  generateApple(10, 30);
  generateSnake(30, 10);
};

// ------------------ START GAME ------------------ //
terminateGame();
// setInterval(generateApple, 10);
