var buttons = [];
var addButton;

function initButtons() {
  addTile({type: "Clear", color: "rgba(255,255,255,100)"});
  addTile({type: "Player", color: "rgb(0,0,255)"});
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
  console.log(data)
  let p = {};
  p.elem = createElement("li");
  p.elem.html("<div class='colorTag' style='background-color:"
        + data.color +"'></div>"
        + "<div class='label'>" + data.type + "</div>");
  let db = createElement("button","x");
  db.class('DeleteBtn');
  db.parent(p.elem);

  p.data = {
    type: data.type,
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
    p.data.clr = clr;
    currentBlock = new Tile(p.data);
    initTilesetWindow(p);
  })

  db.mousePressed(() => {
    if (!confirm(`Delete ${db.p.data.type}?`)) {return;}
    if (currentBlock.type == db.p.data.type) {currentBlock = null; setTool("move")}
    db.p.elem.remove();
    buttons = buttons.filter((b) => b !== db.p);
  })

  buttons.push(p);
  p.elem.parent("buttons");

}
