describe("photonui.GridLayout (layoutOptons)", function() {

    beforeAll(function() {
        addTitle("photonui.GridLayout (layoutOptons)");

        // Patch the GridLayout's _sizingHack method to be able to spy it...
        // Yes I know, it is dirty...
        var hackString = photonui.GridLayout.prototype._sizingHack.toString();
        hackString = hackString.replace(/^function\s*\(.*\)\s*\{/, "");
        hackString = hackString.replace(/\}$/, "");
        hackString = hackString.replace(/return/g, "setTimeout(this.__testSpy, 1) ; return");
        hackString = hackString.replace(/setTimeout\s*\(([^,]+),/g, "setTimeout(function() { $1 ; setTimeout(this.__testSpy, 1) ; }.bind(this),");
        this.hackFunction = new Function(hackString);
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

    it("has right default item sizing", function(done) {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.grid.__testSpy = function() {
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

            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;
        this.grid._sizingHack();
    });

    it("can extend a widget on multiple columns", function(done) {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w5.destroy();
        this.w8.destroy();
        this.w9.destroy();

        this.w4.layoutOptions.cols = 2;
        this.w7.layoutOptions.cols = 3;

        this.grid.__testSpy = function() {
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

            done()
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._updateLayout();
    });

    it("can extend a widget on multiple rows", function(done) {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w5.destroy();
        this.w6.destroy();
        this.w9.destroy();

        this.w2.layoutOptions.rows = 2;
        this.w3.layoutOptions.rows = 3;

        this.grid.__testSpy = function() {
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

            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._updateLayout();
    });

    it("can extend a widget on multiple rows and columns", function(done) {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w6.destroy();
        this.w8.destroy();
        this.w9.destroy();

        this.w5.layoutOptions.rows = 2;
        this.w5.layoutOptions.cols = 2;

        this.grid.__testSpy = function() {
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

            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._updateLayout();
    });

    it("can have padding", function(done) {
        this.area.style.height = "320px";
        this.area.style.width = "340px";

        this.grid.verticalPadding = 20;
        this.grid.horizontalPadding = 10;

        this.grid.__testSpy = function() {
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

            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._sizingHack();
    });

    it("can have vertical spacing", function(done) {
        this.area.style.height = "300px";
        this.area.style.width = "320px";

        this.grid.verticalSpacing = 10;

        this.grid.__testSpy = function() {
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

            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._sizingHack();
    });

    it("can have horizontal spacing", function(done) {
        this.area.style.height = "320px";
        this.area.style.width = "300px";

        this.grid.horizontalSpacing = 10;

        this.grid.__testSpy = function() {
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

            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._sizingHack();
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

    it("can handle the 'verticalAlign' layout options", function(done) {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w1.layoutOptions.verticalAlign = "start";
        this.w1.text = "top";

        this.w2.layoutOptions.verticalAlign = "center";
        this.w2.text = "center";

        this.w3.layoutOptions.verticalAlign = "end";
        this.w3.text = "bottom";

        this.grid._updateLayout();

        var areaPos = photonui.Helpers.getAbsolutePosition(this.area);

        this.grid.__testSpy = function() {
            expect(this.w1.offsetHeight + this.w4.offsetHeight + this.w7.offsetHeight).toBeLessThan(300);
            expect(photonui.Helpers.getAbsolutePosition(this.w1.html).y).toEqual(areaPos.y);

            expect(this.w2.offsetHeight + this.w5.offsetHeight + this.w8.offsetHeight).toBeLessThan(300);
            expect(photonui.Helpers.getAbsolutePosition(this.w2.html).y).toBeGreaterThan(areaPos.y);
            expect(photonui.Helpers.getAbsolutePosition(this.w2.html).y).toBeLessThan(areaPos.y + 300 - this.w2.offsetHeight - this.w5.offsetHeight - this.w8.offsetHeight);

            expect(this.w3.offsetHeight + this.w6.offsetHeight + this.w9.offsetHeight).toBeLessThan(300);
            expect(photonui.Helpers.getAbsolutePosition(this.w3.html).y).toEqual(areaPos.y + 300 - this.w3.offsetHeight - this.w6.offsetHeight - this.w9.offsetHeight);

            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._sizingHack();
    });

    it("can handle the 'horizontalAlign' layout options", function(done) {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w1.layoutOptions.horizontalAlign = "start";
        this.w1.text = "left";

        this.w4.layoutOptions.horizontalAlign = "center";
        this.w4.text = "center";

        this.w7.layoutOptions.horizontalAlign = "end";
        this.w7.text = "right";

        this.grid._updateLayout();

        var areaPos = photonui.Helpers.getAbsolutePosition(this.area);

        this.grid.__testSpy = function() {
            expect(this.w1.offsetWidth + this.w2.offsetWidth + this.w3.offsetWidth).toBeLessThan(300);
            expect(photonui.Helpers.getAbsolutePosition(this.w1.html).x).toEqual(areaPos.x);

            expect(this.w4.offsetHeight + this.w5.offsetWidth + this.w6.offsetWidth).toBeLessThan(300);
            expect(photonui.Helpers.getAbsolutePosition(this.w4.html).x).toBeGreaterThan(areaPos.x);
            expect(photonui.Helpers.getAbsolutePosition(this.w4.html).x).toBeLessThan(areaPos.x + 300 - this.w4.offsetWidth - this.w5.offsetWidth - this.w6.offsetWidth);

            expect(this.w7.offsetWidth + this.w8.offsetWidth + this.w9.offsetWidth).toBeLessThan(300);
            expect(photonui.Helpers.getAbsolutePosition(this.w7.html).x).toEqual(areaPos.x + 300 - this.w7.offsetWidth - this.w8.offsetWidth - this.w9.offsetWidth);

            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._sizingHack();
    });

    it("can handle the 'minWidth' layout options", function() {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w1.layoutOptions.minWidth = 120;
        this.grid._updateLayout();

        expect(this.w1.offsetWidth).toBeGreaterThan(119);
    });

    it("can handle the 'maxWidth' layout options", function() {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w1.layoutOptions.maxWidth = 80;
        this.grid._updateLayout();

        expect(this.w1.offsetWidth).toBeLessThan(81);
    });

    it("can handle the 'width' layout options", function() {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w1.layoutOptions.width = 120;
        this.grid._updateLayout();

        expect(this.w1.offsetWidth).toEqual(120);
    });

    it("can handle the 'minHeight' layout options", function(done) {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w1.layoutOptions.minHeight = 120;

        this.grid.__testSpy = function() {
            expect(this.w1.offsetHeight).toBeGreaterThan(119);
            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._updateLayout();
    });

    it("can handle the 'maxHeight' layout options", function(done) {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w1.layoutOptions.maxHeight = 80;

        this.grid.__testSpy = function() {
            expect(this.w1.offsetHeight).toBeLessThan(81);
            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._updateLayout();
    });

    it("can handle the 'height' layout options", function(done) {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w1.layoutOptions.height = 120;

        this.grid.__testSpy = function() {
            expect(this.w1.offsetHeight).toEqual(120);
            done();
        }.bind(this);
        this.grid._sizingHack = this.hackFunction;

        this.grid._updateLayout();
    });
});
