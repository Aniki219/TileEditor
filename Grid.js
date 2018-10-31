var grid = [];

var gridSize = 32;
var numCols;
var numRows;

function resizeGrid() {
  let newCols = $('#numColInput')[0].value;
  newCols = parseInt(newCols);
  let newRows = $('#numRowInput')[0].value;
  newRows = parseInt(newRows);

  let dcols = newCols - numCols;
  let drows = newRows - numRows;

  let newGrid = [];
  for(var index = 0; index<newCols*newRows; index++) {
    if (!grid[index]) {continue;}
    let row = floor(index / numCols);
    let newIndex = index + row * dcols;
    newGrid[newIndex] = grid[index];
  }
  grid = newGrid;

  numCols = newCols;
  numRows = newRows;
  resizeCanvas(newCols * gridSize, newRows * gridSize)
}

function drawGrid() {
  numCols = width/gridSize;
  numRows = height/gridSize;

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

function clearGrid() {
  grid = [];
}

function setGridSize(val) {
  if (val > 0) {
    gridSize = val;
    select('#gridSizeInput').value(val)
  }
}
