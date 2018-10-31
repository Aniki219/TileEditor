function initToolbar() {
  select("#resize").mousePressed(resizeGrid);
  select("#clearAll").mousePressed(clearGrid);

  select("#gridSizeUp").mousePressed(() => setGridSize(gridSize+16));
  select("#gridSizeDown").mousePressed(() => setGridSize(gridSize-16));
}

$('#gridSizeInput').on('keypress', (e) => {
  if(e.which === 13){
    let val = parseInt(e.target.value);
    $(this).attr("disabled", "disabled");
    setGridSize(val);
    $(this).removeAttr("disabled");
  }
})

$('#numColInput, #numRowInput').on('keypress', (e) => {
  if(e.which === 13){
    $(this).attr("disabled", "disabled");
    resizeGrid();
    $(this).removeAttr("disabled");
  }
})
