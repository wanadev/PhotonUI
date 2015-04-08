var fm = new photonui.FileManager({
    acceptedMimes: ["image/png", "image/jpeg"],
    acceptedExts: ["bmp", "svg"],
    dropZone: document,
    multiselect: true
});

var btn = new photonui.Button({
    leftIcon: new photonui.FAIcon("fa-folder-open-o"),
    text: "Select a file or drop it on the page"
});

btn.registerCallback("open", "click", fm.open, fm);

fm.registerCallback("open", "file-open", function(widget, file, x, y) {
    alert("file-open: " + file.name);
});

photonui.domInsert(btn, document.getElementById("widget-area"));
  