document.getElementById("widget-area").style.width = "200px";

var sel = new photonui.Select({
    children: [
        new photonui.MenuItem({value: "item1", text: "Item 1"}),
        new photonui.MenuItem({value: "item2", text: "Item 2"}),
        new photonui.MenuItem({value: "item3", text: "Item 3"})
    ]
});

sel.registerCallback("change", "value-changed", function(widget, value) {
    alert("Value changed: " + value);
});

photonui.domInsert(sel, document.getElementById("widget-area"));

