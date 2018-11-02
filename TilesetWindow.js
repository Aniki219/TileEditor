// var s = function( sketch ) {
//   with(sketch) {
//     var x = 100;
//     var y = 100;
//
//     sketch.setup = function() {
//       createCanvas(200, 200);
//     };
//
//     sketch.draw = function() {
//       console.log(3)
//       background(255,0,0);
//       fill(255);
//       rect(x,y,50,50);
//     };
//
//     sketch.mousePressed = function() {
//       console.log("mousepressed")
//     }
//   };
// };
//
// var myp5 = new p5(s, document.getElementById('centerDiv'));
var tileSelector = null;

$("#tileset").mousedown((e)=>{
  var parentOffset = $(e.currentTarget).offset();
  var relX = e.pageX - parentOffset.left;
  var relY = e.pageY - parentOffset.top;
  tileSelector = {};
  tileSelector.startCoords = getGridXY(relX, relY);
  tileSelector.endCoords = getGridXY(relX, relY);
  drawTileSelector();
});

$("#tileset").mousemove((e)=>{
  if (!tileSelector) {return;}

  var parentOffset = $(e.currentTarget).offset();
  var relX = e.pageX - parentOffset.left;
  var relY = e.pageY - parentOffset.top;

  tileSelector.endCoords = getGridXY(relX, relY);
  drawTileSelector();
});

$("#tileset").mouseup((e)=>{
  var parentOffset = $(e.currentTarget).offset();
  var relX = e.pageX - parentOffset.left;
  var relY = e.pageY - parentOffset.top;
  tileSelector = null;
});

function drawTileSelector() {
  let sx = min(tileSelector.startCoords.x, tileSelector.endCoords.x);
  let sy = min(tileSelector.startCoords.y, tileSelector.endCoords.y);
  let ex = max(tileSelector.endCoords.x, tileSelector.startCoords.x)+gridSize;
  let ey = max(tileSelector.endCoords.y, tileSelector.startCoords.y)+gridSize;

  $("#tileSelector").css("top", `${sy}`);
  $("#tileSelector").css("left", `${sx}`);
  $("#tileSelector").css("width", `${ex - sx}`);
  $("#tileSelector").css("height", `${ey - sy}`);
}

function initTilesetWindow() {
  let menu = $("#chooseTileset");
  menu.empty();
  menu.css("display","block");
  for (var name in tilesetImages) {
    menu.append(`<option value="${tilesetImages[name]}">${name}</option>`)
  }
}

var tilesetImages = {
  castle: "https://i.imgur.com/38qRsPz.png",
  enemies: "https://i.imgur.com/UAVsbxs.png",
}

$("#chooseTileset").change((e)=> {
  let src = e.currentTarget.value;
  $("#tileset").attr("src", src);
})
