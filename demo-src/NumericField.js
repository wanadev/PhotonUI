var grid = new photonui.GridLayout();

// Simple Numeric Field
var field1 = new photonui.NumericField();
var label1 = new photonui.Label({
    text: "Free Number:",
    forInput: field1
});
grid.addChild(label1, {gridX: 0, gridY: 0});
grid.addChild(field1, {gridX: 1, gridY: 0});

// Integer [0-100]
var field2 = new photonui.NumericField({
    min: 0,
    max: 100,
    value: 42,
    decimalDigits: 0
});
var label2 = new photonui.Label({
    text: "Integer [0-100]:",
    forInput: field2
});
grid.addChild(label2, {gridX: 0, gridY: 1});
grid.addChild(field2, {gridX: 1, gridY: 1});

// Float
var field3 = new photonui.NumericField({
    decimalDigits: 2,
    step: 0.1,
    value: 42,
    decimalSymbol: ","
});
var label3 = new photonui.Label({
    text: "Float:",
    forInput: field3
});
grid.addChild(label3, {gridX: 0, gridY: 2});
grid.addChild(field3, {gridX: 1, gridY: 2});

photonui.domInsert(grid, document.getElementById("widget-area"));

