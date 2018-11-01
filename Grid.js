var grid = [];

var gridSize = 32;
var gridTransparency = 100;
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
  for(var index = 0; index<grid.length; index++) {
    if (!grid[index]) {continue;}

    let row = floor(index / numCols);
    let col = index - row*numCols;
    if (col >= newCols || row>=newRows) {continue;}
    let newIndex = index + row * dcols;

    newGrid[newIndex] = grid[index].copy();
  }
  grid = [];
  grid = newGrid.slice();

  numCols = newCols;
  numRows = newRows;
  resizeCanvas(newCols * gridSize, newRows * gridSize)
}

function drawGrid() {
  numCols = width/gridSize;
  numRows = height/gridSize;

  for (let tile of grid) {
    if (!tile) {continue;}
    tile.outline();
  }

  for (let tile of grid) {
    if (!tile) {continue;}
    tile.draw();
  }

  for (let tile of grid) {
    if (!tile) {continue;}
    tile.outline2();
  }

  stroke(255,255,255,gridTransparency);
  for(var x = 0; x < numCols*gridSize; x += gridSize) {
    line(x, 0, x, height);
  }
  for (var y = 0; y < numRows*gridSize; y += gridSize) {
    line(0, y, width, y);
  }
}

function placeBlock() {
  let numCol = floor(width/gridSize);
  let numRow = floor(height/gridSize);
  if (currentBlock && mouseOnScreen) {
    index = currentBlock.x / gridSize + currentBlock.y * numCol / gridSize;
    grid[index] = new Tile(currentBlock.type, currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h, currentBlock.clr)
  }
}

function removeBlock() {
  let xx = (mouseX);
  let yy = (mouseY);

  for(let tile of grid) {
    if (tile && tile.x + tile.w > xx && tile.x < xx &&
      tile.y + tile.h > yy && tile.y < yy) {
        let index = getGridIndex(tile.x, tile.y);
        grid[index] = null;
      }
  }
}

function drawCurrentBlock() {
  if (!currentBlock || !mouseOnScreen()) {return;}
    currentBlock.x = mouseX - mouseX % gridSize;
    currentBlock.y = mouseY - mouseY % gridSize;
    currentBlock.draw();
}

function getGridIndex(x, y = null) {
  let col, row;
  if (y != null) {
    col = floor(x/gridSize);
    row = floor(y/gridSize);
  } else {
    col = floor(x.x/gridSize);
    row = floor(x.y/gridSize);
  }
  return col + row * numCols;
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
