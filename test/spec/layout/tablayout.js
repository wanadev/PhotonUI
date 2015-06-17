describe("photonui.TabLayout", function() {

    beforeAll(function() {
        addTitle("photonui.TabLayout");
    });

    beforeEach(function() {
        this.area = addTestArea();
        this.area.className += " photonui-container-expand-child";
        this.area.style.width = "300px";
        this.area.style.height = "200px";

        this.c1 = new photonui.TabItem({
            child: new DummyWidget({
                text: "Tab 1"
            })
        });
        this.c2 = new photonui.TabItem({
            child: new DummyWidget({
                text: "Tab 2"
            })
        });
        this.c3 = new photonui.TabItem({
            title: "Tab with a very long name",
            child: new DummyWidget({
                text: "Tab 3"
            })
        });

        this.l = new photonui.TabLayout({
            children: [this.c1, this.c2, this.c3]
        });

        photonui.domInsert(this.l, this.area);
    });

    it("can select the first tab by default", function() {
        expect(this.l.activeTab).toBe(this.c1);
    });

    it("can switch between tabs", function() {
        this.l.activeTab = this.c2;

        expect(this.c1.visible).toBeFalsy();
        expect(this.c2.visible).toBeTruthy();
        expect(this.c3.visible).toBeFalsy();

        this.c3.visible = true;

        expect(this.c1.visible).toBeFalsy();
        expect(this.c2.visible).toBeFalsy();
        expect(this.c3.visible).toBeTruthy();
    });

    it("can find an other tab to display if the active tab is removed", function() {
        this.l.activeTab.destroy();
        expect(this.c2.visible).toBeTruthy();
    });

    it("can change the order of its tabs (order layout option)", function() {
        this.c1.title = "Tab 1";
        this.c2.title = "Tab 2";
        this.c3.title = "Tab 3";
        this.c1.layoutOptions.order = 4;
        this.l._updateLayout();

        var c1pos = photonui.Helpers.getAbsolutePosition(this.c1.tabHtml);
        var c2pos = photonui.Helpers.getAbsolutePosition(this.c2.tabHtml);
        var c3pos = photonui.Helpers.getAbsolutePosition(this.c3.tabHtml);

        expect(c2pos.x).toBeLessThan(c3pos.x);
        expect(c3pos.x).toBeLessThan(c1pos.x);
    });

    it("can display tabs on top", function() {
        var apos = photonui.Helpers.getAbsolutePosition(this.area);
        var c1pos = photonui.Helpers.getAbsolutePosition(this.c1.tabHtml);
        var c2pos = photonui.Helpers.getAbsolutePosition(this.c2.tabHtml);
        var c3pos = photonui.Helpers.getAbsolutePosition(this.c3.tabHtml);

        expect(c1pos.x).toBeLessThan(c2pos.x);
        expect(c2pos.x).toBeLessThan(c3pos.x);

        expect(c1pos.y).toBeLessThan(apos.y+100);
        expect(c2pos.y).toBeLessThan(apos.y+100);
        expect(c3pos.y).toBeLessThan(apos.y+100);
    });

    it("can display tabs on bottom", function() {
        this.l.tabsPosition = "bottom";

        var apos = photonui.Helpers.getAbsolutePosition(this.area);
        var c1pos = photonui.Helpers.getAbsolutePosition(this.c1.tabHtml);
        var c2pos = photonui.Helpers.getAbsolutePosition(this.c2.tabHtml);
        var c3pos = photonui.Helpers.getAbsolutePosition(this.c3.tabHtml);

        expect(c1pos.x).toBeLessThan(c2pos.x);
        expect(c2pos.x).toBeLessThan(c3pos.x);

        expect(c1pos.y).toBeGreaterThan(apos.y+100);
        expect(c2pos.y).toBeGreaterThan(apos.y+100);
        expect(c3pos.y).toBeGreaterThan(apos.y+100);
    });

    it("can display tabs on left", function() {
        this.l.tabsPosition = "left";

        var apos = photonui.Helpers.getAbsolutePosition(this.area);
        var c1pos = photonui.Helpers.getAbsolutePosition(this.c1.tabHtml);
        var c2pos = photonui.Helpers.getAbsolutePosition(this.c2.tabHtml);
        var c3pos = photonui.Helpers.getAbsolutePosition(this.c3.tabHtml);

        expect(c1pos.y).toBeLessThan(c2pos.y);
        expect(c2pos.y).toBeLessThan(c3pos.y);

        expect(c1pos.x).toBeLessThan(apos.x+150);
        expect(c2pos.x).toBeLessThan(apos.x+150);
        expect(c3pos.x).toBeLessThan(apos.x+150);
    });

    it("can display tabs on right", function() {
        this.l.tabsPosition = "right";

        var apos = photonui.Helpers.getAbsolutePosition(this.area);
        var c1pos = photonui.Helpers.getAbsolutePosition(this.c1.tabHtml);
        var c2pos = photonui.Helpers.getAbsolutePosition(this.c2.tabHtml);
        var c3pos = photonui.Helpers.getAbsolutePosition(this.c3.tabHtml);

        expect(c1pos.y).toBeLessThan(c2pos.y);
        expect(c2pos.y).toBeLessThan(c3pos.y);

        expect(c1pos.x).toBeGreaterThan(apos.x+150);
        expect(c2pos.x).toBeGreaterThan(apos.x+150);
        expect(c3pos.x).toBeGreaterThan(apos.x+150);
    });

    it("can have pading", function() {
        this.l.padding = 0;
        var w1 = this.l.activeTab.child.offsetWidth;
        this.l.padding = 20;
        var w2 = this.l.activeTab.child.offsetWidth;
        expect(w1).toBeGreaterThan(w2);
    });
});

