var grid = new photonui.GridLayout();

// CheckBox
var checkbox = new photonui.CheckBox({value: true});
var label1 = new photonui.Label({
    text: "CheckBox:",
    forInput: checkbox
});
grid.addChild(label1, {gridX: 0, gridY: 0});
grid.addChild(checkbox, {gridX: 1, gridY: 0});

// Switch
var sw = new photonui.Switch();
var label2 = new photonui.Label({
    text: "Switch:",
    forInput: sw
});
grid.addChild(label2, {gridX: 0, gridY: 1});
grid.addChild(sw, {gridX: 1, gridY: 1});

// ToggleButton
var toggle = new photonui.ToggleButton({
    text: "Toggle",
    value: true
});
var label3 = new photonui.Label({
    text: "ToggleButton:",
    forInput: toggle
});
grid.addChild(label3, {gridX: 0, gridY: 2});
grid.addChild(toggle, {gridX: 1, gridY: 2});

photonui.domInsert(grid, document.getElementById("widget-area"));
  