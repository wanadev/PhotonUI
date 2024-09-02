var grid = new photonui.GridLayout({
    horizontalPadding: 0,
    verticalPadding: 0,
    horizontalSpacing: 5,
    verticalSpacing: 5,
    children: [
        new photonui.Button({
            text: "Widget 1",
            layoutOptions: {
                x: 0, y: 0,
                cols: 1, rows: 1
            }
        }),
        new photonui.Button({
            text: "Widget 2",
            layoutOptions: {
                x: 1, y: 0,
                cols: 1, rows: 1
            }
        }),
        new photonui.Button({
            text: "Widget 3",
            layoutOptions: {
                x: 2, y: 0,
                cols: 1, rows: 2
            }
        }),
        new photonui.Button({
            text: "Widget 4",
            layoutOptions: {
                x: 0, y: 1,
                cols: 2, rows: 1
            }
        })
    ]
});

photonui.domInsert(grid, "demo");
