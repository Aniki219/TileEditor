var currentBlock;
var prevGrids = [];
var reGrids = [];
var lastGrid = [];
var historyNum = 10;

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
  toolHotKeys();
  setCursor();
  $('#myCanvas').css('max-width',() => {
    let w = $('body')[0].clientWidth;
    w = parseInt(w);
    return w-220 + "px"
  })
  if (gridChange()) {
    prevGrids.push(lastGrid.slice());
    lastGrid = grid.slice();
    reGrids = [];

    if (prevGrids.length > historyNum) {
      prevGrids.shift();
    }
    if (reGrids.length > historyNum) {
      prevGrids.shift();
    }
  }
  for(let index = 0; index < grid.length; index++) {
    if (!grid[index]) {continue;}
    if (grid[index].type == "Clear") {
      grid[index] = null;
    }
  }
}

$('#myCanvas').mousedown(function(e) {if(e.button==1) e.preventDefault()});
$('body').bind('keydown', function(e) {
  if(e.ctrlKey && (e.which == 'A'.charCodeAt(0))) {
    e.preventDefault();
  }
});
