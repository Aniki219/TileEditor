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

  "select": {
    mouseDown: selectDown,
    mouseUp: selectUp,
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
var selectionBox = null;

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

function selectUp() {
  if (selectionBox) {
    let sx = min(selectionBox.x1, selectionBox.x2);
    let sw = max(selectionBox.x1, selectionBox.x2) - sx;
    let sy = min(selectionBox.y1, selectionBox.y2);
    let sh = max(selectionBox.y1, selectionBox.y2) - sy;
    for(tile of grid) {
      if (!tile) {continue;}
      if (tile.x + tile.w > sx && tile.x < sx + sw && tile.y + tile.h > sy && tile.y < sy + sh) {
        tile.selected = !register[CONTROL];
      }
    }
  }

  selectionBox = null;
  if (!mouseOnScreen()) {return;}

  let index = getMouseIndex();
  if (grid[index]) {
    grid[index].selected = !register[CONTROL];
  }
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

function selectDown() {
  if (!register[SHIFT] && !register[CONTROL]) {
    deselect();
  }
  noFill()
  stroke(255);
  if (selectionBox) {
    rect(selectionBox.x1, selectionBox.y1, selectionBox.x2 - selectionBox.x1, selectionBox.y2 - selectionBox.y1);
  }

  if (!mouseOnScreen()){return;}
  if (selectionBox) {
    selectionBox.x2 = mouseX;
    selectionBox.y2 = mouseY;
  } else {
    selectionBox = {
      x1: mouseX,
      y1: mouseY,
      x2: mouseX,
      y2: mouseY
    }
  }
}

function stopMove() {
  let tile = movingBlock;
  if (!movingBlock) {return;}
    tile.move = false;
    tile.x = round(tile.x / gridSize)*gridSize;
    tile.y = round(tile.y / gridSize)*gridSize;
    let index = getGridIndex(tile);
    grid[index] = tile.copy();
    grid[index].selected = true;

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

function toolHotKeys() {
  if (register[DELETE] || register[BACKSPACE]) {
    deleteSelected()
  }
  if (getKey('B') || getKey('P')) {setTool("paintbrush")};
  if (getKey('F')) {setTool("fill")};
  if (getKey('S')) {setTool("select")};
  if (getKey('M') || getKey('P')) {setTool("move")};
  if (getKey('D') || getKey('E')) {setTool("eye dropper")};
  if (getKey('U') || register[CONTROL] && getKey('Z')) {
    register['Z'.charCodeAt(0)] = false;
    register['U'.charCodeAt(0)] = false;
    undo();
  }
  if (getKey('R') || register[CONTROL] && getKey('Y')) {
    register['Y'.charCodeAt(0)] = false;
    redo();
  }
  if (register[ESCAPE]) {
    deselect();
  }
}

function deselect() {
  for(let tile of grid) {
    if (!tile) {continue;}
    tile.selected = false;
  }
}

function setCursor() {
  if (!mouseOnScreen()) {cursor(); return};
  switch (currentTool) {
    case "paintbrush":
      (currentBlock)?noCursor():cursor();
      break;
    case "eye dropper":
      cursor();
      break;
    case "fill":
      (currentBlock)?noCursor():cursor();
      break;
    case "select":
      cursor(CROSS);
      break;
    case "move":
      cursor("https://i.imgur.com/oARFZrU.png");
      break;
    default:
      cursor();
  }
}

function deleteSelected() {
  for(let index = 0; index < grid.length; index++) {
    let tile = grid[index];
    if (!tile || !tile.selected) {continue;}
    grid[index] = null;
  }
}
