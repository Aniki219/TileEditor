var tools = {
  "paintbrush": {
    mouseDown: placeBlock,
    mouseUp: null,
    active: drawCurrentBlock
  },

  "eye dropper": {
    mouseDown: null,
    mouseUp: eyeDrop,
  },

  "fill": {
    mouseDown: null,
    mouseUp: floodFill,
  },

  "move": {
    mouseDown: moveBlock,
    mouseUp: stopMove,
  },

  "undo": {
    active: undo,
    mouseDown: null,
    mouseUp: null,
  },

  "redo": {
    active: redo,
    mouseDown: null,
    mouseUp: null,
  },
}

var toolIcons;
var currentTool;
var prevTool = "paintbrush";
var movingBlock = null;

function toolsInit() {
  let ul = select("#paintTools");
  toolIcons = selectAll("img", "li", ul.elt);
  setTool("paintbrush");

  for(let tool of toolIcons) {
    $(tool.elt.parentNode).mousedown(() => setTool(tool.elt.title));
  }
}

function setTool(name) {
  for(let tool of toolIcons) {
    $(tool.elt.parentNode).css("outline", "none");
  }
  let selectedToolIcon = toolIcons.find((x) => x.elt.title == name).parent();
  $(selectedToolIcon).css("outline", "2px solid black");
  prevTool = currentTool;
  currentTool = name;
}

function doTool() {
  if (!tools[currentTool]) {return;}
  if (tools[currentTool].active) {tools[currentTool].active();}
  if (register["mouseleft"] && tools[currentTool].mouseDown) {
    tools[currentTool].mouseDown();
  }
  if (register["mouseright"]) {
    removeBlock();
  }
}

function toolMouseUp() {
  if (tools[currentTool] && tools[currentTool].mouseUp) {
    tools[currentTool].mouseUp();
  }
}

function floodFill() {
  if (!currentBlock || !mouseOnScreen()) {return;}
  let index = getMouseIndex();
  let giveUp = 1000;
  let fillType = currentBlock.copy();
  let replacing = (grid[index])?grid[index].type:null;
  recFill(index, replacing, fillType, giveUp);
}

function recFill(index, replacing, fillType, giveUp) {
  if (giveUp <= 0) {return;}
  if (index < 0 || index >= numRows * numCols) {return;}
  if ((!grid[index] && replacing) || (grid[index] && !replacing)) {return;}
  if (grid[index] && replacing && grid[index].type != replacing) {return;}
  grid[index] = fillType.copy();
  let row = floor(index/numCols);
  let col = index - row*numCols;
  grid[index].x = col * gridSize;
  grid[index].y = row * gridSize;
  recFill(index+numCols, replacing, fillType, giveUp-1);
  recFill(index-numCols, replacing, fillType, giveUp-1);
  if (col < numCols-1)
  recFill(index+1, replacing, fillType, giveUp-1);
  if (col > 0)
  recFill(index-1, replacing, fillType, giveUp-1);
}

function moveBlock() {
  if (movingBlock) {
    movingBlock.x = mouseX - movingBlock.ox;
    movingBlock.y = mouseY - movingBlock.oy;
    movingBlock.draw();
  } else {
    let index = getMouseIndex();
    if (!grid[index]) {return;}
    movingBlock = grid[index].copy();
    grid[index] = null;
    movingBlock.move = true;
    movingBlock.ox = mouseX - movingBlock.x;
    movingBlock.oy = mouseY - movingBlock.y;
  }

}

function stopMove() {
  let tile = movingBlock;
  if (!movingBlock) {return;}
    tile.move = false;
    tile.x = round(tile.x / gridSize)*gridSize;
    tile.y = round(tile.y / gridSize)*gridSize;
    let index = getGridIndex(tile);
    grid[index] = Object.assign(tile);

  movingBlock = null;
}

function undo() {
  if (currentTool == "undo") {setTool(prevTool);}
  if (prevGrids.length == 0) {return;}
  reGrids.push(grid.slice())
  grid = prevGrids.pop().slice();
  lastGrid = grid.slice();

}

function redo() {
  if (currentTool == "redo") {setTool(prevTool);}
  if (reGrids.length == 0) {return;}
  prevGrids.push(grid.slice());
  grid = reGrids.pop().slice();
  lastGrid = grid.slice();
}

function eyeDrop() {
  if (!mouseOnScreen() || !grid[getMouseIndex()]) {return;}
  currentBlock = grid[getMouseIndex()].copy();
  setTool(prevTool);
}
