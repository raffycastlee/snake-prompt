const mainGrid = document.getElementById("main-box");
let currentSquare = document.querySelector("food");
let prevX = Math.floor(Math.random() * 40);
let prevY = Math.floor(Math.random() * 40);

const initBoard = () => {
  let rowIndex = 0;
  let columnIndex = 0;

  // console.log("entered init");

  mainGrid.replaceChildren(
    ...[...Array(40)].map(() => {
      columnIndex = 0;
      const row = document.createElement("div");

      // console.log(`creating ${rowIndex}th row`);

      row.setAttribute("class", "row");
      row.setAttribute("id", `row-${rowIndex++}`);
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

const generateApple = () => {
  // makes sure there's no repeat coords
  let x = Math.floor(Math.random() * 40);
  let y = Math.floor(Math.random() * 40);
  while (x === prevX && y === prevY) {
    x = Math.floor(Math.random() * 40);
    y = Math.floor(Math.random() * 40);
  }
  console.log(`setting new food square`);

  if (currentSquare !== null) {
    currentSquare.classList.remove("food");
    currentRow = document.querySelector(`#row-${y}`);
    currentSquare = currentRow.querySelector(`#column-${x}`);
    currentSquare.setAttribute("class", "column food");
  } else {
    currentRow = document.querySelector(`#row-${y}`);
    console.log(y);
    console.log(currentRow);
    currentSquare = currentRow.querySelector(`#column-${x}`);
    currentSquare.setAttribute("class", "column food");
  }
};

initBoard();
generateApple();
setInterval(generateApple, 10000);
