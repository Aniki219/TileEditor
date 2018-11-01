class Tile {
  constructor(x, y, w, h, clr) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.clr = clr;

    this.selected = false;
    this.move = false;
    this.ox = 0;
    this.oy = 0;
  }

  draw() {
    if(this.move) {
      stroke(255);
      noFill();
      rect(this.x-1, this.y-1, this.w+2, this.h+2);
      let tclr = Object.assign(this.clr);
      tclr.levels[3]=100
      console.log(tclr);
      fill(tclr.levels)
      noStroke();
      rect(round(this.x/gridSize)*gridSize, round(this.y/gridSize)*gridSize, this.w, this.h);
    }
    fill(this.clr);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}
