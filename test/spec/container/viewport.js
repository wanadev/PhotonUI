describe("photonui.Viewport", function() {

    beforeAll(function() {
        addTitle("photonui.Viewport");
    });

    beforeEach(function() {
        this.area = addTestArea();
        this.area.style.width = "300px";
        this.area.style.height = "200px";

        this.viewport = new photonui.Viewport({
            child: new photonui.BoxLayout({
                children: [
                    new DummyWidget({text: "Widget 0"}),
                    new DummyWidget({text: "Widget 1"}),
                    new DummyWidget({text: "Widget 2"}),
                    new DummyWidget({text: "Widget 3"}),
                    new DummyWidget({text: "Widget 4"}),
                    new DummyWidget({text: "Widget 5"}),
                    new DummyWidget({text: "Widget 6"}),
                    new DummyWidget({text: "Widget 7"}),
                    new DummyWidget({text: "Widget 8"}),
                    new DummyWidget({text: "Widget 9"})
                ]
            })
        });

        photonui.domInsert(this.viewport, this.area);
    });

    afterEach(function() {
        // ...
    });

    it("takes all its parent's size by default", function() {
        expect(this.viewport.offsetWidth).toEqual(300);
        expect(this.viewport.offsetHeight).toEqual(200);
    });

    it("takes all its parent's size by default (even if parent's has padding)", function() {
        this.area.style.padding = "10px";
        expect(this.viewport.offsetWidth).toEqual(280);
        expect(this.viewport.offsetHeight).toEqual(180);
    });

    it("takes all its parent's size by default (even if the parent's height is not defined)", function() {
        var div = document.createElement("div");
        photonui.domInsert(this.viewport, div);
        this.area.style.height = "250px";
        this.area.appendChild(div);

        this.viewport._sizingHack(); // !!

        expect(this.viewport.offsetWidth).toEqual(300);
        expect(this.viewport.offsetHeight).toEqual(250);
    });

    it("can have a specified height", function() {
        this.viewport.height = 100;
        expect(this.viewport.offsetHeight).toEqual(100);
    });

    it("can have a minimum height", function() {
        this.viewport.minHeight = 300;
        expect(this.viewport.offsetHeight).toEqual(300);
    });

    it("can have a maximum height", function() {
        this.viewport.maxHeight = 100;
        expect(this.viewport.offsetHeight).toEqual(100);
    });

    it("can have a specified width", function() {
        this.viewport.width = 200;
        expect(this.viewport.offsetWidth).toEqual(200);
    });

    it("can have a minimum width", function() {
        this.viewport.minWidth = 400;
        expect(this.viewport.offsetWidth).toEqual(400);
    });

    it("can have a maximum width", function() {
        this.viewport.maxWidth = 200;
        expect(this.viewport.offsetWidth).toEqual(200);
    });

});

