describe("photonui.BaseDataView (widget)", function() {

    describe("basics", function() {

        beforeEach(function() {
            this.dv = new photonui.BaseDataView();
            this.area = addTestArea();
            photonui.domInsert(this.dv, this.area);
        });

        afterEach(function() {
            // this.dv.destroy();
        });

        it("has a name", function() {
            expect(this.dv.name).not.toBeUndefined();
        });

        it("has an HTML element", function() {
            expect(this.dv.html instanceof HTMLElement).toBeTruthy();
        });

        it("has the 'photonui-widget' class on its outer HTML", function() {
            expect(this.dv.html.className).toContain("photonui-widget");
        });

        it("has the 'photonui-dataview' class on its outer HTML", function() {
            expect(this.dv.html.className).toContain("photonui-dataview");
        });

        it("can be unparented", function() {
            this.c = new DummyContainer();
            this.c.child = this.dv;
            this.dv.unparent();

            expect(this.c.child).toBeNull();
            expect(this.c.childName).toBeNull();
            expect(this.c.containerNode.childNodes.length).toEqual(0);
        });

        it("is unparented when it is destroyed", function() {
            this.c = new DummyContainer();
            this.c.child = this.dv;
            this.dv.destroy();

            expect(this.c.child).toBeNull();
            expect(this.c.childName).toBeNull();
            expect(this.c.containerNode.childNodes.length).toEqual(0);
        });

        it("can be inserted and removed from any html element", function() {
            var div = document.createElement("div");

            photonui.domInsert(this.dv, div);
            expect(div.childNodes).toContain(this.dv.html);

            this.dv.unparent();
            expect(div.childNodes).not.toContain(this.dv.html);
        });

        it("have its name as id of its HTML element", function() {
            expect(this.dv.html.id).toEqual(this.dv.name);
        });
    });

    describe("handling items", function() {

        beforeEach(function() {
            this.items = [
                "hello",
                "world",
            ];
            this.otherItems = [
                "foo",
                "bar",
                "foobar",
            ];
            this.dv = new photonui.BaseDataView({
              items: this.items,
            });
            this.area = addTestArea();
            photonui.domInsert(this.dv, this.area);
        });

        afterEach(function() {
            this.dv.destroy();
        });

        it("should display all the items", function() {
            var itemElements = this.dv.html.getElementsByClassName("photonui-dataview-item");

            expect(itemElements.length).toEqual(this.items.length);

            for (var i = 0; i < itemElements.length; i++) {
                expect(itemElements[i].textContent).toEqual(this.items[i]);
            }
        });

        it("should update its DOM when data is changed", function() {
            this.dv.items = this.otherItems;

            var itemElements = this.dv.html.getElementsByClassName("photonui-dataview-item");

            expect(itemElements.length).toEqual(this.otherItems.length);

            for (var i = 0; i < itemElements.length; i++) {
                expect(itemElements[i].textContent).toEqual(this.otherItems[i]);
            }
        });

    });
});
