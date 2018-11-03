var imageFiles = [];
var imageSourceArray = [
  "https://i.imgur.com/MnSjPVk.png",
  "https://i.imgur.com/UAVsbxs.png",
];


function preload() {
  selectionBoxImg = loadImage("https://png.icons8.com/ios-glyphs/40/000000/select-none.png");
  paintBrushImg = loadImage("https://png.icons8.com/windows/40/000000/paint-brush.png");
  fillCanImg = loadImage("https://png.icons8.com/metro/40/000000/fill-color.png");
  eyeDropperImg = loadImage("https://png.icons8.com/material-rounded/40/000000/color-dropper.png");
  moveToolImg = loadImage("https://png.icons8.com/material-two-tone/40/000000/move.png");
  moveHandImg = loadImage("https://png.icons8.com/small/40/000000/four-fingers.png");

  for(let src of imageSourceArray) {
    imageFiles.push(loadImage(src));
  }
}
