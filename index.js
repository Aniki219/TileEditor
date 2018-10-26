var buttons = [];
var addButton, gridSizeBtn, gridSizeInput;
var gridSize = 25;
var currentBlock;
var grid = [];
var register = {};
var numCols;
var numRows;


function setup() {
  let canvas = createCanvas(500,500);
  currentBlockColor = color(200,0,0);
  canvas.parent("myCanvas")
  addTile({name: "Player", color: "rgb(0,0,255)"});
  addTile({name: "Wall", color: "brown"});
  addTile({name: "Hole", color: "black"});
  addTile({name: "Enemy", color: "red"});
  addButton = select("#add");
  gridSizeBtn = select("#gridSizeBtn");
  gridSizeInput = select("#gridSizeInput");
  resize = select("#resize");

  numCols = width/gridSize;
  numRows = height/gridSize;

  let randColor = `rgb(${floor(random(256))}, ${floor(random(256))}, ${floor(random(256))})`
  select("#addColor").value(randColor);
  $("#addColor").spectrum({
      color: `${randColor}`,
      preferredFormat: 'rgb'
  });
}

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

function draw() {
  background(100,100,200);
  drawGrid();
  if (register["mouseleft"]) {
    placeBlock();
  }
  if (register["mouseright"]) {
    removeBlock();
  }
  getCurrentBlock();

  addButton.mousePressed(addPressed);
  gridSizeBtn.mousePressed(setGridSize);
  resize.mousePressed(() => resizeGrid(10,10));
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

function mousePressed() {
  if (mouseOnScreen()) {
    register["mouse" + mouseButton] = true;
  }
}

function mouseReleased() {
  register["mouse" + mouseButton] = false;
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

function mouseOnScreen() {
  return (mouseX < width && mouseX >= 0 && mouseY >= 0 && mouseY < height);
}

function getCurrentBlock() {
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

function addPressed() {
  let add = {
    name: select("#addName").value(),
    width: parseInt(select("#addWidth").value()) || gridSize,
    height: parseInt(select("#addHeight").value()) || gridSize,
    color: select("#addColor").value() || color(255,0,0)
  };


  if (add.name.length > 0) {
    select("#addName").value("");
    let randColor = `rgb(${floor(random(256))}, ${floor(random(256))}, ${floor(random(256))})`
    select("#addColor").value(randColor);
    $("#addColor").spectrum({
        color: `${randColor}`
    });
    addTile(add);
  }
}

function addTile(data) {
  let p = {};
  p.elem = createElement("li");
  p.elem.html("<div class='colorTag' style='background-color:"
        + data.color +"'></div>"
        + "<div class='label'>" + data.name + "</div>");
  let db = createElement("button","x");
  db.class('DeleteBtn');
  db.parent(p.elem);

  p.data = {
    type: data.name,
    width: data.width || gridSize,
    height: data.height || gridSize,
  }

  db.p = p;

  p.elem.mousePressed(() => {
    if (mouseButton != "left") {return;}
    let type = select(".label", p.elem).html();
    let rgb = select(".colorTag", p.elem).style("background-color");
    rgb = (rgb.substring(4,rgb.length-1).split(", "))
    let clr = color(rgb[0], rgb[1], rgb[2]);

    currentBlock = {
      type: type,
      x: 0,
      y: 0,
      w: p.data.width,
      h: p.data.height,
      clr: clr
    };
  })

  db.mousePressed(() => {
    if (!confirm(`Delete ${db.p.data.type}?`)) {return;}
    db.p.elem.remove();
    buttons = buttons.filter((b) => b !== db.p);
  })

  buttons.push(p);
  p.elem.parent("buttons");

}
