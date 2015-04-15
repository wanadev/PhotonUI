var vbox = new photonui.BoxLayout();

vbox.addChild(new photonui.FAIcon("fa-camera-retro"));
vbox.addChild(new photonui.FAIcon("fa-camera-retro", {"size": "fa-lg"}));
vbox.addChild(new photonui.FAIcon("fa-camera-retro", {"size": "fa-2x"}));
vbox.addChild(new photonui.FAIcon("fa-camera-retro", {"size": "fa-3x"}));
vbox.addChild(new photonui.FAIcon("fa-camera-retro", {"size": "fa-4x"}));
vbox.addChild(new photonui.FAIcon("fa-camera-retro", {
    "size": "fa-5x",
    "color": "#07656D"
}));

photonui.domInsert(vbox, document.getElementById("widget-area"));

