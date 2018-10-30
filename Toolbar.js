var gridSizeBtn, gridSizeInput, resize;

function initToolbar() {
  gridSizeBtn = select("#gridSizeBtn");
  gridSizeInput = select("#gridSizeInput");
  resize = select("#resize");

  gridSizeBtn.mousePressed(setGridSize);
  resize.mousePressed(() => resizeGrid(10,10));
}
