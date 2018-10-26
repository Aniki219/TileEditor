function mousePressed() {
  if (mouseOnScreen()) {
    register["mouse" + mouseButton] = true;
  }
}

function mouseReleased() {
  register["mouse" + mouseButton] = false;
}

function mouseOnScreen() {
  return (mouseX < width && mouseX >= 0 && mouseY >= 0 && mouseY < height);
}
