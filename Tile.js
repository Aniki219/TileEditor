class Tile {
  constructor(type, x, y, w, h, clr) {
    this.type = type;
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
      this.outline();
      let tclr = Object.assign(this.clr);
      tclr.levels[3] = 100;
      fill(tclr.levels);
      noStroke();
      rect(round(this.x/gridSize)*gridSize, round(this.y/gridSize)*gridSize, this.w, this.h);
    }
    fill(this.clr);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  outline() {
    if (!(this.selected || this.move)) {return}
    stroke(255);
    noFill();
    rect(this.x-1, this.y-1, this.w+2, this.h+2);
  }

  outline2() {
    if (this.selected) {
      stroke(255);
      let index = getGridIndex(this.x, this.y);
      let row = floor(index/numCols);
      let col = index - row*numCols;
      let d = grid[index + numCols];
      let u = grid[index - numCols];
      let l = grid[index - 1];
      let r = grid[index + 1];
      if (d && !d.selected) {line(this.x, this.y + this.h, this.x + this.w, this.y + this.h)}
      if (u && !u.selected) {line(this.x, this.y, this.x + this.w, this.y)}
      if (l && !l.selected && col > 0) {line(this.x, this.y, this.x, this.y + this.h)}
      if (r && !r.selected && col < numCols - 1) {line(this.x + this.w, this.y, this.x + this.w, this.y + this.h)}
    }
  }

  copy() {
    return new Tile(this.type, this.x, this.y, this.w, this.h, this.clr)
  }
}
