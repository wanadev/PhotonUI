var pos = photonui.Helpers.getAbsolutePosition("demo");

new photonui.Dialog({
    title: "My Dialog",
    visible: true,
    x: pos.x, y: pos.y,
    child: new photonui.Label("Hello, I'm a dialog"),
    padding: 10,
    buttons: [
        new photonui.Button()
    ],
    callbacks: {
        "close-button-clicked": function(widget) {
            widget.destroy();
        }
    }
});
