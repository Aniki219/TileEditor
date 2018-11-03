var tools = {
  "paintbrush": {
    mouseDown: placeBlock,
    mouseUp: null,
    active: drawCurrentBlock
  },

  "rectangle": {
    mouseDown: showRect,
    mouseUp: placeRect,
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

  "none": {

  }
}

var toolIcons;
var currentTool;
var prevTool = "paintbrush";
var movingBlocks = [];
var rectBox = null;
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
  if (name == "") {return;}
  for(let tool of toolIcons) {
    $(tool.elt.parentNode).css("outline", "none");
  }
  prevTool = currentTool;
  currentTool = name;

  let selectedTool = toolIcons.find((x) => x.elt.title == name);
  if (!selectedTool) {return;}
  let selectedToolIcon = selectedTool.parent();
  $(selectedToolIcon).css("outline", "2px solid black");
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

function showRect() {
  if (!currentBlock) {return};
  if (rectBox) {
    rectBox.x2 = gridMouse().x;
    rectBox.y2 = gridMouse().y;
    for(let xx = min(rectBox.x1, rectBox.x2); xx <= max(rectBox.x1, rectBox.x2); xx+=gridSize) {
      for(let yy = min(rectBox.y1, rectBox.y2); yy <= max(rectBox.y1, rectBox.y2); yy+=gridSize) {
        fill(currentBlock.clr);
        rect(xx, yy, currentBlock.w, currentBlock.h);
      }
    }
  } else {
    rectBox = {
      x1: gridMouse().x,
      y1: gridMouse().y,
      x2: gridMouse().x,
      y2: gridMouse().y,
    }
  }
}

function placeRect() {
  if (!currentBlock) {return};
  if (rectBox) {
    rectBox.x2 = gridMouse().x;
    rectBox.y2 = gridMouse().y;
    for(let xx = min(rectBox.x1, rectBox.x2); xx <= max(rectBox.x1, rectBox.x2); xx+=gridSize) {
      for(let yy = min(rectBox.y1, rectBox.y2); yy <= max(rectBox.y1, rectBox.y2); yy+=gridSize) {
        let index = getGridIndex(xx, yy);
        data = currentBlock.copy();
        data.x = xx;
        data.y = yy;
        grid[index] = new Tile(data);
      }
    }
  }
  rectBox = null;
}

function eyeDrop() {
  if (!mouseOnScreen() || !grid[getMouseIndex()]) {return;}
  currentBlock = grid[getMouseIndex()].copy();
  setTool(prevTool);
}

function floodFill() {
  if (!currentBlock || !mouseOnScreen()) {return;}
  let index = getMouseIndex();
  let giveUp = 1000;
  let fillBlock = currentBlock.copy();
  let replaceType = (grid[index])?grid[index].type:null;
  if (fillBlock.type && replaceType && replaceType == fillBlock.type){return;}
  recFill(index, replaceType, fillBlock, giveUp);
}

function recFill(index, replaceType, fillBlock, giveUp) {
  if (giveUp <= 0) {return;}
  if (index < 0 || index >= numRows * numCols) {return;}
  if ((!grid[index] && replaceType) || (grid[index] && !replaceType)) {return;}
  if (grid[index] && replaceType && grid[index].type != replaceType) {return;}
  grid[index] = fillBlock.copy();
  let row = floor(index/numCols);
  let col = index - row*numCols;
  grid[index].x = col * gridSize;
  grid[index].y = row * gridSize;
  recFill(index+numCols, replaceType, fillBlock, giveUp-1);
  recFill(index-numCols, replaceType, fillBlock, giveUp-1);
  if (col < numCols-1)
  recFill(index+1, replaceType, fillBlock, giveUp-1);
  if (col > 0)
  recFill(index-1, replaceType, fillBlock, giveUp-1);
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

function selectDown() {
  if (grid[getMouseIndex()] && grid[getMouseIndex()].selected) {
    setTool("move");
    return;
  }
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

function moveBlock() {
  if (movingBlocks.length>0) {
    for(let block of movingBlocks) {
      block.x = mouseX - block.ox;
      block.y = mouseY - block.oy;
      block.draw();
    }
  } else {
    let index = getMouseIndex();
    if (grid[index]) {
      if(!grid[index].selected) {
        if (!register[SHIFT]) {deselect();}
        grid[index].selected = true;
      }
    } else {
      deselect();
      setTool("select");
    }
    for(let i = 0; i < grid.length; i++) {
      if (grid[i] && grid[i].selected) {
        let mb = grid[i].copy();
        grid[i] = null;
        mb.move = true;
        mb.ox = mouseX - mb.x;
        mb.oy = mouseY - mb.y;
        movingBlocks.push(mb);
      }
    }
  }
}

function stopMove() {
  for(let tile of movingBlocks) {
    tile.move = false;
    tile.x = round(tile.x / gridSize)*gridSize;
    tile.y = round(tile.y / gridSize)*gridSize;
    let index = getGridIndex(tile);
    if (index < 0 || index >= numCols * numRows) {continue;}
    grid[index] = tile.copy();
    grid[index].selected = true;
  }
  movingBlocks = [];
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

function toolHotKeys() {
  if (register[DELETE] || register[BACKSPACE]) {
    deleteSelected()
  }
  if (getKey('B') || getKey('P')) {setTool("paintbrush")};
  if (getKey('F')) {setTool("fill")};
  if (getKey('S')) {setTool("select")};
  if (getKey('M') || getKey('P')) {setTool("move")};
  if (getKey('D') || getKey('E')) {setTool("eye dropper")};
  if (register[CONTROL] && getKey('Z')) {
    register['Z'.charCodeAt(0)] = false;
    undo();
  }
  if (register[CONTROL] && getKey('Y')) {
    register['Y'.charCodeAt(0)] = false;
    redo();
  }
  if (register[CONTROL] && getKey('A')) {
    register['A'.charCodeAt(0)] = false;
    for(let tile of grid) {
      if (!tile) {continue;}
      tile.selected = true;
    }
  }
  if (register[ESCAPE]) {
    deselect();
  }
}

function deselect() {
  for(let tile of grid) {
    if (!tile) {continue;}
    tile.selected = false;
    tile.move = false;
  }
}

function setCursor() {
  if (!mouseOnScreen()) {cursor(); return};
  switch (currentTool) {
    case "paintbrush":
      cursor();
      break;
    case "eye dropper":
      cursor();
      break;
    case "fill":
      if (!currentBlock) {noCursor();} else {
        currentBlock.draw();
        currentBlock.x = mouseX - mouseX % gridSize;
        currentBlock.y = mouseY - mouseY % gridSize;
      }
      $('#myCanvas canvas').css('cursor', "url('https://i.imgur.com/4BEc2R0.png'), auto");
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
