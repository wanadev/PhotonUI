var listview = new photonui.ListView({
    items: [
        { name: "John", count: 2 },
        { name: "Jane", count: 4 },
        { name: "Janeth", count: 12 }
    ],
    columns: [ 
        {
            id: "name",
            value: function(item) { return `${item.name}: ` }
        }, 
        "count"
    ],
    callbacks: {
        "item-click": function(event, item) {
            item.value.count++;
            item.node.querySelector(".photonui-dataview-column-count")
                .innerText = item.value.count;
        },
        "item-select": function(event, item) {
            item.node.style.fontWeight = "bold"
        },
        "item-unselect": function(event, item) {
            item.node.style.fontWeight = ""
        },
    }
});

photonui.domInsert(listview, "demo");