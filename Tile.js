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

  smartTile() {
    let check = [];
    let index = getGridIndex(this.x, this.y);
    for (let c = -1; c < 2; c++) {
      for (let r = -1; r < 2; r++) {
        let coords = getColRow(index);
        if (coords.col + c < 0 || coords.col + c >= numCols) {check[(c+1)+(r+1)*3] = 1; continue;}
        if (coords.row + r < 0 || coords.row + r >= numRows) {check[(c+1)+(r+1)*3] = 1; continue;}
        let i = index + c + (r * numCols);
        check[(c+1)+(r+1)*3] = (grid[i] && grid[i].type == this.type)?1:0;
      }
    }
    let str = check.toString().replace(/,/g,"");

    //inner corners
    if (/1111\S1110/.test(str)) {this.sx = 0; this.sy = 0}
    else if (/1101\S1111/.test(str)) {this.sx = 0; this.sy = 64}
    else if (/0111\S1111/.test(str)) {this.sx = 64; this.sy = 64}
    else if (/1111\S1011/.test(str)) {this.sx = 64; this.sy = 0}
    //sides
    else if (/\S1\S1\S1\S0\S/.test(str)) {this.sx = 32; this.sy = 0}
    else if (/\S0\S1\S1\S1\S/.test(str)) {this.sx = 32; this.sy = 64}
    else if (/\S1\S0\S1\S1\S/.test(str)) {this.sx = 64; this.sy = 32}
    else if (/\S1\S1\S0\S1\S/.test(str)) {this.sx = 0; this.sy = 32}
    //outer corners
    else if (/\S1\S1\S0\S0\S/.test(str)) {this.sx = 96; this.sy = 0}
    else if (/\S0\S1\S0\S1\S/.test(str)) {this.sx = 96; this.sy = 32}
    else if (/\S0\S0\S1\S1\S/.test(str)) {this.sx = 128; this.sy = 32}
    else if (/\S1\S0\S1\S0\S/.test(str)) {this.sx = 128; this.sy = 0}
    //top
    else if (/\S1\S1\S1\S1\S/.test(str)) {this.sx = 32; this.sy = 32}
    //default
    else {this.sx = 32; this.sy = 32};
    return(str);
  }

  copy() {
    return new Tile(this)
  }
}
