var tileSelector = null;
var editingTile;

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
  if (!tileSelector) {
    $("#tileSelector").css("top", 0);
    $("#tileSelector").css("left", 0);
    $("#tileSelector").css("width", 0);
    $("#tileSelector").css("height", 0);
    $("#tileSelector").css("border", "none");
    return;
  }
  $("#tileSelector").css("border", "1px solid white");
  let sx = min(tileSelector.startCoords.x, tileSelector.endCoords.x);
  let sy = min(tileSelector.startCoords.y, tileSelector.endCoords.y);
  let ex = max(tileSelector.endCoords.x, tileSelector.startCoords.x)+gridSize;
  let ey = max(tileSelector.endCoords.y, tileSelector.startCoords.y)+gridSize;

  $("#tileSelector").css("top", `${sy}`);
  $("#tileSelector").css("left", `${sx}`);
  $("#tileSelector").css("width", `${ex - sx}`);
  $("#tileSelector").css("height", `${ey - sy}`);

  let ts = $("#tileSelector")[0].style;
  editingTile.data = {
    type: editingTile.data.type,
    w: ex - sx,
    h: ey - sy,
    src: $("#tileset").attr("src"),
    sx: sx,
    sy: sy,
    sw: ex - sx,
    sh: ey - sy
  }
}

function initTilesetWindow(tile) {
  setTool("none");
  $("#tileSetBox").css("display", "block");
  let menu = $("#chooseTileset");
  menu.empty();
  menu.css("display","block");
  for (var name in tilesetImages) {
    menu.append(`<option value="${tilesetImages[name]}">${name}</option>`)
  }
  editingTile = tile;
}

var tilesetImages = {
  castle: "https://i.imgur.com/MnSjPVk.png",
  enemies: "https://i.imgur.com/UAVsbxs.png",
}

$("#chooseTileset").change((e)=> {
  let src = e.currentTarget.value;
  $("#tileset").attr("src", src);
})

$("#tilesetCancel").click((event) => {
  $('#tileSetBox').hide();
  setTool("paintbrush");
});

$("#tilesetUpdate").click((event) => {
  $('#tileSetBox').hide();
  setTool("paintbrush");
  let d = editingTile.data;
  currentBlock = new Tile(d);
  let colorTag = $(editingTile.elem.elt).children(".colorTag");
  colorTag.attr("src", editingTile.data.src);
  colorTag.css("clip", `rect(${d.sy}px, ${d.sw + d.sx}px, ${d.sh+d.sy}px, ${d.sx}px)`);
  let s = 32/(max(d.sw, d.sh));
  colorTag.css("transform", `scale(${s}) translate(${-d.sx}px,${-d.sy}px)`);
  colorTag.css("background-color", "white");
});
