var colorPicker = new photonui.ColorPicker({
    value: "#4EC8DB",
    callbacks: {
        "value-changed": function(widget, value) {
            var header = document.getElementsByTagName("header")[0];
            header.style.backgroundColor = value;
        }
    }
});

photonui.domInsert(colorPicker, "demo");
