// --- UI ---

var grid = new photonui.GridLayout();
var eventLabel = new photonui.Label({text: "Event: -"});
var positionLabel = new photonui.Label({text: "Position: (0, 0)", textAlign: "right"});
var canvas = new photonui.Canvas({width: 400, height: 300});

grid.addChild(eventLabel, {gridX: 0, gridY: 0});
grid.addChild(positionLabel, {gridX: 1, gridY: 0});
grid.addChild(canvas, {gridX: 0, gridY: 1, gridWidth: 2});

photonui.domInsert(grid, document.getElementById("widget-area"));


// --- Mouse Manager ---

var mouse = new photonui.MouseManager(canvas);
var x = 0;
var y = 0;

// Update the event name and mouse position for each event
mouse.registerCallback("any-event", "mouse-event", function(manager, mstate) {
    mstate.action == "mouse-move" || (eventLabel.text = "Event: " + mstate.action);
    positionLabel.text = "Position: (" + mstate.x + ", " + mstate.y + ")";

    // Uncomment to display the complete log on the console
    // mstate.action == "mouse-move" || console.log(mstate.action);
});

// Click
mouse.registerCallback("click", "click", function(manager, mstate) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#07656D";

    ctx.beginPath();
    ctx.arc(mstate.x, mstate.y, 10, 0, 2*Math.PI);
    ctx.stroke();
});

// Double Click
mouse.registerCallback("double-click", "double-click", function(manager, mstate) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#6D072C";

    ctx.beginPath();
    ctx.arc(mstate.x, mstate.y, 10, 0, 2*Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mstate.x, mstate.y, 15, 0, 2*Math.PI);
    ctx.stroke();
});

// Drag Start
mouse.registerCallback("drag-start", "drag-start", function(manager, mstate) {
    x = mstate.x;
    y = mstate.y;
});

// Dragging
mouse.registerCallback("dragging", "dragging", function(manager, mstate) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#07656D";

    ctx.strokeRect(x, y, mstate.x-x, mstate.y-y);
});

// Drag End
mouse.registerCallback("drag-end", "drag-end", function(manager, mstate) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#07656D";
    ctx.fillStyle = "rgba(7, 101, 109, 0.2)";

    ctx.fillRect(x, y, mstate.x-x, mstate.y-y);
    ctx.strokeRect(x, y, mstate.x-x, mstate.y-y);
});

  