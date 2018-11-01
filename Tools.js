var tools = {
  "paintbrush": {
    mouseDown: placeBlock,
    mouseUp: null,
    active: drawCurrentBlock
  },

  "move": {
    mouseDown: moveBlock,
    mouseUp: stopMove,
  }
}

var toolIcons;
var currentTool;
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

function moveBlock() {
  if (movingBlock) {
    movingBlock.x = mouseX - movingBlock.ox;
    movingBlock.y = mouseY - movingBlock.oy;
    movingBlock.draw();
  } else {
    let index = getMouseIndex();
    if (!grid[index]) {return;}
    movingBlock = Object.assign(grid[index]);
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
