var tabs = new photonui.TabLayout({
    tabsPosition: "top",  // "top", "bottom", "left" or "right"
    children: [
        new photonui.TabItem({
            title: "Tab 1",
            child: new photonui.Label("Widget inside the first tab")
        }),
        new photonui.TabItem({
            title: "Tab 2",
            child: new photonui.Button()
        }),
        new photonui.TabItem({
            title: "Tab 3"
        })
    ]
});

photonui.domInsert(tabs, "demo");
document.getElementById("demo")
    .className += " photonui-container-expand-child";
