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
  "head": headSquare,
  "length": 1,
  "orientation": null
}

const generateSnake = (x,y) => {
  // base case again
  // again there has to be a better way to do base case
  if (headSquare !== null) {
    headSquare.classList.remove("head");
    currentRow = document.querySelector(`#row-${y}`);
    headSquare = currentRow.querySelector(`#column-${x}`); 
    // holy shit how do i handle collision
    headSquare.setAttribute("class", "column head");
  } else {
    currentRow = document.querySelector(`#row-${y}`);
    headSquare = currentRow.querySelector(`#column-${x}`);
    // holy shit how do i handle collision
    headSquare.setAttribute("class", "column head");
  }  
}

const moveSnake = (x,y) => {
  // how the fuck do i track the body?
  // can't be just a fade
  // i want to off myself
  if (playerData.orientation === 'Left') {

  } else if (playerData.orientation === 'Right') {

  } else if (playerData.orientation === 'Down') {

  } else if (playerData.orientation === 'Up') {

  } else { // all other keypresses just ignore

  }
}

// flag to check if game has already started
let gameStarted = false;
// starts game
onkeydown = (e) => {
  // removes the 'Arrow'- prefix onkeydown event
  playerData.orientation = e.key.slice(5);
  // makes sure generate doesn't happen more than once naturally
  if (!gameStarted) {
    gameStarted = true;
    setInterval(generateApple, 1000);
  }
  setInterval(moveSnake, 10);
}



// ------------------ START GAME ------------------ // 
initBoard();
generateApple(10, 30);
generateSnake(30, 10);
// setInterval(generateApple, 10);
