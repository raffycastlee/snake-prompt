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

  // console.log("entered init");

  // create rows...
  mainGrid.replaceChildren(
    ...[...Array(40)].map(() => {
      // reset column# for each row
      columnIndex = 0;
      const row = document.createElement("div");

      // console.log(`creating ${rowIndex}th row`);

      row.setAttribute("class", "row");
      row.setAttribute("id", `row-${rowIndex++}`);
      // create columns
      row.replaceChildren(
        ...[...Array(40)].map(() => {
          const column = document.createElement("div");

          // console.log(`creating ${columnIndex}th column`);

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

  // console.log(`setting new food square`);

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
  body: [],
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
    // console.log(headSquare.classList[1]);
    if (headSquare.classList[1] === "food") {
      updateCurrScore();
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
  if (playerData.orientation === "Left") {
    playerData.head[0]--;
    // console.log("snake left");
  } else if (playerData.orientation === "Right") {
    playerData.head[0]++;
    // console.log("snake right");
  } else if (playerData.orientation === "Down") {
    playerData.head[1]++;
    // console.log("snake down");
  } else if (playerData.orientation === "Up") {
    playerData.head[1]--;
    // console.log("snake up");
  } else {
    // all other keypresses just ignore
    // console.log("keypress ignored");
  }

  // console.log(playerData.head)
  try {
    generateSnake(playerData.head[0], playerData.head[1]);
  } catch (err) {
    terminateGame();
  }
};

// flag to check if game has already started
let gameStarted = false;
// starts game
onkeydown = (e) => {
  console.log(e.key.slice(5));
  console.log(gameStarted);
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
  // console.log(playerData);
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
  updateHighScore();
  gameStarted = false;
  clearInterval(snakeInterval);
  clearInterval(foodInterval);
  initBoard();
  generateApple(10, 30);
  generateSnake(30, 10);
};

// ------------------ START GAME ------------------ //
terminateGame();
// setInterval(generateApple, 10);
