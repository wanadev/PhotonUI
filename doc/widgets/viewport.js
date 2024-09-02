var viewport = new photonui.Viewport({
    width: 300,
    height: 200,
    padding: 5,
    horizontalScrollbar: false,  // true, false or null (= auto)
    verticalScrollbar: null,     // true, false or null (= auto)
    child: new photonui.BoxLayout({
        children: [
            new photonui.Button(),
            new photonui.Button(),
            new photonui.Button(),
            new photonui.Button(),
            new photonui.Button(),
            new photonui.Button(),
            new photonui.Button(),
            new photonui.Button(),
            new photonui.Button(),
            new photonui.Button()
        ]
    })
});

photonui.domInsert(viewport, "demo");
