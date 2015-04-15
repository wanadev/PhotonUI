showSmiley();

var slider = new photonui.Slider({
    min: -360,
    max: 360,
    step: 20,
    decimalDigits: 0
});

slider.registerCallback(
    "rotate",
    "value-changed",
    function (widget) {
        var smiley = document.getElementById("smiley");
        smiley.style.webkitTransform = "rotate(" + widget.value + "deg)";
        smiley.style.transform = "rotate(" + widget.value + "deg)";
        if (Math.abs(widget.value) > 90 && Math.abs(widget.value) < 270) {
            smiley.className = "smiley sic";
        }
        else {
            smiley.className = "smiley";
        }
    }
);

photonui.domInsert(slider, document.getElementById("widget-area"));

