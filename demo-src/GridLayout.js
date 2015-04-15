var grid = new photonui.GridLayout();

grid.addChild(new photonui.Button(), {gridX: 0, gridY: 0});
grid.addChild(new photonui.Button(), {gridX: 1, gridY: 0});
grid.addChild(new photonui.Button(), {gridX: 0, gridY: 1});
grid.addChild(new photonui.Button(), {gridX: 1, gridY: 1});

// Double height button
grid.addChild(
    new photonui.Button(),
    {gridX: 2, gridY: 0, gridHeight: 2}
);

// Triple width button
grid.addChild(
    new photonui.Button(),
    {gridX: 0, gridY: 2, gridWidth: 3}
);

photonui.domInsert(grid, document.getElementById("widget-area"));

