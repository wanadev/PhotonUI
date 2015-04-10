hideWidgetArea();

var cpd = new photonui.ColorPickerDialog({
    visible: true,
    x: 50, y: 75,
    callbacks: {
  "value-changed": function(widget, color) {
alert("Color changed: " + color);
  }
    }
});
  
