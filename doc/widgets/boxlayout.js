var box = new photonui.BoxLayout({
    orientation: "vertical",  // "vertical" or "horizontal"
    spacing: 5,               // spacing between widgets
    children: [
        new photonui.Button(),
        new photonui.Button(),
        new photonui.Button()
    ]
});

photonui.domInsert(box, "demo");
