var register = {};

function keyPressed() {
  register[keyCode] = true;
}

function keyReleased() {
  register[keyCode] = false;
}

function getKey(name) {
  return (register[name.charCodeAt(0)]);
}

function mousePressed() {
  if (mouseOnScreen()) {
    register["mouse" + mouseButton] = true;
  }
}

function mouseReleased() {
  register["mouse" + mouseButton] = false;

  if (mouseButton == "left") {
    toolMouseUp();
  }
}

function mouseOnScreen() {
  return (mouseX < width && mouseX >= 0 && mouseY >= 0 && mouseY < height);
}

function getMouseIndex() {
  let col = floor(mouseX / gridSize);
  let row = floor(mouseY / gridSize);
  return col + row * numCols;
}
