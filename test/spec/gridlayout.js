describe("photonui.GridLayout (layout logic)", function() {

    beforeEach(function() {
        this.l1 = new photonui.GridLayout();
        this.l2 = new photonui.GridLayout();
        this.w1 = new DummyWidget({layoutOptions: {x: 0}});
        this.w2 = new DummyWidget({layoutOptions: {x: 1}});
        this.w3 = new DummyWidget({layoutOptions: {x: 2}});
    });

    afterEach(function() {
        this.l1.destroy();
        this.l2.destroy();
        this.w1.destroy();
        this.w2.destroy();
        this.w3.destroy();
    });

    it("can have children widget", function() {
        this.l1.children = [this.w1, this.w2];
        this.l1.addChild(this.w3);

        expect(this.l1.children.length).toEqual(3);
        expect(this.l1.children).toContain(this.w1);
        expect(this.l1.children).toContain(this.w2);
        expect(this.l1.children).toContain(this.w3);

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).toContain(this.w1.html);
        expect(nodes).toContain(this.w2.html);
        expect(nodes).toContain(this.w3.html);
    });

    it("can update its children parents", function() {
        this.l1.children = [this.w1, this.w2];
        this.l1.addChild(this.w3);

        expect(this.l1.children.length).toEqual(3);
        expect(this.w1.parentName).toBe(this.l1.name);
        expect(this.w2.parentName).toBe(this.l1.name);
        expect(this.w3.parentName).toBe(this.l1.name);
        expect(this.w1.parent).toBe(this.l1);
        expect(this.w2.parent).toBe(this.l1);
        expect(this.w3.parent).toBe(this.l1);
    });

    it("can have its children removed", function() {
        this.l1.children = [this.w1, this.w2];
        this.l1.children = [];

        expect(this.l1.children.length).toEqual(0);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBeNull();

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).not.toContain(this.w2.html);
    });

    it("can have one child removed", function() {
        this.l1.children = [this.w1, this.w2];
        this.l1.children = [this.w2];

        expect(this.l1.children.length).toEqual(1);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBe(this.l1);

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).toContain(this.w2.html);
    });

    it("can remove one if its child", function() {
        this.l1.children = [this.w1, this.w2];
        this.l1.removeChild(this.w1);

        expect(this.l1.children.length).toEqual(1);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBe(this.l1);

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).toContain(this.w2.html);
    });

    it("can destroy its children", function() {
        this.l1.children = [this.w1, this.w2];
        this.l1.empty();

        expect(this.l1.children.length).toEqual(0);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBeNull();

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).not.toContain(this.w2.html);
    });

    it("can have its children changed", function() {
        this.l1.children = [this.w1, this.w2];
        this.l1.children = [this.w3, this.w2];

        expect(this.l1.children.length).toEqual(2);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBe(this.l1);
        expect(this.w3.parent).toBe(this.l1);

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).toContain(this.w2.html);
        expect(nodes).toContain(this.w3.html);
    });

    it("allows its children to be reparented", function() {
        this.l1.children = [this.w1, this.w2, this.w3];
        this.l2.children = [this.w1];
        this.l2.addChild(this.w3);

        expect(this.l1.children.length).toEqual(1);
        expect(this.l2.children.length).toEqual(2);
        expect(this.w1.parent).toBe(this.l2);
        expect(this.w2.parent).toBe(this.l1);
        expect(this.w3.parent).toBe(this.l2);

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).toContain(this.w2.html);
        expect(nodes).not.toContain(this.w3.html);

        var nodes2 = this.l2.html.querySelectorAll(".photonui-widget");
        expect(nodes2).toContain(this.w1.html);
        expect(nodes2).toContain(this.w3.html);
    });

});

