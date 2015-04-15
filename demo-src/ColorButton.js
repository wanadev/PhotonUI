showSmiley();

var btn = new photonui.ColorButton();

btn.registerCallback(
    "smiley-color",
    "value-changed",
    function(widget, color) {
        var smiley = document.getElementById("smiley");
        smiley.style.borderColor = color;
    }
);

photonui.domInsert(btn, document.getElementById("widget-area"));

