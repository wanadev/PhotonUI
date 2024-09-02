var dlg = new photonui.ColorPickerDialog({
    value: "#4EC8DB",
    callbacks: {
        "value-changed": function(widget, value) {
            var header = document.getElementsByTagName("header")[0];
            header.style.backgroundColor = value;
        }
    }
});

// Add a button to show up the dialog
var btn = new photonui.Button({
    text: "Display the dialog",
    callbacks: {
        click: dlg.show.bind(dlg)
    }
});

photonui.domInsert(btn, "demo");
