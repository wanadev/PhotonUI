var fluidview = new photonui.FluidView({
    containerElement: "div",
    itemElement: "div",
    columnElement: "div",
    itemsWidth: 70,
    itemsHeight: 30,
    verticalPadding: 10,
    horizontalPadding: 20,
    verticalSpacing: 20,
    horizontalSpacing: 10,
    items: [
        { name: "Bicycle", icon: "fa-bicycle", color: "green" },
        { name: "Subway", icon: "fa-subway", color: "blue" },
        { name: "Train", icon: "fa-train", color: "red" },
        { name: "Car", icon: "fa-car", color: "yellow" },
        { name: "Ship", icon: "fa-ship", color: "cyan" },
        { name: "Plane", icon: "fa-plane", color: "magenta" },
    ],
    columns: [
        {
            id: "icon",
            label: "Icon",
            value: function(item) {
                return new photonui.FAIcon({
                    iconName: item.icon,
                    color: item.color,
                })
            }
        },
        "name", 
    ],
});

photonui.domInsert(fluidview, "demo");