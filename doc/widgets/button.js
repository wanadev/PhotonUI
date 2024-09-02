var btn = new photonui.Button({
    text: "My Button",
    leftIcon: new photonui.FAIcon("fa-send"),
    callbacks: {
        click: function(widget, event) {
            alert("Someone clicked on " + widget.text);
        }
    }
});

photonui.domInsert(btn, "demo");
