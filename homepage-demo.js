var pos = photonui.Helpers.getAbsolutePosition("demo");

var win = new photonui.Window({
    title: "Hello Photon",
    x: pos.x, y: pos.y,
    width: 300,
    visible: true,
    padding: 10,
    child: new photonui.Label({
        text: "Edit the code -->"
    }),
    callbacks: {
        "close-button-clicked": function(widget) {
            widget.destroy();
        }
    }
});
