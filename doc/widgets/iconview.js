var iconview = new photonui.IconView({
    iconWidth: 32,
    iconHeight: 32,
    items: [
        { faIcon: { iconName: "fa-bicycle" } },
        { faIcon: { iconName: "fa-subway" } },
        { faIcon: { iconName: "fa-train" } },
        { faIcon: { iconName: "fa-car" } },
        { faIcon: { iconName: "fa-ship" } },
        { faIcon: { iconName: "fa-plane" } },
    ],
});

photonui.domInsert(iconview, "demo");