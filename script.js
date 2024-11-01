const mainGrid = document.getElementById("main-box");
let foodSquare = document.querySelector("food");
let headSquare = document.querySelector("head");

// state trackers
const playerData = {
  head: [],
  length: 1,
  orientation: null,
  tempOrientation: null,
  body: [],
  currScore: 0,
  highScore: 0,
};
let prevX = 0;
let prevY = 0;
let foodInterval;
let snakeInterval;
// currently not in use 
let playerDataCopy;

// wipes board clean
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
  // DONE: logic has to account for snake body
  while (x === prevX && y === prevY &&
         !playerData.head[0] === x && !playerData[1] === y &&
         !playerData.body.find(item => item[0] === x && item[1] === y)
  ) {
    x = Math.floor(Math.random() * 40);
    y = Math.floor(Math.random() * 40);
  }
  // to avoid prev and new tile conflict
  prevX = x;
  prevY = y;

  // if food square still exists, wipe that square
  if (foodSquare !== null) {
    foodSquare.classList.remove("food");
  }
  currentRow = document.querySelector(`#row-${y}`);
  foodSquare = currentRow.querySelector(`#column-${x}`);
  foodSquare.setAttribute("class", "column food");
};

const generateSnake = (x, y) => {
  // "moving" head coord
  if (headSquare !== null) {
    headSquare.classList.remove("head");
    currentRow = document.querySelector(`#row-${y}`);
    headSquare = currentRow.querySelector(`#column-${x}`);
    // if head is moving into food
    if (headSquare.classList[1] === "food") {
      updateCurrScore();
      // append to body
      playerData.body.unshift([x, y]);
      // resets the food
      // if this isn't done, interval gets messed up
      clearInterval(foodInterval);
      generateApple();
      foodInterval = setInterval(generateApple, 5000);
    } else if (headSquare.classList[1] === "body") {
      // game over!
      terminateGame();
      return;
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

// just making body tiles
const generateBody = (coords) => {
  for (const val of coords) {
    currentRow = document.querySelector(`#row-${val[1]}`);
    let body = currentRow.querySelector(`#column-${val[0]}`);
    body.setAttribute("class", "column body");
  }
};

// for wiping tail tile
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
  // finalizes movement input
  // has to be done to make game properly "run" on set interval
  playerData.orientation = playerData.tempOrientation;

  // to help wipe tail if it exists
  let rearHolder = null;

  // moving head according to input
  if (playerData.orientation === "Left") {
    prevHead = playerData.head;
    if (playerData.currScore > 0) {
      playerData.body.unshift([playerData.head[0], playerData.head[1]]);
      rearHolder = playerData.body.pop()
    }
    playerData.head[0]--;
  } else if (playerData.orientation === "Right") {
    prevHead = playerData.head;
    if (playerData.currScore > 0) {
      playerData.body.unshift([playerData.head[0], playerData.head[1]]);
      rearHolder = playerData.body.pop()
    }
    playerData.head[0]++;
  } else if (playerData.orientation === "Down") {
    prevHead = playerData.head;
    if (playerData.currScore > 0) {
      playerData.body.unshift([playerData.head[0], playerData.head[1]]);
      rearHolder = playerData.body.pop()
    }
    playerData.head[1]++;
  } else if (playerData.orientation === "Up") {
    prevHead = playerData.head;
    if (playerData.currScore > 0) {
      playerData.body.unshift([playerData.head[0], playerData.head[1]]);
      rearHolder = playerData.body.pop()
    }
    playerData.head[1]--;
  } else {
    // idk just blank for now
  }

  // if out of bounds
  if (playerData.head[0] < 0 || playerData.head[0] > 39 ||
      playerData.head[1] < 0 || playerData.head[1] > 39
  ) {
    terminateGame();
  }

  generateSnake(playerData.head[0], playerData.head[1]);
  if (playerData.body.length > 0) {
    console.log("generating body");
    console.log(playerData.body);
    generateBody(playerData.body);
  }

  // to wipe tail
  if (rearHolder) {
    clearTile(rearHolder);
  }
  // in case i want to do anything with previous gamestate
  playerDataCopy = JSON.parse(JSON.stringify(playerData));
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
  
  // removes the 'Arrow'- prefix onkeydown event
  const keypress = e.key.slice(5);

  // inits snake movement
  if (playerData.orientation === null) {
    snakeInterval = setInterval(moveSnake, 50);
    playerData.orientation = keypress;
    playerData.tempOrientation = keypress;
    return;
  }

  // validating keypresses
  // if the same as last. and if polar opposite
  switch (keypress) {
    case "Left":
      if (
        keypress !== playerData.orientation &&
        playerData.orientation !== "Right"
      ) {
        playerData.tempOrientation = keypress;
      }
      break;
    case "Right":
      if (
        keypress !== playerData.orientation &&
        playerData.orientation !== "Left"
      ) {
        playerData.tempOrientation = keypress;
      }
      break;
    case "Down":
      if (
        keypress !== playerData.orientation &&
        playerData.orientation !== "Up"
      ) {
        playerData.tempOrientation = keypress;
      }
      break;
    case "Up":
      if (
        keypress !== playerData.orientation &&
        playerData.orientation !== "Down"
      ) {
        playerData.tempOrientation = keypress;
      }
      break;
  }
};

const terminateGame = () => {
  if (playerData.currScore > playerData.highScore) {
    alert(`Game over! Click 'Okay' or Press <Enter> to restart.\nNew Best: ${playerData.currScore}`);
  } else {
    alert(`Game over! Click 'Okay' or Press <Enter> to restart.`);
  }
  clearInterval(snakeInterval);
  clearInterval(foodInterval);
  // GOOD OL' MANUAL STATE RESETS
  prevX = 0;
  prevY = 0;
  playerData.orientation = null;
  playerData.tempOrientation = null;
  playerData.head = [],
  playerData.highScore = Math.max(playerData.currScore, playerData.highScore);
  playerData.currScore = 0;
  playerData.body = [],
  gameStarted = false;
  updateHighScore();
  initBoard();
  generateApple(10, 30);
  generateSnake(30, 10);
};

// ------------------ GAME START ------------------ //
// - apateu-a-pateu apateu-a-pateu apateu-a-pateu - //
initBoard();
generateApple(10, 30);
generateSnake(30, 10);
alert(`Use <arrow> keys to move the snake!`)