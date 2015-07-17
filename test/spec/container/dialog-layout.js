describe("photonui.Dialog (buttons layout)", function() {

    beforeEach(function() {
        this.l1 = new photonui.Dialog();
        this.l2 = new photonui.Dialog();
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

    it("can have buttons widget", function() {
        this.l1.buttons = [this.w1, this.w2];
        this.l1.addButton(this.w3);

        expect(this.l1.buttons.length).toEqual(3);
        expect(this.l1.buttons).toContain(this.w1);
        expect(this.l1.buttons).toContain(this.w2);
        expect(this.l1.buttons).toContain(this.w3);

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).toContain(this.w1.html);
        expect(nodes).toContain(this.w2.html);
        expect(nodes).toContain(this.w3.html);
    });

    it("can update its buttons parents", function() {
        this.l1.buttons = [this.w1, this.w2];
        this.l1.addButton(this.w3);

        expect(this.l1.buttons.length).toEqual(3);
        expect(this.w1.parentName).toBe(this.l1.name);
        expect(this.w2.parentName).toBe(this.l1.name);
        expect(this.w3.parentName).toBe(this.l1.name);
        expect(this.w1.parent).toBe(this.l1);
        expect(this.w2.parent).toBe(this.l1);
        expect(this.w3.parent).toBe(this.l1);
    });

    it("can update its buttons parents (declarative way)", function() {
        var l1 = new photonui.Dialog({
            buttons: [
                new DummyWidget({name: "widget1"})
            ]
        });
        var w1 = photonui.getWidget("widget1");

        expect(l1.buttons.length).toEqual(1);
        expect(w1.parentName).toBe(l1.name);
        expect(w1.parent).toBe(l1);

        l1.destroy();
    });

    it("can have its buttons removed", function() {
        this.l1.buttons = [this.w1, this.w2];
        this.l1.buttons = [];

        expect(this.l1.buttons.length).toEqual(0);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBeNull();

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).not.toContain(this.w2.html);
    });

    it("can have one child removed", function() {
        this.l1.buttons = [this.w1, this.w2];
        this.l1.buttons = [this.w2];

        expect(this.l1.buttons.length).toEqual(1);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBe(this.l1);

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).toContain(this.w2.html);
    });

    it("can remove one if its child", function() {
        this.l1.buttons = [this.w1, this.w2];
        this.l1.removeButton(this.w1);

        expect(this.l1.buttons.length).toEqual(1);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBe(this.l1);

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).toContain(this.w2.html);
    });

    it("destroys its buttons when destroyed", function() {
        this.l1.buttons = [this.w1, this.w2];
        this.l1.destroy();

        expect(this.l1.buttons.length).toEqual(0);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBeNull();

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).not.toContain(this.w2.html);
    });

    it("can have its buttons changed", function() {
        this.l1.buttons = [this.w1, this.w2];
        this.l1.buttons = [this.w3, this.w2];

        expect(this.l1.buttons.length).toEqual(2);
        expect(this.w1.parent).toBeNull();
        expect(this.w2.parent).toBe(this.l1);
        expect(this.w3.parent).toBe(this.l1);

        var nodes = this.l1.html.querySelectorAll(".photonui-widget");
        expect(nodes).not.toContain(this.w1.html);
        expect(nodes).toContain(this.w2.html);
        expect(nodes).toContain(this.w3.html);
    });

    it("allows its buttons to be reparented", function() {
        this.l1.buttons = [this.w1, this.w2, this.w3];
        this.l2.buttons = [this.w1];
        this.l2.addButton(this.w3);

        expect(this.l1.buttons.length).toEqual(1);
        expect(this.l2.buttons.length).toEqual(2);
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

