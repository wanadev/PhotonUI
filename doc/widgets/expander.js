var box = new photonui.BoxLayout({
    horizontalPadding: 10,
    verticalPadding: 10,
    spacing: 10,

    children: [
        new photonui.Expander({
            title: "Expander 1",
            child: new photonui.Label({
                text: "Never gonna..."
            })
        }),
        new photonui.Expander({
            title: "Expander 2",
            folded: true,
            child: new photonui.Label({
                text: "... give you..."
            })

        }),
        new photonui.Expander({
            title: "Expander 3",
            folded: true,
            child: new photonui.Label({
                text: "... up!"
            })
        })
    ]
});

photonui.domInsert(box, "demo");
