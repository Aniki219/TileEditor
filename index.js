var currentBlock;

function setup() {
  let canvas = createCanvas(640,480);
  canvas.parent("myCanvas")
  initButtons();
  initToolbar();
  toolsInit();
}

function draw() {
  background(100,100,200);
  drawGrid();
  doTool();
  $('#myCanvas').css('max-width',() => {
    let w = $('body')[0].clientWidth;
    w = parseInt(w);
    return w-220 + "px"
  })
}

$('#myCanvas').mousedown(function(e) {if(e.button==1) e.preventDefault()});
