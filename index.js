var currentBlock;

function setup() {
  let canvas = createCanvas(640,480);
  canvas.parent("myCanvas")
  initButtons();
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
  $('#myCanvas').css('max-width',() => {
    let w = $('body')[0].clientWidth;
    w = parseInt(w);
    return w-220 + "px"
  })
}

$('body').mousedown(function(e){if(e.button==1)e.preventDefault()});
