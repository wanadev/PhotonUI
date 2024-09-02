var menu = new photonui.Menu({
    iconVisible: true,
    children: [
        new photonui.SubMenuItem({
            text: "Submenu Item",
            menuName: "submenu1",
            icon: new photonui.FAIcon("fa-paw")
        }),
        new photonui.Menu({
            visible: true,  // false to hide it by default
            name: "submenu1",
            iconVisible: true,
            children: [
                new photonui.MenuItem({
                    text: "Submenu Item 1",
                    icon: new photonui.FAIcon("fa-gamepad")
                }),
                new photonui.MenuItem({
                    text: "Sumbenu Item 2",
                    icon: new photonui.FAIcon("fa-flask")
                })
            ]
        })
    ]
});

photonui.domInsert(menu, "demo");
