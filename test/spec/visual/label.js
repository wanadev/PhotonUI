describe("photonui.Label", function() {

    beforeAll(function() {
        addTitle("photonui.Label");
        this.tr = new photonui.Translation();
    });

    beforeEach(function() {
        this.area = addTestArea();
        this.area.className += " photonui-container-expand-child";
        this.label = new photonui.Label();

        photonui.domInsert(this.label, this.area);
    });

    it("can display a text", function() {
        this.label.text = "Hello World!";
        expect(this.label.html.innerHTML).toEqual("Hello World!");
    });

    it("can display a multiline text", function() {
        this.label.text = "Hello World!\nNew Line!";
        expect(this.label.html.innerHTML).toMatch(/Hello World!<br\s*\/?>New Line!/);
    });

    it("can display a translatable text", function() {
        this.label.text = _("Hello World!");
        expect(this.label.html.innerHTML).toEqual("Hello World!");
    });

    it("can display a multiline translatable text", function() {
        this.label.text = _("Hello World!\nNew Line!");
        expect(this.label.html.innerHTML).toMatch(/Hello World!<br\s*\/?>New Line!/);
    });

});