describe("photonui.GridLayout (layoutOptons)", function() {

    beforeAll(function() {
        addTitle("photonui.GridLayout (layoutOptons)");
    });

    beforeEach(function() {
        this.area = addTestArea();
        this.area.className += " photonui-container-expand-child";

        this.grid = new photonui.GridLayout({
            verticalSpacing: 0,
            horizontalSpacing: 0
        });

        this.w1 = new DummyWidget({text: "W1", layoutOptions: {x: 0, y: 0}});
        this.w2 = new DummyWidget({text: "W2", layoutOptions: {x: 1, y: 0}});
        this.w3 = new DummyWidget({text: "W3", layoutOptions: {x: 2, y: 0}});

        this.w4 = new DummyWidget({text: "W4", layoutOptions: {X: 0, y: 1}});
        this.w5 = new DummyWidget({text: "W5", layoutOptions: {x: 1, y: 1}});
        this.w6 = new DummyWidget({text: "W6", layoutOptions: {x: 2, y: 1}});

        this.w7 = new DummyWidget({text: "W7", layoutOptions: {x: 0, y: 2}});
        this.w8 = new DummyWidget({text: "W8", layoutOptions: {x: 1, y: 2}});
        this.w9 = new DummyWidget({text: "W9", layoutOptions: {x: 2, y: 2}});

        this.grid.children = [
            this.w1, this.w2, this.w3,
            this.w4, this.w5, this.w6,
            this.w7, this.w8, this.w9
        ];

        photonui.domInsert(this.grid, this.area);
    });

    it("has right default item sizing", function() {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        expect(this.w1.offsetWidth).toEqual(100);
        expect(this.w1.offsetHeight).toEqual(100);

        expect(this.w2.offsetWidth).toEqual(100);
        expect(this.w2.offsetHeight).toEqual(100);

        expect(this.w3.offsetWidth).toEqual(100);
        expect(this.w3.offsetHeight).toEqual(100);

        expect(this.w4.offsetWidth).toEqual(100);
        expect(this.w4.offsetHeight).toEqual(100);

        expect(this.w5.offsetWidth).toEqual(100);
        expect(this.w5.offsetHeight).toEqual(100);

        expect(this.w6.offsetWidth).toEqual(100);
        expect(this.w6.offsetHeight).toEqual(100);

        expect(this.w7.offsetWidth).toEqual(100);
        expect(this.w7.offsetHeight).toEqual(100);

        expect(this.w8.offsetWidth).toEqual(100);
        expect(this.w8.offsetHeight).toEqual(100);

        expect(this.w9.offsetWidth).toEqual(100);
        expect(this.w9.offsetHeight).toEqual(100);
    });

    it("can extend a widget on multiple columns", function() {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w5.destroy();
        this.w8.destroy();
        this.w9.destroy();

        this.w4.layoutOptions.cols = 2;
        this.w7.layoutOptions.cols = 3;

        this.grid._updateLayout();

        expect(this.w1.offsetWidth).toEqual(100);
        expect(this.w1.offsetHeight).toEqual(100);

        expect(this.w2.offsetWidth).toEqual(100);
        expect(this.w2.offsetHeight).toEqual(100);

        expect(this.w3.offsetWidth).toEqual(100);
        expect(this.w3.offsetHeight).toEqual(100);

        expect(this.w4.offsetWidth).toEqual(200);
        expect(this.w4.offsetHeight).toEqual(100);

        expect(this.w6.offsetWidth).toEqual(100);
        expect(this.w6.offsetHeight).toEqual(100);

        expect(this.w7.offsetWidth).toEqual(300);
        expect(this.w7.offsetHeight).toEqual(100);
    });

    it("can extend a widget on multiple rows", function() {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w5.destroy();
        this.w6.destroy();
        this.w9.destroy();

        this.w2.layoutOptions.rows = 2;
        this.w3.layoutOptions.rows = 3;

        this.grid._updateLayout();

        expect(this.w1.offsetWidth).toEqual(100);
        expect(this.w1.offsetHeight).toEqual(100);

        expect(this.w2.offsetWidth).toEqual(100);
        expect(this.w2.offsetHeight).toEqual(200);

        expect(this.w3.offsetWidth).toEqual(100);
        expect(this.w3.offsetHeight).toEqual(300);

        expect(this.w4.offsetWidth).toEqual(100);
        expect(this.w4.offsetHeight).toEqual(100);

        expect(this.w7.offsetWidth).toEqual(100);
        expect(this.w7.offsetHeight).toEqual(100);

        expect(this.w8.offsetWidth).toEqual(100);
        expect(this.w8.offsetHeight).toEqual(100);
    });

    it("can extend a widget on multiple rows and columns", function() {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w6.destroy();
        this.w8.destroy();
        this.w9.destroy();

        this.w5.layoutOptions.rows = 2;
        this.w5.layoutOptions.cols = 2;

        this.grid._updateLayout();

        expect(this.w1.offsetWidth).toEqual(100);
        expect(this.w1.offsetHeight).toEqual(100);

        expect(this.w2.offsetWidth).toEqual(100);
        expect(this.w2.offsetHeight).toEqual(100);

        expect(this.w3.offsetWidth).toEqual(100);
        expect(this.w3.offsetHeight).toEqual(100);

        expect(this.w4.offsetWidth).toEqual(100);
        expect(this.w4.offsetHeight).toEqual(100);

        expect(this.w5.offsetWidth).toEqual(200);
        expect(this.w5.offsetHeight).toEqual(200);

        expect(this.w7.offsetWidth).toEqual(100);
        expect(this.w7.offsetHeight).toEqual(100);
    });

    it("can have padding", function() {
        this.area.style.height = "320px";
        this.area.style.width = "340px";

        this.grid.verticalPadding = 20;
        this.grid.horizontalPadding = 10;

        expect(this.w1.offsetWidth).toEqual(100);
        expect(this.w1.offsetHeight).toEqual(100);

        expect(this.w2.offsetWidth).toEqual(100);
        expect(this.w2.offsetHeight).toEqual(100);

        expect(this.w3.offsetWidth).toEqual(100);
        expect(this.w3.offsetHeight).toEqual(100);

        expect(this.w4.offsetWidth).toEqual(100);
        expect(this.w4.offsetHeight).toEqual(100);

        expect(this.w5.offsetWidth).toEqual(100);
        expect(this.w5.offsetHeight).toEqual(100);

        expect(this.w6.offsetWidth).toEqual(100);
        expect(this.w6.offsetHeight).toEqual(100);

        expect(this.w7.offsetWidth).toEqual(100);
        expect(this.w7.offsetHeight).toEqual(100);

        expect(this.w8.offsetWidth).toEqual(100);
        expect(this.w8.offsetHeight).toEqual(100);

        expect(this.w9.offsetWidth).toEqual(100);
        expect(this.w9.offsetHeight).toEqual(100);
    });

    it("can have vertical spacing", function() {
        this.area.style.height = "300px";
        this.area.style.width = "320px";

        this.grid.verticalSpacing = 10;

        expect(this.w1.offsetHeight).toEqual(100);
        expect(this.w2.offsetHeight).toEqual(100);
        expect(this.w3.offsetHeight).toEqual(100);
        expect(this.w4.offsetHeight).toEqual(100);
        expect(this.w5.offsetHeight).toEqual(100);
        expect(this.w6.offsetHeight).toEqual(100);
        expect(this.w7.offsetHeight).toEqual(100);
        expect(this.w8.offsetHeight).toEqual(100);
        expect(this.w9.offsetHeight).toEqual(100);

        expect(this.w1.offsetWidth + this.w2.offsetWidth + this.w3.offsetWidth).toEqual(300);
        expect(this.w4.offsetWidth + this.w5.offsetWidth + this.w6.offsetWidth).toEqual(300);
        expect(this.w7.offsetWidth + this.w8.offsetWidth + this.w9.offsetWidth).toEqual(300);
    });

    it("can have horizontal spacing", function() {
        this.area.style.height = "320px";
        this.area.style.width = "300px";

        this.grid.horizontalSpacing = 10;

        expect(this.w1.offsetWidth).toEqual(100);
        expect(this.w2.offsetWidth).toEqual(100);
        expect(this.w3.offsetWidth).toEqual(100);
        expect(this.w4.offsetWidth).toEqual(100);
        expect(this.w5.offsetWidth).toEqual(100);
        expect(this.w6.offsetWidth).toEqual(100);
        expect(this.w7.offsetWidth).toEqual(100);
        expect(this.w8.offsetWidth).toEqual(100);
        expect(this.w9.offsetWidth).toEqual(100);

        expect(this.w1.offsetHeight + this.w4.offsetHeight + this.w7.offsetHeight).toEqual(300);
        expect(this.w2.offsetHeight + this.w5.offsetHeight + this.w8.offsetHeight).toEqual(300);
        expect(this.w3.offsetHeight + this.w6.offsetHeight + this.w9.offsetHeight).toEqual(300);
    });

    it("works properly with the sizing hack", function(done) {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        setTimeout(function() {
            expect(this.w1.offsetWidth).toEqual(100);
            expect(this.w1.offsetHeight).toEqual(100);

            expect(this.w2.offsetWidth).toEqual(100);
            expect(this.w2.offsetHeight).toEqual(100);

            expect(this.w3.offsetWidth).toEqual(100);
            expect(this.w3.offsetHeight).toEqual(100);

            expect(this.w4.offsetWidth).toEqual(100);
            expect(this.w4.offsetHeight).toEqual(100);

            expect(this.w5.offsetWidth).toEqual(100);
            expect(this.w5.offsetHeight).toEqual(100);

            expect(this.w6.offsetWidth).toEqual(100);
            expect(this.w6.offsetHeight).toEqual(100);

            expect(this.w7.offsetWidth).toEqual(100);
            expect(this.w7.offsetHeight).toEqual(100);

            expect(this.w8.offsetWidth).toEqual(100);
            expect(this.w8.offsetHeight).toEqual(100);

            expect(this.w9.offsetWidth).toEqual(100);
            expect(this.w9.offsetHeight).toEqual(100);

            this.w9.html.style.minHeight = "130px";

            //this.grid._sizingHack();

            setTimeout(function() {
                expect(this.w3.offsetHeight + this.w6.offsetHeight + this.w9.offsetHeight).toEqual(300);

                done();
            }.bind(this), 10);
        }.bind(this), 10);
    });
});
