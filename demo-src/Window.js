hideWidgetArea();

// Create the First Window
var win = new photonui.Window({
    title: "First Window",
    x: 50, y: 100,
    width: 200, height: 100,
    visible: true
});

// Create the second window
var win2 = new photonui.Window({
    title: "Second Window",
    x: 100, y: 150,
    padding: 50,
    visible: true,
    child: new photonui.Label({text: "Move Me!"})
});

// Display the second window position when it was moved
win2.registerCallback(
    "demo.window-moved",
    "position-changed",
    function(widget, x, y) {
  widget.child.text = "x: " + x + ", y: " + y;
    }
);

// Close windows
function close(widget) {
    widget.destroy();
}
win.registerCallback("clwin", "close-button-clicked", close);
win2.registerCallback("clwin", "close-button-clicked", close);
  
