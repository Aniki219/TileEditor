
var currentBlock;



function setup() {
  let canvas = createCanvas(500,500);
  canvas.parent("myCanvas")
  initButtons();
  initGrid();
  initToolbar();
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
}
