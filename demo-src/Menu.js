document.getElementById("widget-area").style.width = "200px";

var menu = new photonui.Menu();

menu.children = [
    new photonui.MenuItem({
        "text": "Item 1",
        "icon": new photonui.FAIcon("fa-gears")
    }),
    new photonui.MenuItem({
        "text": "Item 2",
        "icon": new photonui.FAIcon("fa-cloud")
    }),
    new photonui.MenuItem({
        "text": "Item 3",
        "icon": new photonui.FAIcon("fa-group")
    }),
    new photonui.SubMenuItem({
        "text": "Item 4",
        "menu": new photonui.Menu({
            "name": "submenu1",
            "visible": false
        })
    }),
    photonui.getWidget("submenu1"),
    new photonui.MenuItem({"text": "Item 5"}),
    new photonui.MenuItem({"text": "Item 6"})
];

var submenu = photonui.getWidget("submenu1");

submenu.children = [
    new photonui.MenuItem({
        "text": "SubItem 1",
        "icon": new photonui.FAIcon("fa-eye")
    }),
    new photonui.MenuItem({
        "text": "SubItem 2",
        "icon": new photonui.FAIcon("fa-globe")
    }),
    new photonui.MenuItem({
        "text": "SubItem 3",
        "icon": new photonui.FAIcon("fa-leaf")
    }),
];

photonui.domInsert(menu, document.getElementById("widget-area"));

