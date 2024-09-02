// Create the spritesheet
var spriteSheet = new photonui.SpriteSheet({
    name: "default",
    imageUrl: "./spritesheet.png",
    size: 16,
    icons: {
        "remove":    [ 0,  0],
        "add":       [16,  0],
        "grayHeart": [32,  0],
        "redHeart":  [48,  0],
        "battery1":  [ 0, 16],
        "battery2":  [16, 16],
        "battery3":  [32, 16],
        "battery4":  [48, 16]
    }
});

// Create an icon from the spritesheet
var icon = new photonui.SpriteIcon("default/redHeart");

photonui.domInsert(icon, "demo");
