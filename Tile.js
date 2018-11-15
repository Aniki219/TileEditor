class Tile {
  constructor(data) {
    this.type = data.type || "none";
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.w = data.w || gridSize;
    this.h = data.h || gridSize;
    this.clr = data.clr || null;

    this.selected = false;
    this.move = false;
    this.visible = true;
    this.highlight = false;
    this.ox = 0;
    this.oy = 0;

    this.src = data.src || null;
    this.sx = data.sx;
    this.sy = data.sy;
    this.sw = data.sw || gridSize;
    this.sh = data.sh || gridSize;
  }

  draw() {
    if (!this.visible) {return;}
    this.outline2();
    if(this.move) {
      this.outline();
      let tclr = (this.clr) ? Object.assign(this.clr) : color(0,0,255);
      tclr.levels[3] = 100;
      fill(tclr.levels);
      noStroke();
      rect(getGridXY(this.x), getGridIndex(this.y), this.w, this.h);
    }

    if (this.src) {
      let index = imageSourceArray.findIndex((src) => src == this.src);
      image(imageFiles[index], this.x, this.y, this.w, this.h, this.sx, this.sy, this.sw, this.sh);
    } else if (this.clr) {
      fill(this.clr);
      noStroke();
      rect(this.x, this.y, this.w, this.h);
    }

  }

  outline() {
    if (!this.visible) {return;}
    if (!(this.selected || this.highlight || this.move)) {return}
    stroke(255);
    noFill();
    rect(this.x-1, this.y-1, this.w+2, this.h+2);
  }

  outline2() {
    if (!this.visible) {return;}
    if (this.selected || this.highlight) {
      stroke(255);
      let index = getGridIndex(this.x, this.y);
      let row = floor(index/numCols);
      let col = index - row*numCols;
      let d = grid[index + numCols];
      let u = grid[index - numCols];
      let l = grid[index - 1];
      let r = grid[index + 1];

      if (d && !(d.selected || d.highlight)) {line(this.x, this.y + this.h, this.x + this.w, this.y + this.h)}
      if (u && !(u.selected || u.highlight)) {line(this.x, this.y, this.x + this.w, this.y)}
      if (l && !(l.selected || l.highlight) && col > 0) {line(this.x, this.y, this.x, this.y + this.h)}
      if (r && !(r.selected || r.highlight) && col < numCols - 1) {line(this.x + this.w, this.y, this.x + this.w, this.y + this.h)}
    }
  }

  copy() {
    return new Tile(this)
  }
}
