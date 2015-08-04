//
// This file was auto-generated and may not be modified
//

describe("photonui.TextAreaField (widget)", function() {

    beforeEach(function() {
        this.c = new DummyContainer();
        this.w = new photonui.TextAreaField();
    });

    afterEach(function() {
        this.c.destroy();
        this.w.destroy();
    });

    it("has a name", function() {
        expect(this.w.name).not.toBeUndefined();
    });

    it("has HTML element", function() {
        expect(this.w.html instanceof HTMLElement).toBeTruthy();
    });

    it("has the 'photonui-widget' class on its outer HTML", function() {
        expect(this.w.html.className).toContain("photonui-widget");
    });

    it("has the 'photonui-textareafield' class on its outer HTML", function() {
        expect(this.w.html.className).toContain("photonui-textareafield");
    });

    it("can be unparented", function() {
        this.c.child = this.w;
        this.w.unparent();

        expect(this.c.child).toBeNull();
        expect(this.c.childName).toBeNull();
        expect(this.c.containerNode.childNodes.length).toEqual(0);
    });

    it("is unparented when it is destroyed", function() {
        this.c.child = this.w;
        this.w.destroy();

        expect(this.c.child).toBeNull();
        expect(this.c.childName).toBeNull();
        expect(this.c.containerNode.childNodes.length).toEqual(0);
    });

    it("can be inserted and removed from any html element", function() {
        var div = document.createElement("div");

        photonui.domInsert(this.w, div);
        expect(div.childNodes).toContain(this.w.html);

        this.w.unparent();
        expect(div.childNodes).not.toContain(this.w.html);
    });

    it("have its name as id of its HTML element", function() {
        expect(this.w.html.id).toEqual(this.w.name);
    });

});

