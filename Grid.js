var grid = [];

var gridSize = 32;
var gridTransparency = 100;
var numCols;
var numRows;
var copiedBlocks = [];
var pastedBlocks = [];

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

function placeBlock(block) {
  let numCol = floor(width/gridSize);
  let numRow = floor(height/gridSize);
  if (block && mouseOnScreen) {
    for(let xx = 0; xx < block.sw; xx += gridSize) {
      for(let yy = 0; yy < block.sh; yy += gridSize) {
        let t = new Tile(block);
        t.x += xx;
        t.y += yy;
        t.sx += xx;
        t.sy += yy;
        t.sw = gridSize;
        t.sh = gridSize;
        t.w = gridSize;
        t.h = gridSize;

        index = t.x / gridSize + t.y * numCol / gridSize;
        grid[index] = t;
      }
    }
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

  if (pastedBlocks.length > 0) {
    pastedBlocks.forEach(e => {
      let index = imageSourceArray.findIndex((src) => src == e.src);
      image(imageFiles[index], getGridXY(mouseX) - e.ox, getGridIndex(mouseY) - e.oy, e.w, e.h, e.sx, e.sy, e.sw, e.sh);
    })
    return;
  }
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

function gridMouse() {
  return {
    x: mouseX - mouseX % gridSize,
    y: mouseY - mouseY % gridSize
  }
}

function getGridXY(x, y) {
  return {
    x: x - x % gridSize,
    y: y - y % gridSize
  }
}

function gridChange() {
  if (register["mouseleft"] || register["mouseright"]) {return false;}
  if (grid.length != lastGrid.length) {return true;}
  for (let i = 0; i < grid.length; i++) {
    if (!lastGrid[i] && !grid[i]) {continue;}
    if ((!lastGrid[i] && grid[i]) || (lastGrid[i] && !grid[i])) {
      return true;
    }
    if (lastGrid[i].type != grid[i].type) {
      return true;
    }
  }
  return false;
}

function selectedBlocks() {
  return grid.filter(b => {
    if (!b) {
      return false;
    } else {
      return b.selected;
    }
  })
}

function copySelection() {

  copiedBlocks = [];

  let blocks = selectedBlocks();
  if (!blocks || blocks.length <= 0) {return;}
  let startX = blocks[0].x;
  let startY = blocks[0].y;

  blocks.forEach((e) => {
    if (startX > e.x) {startX = e.x;}
    if (startY > e.y) {startY = e.y;}
  })

  blocks.forEach((e) => {
    let newBlock = e.copy();
    newBlock.ox = startX - e.x;
    newBlock.oy = startY - e.y;
    copiedBlocks.push(newBlock);
  });
}

function pasteSelection() {
  setTool("paintbrush");
  pastedBlocks = [];
  copiedBlocks.forEach((e) => {
    let newBlock = e.copy();
    newBlock.ox = e.ox;
    newBlock.oy = e.oy;
    pastedBlocks.push(newBlock);
  });
}
