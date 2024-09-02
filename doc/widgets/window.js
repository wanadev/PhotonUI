var pos = photonui.Helpers.getAbsolutePosition("demo");

new photonui.Window({
    title: "My Window",
    visible: true,
    x: pos.x, y: pos.y,
    width: 300, height: 100,
    callbacks: {
        "close-button-clicked": function(widget) {
            widget.destroy();
        },
        "position-changed": function(widget, x, y) {
            widget.title = "My Window (x: " + x + ", y: " + y + ")";
        }
    }
});
