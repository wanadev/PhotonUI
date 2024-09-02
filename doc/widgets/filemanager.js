// File manager that accepts PNG, JPEG, BMP and SVG files
var fm = new photonui.FileManager({
    acceptedMimes: ["image/png", "image/jpeg"], 
    acceptedExts: ["bmp", "svg"],
    dropZone: document,        // Enable file d&d
    multiselect: true,         // Allow to select more than one file
    callbacks: {
        "file-open": function(widget, file, x, y) {
            // x and y are defined only with d&d
            if (x !== undefined) {
                alert(file.name + " dropped at ("+x+", "+y+")");
            }
            else {
                alert(file.name + " opened");
            }
        }
    }
});

// Button to show the "file open" dialog
var btn = new photonui.Button({
    text: "Open",
    callbacks: {
        click: function(widget, event) {
            fm.open();
        }
    }
});

photonui.domInsert(btn, "demo");
