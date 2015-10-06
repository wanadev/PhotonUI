describe("photonui.FluidLayout", function() {

    beforeAll(function() {
        addTitle("photonui.FluidLayout");
    });

    beforeEach(function() {
        this.area = addTestArea();
        this.area.className += " photonui-container-expand-child";

        this.layout = new photonui.FluidLayout({
            verticalSpacing: 0,
            horizontalSpacing: 0
        });

        this.w1 = new DummyWidget({text: "W1"});
        this.w2 = new DummyWidget({text: "W2"});
        this.w3 = new DummyWidget({text: "W3"});
        this.w4 = new DummyWidget({text: "W4"});

        this.w1.html.style.width = "100px";
        this.w1.html.style.height = "100px";
        this.w2.html.style.width = "100px";
        this.w2.html.style.height = "100px";
        this.w3.html.style.width = "100px";
        this.w3.html.style.height = "100px";
        this.w4.html.style.width = "100px";
        this.w4.html.style.height = "100px";

        photonui.domInsert(this.layout, this.area);
    });

    it("does not wrap if not needed", function() {
        this.area.style.width = "400px";
        this.layout.children = [this.w1, this.w2, this.w3, this.w4];
        expect(this.area.offsetHeight).toEqual(100);
    });

    it("wraps if needed", function() {
        this.area.style.width = "300px";
        this.layout.children = [this.w1, this.w2, this.w3, this.w4];

        var ax = photonui.Helpers.getAbsolutePosition(this.area).x;
        var w4x = photonui.Helpers.getAbsolutePosition(this.w4.html).x;

        expect(this.area.offsetHeight).toEqual(200);
        expect(w4x).toEqual(ax);
    });

    it("can have an horizontalSpacing", function() {
        this.area.style.width = "310px";
        this.layout.horizontalSpacing = 5;
        this.layout.children = [this.w1, this.w2, this.w3, this.w4];

        var ax = photonui.Helpers.getAbsolutePosition(this.area).x;
        var w4x = photonui.Helpers.getAbsolutePosition(this.w4.html).x;

        expect(this.area.offsetHeight).toEqual(200);
        expect(w4x).toEqual(ax);
    });

    it("can have a verticalSpacing", function() {
        this.area.style.width = "300px";
        this.layout.verticalSpacing = 5;
        this.layout.children = [this.w1, this.w2, this.w3, this.w4];

        var ay = photonui.Helpers.getAbsolutePosition(this.area).y;
        var w4y = photonui.Helpers.getAbsolutePosition(this.w4.html).y;

        expect(this.area.offsetHeight).toEqual(205);
        expect(w4y).toEqual(ay + 100 + 5);
    });

    it("can have a verticalPadding", function() {
        this.layout.verticalPadding = 10;
        this.layout.children = [this.w1, this.w2, this.w3, this.w4];

        var ax = photonui.Helpers.getAbsolutePosition(this.area).x;
        var w1x = photonui.Helpers.getAbsolutePosition(this.w1.html).x;

        expect(w1x - ax).toEqual(10);
    });

    it("can have an horizontalPadding", function() {
        this.layout.horizontalPadding = 10;
        this.layout.children = [this.w1, this.w2, this.w3, this.w4];

        var ay = photonui.Helpers.getAbsolutePosition(this.area).y;
        var w1y = photonui.Helpers.getAbsolutePosition(this.w1.html).y;

        expect(w1y - ay).toEqual(10);
    });

});

