describe("photonui.Dialog", function() {

    beforeAll(function() {
        // ...
    });

    beforeEach(function() {
        // ...
    });

    afterEach(function() {
        // ...
    });

    it("destroys its children (child + buttons) when destroyed", function() {
        var w1 = new DummyWidget();
        var w2 = new DummyWidget();

        var dlg = new photonui.Dialog({
            child: w1,
            buttons: [w2]
        });

        dlg.destroy();

        expect(photonui.getWidget(w1.name)).toBeNull();
        expect(photonui.getWidget(w2.name)).toBeNull();
    });

});

