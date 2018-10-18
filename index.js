var buttons = [];

function setup() {
  let canvas = createCanvas(500,500);
  canvas.parent("myCanvas")
  let p = createElement("li", "hdshfshdka");
  buttons.push(p);
  p.parent("buttonList");
  p = createElement("li", "asdasd");
  buttons.push(p);
  p.parent("buttonList");
  p = createElement("li", "dshrerywhdf");
  p.html("<div style='background-color:blue; width:25px'></div><h4>HELLO</h4>")
  buttons.push(p);
  p.parent("buttonList");
  p = createElement("li", "sfnwbrw");
  buttons.push(p);
  p.parent("buttonList");
}

function draw() {
  background(100,100,200)
  for (let button of buttons) {
    button.mousePressed(()=>console.log(button.html()))
  }
}
