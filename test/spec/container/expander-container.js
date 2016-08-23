//
// This file was auto-generated and may not be modified
//

describe("photonui.Expander (container)", function () {

    beforeEach(function () {
        this.c1 = new photonui.Expander();
        this.c2 = new photonui.Expander();
        this.w1 = new DummyWidget();
        this.w2 = new DummyWidget();
    });

    afterEach(function () {
        this.c1.destroy();
        this.c2.destroy();
        this.w1.destroy();
        this.w2.destroy();
    });

    it("has a container HTML element", function () {
        expect(this.c1.containerNode instanceof HTMLElement).toBeTruthy();
    });

    it("has the 'photonui-container' class on its conainer HTML node", function () {
        expect(this.c1.containerNode.className).toContain("photonui-container");
    });

    it("can have a child widget", function () {
        this.c1.child = this.w1;

        expect(this.c1.child).toBe(this.w1);
        expect(this.c1.childName).toBe(this.w1.name);
        expect(this.c1.containerNode.childNodes[0]).toBe(this.w1.html);
    });

    it("can update its child parent", function () {
        this.c1.child = this.w1;

        expect(this.w1.parent).toBe(this.c1);
        expect(this.w1.parentName).toBe(this.c1.name);
    });

    it("can have its child removed", function () {
        this.c1.child = this.w1;
        this.c1.child = null;

        expect(this.c1.child).toBeNull();
        expect(this.w1.parent).toBeNull();
        expect(this.w1.parent).toBeNull();
        expect(this.c1.containerNode.childNodes.length).toEqual(0);
    });

    it("can remove its child", function () {
        this.c1.child = this.w1;
        this.c1.removeChild(this.w1);

        expect(this.c1.child).toBeNull();
        expect(this.w1.parent).toBeNull();
        expect(this.w1.parent).toBeNull();
        expect(this.c1.containerNode.childNodes.length).toEqual(0);
    });

    it("can have its child changed", function () {
        this.c1.child = this.w1;
        this.c1.child = this.w2;

        expect(this.c1.child).toBe(this.w2);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBe(this.c1);
        expect(this.c1.containerNode.childNodes.length).toEqual(1);
        expect(this.c1.containerNode.childNodes[0]).toBe(this.w2.html);
    });

    it("can have its child reparented", function () {
        this.c1.child = this.w1;
        this.c2.child = this.w1;

        expect(this.c1.child).toBeNull();
        expect(this.c2.child).toBe(this.w1);
        expect(this.w1.parent).toBe(this.c2);
        expect(this.c1.containerNode.childNodes.length).toEqual(0);
        expect(this.c2.containerNode.childNodes.length).toEqual(1);
        expect(this.c2.containerNode.childNodes[0]).toBe(this.w1.html);
    });

});

