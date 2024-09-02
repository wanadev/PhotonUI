var menu = new photonui.Menu({
    iconVisible: true,
    children: [
        new photonui.MenuItem({
            text: "Menu Item 1",
            icon: new photonui.FAIcon("fa-paper-plane"),
            callbacks: {
                click: function(widget, event) {
                    alert("You clicked on me!");
                }
            }
        }),
        new photonui.MenuItem({
            text: "Menu Item 2",
            icon: new photonui.FAIcon("fa-gears")
        }),
        new photonui.MenuItem({
            text: "Menu Item 3",
            icon: new photonui.FAIcon("fa-paw")
        })
    ]
});


photonui.domInsert(menu, "demo");
