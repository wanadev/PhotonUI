var field = new photonui.TextField({value: ""});

var am = new photonui.AccelManager();

// This accelerator does not work if the field is focused
am.addAccel("accel1", "ctrl + a", function() {
    field.value = "Ctrl + A";
});

// Demo for Mac users (Command + A)
am.addAccel("accel2", "command + a", function() {
    field.value = "Command + A";
});

// This accelerator works even if the field is focused
am.addAccel("accel3", "ctrl + r", function() {
    field.value = "Ctrl + R";
}, false);

// More complexe sequence
am.addAccel("accel4", "ctrl + x > c", function() {
    field.value = "Ctrl + X > C";
});

photonui.domInsert(field, document.getElementById("widget-area"));

