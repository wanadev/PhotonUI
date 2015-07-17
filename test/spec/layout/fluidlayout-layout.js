//
// This file was auto-generated and may not be modified
//

describe("photonui.FluidLayout (layout)", function() {

    beforeEach(function() {
        this.l1 = new photonui.FluidLayout();
        this.l2 = new photonui.FluidLayout();
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

    it("can have children widgets", function() {
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

    it("can update its children parents (declarative way)", function() {
        var l1 = new photonui.FluidLayout({
            children: [
                new DummyWidget({name: "widget1"})
            ]
        });
        var w1 = photonui.getWidget("widget1");

        expect(l1.children.length).toEqual(1);
        expect(w1.parentName).toBe(l1.name);
        expect(w1.parent).toBe(l1);

        l1.destroy();
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

