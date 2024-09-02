var tableview = new photonui.TableView({
    items: [
        { name: "John", count: 2, color: "red" },
        { name: "Jane", count: 4, color: "blue" },
        { name: "Janeth", count: 12, color: "green" }
    ],
    columns: [ 
        "name", 
        "count", 
        {
            id: "color",
            label: "Color",
            value: function(item) {
                return new photonui.ColorButton({ value: item.color })
            }
        }
    ],
    multiSelectable: true,
    dragAndDroppable: true,
});

photonui.domInsert(tableview, "demo");