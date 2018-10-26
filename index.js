
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



function draw() {
  background(100,100,200);
  drawGrid();
  if (register["mouseleft"]) {
    placeBlock();
  }
  if (register["mouseright"]) {
    removeBlock();
  }
  drawCurrentBlock();

  addButton.mousePressed(addPressed);
  gridSizeBtn.mousePressed(setGridSize);
  resize.mousePressed(() => resizeGrid(10,10));
}
