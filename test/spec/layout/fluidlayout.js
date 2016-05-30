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
        this.area.style.width = "315px";
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

    // Disabled: firefox bug with karma...
    it("can have an horizontalPadding", function() {
        this.layout.horizontalPadding = 10;
        this.layout.children = [this.w1, this.w2, this.w3, this.w4];

        var ay = photonui.Helpers.getAbsolutePosition(this.area).y;
        var w1y = photonui.Helpers.getAbsolutePosition(this.w1.html).y;

        expect(w1y - ay).toEqual(10);
    });


    it("can align verticaly its children", function() {
        this.area.style.width = "250px";
        this.area.style.height = "250px";

        this.layout.children = [this.w1, this.w2, this.w3, this.w4];

        var ay = photonui.Helpers.getAbsolutePosition(this.area).y;
        var w1y;

        this.layout.verticalAlign = "start";
        w1y = photonui.Helpers.getAbsolutePosition(this.w1.html).y;
        expect(w1y).toEqual(ay);

        this.layout.verticalAlign = "center";
        w1y = photonui.Helpers.getAbsolutePosition(this.w1.html).y;
        expect(w1y).toEqual(ay + 25);

        this.layout.verticalAlign = "end";
        w1y = photonui.Helpers.getAbsolutePosition(this.w1.html).y;
        expect(w1y).toEqual(ay + 50);
    });

    it("can align horizontally its children", function() {
        this.area.style.width = "250px";
        this.area.style.height = "250px";

        this.layout.children = [this.w1, this.w2, this.w3, this.w4];

        var ax = photonui.Helpers.getAbsolutePosition(this.area).x;
        var w1x;

        this.layout.horizontalAlign = "start";
        w1x = photonui.Helpers.getAbsolutePosition(this.w1.html).x;
        expect(w1x).toEqual(ax);

        this.layout.horizontalAlign = "center";
        w1x = photonui.Helpers.getAbsolutePosition(this.w1.html).x;
        expect(w1x).toEqual(ax + 25);

        this.layout.horizontalAlign = "end";
        w1x = photonui.Helpers.getAbsolutePosition(this.w1.html).x;
        expect(w1x).toEqual(ax + 50);
    });

    it("can align its children on rows", function() {
        this.area.style.width = "400px";
        this.area.style.height = "150px";

        this.w1.html.style.height = "auto";
        this.w1.layoutOptions = {align: "stretch"};
        this.w2.html.style.height = "auto";
        this.w2.layoutOptions = {align: "start"};
        this.w3.html.style.height = "auto";
        this.w3.layoutOptions = {align: "center"};
        this.w4.html.style.height = "auto";
        this.w4.layoutOptions = {align: "end"};

        this.layout.children = [this.w1, this.w2, this.w3, this.w4];

        var ay = photonui.Helpers.getAbsolutePosition(this.area).y;

        expect(photonui.Helpers.getAbsolutePosition(this.w1.html).y).toEqual(ay);
        expect(this.w1.offsetHeight).toEqual(150);
        expect(photonui.Helpers.getAbsolutePosition(this.w2.html).y).toEqual(ay);
        expect(photonui.Helpers.getAbsolutePosition(this.w3.html).y).toBeGreaterThan(ay + 40);
        expect(photonui.Helpers.getAbsolutePosition(this.w4.html).y).toBeGreaterThan(ay + 80);
    });

    it("can change the order of its children", function() {
        this.area.style.width = "200px";

        this.w1.layoutOptions = {order: 2};
        this.w2.layoutOptions = {order: 1};

        this.layout.children = [this.w1, this.w2];

        var w1x = photonui.Helpers.getAbsolutePosition(this.w1.html).x;
        var w2x = photonui.Helpers.getAbsolutePosition(this.w2.html).x;

        expect(w1x).toBeGreaterThan(w2x);
    });

});

