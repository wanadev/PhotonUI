var select = new photonui.Select({
    value: "item1",
    children: [
        new photonui.MenuItem({value: "item1", text: "Item 1"}),
        new photonui.MenuItem({value: "item2", text: "Item 2"}),
        new photonui.MenuItem({value: "item3", text: "Item 3"})
    ],
    callbacks: {
        "value-changed": function(widget, value) {
            alert("Value changed: " + value);
        }
    }
});

photonui.domInsert(select, "demo");
