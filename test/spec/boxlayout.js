describe("photonui.BoxLayout (layout logic)", function() {

    beforeEach(function() {
        this.l1 = new photonui.BoxLayout();
        this.l2 = new photonui.BoxLayout();
        this.w1 = new DummyWidget();
        this.w2 = new DummyWidget();
        this.w3 = new DummyWidget();
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
