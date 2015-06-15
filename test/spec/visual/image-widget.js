describe("photonui.Image (widget)", function() {

    beforeEach(function() {
        this.c = new DummyContainer();
        this.w = new photonui.Image();
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

});
