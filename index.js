var buttons = [];
var addButton, gridSizeBtn, gridSizeInput;
var gridSize = 25;
var currentBlockType = null;
var currentBlockColor;
var currentBlock = {};
var grid = [];


function setup() {
  let canvas = createCanvas(500,500);
  currentBlockColor = color(200,0,0);
  canvas.parent("myCanvas")
  addTile("Player", "blue");
  addTile("Wall", "brown");
  addTile("Hole", "black");
  addTile("Enemy", "red");
  addButton = select("#add");
  gridSizeBtn = select("#gridSizeBtn");
  gridSizeInput = select("#gridSizeInput");
}

function draw() {
  background(100,100,200);
  drawGrid();
  getCurrentBlock();

  addButton.mousePressed(addPressed);
  gridSizeBtn.mousePressed(setGridSize);
}

function drawGrid() {
  stroke(255);
  for(var x = 0; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (var y = 0; y < height; y += gridSize) {
    line(0, y, width, y);
  }

  for (let tile of grid) {
    if (!tile) {continue;}
    fill(tile.clr);
    rect(tile.x, tile.y, tile.w, tile.h);
  }
}

function mousePressed() {
  let t = currentBlock;
  let numCol = floor(width/gridSize);
  console.log(numCol)
  let numRow = floor(height/gridSize);
  if (t && t.x <= width && t.x >= 0 && t.y >=0 && t.y<=height) {
    index = t.x / gridSize + t.y * numCol / gridSize;
    grid[index] = t;
  }
}

function getCurrentBlock() {
  for (let button of buttons) {
    button.mousePressed(() => {
      currentBlockType = select(".label", button).html();
      currentBlockColor = select(".colorTag", button).style("background-color");
      rgb = (currentBlockColor.substring(4,currentBlockColor.length-1).split(", "))
      currentBlockColor = color(rgb[0], rgb[1], rgb[2]);
    })
  }

  if (currentBlockType) {
    currentBlock = {
      type: currentBlockType,
      x: mouseX - mouseX % gridSize,
      y: mouseY - mouseY % gridSize,
      w: gridSize,
      h: gridSize,
      clr: currentBlockColor
    };

    noStroke();
    fill(currentBlockColor);
    rect(currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h);
  }
}

function setGridSize() {
  if (gridSizeInput.value() > 0) {
    gridSize = parseInt(gridSizeInput.value());
  }
}

function addPressed() {
  let addInput = select("#addInput");
  let addColor = select("#addColor");
  let name = addInput.value();
  let clr = addColor.value();

  if (name.length > 0 && clr) {
    addInput.value("");
    addTile(name, clr);
  }
}

function addTile(label, colorName) {
  p = createElement("li");
  p.html("<div class='colorTag' style='background-color:"
        + colorName +"'></div>"
        + "<div class='label'>" + label + "</div>");
  db = createElement("button","Delete");
  db.class('DeleteBtn');
  eb = createElement("button","Edit");
  eb.class('EditBtn');

  buttons.push(p);
  p.parent("buttons");
  db.parent(p);
  eb.parent(p);
}

$("#addColor").spectrum({
    color: "#f00",
    preferredFormat: "rgb"
});
