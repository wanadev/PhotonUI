var select = new photonui.FontSelect({
    value: "item1",
    fonts: [
        "Arial",
        "Arial Black",
        "Cantarell",
        "Courier New",
        "Impact",
        "Time New Roman",
        "Titillium Web",
        "Verdana"
    ],
    callbacks: {
        "value-changed": function(widget, value) {
            alert("Value changed: " + value);
        }
    }
});

photonui.domInsert(select, "demo");
