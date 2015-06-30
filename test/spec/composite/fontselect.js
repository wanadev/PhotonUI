describe("photonui.FontSelect", function() {

    beforeAll(function() {
        // ...
    });

    beforeEach(function() {
        // ...
    });

    afterEach(function() {
        // ...
    });

     it("can be declared with a value from the default set", function() {
         var s = new photonui.FontSelect({value: "monospace"});
         expect(s.value).toEqual("monospace");
     });

});

