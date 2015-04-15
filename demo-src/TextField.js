var grid = new photonui.GridLayout();

// Text Field
var textField = new photonui.TextField({
    placeholder: "Some text here..."
});
var label1 = new photonui.Label({
    text: "Text Field:",
    forInput: textField
});
grid.addChild(label1, {gridX: 0, gridY: 0});
grid.addChild(textField, {gridX: 1, gridY: 0});

// Password Field
var passwordField = new photonui.TextField({
    type: "password",
    value: "passw0rd"
});
var label2 = new photonui.Label({
    text: "Password:",
    forInput: passwordField
});
grid.addChild(label2, {gridX: 0, gridY: 1});
grid.addChild(passwordField, {gridX: 1, gridY: 1});

// Separator
grid.addChild(
    new photonui.Separator(),
    {gridX: 0, gridY: 2, gridWidth: 2}
);

// Text Area
var textArea = new photonui.TextAreaField();
var label3 = new photonui.Label({
    text: "Text Area:",
    forInput: textArea
});
grid.addChild(label3, {gridX: 0, gridY: 3});
grid.addChild(textArea, {gridX: 1, gridY: 3});

photonui.domInsert(grid, document.getElementById("widget-area"));

