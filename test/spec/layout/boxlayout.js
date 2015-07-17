describe("photonui.BoxLayout (layoutOptions, horizontal orientation)", function() {

    beforeAll(function() {
        addTitle("photonui.BoxLayout (visual, horizontal orientation)");
    });

    beforeEach(function() {
        this.area = addTestArea();
        this.area.className += " photonui-container-expand-child";

        this.w1 = new DummyWidget();
        this.w2 = new DummyWidget();
        this.w3 = new DummyWidget();

        this.box = new photonui.BoxLayout({
            orientation: "horizontal",
            horizontalPadding: 0,
            verticalPadding: 0,
            spacing: 0,
            children: [
                this.w1,
                this.w2,
                this.w3
            ]
        });

        photonui.domInsert(this.box, this.area);
    });

    it("has right default item sizing", function() {
        this.area.style.height = "100px";
        this.area.style.width = "300px";

        expect(this.w1.offsetHeight).toEqual(100);
        expect(this.w2.offsetHeight).toEqual(100);
        expect(this.w3.offsetHeight).toEqual(100);
        expect(this.w1.offsetWidth).toEqual(100);
        expect(this.w2.offsetWidth).toEqual(100);
        expect(this.w2.offsetWidth).toEqual(100);
    });

    it("can have padding", function() {
        this.area.style.height = "100px";
        this.area.style.width = "300px";

        this.box.verticalPadding = 15;
        this.box.horizontalPadding = 10;

        expect(this.w1.offsetHeight).toEqual(80);
        expect(this.w2.offsetHeight).toEqual(80);
        expect(this.w3.offsetHeight).toEqual(80);
        expect(this.w1.offsetWidth).toEqual(90);
        expect(this.w2.offsetWidth).toEqual(90);
        expect(this.w2.offsetWidth).toEqual(90);
    });

    it("can have spacing", function() {
        this.area.style.width = "320px";

        this.box.spacing = 10;

        expect(this.w1.offsetWidth).toEqual(100);
        expect(this.w2.offsetWidth).toEqual(100);
        expect(this.w2.offsetWidth).toEqual(100);
    });

    it("can handle the 'align' layout option", function() {
        this.area.style.width = "400px";
        this.area.style.height = "100px";

        var w4 = new DummyWidget();
        this.box.addChild(w4);

        this.w1.layoutOptions.align = "stretch";
        this.w2.layoutOptions.align = "start";
        this.w3.layoutOptions.align = "center";
        w4.layoutOptions.align = "end";

        this.box._updateLayout();

        var areaPos = photonui.Helpers.getAbsolutePosition(this.area);

        expect(photonui.Helpers.getAbsolutePosition(this.w1.html).y).toEqual(areaPos.y);
        expect(this.w1.offsetHeight).toEqual(100);

        expect(photonui.Helpers.getAbsolutePosition(this.w2.html).y).toEqual(areaPos.y);
        expect(this.w2.offsetHeight).toBeLessThan(100);

        expect(photonui.Helpers.getAbsolutePosition(this.w3.html).y).toBeGreaterThan(areaPos.y);
        expect(photonui.Helpers.getAbsolutePosition(this.w3.html).y).toBeLessThan(areaPos.y + 100 - this.w3.offsetHeight);
        expect(this.w3.offsetHeight).toBeLessThan(100);

        expect(photonui.Helpers.getAbsolutePosition(w4.html).y).toEqual(areaPos.y + 100 - w4.offsetHeight);
        expect(w4.offsetHeight).toBeLessThan(100);
    });

   it("can handle the 'minWidth' layout option", function() {
        this.area.style.width = "300px";

        this.w2.layoutOptions.minWidth = 150;
        this.box._updateLayout();

        expect(this.w2.offsetWidth).toEqual(150);
    });

    it("can handle the 'maxWidth' layout option", function() {
        this.area.style.width = "300px";

        this.w2.layoutOptions.maxWidth = 80;
        this.box._updateLayout();

        expect(this.w2.offsetWidth).toEqual(80);
    });

    it("can handle the 'width' layout option", function() {
        this.area.style.width = "400px";

        this.w2.layoutOptions.width = 200;
        this.w3.layoutOptions.width = 80;
        this.box._updateLayout();

        expect(this.w2.offsetWidth).toEqual(200);
        expect(this.w3.offsetWidth).toEqual(80);
    });

    it("can handle the 'minHeight' layout option", function() {
        this.area.style.width = "300px";

        this.w2.layoutOptions.minHeight = 100;
        this.box._updateLayout();

        expect(this.w2.offsetHeight).toEqual(100);
    });

    it("can handle the 'maxHeight' layout option", function() {
        this.area.style.width = "300px";
        this.area.style.height = "100px";

        this.w2.layoutOptions.maxHeight = 50;
        this.box._updateLayout();

        expect(this.w2.offsetHeight).toEqual(50);
    });

    it("can handle the 'height' layout option", function() {
        this.area.style.width = "300px";
        this.area.style.height = "100px";

        this.w2.layoutOptions.height = 50;
        this.box._updateLayout();

        expect(this.w2.offsetHeight).toEqual(50);
    });

    it("set the margins on the right items when widgets are reordered", function() {
        this.area.style.width = "300px";

        this.box.spacing = 10;
        this.w1.text = "widget 1"
        this.w2.text = "widget 2"
        this.w3.text = "widget 3"
        this.w3.layoutOptions.order = -1;
        this.box._updateLayout();

        expect(this.w3.html.parentNode.style.marginRight).toEqual("10px");
        expect(this.w1.html.parentNode.style.marginRight).toEqual("10px");
        expect(this.w2.html.parentNode.style.marginRight).toEqual("");
    });
});


