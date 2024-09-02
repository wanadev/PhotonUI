var btn = new photonui.IconButton({
    icon: new photonui.FAIcon("fa-send"),
    width: 32,
    height: 32,
    callbacks: {
        click: function(widget, event) {
            alert("clicked!");
        }
    }
});

photonui.domInsert(btn, "demo");
