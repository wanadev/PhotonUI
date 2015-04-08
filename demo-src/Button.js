var grid = new photonui.GridLayout();

// Button with an icon
var btn1 = new photonui.Button({
    text: "Options",
    leftIcon: new photonui.FAIcon("fa-cog")
});
grid.addChild(btn1, {gridX: 0, gridY: 0});

// Button with only an icon (no text)
var btn2 = new photonui.Button({
    textVisible: false,
    leftIcon: new photonui.FAIcon("fa-cog")
});
grid.addChild(btn2, {gridX: 1, gridY: 0});

// Button with an icon at right
var btn3 = new photonui.Button({
    text: "Next",
    rightIcon: new photonui.FAIcon("fa-arrow-right")
});
grid.addChild(btn3, {gridX: 0, gridY: 1, gridWidth: 2});

photonui.domInsert(grid, document.getElementById("widget-area"));
  