describe("photonui.BoxLayout (layoutOptions, vertical orientation)", function() {

    beforeAll(function() {
        addTitle("photonui.BoxLayout (visual, horizontal orientation)");
    });

    beforeEach(function() {
        this.area = addTestArea();
        this.area.className += " photonui-container-expand-child";

        this.w1 = new DummyWidget();
        this.w2 = new DummyWidget();
        this.w3 = new DummyWidget();

        this.box = new photonui.BoxLayout({
            orientation: "vertical",
            horizontalPadding: 0,
            verticalPadding: 0,
            spacing: 0,
            children: [
                this.w1,
                this.w2,
                this.w3
            ]
        });

        photonui.domInsert(this.box, this.area);
    });

    it("has right default item sizing", function() {
        this.area.style.height = "300px";
        this.area.style.width = "300px";

        expect(this.w1.offsetHeight).toEqual(100);
        expect(this.w2.offsetHeight).toEqual(100);
        expect(this.w3.offsetHeight).toEqual(100);
        expect(this.w1.offsetWidth).toEqual(300);
        expect(this.w2.offsetWidth).toEqual(300);
        expect(this.w2.offsetWidth).toEqual(300);
    });

    it("can have padding", function() {
        this.area.style.height = "300px";
        this.area.style.width = "300px";

        this.box.verticalPadding = 10;
        this.box.horizontalPadding = 15;

        expect(this.w1.offsetHeight).toEqual(90);
        expect(this.w2.offsetHeight).toEqual(90);
        expect(this.w3.offsetHeight).toEqual(90);
        expect(this.w1.offsetWidth).toEqual(280);
        expect(this.w2.offsetWidth).toEqual(280);
        expect(this.w2.offsetWidth).toEqual(280);
    });

    it("can have spacing", function() {
        this.area.style.width = "300px";
        this.area.style.height = "320px";

        this.box.spacing = 10;

        expect(this.w1.offsetHeight).toEqual(100);
        expect(this.w2.offsetHeight).toEqual(100);
        expect(this.w2.offsetHeight).toEqual(100);
    });

    it("can handle the 'align' layout option", function() {
        this.area.style.width = "300px";

        var w4 = new DummyWidget();
        this.box.addChild(w4);

        this.w1.layoutOptions.align = "stretch";
        this.w2.layoutOptions.align = "start";
        this.w3.layoutOptions.align = "center";
        w4.layoutOptions.align = "end";

        this.box._updateLayout();

        var areaPos = photonui.Helpers.getAbsolutePosition(this.area);

        expect(photonui.Helpers.getAbsolutePosition(this.w1.html).x).toEqual(areaPos.x);
        expect(this.w1.offsetWidth).toEqual(300);

        expect(photonui.Helpers.getAbsolutePosition(this.w2.html).x).toEqual(areaPos.x);
        expect(this.w2.offsetWidth).toBeLessThan(300);

        expect(photonui.Helpers.getAbsolutePosition(this.w3.html).x).toBeGreaterThan(areaPos.x);
        expect(photonui.Helpers.getAbsolutePosition(this.w3.html).x).toBeLessThan(areaPos.x + 300 - this.w3.offsetWidth);
        expect(this.w3.offsetWidth).toBeLessThan(300);

        expect(photonui.Helpers.getAbsolutePosition(w4.html).x).toEqual(areaPos.x + 300 - w4.offsetWidth);
        expect(w4.offsetWidth).toBeLessThan(300);
    });

    it("can handle the 'minWidth' layout option", function() {
        this.area.style.width = "300px";

        this.w2.layoutOptions.minWidth = 350;
        this.box._updateLayout();

        expect(this.w2.offsetWidth).toEqual(350);
    });

    it("can handle the 'maxWidth' layout option", function() {
        this.area.style.width = "300px";

        this.w2.layoutOptions.maxWidth = 150;
        this.box._updateLayout();

        expect(this.w2.offsetWidth).toEqual(150);
    });

    it("can handle the 'width' layout option", function() {
        this.area.style.width = "300px";

        this.w2.layoutOptions.width = 150;
        this.box._updateLayout();

        expect(this.w2.offsetWidth).toEqual(150);
    });

    it("can handle the 'minHeight' layout option", function() {
        this.area.style.width = "300px";

        this.w2.layoutOptions.minHeight = 100;
        this.box._updateLayout();

        expect(this.w2.offsetHeight).toEqual(100);
    });

    it("can handle the 'maxHeight' layout option", function() {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w2.layoutOptions.maxHeight = 80;
        this.box._updateLayout();

        expect(this.w2.offsetHeight).toEqual(80);
    });

    it("can handle the 'height' layout option", function() {
        this.area.style.width = "300px";
        this.area.style.height = "300px";

        this.w2.layoutOptions.height = 80;
        this.w3.layoutOptions.height = 150;
        this.box._updateLayout();

        expect(this.w2.offsetHeight).toEqual(80);
        expect(this.w3.offsetHeight).toEqual(150);
    });

    it("set the margins on the right items when widgets are reordered", function() {
        this.area.style.width = "300px";

        this.box.spacing = 10;
        this.w1.text = "widget 1"
        this.w2.text = "widget 2"
        this.w3.text = "widget 3"
        this.w3.layoutOptions.order = -1;
        this.box._updateLayout();

        expect(this.w3.html.parentNode.style.marginBottom).toEqual("10px");
        expect(this.w1.html.parentNode.style.marginBottom).toEqual("10px");
        expect(this.w2.html.parentNode.style.marginBottom).toEqual("");
    });
});

