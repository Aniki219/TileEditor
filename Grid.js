function resizeGrid(newCols, newRows) {
  resizeCanvas(250,250)
  let cols = floor(width/gridSize);
  let rows = floor(width/gridSize);

  let dcols = newCols - cols;
  let drows = newRows - rows;

  let newGrid = [];
  for(var index = 0; index<grid.length; index++) {
    if (!grid[index]) {continue;}
    let row = floor(index / cols);
    let col = index - row * cols;
    let newCol = col + row * dcols;
    let newIndex = newCol + row * newCols;
    newGrid[newIndex] = grid[index];
  }

  numCols = newCols;
  numRows = newRows;
}

function drawGrid() {
  stroke(255);
  for(var x = 0; x < numCols*gridSize; x += gridSize) {
    line(x, 0, x, height);
  }
  for (var y = 0; y < numRows*gridSize; y += gridSize) {
    line(0, y, width, y);
  }

  for (let tile of grid) {
    if (!tile) {continue;}
    fill(tile.clr);
    rect(tile.x, tile.y, tile.w, tile.h);
  }
}

function placeBlock() {
  let numCol = floor(width/gridSize);
  let numRow = floor(height/gridSize);
  if (currentBlock && mouseOnScreen) {
    index = currentBlock.x / gridSize + currentBlock.y * numCol / gridSize;
    grid[index] = {};
    for (let key in currentBlock) {
      grid[index][key] = currentBlock[key];
    }
  }
}

function removeBlock() {
  let xx = (mouseX);
  let yy = (mouseY);

  grid = grid.filter((tile) => {
    return !(tile.x + tile.w > xx && tile.x < xx &&
      tile.y + tile.h > yy && tile.y < yy)
  })
}

function drawCurrentBlock() {
    if (!currentBlock) {return};
    currentBlock.x = mouseX - mouseX % gridSize;
    currentBlock.y = mouseY - mouseY % gridSize;
    noStroke();
    fill(currentBlock.clr);
    rect(currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h);
}

function setGridSize() {
  if (gridSizeInput.value() > 0) {
    gridSize = parseInt(gridSizeInput.value());
  }
}
