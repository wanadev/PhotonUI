// We add a field to test accels
var field = new photonui.TextField({
    value: "Text Field"
});
photonui.domInsert(field, "demo");

// ... And  a label to display things
var label = new photonui.Label({text: ""});
photonui.domInsert(label, "demo");

// We create the accel
var accel = new photonui.AccelManager();

// "Ctrl+A" / "Command+A" accelerator that is disabled if
// a field is focused
accel.addAccel("accel1", "ctrl + a", function() {
    label.text += "'Ctrl + A' accelerator\n";
});
accel.addAccel("accel1-mac", "command + a", function() {
    label.text += "'Command + A' accelerator\n";
});

// "Ctrl+R" accelerator that works even if the field is focused
accel.addAccel("accel3", "ctrl + r", function() {
    label.text += "'Ctrl + R' accelerator\n";
}, false);

// A more complexe sequence (hold "Ctrl+X", and then press "C")
accel.addAccel("accel4", "ctrl + x > c", function() {
    label.text += "'Ctrl + X > C' accelerator\n";
});
