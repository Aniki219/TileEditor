var buttons = [];
var addButton;

function initButtons() {
  addClearTile();
  addTile({type: "PlayerPlayerPlayer", color: "rgb(0,0,255)"});
  addTile({type: "Wall", color: "brown"});
  addTile({type: "Hole", color: "black"});
  addTile({type: "Enemy", color: "red"});

  addButton = select("#add");
  addButton.mousePressed(addPressed);

  let randColor = `rgb(${floor(random(256))}, ${floor(random(256))}, ${floor(random(256))})`
  select("#addColor").value(randColor);
  $("#addColor").spectrum({
      color: `${randColor}`,
      preferredFormat: 'rgb'
  });
}

function addClearTile() {
  addTile({type: "Clear", color: "rgba(255,255,255,100)"});
  let clearTile = $(buttons[0].elem.elt);
  clearTile.find(".editBtn").remove();
  clearTile.find(".deleteBtn").remove();
  clearTile.find(".visible").remove();
  clearTile.find("img").attr("src", "https://image.flaticon.com/icons/svg/491/491721.svg");
  clearTile.find("img").css("width", "32px");
}

function addPressed() {
  let add = {
    type: select("#addName").value(),
    width: parseInt(select("#addWidth").value()) || gridSize,
    height: parseInt(select("#addHeight").value()) || gridSize,
    color: select("#addColor").value() || color(255,0,0)
  };

  if (add.type.length > 0) {
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
  p.elem.html("<img class='colorTag'"
        + "src='https://i.imgur.com/RRTXt3w.png'"
        + "style='background-color:"
        + data.color +"'></img>"
        + "<div class='label'>" + data.type + "</div>");
  let visible = createElement("img");
  visible.attribute("src", "https://image.flaticon.com/icons/svg/159/159604.svg");
  let eb = createElement("button", "Edit");
  let db = createElement("button","x");

  db.class('deleteBtn');
  db.parent(p.elem);
  eb.class('editBtn');
  eb.parent(p.elem);
  visible.class('visible');
  visible.parent(p.elem);
  visible.on = true;

  p.data = {
    type: data.type,
    width: data.width || gridSize,
    height: data.height || gridSize,
  }

  visible.p = p;
  eb.p = p;
  db.p = p;

  p.elem.mousePressed(() => {
    if (mouseButton != "left") {return;}
    let type = select(".label", p.elem).html();
    let rgb = select(".colorTag", p.elem).style("background-color");
    rgb = (rgb.substring(4,rgb.length-1).split(", "))
    let clr = color(rgb[0], rgb[1], rgb[2]);
    p.data.clr = clr;
    currentBlock = new Tile(p.data);
    pastedBlocks = [];
  })

  visible.mousePressed(() => {
    visible.on = !visible.on;
    if (visible.on) {
      visible.attribute("src", "https://image.flaticon.com/icons/svg/159/159604.svg");
    } else {
      visible.attribute("src", "https://image.flaticon.com/icons/svg/149/149110.svg");
    }

    grid.forEach((tile) => {
      if (tile && tile.type == visible.p.data.type) {tile.visible = visible.on}
    })
  })

  eb.mousePressed(() => {
    initTilesetWindow(eb.p);
  })

  db.mousePressed(() => {
    if (!confirm(`Delete ${db.p.data.type} and all of its Tiles?`)) {return;}
    if (currentBlock && currentBlock.type == db.p.data.type) {currentBlock = null; setTool("move")}
    db.p.elem.remove();
    buttons = buttons.filter((b) => b !== db.p);
    grid = grid.filter((tile) => tile && tile.type !== db.p.data.type)
  })

  buttons.push(p);
  p.elem.parent("buttons");
  p.elem.mouseOver(function() {
    $(p.elem.elt).css("margin-left", "8px");
    grid.forEach((tile) => {
      if (tile && tile.type == p.data.type) tile.highlight = true;
    })
  })
  p.elem.mouseOut(function() {
    $(p.elem.elt).css("margin-left", "0px");
    grid.forEach((tile) => {
      if (tile && tile.type == p.data.type) tile.highlight = false;
    })
  })
  eb.mouseOver(function(e) {
    e.stopPropagation();
    $(eb.elt).css("background-color", "#8197e8");
  })
  eb.mouseOut(function(e) {
    e.stopPropagation();
    $(eb.elt).css("background-color", "6464c8");
  })
  db.mouseOver(function(e) {
    e.stopPropagation();
    $(db.elt).css("background-color", "#fd7e4c");
  })
  db.mouseOut(function(e) {
    e.stopPropagation();
    $(db.elt).css("background-color", "#E15119");
  })
}
