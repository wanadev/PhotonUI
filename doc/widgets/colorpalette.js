var palette = new photonui.ColorPalette({
    callbacks: {
        "value-changed": function(widget, value) {
            var header = document.getElementsByTagName("header")[0];
            header.style.backgroundColor = value;
        }
    }
});

photonui.domInsert(palette, "demo");
