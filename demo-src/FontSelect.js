document.getElementById("widget-area").style.width = "200px";

var fsel = new photonui.FontSelect({
    fonts: [
        "Arial",
        "Arial Black",
        "Courier New",
        "Georgia",
        "Impact",
        "Times New Roman"
    ]
});

fsel.registerCallback("change", "value-changed", function(widget, value) {
    alert("Value changed: " + value);
});

photonui.domInsert(fsel, document.getElementById("widget-area"));