describe("photonui.BoxLayout (bugfix)", function() {

    beforeAll(function() {
        addTitle("photonui.BoxLayout (bugfix)");
    });

    beforeEach(function() {
        this.area = addTestArea();
        this.area.className += " photonui-container-expand-child";
    });

    // Disabled because there is a known bug with height sizing on webkit, and we don't care...
    xit("works with nested BoxLayout", function() {
        this.area.style.width = "320px";
        this.area.style.height = "170px";

        var w1 = new DummyWidget();
        var w2 = new DummyWidget();
        var w3 = new DummyWidget();
        var w4 = new DummyWidget();

        var vbox = new photonui.BoxLayout({
            orientation: "vertical",
            spacing: 10,
            children: [w1]
        });

        var hbox = new photonui.BoxLayout({
            orientation: "horizontal",
            spacing: 10,
            children: [w2, w3, w4]
        });

        vbox.addChild(hbox);
        photonui.domInsert(vbox, this.area);

        expect(w1.offsetWidth).toEqual(320);
        expect(w1.offsetHeight).toEqual(80);

        expect(w2.offsetWidth).toEqual(100);
        expect(w2.offsetHeight).toEqual(80);
        expect(w3.offsetWidth).toEqual(100);
        expect(w3.offsetHeight).toEqual(80);
        expect(w4.offsetWidth).toEqual(100);
        expect(w4.offsetHeight).toEqual(80);
    });
});
