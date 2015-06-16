describe("photonui.TabLayout", function() {

    beforeAll(function() {
        addTitle("photonui.TabLayout");
    });

    beforeEach(function() {
        this.area = addTestArea();
        this.area.className += " photonui-container-expand-child";
        this.area.style.width = "300px";
        this.area.style.height = "200px";

        this.c1 = new photonui.TabItem();
        this.c2 = new photonui.TabItem();
        this.c3 = new photonui.TabItem({title: "Tab with a very long name"});

        this.l = new photonui.TabLayout({
            children: [this.c1, this.c2, this.c3]
        });

        photonui.domInsert(this.l, this.area);
    });

    it("can display tab on top", function() {
        // EXPECTATIONS
    });

    it("can display tab on bottom", function() {
        this.l.tabsPosition = "bottom";
        // EXPECTATIONS
    });

    it("can display tab on left", function() {
        this.l.tabsPosition = "left";
        // EXPECTATIONS
    });

    it("can display tab on right", function() {
        this.l.tabsPosition = "right";
        // EXPECTATIONS
    });

});

