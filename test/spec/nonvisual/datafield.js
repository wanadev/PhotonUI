describe("photonui.DataField", function () {

    beforeAll(function () {
        this.data = [
            {
                id: 1,
                title: "I know things!",
                published: new Date(),
                "nb-comment": 2,
                author: {
                    firstName: "John",
                    lastName: "Snow"
                }
            },
            {
                id: 2,
                title: "How the dark side of the force can help you to be a better person",
                published: new Date(),
                "nb-comment": 0,
                author: {
                    firstName: "Darth",
                    lastName: "Vador"
                }
            }
        ];

        this.flatData = [
            "line 1",
            "line 2"
        ];
    });

    beforeEach(function () {
        // ...
    });

    afterEach(function () {
        // ...
    });

    it("extracts the field value from a flat data row", function () {
        var df = new photonui.DataField();
        expect(df.format(this.flatData[0])).toEqual("line 1");
    });

    it("extracts the field value from an object data row", function () {
        var df = new photonui.DataField({
            key: "title"
        });
        expect(df.format(this.data[0])).toEqual("I know things!");
    });

    it("extracts the field value from neested object data row", function () {
        var df = new photonui.DataField({
            key: "author.firstName"
        });
        expect(df.format(this.data[0])).toEqual("John");
    });

    it("extracts the field value from neested object data row (with custom separator)", function () {
        var df = new photonui.DataField({
            key: "author|firstName",
            keySeparator: "|"
        });
        expect(df.format(this.data[0])).toEqual("John");
    });

    it("formats the field value using the default formatter", function () {
        var df = new photonui.DataField({
            key: "author.firstName",
            formatterOptions: {
                format: "Hello %s!"
            }
        });
        expect(df.format(this.data[0])).toEqual("Hello John!");
    });

    it("formats the field value using a build-in formatter", function () {
        var df = new photonui.DataField({
            key: "published",
            formatter: "dateFormatter",
            formatterOptions: {
                format: "YYYY"
            }
        });
        expect(df.format(this.data[0])).toEqual(String(new Date().getFullYear()));
    });

    it("formats the field value using a custom formatter", function () {
        var df = new photonui.DataField({
            formatter: function (value, row, options) {
                return "You know nothing " + value.author.firstName + " " + row.author.lastName;
            }
        });
        expect(df.format(this.data[0])).toEqual("You know nothing John Snow");
    });

    it("has the key as title by default", function () {
        var df = new photonui.DataField({
            key: "author.firstName"
        });
        expect(df.title).toEqual("author.firstName");
    });

    it("can have a custom title", function () {
        var df = new photonui.DataField({
            key: "author.firstName",
            title: "Title"
        });
        expect(df.title).toEqual("Title");
    });

    it("can have an empty title", function () {
        var df = new photonui.DataField({
            key: "author.firstName",
            title: ""
        });
        expect(df.title).toBe("");
    });

});

