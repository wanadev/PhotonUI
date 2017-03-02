describe("photonui.DataView (widget)", function() {

    beforeEach(function() {
        this.area = addTestArea();
    });

    afterEach(function() {
        this.dv.destroy();
    });

    describe("basics", function() {

        beforeEach(function() {
            this.dv = new photonui.DataView();
            photonui.domInsert(this.dv, this.area);
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

        it("displays all the items", function() {
            this.items = [
                "hello",
                "world",
            ];

            this.dv = new photonui.DataView({
              items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            var itemElements = this.dv.html.getElementsByClassName("photonui-dataview-item");

            expect(itemElements.length).toEqual(this.items.length);

            for (var i = 0; i < itemElements.length; i++) {
                expect(itemElements[i].textContent).toEqual(this.items[i]);
            }
        });

        it("handles numbers as items", function() {
            this.items = [
                "hello",
                1234,
            ];
            this.dv = new photonui.DataView({
                items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            var itemElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(itemElements.length).toEqual(this.items.length);
            expect(itemElements[0].textContent).toEqual(this.items[0]);
            expect(itemElements[1].textContent).toEqual(this.items[1].toString());
        });

        it("handles arrays as items", function() {
            this.items = [
                "hello",
                [
                    "foo",
                    "bar",
                ],
            ];
            this.dv = new photonui.DataView({
                items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            var itemElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(itemElements.length).toEqual(this.items.length);
            expect(itemElements[0].textContent).toEqual(this.items[0]);
            expect(itemElements[1].textContent).toEqual(this.items[1][0] + this.items[1][1]);
        });

        it("handles objects as items", function() {
            this.items = [
                "hello",
                {
                    prop1: "foo",
                    prop2: "bar",
                },
            ];
            this.dv = new photonui.DataView({
                items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            var itemElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(itemElements.length).toEqual(this.items.length);
            expect(itemElements[0].textContent).toEqual(this.items[0]);
            expect(itemElements[1].textContent).toEqual(this.items[1].prop1 + this.items[1].prop2);
        });

        it("handles mixed types of items", function() {
          this.items = [
                42,
                "a string",
                ["an", "array"],
                {
                    prop1: "an",
                    prop2: "object",
                },
            ];
            this.dv = new photonui.DataView({
                items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            var itemElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(itemElements.length).toEqual(this.items.length);
            expect(itemElements[0].textContent).toEqual(this.items[0].toString());
            expect(itemElements[1].textContent).toEqual(this.items[1]);
            expect(itemElements[2].textContent).toEqual(this.items[2][0] + this.items[2][1]);
            expect(itemElements[3].textContent).toEqual(this.items[3].prop1 + this.items[3].prop2);
        });
    });

    describe("handling columns", function() {

        it("generates one column when given a list of strings", function() {
            this.items = [
                "hello",
                "world",
            ];

            this.dv = new photonui.DataView({
              items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.$data.columns.length).toEqual(1);
            expect(this.dv.$data.columns[0].id).toEqual("__generated__");
            expect(this.dv.$data.columns[0].value).toEqual("__generated__");
            expect(this.dv.$data.columns[0].id).toEqual("__generated__");
            expect(this.dv.$data.columns[0].value).toEqual("__generated__");

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(1);
        });

        it("generates one column when given a list of numbers", function() {
            this.items = [
                123,
                456,
            ];

            this.dv = new photonui.DataView({
              items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.$data.columns.length).toEqual(1);
            expect(this.dv.$data.columns[0].id).toEqual("__generated__");
            expect(this.dv.$data.columns[0].value).toEqual("__generated__");

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(1);
        });

        it("generates needed columns when given a list of arrays", function() {
            this.items = [
                [
                    "an",
                    "array",
                ],
                [
                    "another",
                    "array",
                ],
            ];

            this.dv = new photonui.DataView({
              items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.$data.columns.length).toEqual(2);
            expect(this.dv.$data.columns[0].id).toEqual("0");
            expect(this.dv.$data.columns[0].value).toEqual("0");
            expect(this.dv.$data.columns[1].id).toEqual("1");
            expect(this.dv.$data.columns[1].value).toEqual("1");

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(2);
        });

        it("generates needed columns when given a list of objects", function() {
            this.items = [
                {
                    prop1: "an",
                    prop2: "object",
                },
                {
                    prop1: "another",
                    prop2: "object",
                },
            ];

            this.dv = new photonui.DataView({
              items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.$data.columns.length).toEqual(2);
            expect(this.dv.$data.columns[0].id).toEqual("prop1");
            expect(this.dv.$data.columns[0].value).toEqual("prop1");
            expect(this.dv.$data.columns[1].id).toEqual("prop2");
            expect(this.dv.$data.columns[1].value).toEqual("prop2");

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(2);
        });

        it("generates needed columns when given a list mixed types", function() {
            this.items = [
                {
                    prop1: "an",
                    prop2: "object",
                },
                [
                    "an",
                    "array",
                ],
                "hello world",
                42
            ];

            this.dv = new photonui.DataView({
              items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.$data.columns.length).toEqual(5);
            expect(this.dv.$data.columns[0].id).toEqual("prop1");
            expect(this.dv.$data.columns[0].value).toEqual("prop1");
            expect(this.dv.$data.columns[1].id).toEqual("prop2");
            expect(this.dv.$data.columns[1].value).toEqual("prop2");
            expect(this.dv.$data.columns[2].id).toEqual("0");
            expect(this.dv.$data.columns[2].value).toEqual("0");
            expect(this.dv.$data.columns[3].id).toEqual("1");
            expect(this.dv.$data.columns[3].value).toEqual("1");
            expect(this.dv.$data.columns[4].id).toEqual("__generated__");
            expect(this.dv.$data.columns[4].value).toEqual("__generated__");

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(5);
        });

        it("never regenerates columns when a column list has been manually set", function() {
            this.items = [
                "foo",
                "bar",
            ];

            this.columns = [
                "prop1",
            ];

            this.dv = new photonui.DataView({
              items: this.items,
              columns: this.columns,
            });

            this.otherItems = [
                {
                    prop1: "an",
                    prop2: "object",
                },
                {
                    prop1: "another",
                    prop2: "object",
                },
            ];

            this.dv.items = this.otherItems;

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.$data.columns.length).toEqual(this.columns.length);
            expect(this.dv.$data.columns[0].id).toEqual(this.columns[0]);
            expect(this.dv.$data.columns[0].value).toEqual(this.columns[0]);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(1);
            expect(columnElements[0].textContent).toEqual(this.otherItems[0][this.columns[0]]);
        });

        it("accepts an array of keys as a parameter", function() {
            this.items = [
                {
                    prop1: "a prop",
                    prop2: "another prop",
                    prop3: "an hidden prop",
                    prop4: "another prop",
                },
            ];

            this.columns = [
                "prop1",
                "prop2",
                "prop4",
            ]

            this.dv = new photonui.DataView({
                items: this.items,
                columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.$data.columns.length).toEqual(this.columns.length);
            expect(this.dv.$data.columns[0].id).toEqual("prop1");
            expect(this.dv.$data.columns[0].value).toEqual("prop1");
            expect(this.dv.$data.columns[1].id).toEqual("prop2");
            expect(this.dv.$data.columns[1].value).toEqual("prop2");
            expect(this.dv.$data.columns[2].id).toEqual("prop4");
            expect(this.dv.$data.columns[2].value).toEqual("prop4");

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(this.columns.length);

            expect(columnElements[0].textContent).toEqual(this.items[0][this.columns[0]]);
            expect(columnElements[1].textContent).toEqual(this.items[0][this.columns[1]]);
            expect(columnElements[2].textContent).toEqual(this.items[0][this.columns[2]]);
        });

        it("accepts an array of column definition objects as a parameter", function() {
            this.items = [
                {
                    prop1: "a prop",
                    prop2: "another prop",
                    prop3: "an hidden prop",
                    prop4: "another prop",
                },
            ];

            this.columns = [
                {
                    id: "myfirstcol",
                    value: "prop1",
                },
                {
                    id: "mysecondcol",
                    value: "prop2",
                },
                {
                    id: "mythirdcol",
                    value: "prop4",
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(this.columns.length);

            expect(columnElements[0].textContent).toEqual(this.items[0][this.columns[0].value]);
            expect(columnElements[1].textContent).toEqual(this.items[0][this.columns[1].value]);
            expect(columnElements[2].textContent).toEqual(this.items[0][this.columns[2].value]);
        });

        it("accepts an array of mixed keys and column definition objects as a parameter", function() {
            this.items = [
                {
                    prop1: "a prop",
                    prop2: "another prop",
                    prop3: "an hidden prop",
                    prop4: "another prop",
                },
            ];

            this.columns = [
                "prop1",
                "prop2",
                {
                    id: "mythirdcol",
                    value: "prop4",
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.$data.columns.length).toEqual(this.columns.length);
            expect(this.dv.$data.columns[0].id).toEqual("prop1");
            expect(this.dv.$data.columns[0].value).toEqual("prop1");
            expect(this.dv.$data.columns[1].id).toEqual("prop2");
            expect(this.dv.$data.columns[1].value).toEqual("prop2");
            expect(this.dv.$data.columns[2].id).toEqual("mythirdcol");
            expect(this.dv.$data.columns[2].value).toEqual("prop4");

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(this.columns.length);

            expect(columnElements[0].textContent).toEqual(this.items[0][this.columns[0]]);
            expect(columnElements[1].textContent).toEqual(this.items[0][this.columns[1]]);
            expect(columnElements[2].textContent).toEqual(this.items[0][this.columns[2].value]);
        });

        it("allows omitting the column id when defining a column", function() {
            this.items = [
                {
                    prop1: "a prop",
                },
            ];

            this.columns = [
                {
                    value: "prop1",
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.$data.columns.length).toEqual(this.columns.length);
            expect(this.dv.$data.columns[0].id).toEqual("prop1");
            expect(this.dv.$data.columns[0].value).toEqual("prop1");

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(this.columns.length);
        });

        it("allows defining a column value with a property path", function() {
            this.items = [
                {
                    name: {
                        first: "John",
                        last: "Smith",
                    }
                },
            ];

            this.columns = [
                "name.first",
                {
                    id: "lastname",
                    value: "name.last",
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(this.columns.length);

            expect(columnElements[0].textContent).toEqual(this.items[0].name.first);
            expect(columnElements[1].textContent).toEqual(this.items[0].name.last);
        });

        it("escapes raw HTML when not specified", function() {
            this.items = [
                {
                    name: {
                        first: "<div class=\"first-name\">John</div>",
                        last: "Smith",
                    }
                },
            ];

            this.columns = [
                "name.first",
                {
                    id: "lastname",
                    value: function (item) {
                        return "<div class=\"last-name\">" + item.name.last + "</div>";
                    },
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(this.columns.length);

            expect(columnElements[0].textContent).toEqual("<div class=\"first-name\">John</div>");
            expect(columnElements[1].textContent).toEqual("<div class=\"last-name\">Smith</div>");
        });

        it("adds raw HTML when specified", function() {
            this.items = [
                {
                    name: {
                        first: "<div class=\"first-name\">John</div>",
                        last: "Smith",
                    }
                },
            ];

            this.columns = [
                {
                    value: "name.first",
                    rawHtml: true,
                },
                {
                    id: "lastname",
                    value: function (item) {
                        return "<div class=\"last-name\">" + item.name.last + "</div>";
                    },
                    rawHtml: true,
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(this.columns.length);

            expect(columnElements[0].textContent).toEqual("John");
            expect(columnElements[1].textContent).toEqual("Smith");
            expect(columnElements[0].getElementsByClassName("first-name").length).toEqual(1);
            expect(columnElements[1].getElementsByClassName("last-name").length).toEqual(1);
        });

        it("allows defining a column value with a function", function() {
            this.items = [
                {
                    name: {
                        first: "John",
                        last: "Smith",
                    }
                },
            ];

            this.columns = [
                "name.first",
                {
                    id: "lastname_uppercase",
                    value: function (item) {
                        return item.name.last.toUpperCase();
                    },
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(this.columns.length);

            expect(columnElements[0].textContent).toEqual(this.items[0].name.first);
            expect(columnElements[1].textContent).toEqual(this.items[0].name.last.toUpperCase());
        });

        it("binds its context to the column value function", function() {
            this.items = [
                {
                    name: {
                        first: "John",
                        last: "Smith",
                    }
                },
            ];

            this.columns = [
                "name.first",
                "name.last",
                {
                    id: "custom-data",
                    value: function (item) {
                        return this.data.myData;
                    },
                },
            ];

            this.data = {
                myData: "hello world",
            }

            this.dv = new photonui.DataView({
                items: this.items,
                columns: this.columns,
                data: this.data,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(this.columns.length);

            expect(columnElements[0].textContent).toEqual(this.items[0].name.first);
            expect(columnElements[1].textContent).toEqual(this.items[0].name.last);
            expect(columnElements[2].textContent).toEqual(this.data.myData);
        });

        it("adds the widget to the column element when a column value function returns a widget", function() {
            this.items = [
                {
                    name: {
                        first: "John",
                        last: "Smith",
                    }
                },
            ];

            this.columns = [
                "name.first",
                "name.last",
                {
                    id: "delete",
                    value: function (item) {
                        return new photonui.Button({
                            text: "Delete " + item.name.first + " " + item.name.last,
                        });
                    },
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(this.columns.length);

            expect(columnElements[0].textContent).toEqual(this.items[0].name.first);
            expect(columnElements[1].textContent).toEqual(this.items[0].name.last);
            expect(columnElements[2].getElementsByClassName("photonui-button").length).toEqual(1);
        });
    });

    describe("handling DOM", function() {
        it("updates its DOM when data is changed", function() {
            this.otherItems = [
                "foo",
                "bar",
                "foobar",
            ];
            this.dv = new photonui.DataView({
              items: [
                  "hello",
                  "world",
              ],
            });

            photonui.domInsert(this.dv, this.area);

            this.dv.items = this.otherItems;

            var itemElements = this.dv.html.getElementsByClassName("photonui-dataview-item");

            expect(itemElements.length).toEqual(this.otherItems.length);

            for (var i = 0; i < itemElements.length; i++) {
                expect(itemElements[i].textContent).toEqual(this.otherItems[i]);
            }
        });

        it("updates its DOM when columns are changed", function() {
            this.items = [
                {
                    prop1: "an",
                    prop2: "object",
                },
                {
                    prop1: "another",
                    prop2: "object",
                },
            ];

            this.dv = new photonui.DataView({
              items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(2);
            expect(columnElements[0].textContent).toEqual(this.items[0].prop1);
            expect(columnElements[1].textContent).toEqual(this.items[0].prop2);

            this.dv.columns = [
                "prop1",
            ];

            rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(1);
            expect(columnElements[0].textContent).toEqual(this.items[0].prop1);

            this.dv.columns = [
                "prop2",
            ];

            rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements.length).toEqual(1);
            expect(columnElements[0].textContent).toEqual(this.items[0].prop2);
        });

        it("adds an index data-attribute to the item elements", function() {
            this.items = [
                "hello",
                "world",
            ];

            this.dv = new photonui.DataView({
              items: this.items,
            });

            photonui.domInsert(this.dv, this.area);

            var itemElements = this.dv.html.getElementsByClassName("photonui-dataview-item");

            expect(itemElements.length).toEqual(this.items.length);

            for (var i = 0; i < itemElements.length; i++) {
                expect(itemElements[i].getAttribute("data-photonui-dataview-item-index")).toEqual(i.toString());
            }
        });

        it("add a class specifying the column id to the column elements", function() {
            this.items = [
                {
                    prop1: "a prop",
                    prop2: "another prop",
                },
            ];

            this.columns = [
                {
                    id: "myfirstcol",
                    value: "prop1",
                },
                "prop2",
            ];

            this.dv = new photonui.DataView({
              items: this.items,
              columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements[0].className).toContain("photonui-dataview-column-myfirstcol");
            expect(columnElements[1].className).toContain("photonui-dataview-column-prop2");
        });

        it("escapes id when adding the class to the column elements", function() {
            this.items = [
                {
                    prop1: "a prop",
                    prop2: "another prop",
                },
            ];

            this.columns = [
                {
                    id: "__my first _prop_ with SYMBOLS!?%...",
                    value: "prop1",
                },
                "prop2",
            ];

            this.dv = new photonui.DataView({
              items: this.items,
              columns: this.columns,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements[0].className).toContain("photonui-dataview-column-my-first-prop-with-symbols");
            expect(columnElements[1].className).toContain("photonui-dataview-column-prop2");
        });
    });

    describe("handling options", function() {
        it("uses the specified container element", function() {
            this.containerElement = "nav";
            this.items = [
                123,
                456
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                containerElement: this.containerElement,
            });

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.html.tagName.toLowerCase()).toEqual(this.containerElement.toLowerCase());
        });

        it("uses the specified item element", function() {
            this.containerElement = "nav";
            this.itemElement = "div";
            this.items = [
                123,
                456
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                containerElement: this.containerElement,
                itemElement: this.itemElement,
            });

            photonui.domInsert(this.dv, this.area);

            var itemElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(itemElements.length).toEqual(this.items.length);
            expect(itemElements[0].tagName.toLowerCase()).toEqual(this.itemElement.toLowerCase());
            expect(itemElements[1].tagName.toLowerCase()).toEqual(this.itemElement.toLowerCase());
        });

        it("uses the specified column element", function() {
            this.columnElement = "blink";
            this.items = [
                123,
                456
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                columnElement: this.columnElement,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements[0].tagName.toLowerCase()).toEqual(this.columnElement.toLowerCase());
            expect(columnElements[0].tagName.toLowerCase()).toEqual(this.columnElement.toLowerCase());
        });

        it("uses the provided custom widget formater function to render items", function() {
            this.items = [
                {
                    name: {
                        first: "John",
                        last: "Smith",
                    }
                },
                {
                    name: {
                        first: "Hello",
                        last: "World",
                    }
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                customWidgetFormater: function (item) {
                    return new photonui.BoxLayout({
                        children: [
                            new photonui.Button({
                                text: item.name.first,
                            }),
                            new photonui.Button({
                                text: item.name.last,
                            }),
                        ],
                    });
                },
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var buttonElements = rowElements[0].getElementsByTagName("button");
            expect(buttonElements.length).toEqual(2);
            expect(buttonElements[0].textContent).toEqual(this.items[0].name.first);
            expect(buttonElements[1].textContent).toEqual(this.items[0].name.last);
        });

        it("binds its context to the custom widget formater function", function() {
            this.items = [
                {
                    name: {
                        first: "John",
                        last: "Smith",
                    }
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                data: {
                    message: "hello",
                },
                customWidgetFormater: function (item) {
                    return new photonui.Text({
                        text: this.data.message + " " + item.name.first,
                    });
                },
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);
            expect(rowElements[0].textContent).toEqual("hello John");
        });

        it("adds custom classname to container element", function() {
            this.classname = "hello";
            this.items = [
                {
                    prop1: "an",
                    prop2: "object",
                },
                {
                    prop1: "another",
                    prop2: "object",
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                classname: this.classname,
            });

            photonui.domInsert(this.dv, this.area);

            expect(this.dv.html.className).toContain("photonui-hello-container");
        });

        it("adds custom classname to item elements", function() {
            this.classname = "hello";
            this.items = [
                {
                    prop1: "an",
                    prop2: "object",
                },
                {
                    prop1: "another",
                    prop2: "object",
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                classname: this.classname,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            expect(rowElements[0].className).toContain("photonui-dataview-item");
            expect(rowElements[1].className).toContain("photonui-dataview-item");
        });

        it("adds custom classname to column elements", function() {
            this.classname = "hello";
            this.items = [
                {
                    prop1: "an",
                    prop2: "object",
                },
                {
                    prop1: "another",
                    prop2: "object",
                },
            ];

            this.dv = new photonui.DataView({
                items: this.items,
                classname: this.classname,
            });

            photonui.domInsert(this.dv, this.area);

            var rowElements = this.dv.html.getElementsByClassName("photonui-dataview-item");
            expect(rowElements.length).toEqual(this.items.length);

            var columnElements = rowElements[0].getElementsByClassName("photonui-dataview-column");
            expect(columnElements[0].className).toContain("photonui-dataview-column");
            expect(columnElements[1].className).toContain("photonui-dataview-column");
        });
    });
});
