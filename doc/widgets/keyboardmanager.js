// Create our keyboard manager
var kb = new photonui.KeyboardManager(document);

// Create a dialog to be moved
var pos = photonui.Helpers.getAbsolutePosition("demo");
var dialog = new photonui.Dialog({
    title: "I want to move!",
    visible: true,
    padding: 10,
    x: pos.x, y: pos.y,
    child: new photonui.Label("Use your keyboard arrows!")
});

// Update loop
var update = function update() {
    // Check the keyboard current state
    if (kb.isKeyPressed("right"))   dialog.x += 5;
    if (kb.isKeyPressed("left"))    dialog.x -= 5;
    if (kb.isKeyPressed("down"))    dialog.y += 5;
    if (kb.isKeyPressed("up"))      dialog.y -= 5;

    setTimeout(update, 1000 / 60);
};

// Start the loop
update();