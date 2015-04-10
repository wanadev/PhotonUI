// Create the sprite sheet
var spriteSheet = new photonui.SpriteSheet({
    name: "default",
    imageUrl: "./images/sprites.png",
    size: 16,
    icons: {
  "remove":    [ 0,  0],
  "add": [16,  0],
  "grayHeart": [32,  0],
  "redHeart":  [48,  0],
  "battery1":  [ 0, 16],
  "battery2":  [16, 16],
  "battery3":  [32, 16],
  "battery4":  [48, 16]
    }
});

// Use a SpriteIcon in a Button
var btn = new photonui.Button({
    text: "Sprite Icon",
    leftIcon: new photonui.SpriteIcon("default/add")
});

btn.registerCallback("change-icon", "click", function(widget) {
    switchIcon();
});

// Switch icon
var index = 1;

function switchIcon() {
    btn.leftIcon.iconName = "battery" + index;
    index += 1;
    if (index > 4) index = 1;
    setTimeout(switchIcon, 1000);
}

photonui.domInsert(btn, document.getElementById("widget-area"));
  