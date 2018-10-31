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
  let index = getMouseIndex();
  console.log(index)
  if (!grid[index]) {return;}
  let tile = grid[index];

  if (tile.move) {
    tile.x = mouseX + tile.ox;
    tile.y = mouseY + tile.oy;
  } else {
    tile.move = true;
    tile.ox = mouseX - tile.x;
    tile.oy = mouseY - tile.y;
  }

}

function stopMove() {
  for(let tile of grid) {
    tile.move = false;
    tile.x -= tile.x % gridSize;
    tile.y -= tile.y % gridSize;
  }
}
