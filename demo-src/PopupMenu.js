var menu = new photonui.PopupMenu();

menu.children = [
    new photonui.MenuItem({
        "text": "Copy",
        "icon": new photonui.FAIcon("fa-copy")
    }),
    new photonui.MenuItem({
        "text": "Cut",
        "icon": new photonui.FAIcon("fa-cut")
    }),
    new photonui.MenuItem({
        "text": "Paste",
        "icon": new photonui.FAIcon("fa-paste")
    }),
    new photonui.Separator(),
    new photonui.MenuItem({
        "text": "Edit",
        "icon": new photonui.FAIcon("fa-pencil")
    }),
    new photonui.MenuItem({
        "text": "Delete",
        "icon": new photonui.FAIcon("fa-trash-o")
    })
];

// Button
var btn = new photonui.Button({
    "text": "Click Me",
    "rightIcon": new photonui.FAIcon("fa-caret-down")
});
btn.registerCallback("click", "click", menu.popupWidget, menu);

// Attache the menu to the document too
document.addEventListener("contextmenu", function(event) {
    menu.popupXY(event.pageX, event.pageY);
    event.preventDefault();
}, false);

photonui.domInsert(btn, document.getElementById("widget-area"));

