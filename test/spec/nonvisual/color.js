describe("photonui.Color", function() {

    beforeAll(function() {
        jasmine.addMatchers({
            toBeEquivalentToArray: function() {
                return {
                    compare: function(value1, value2) {
                        var isEquivalent = true;

                        if (value1.length !== value2.length) {
                            return {
                                pass: false,
                                message: "Expected array " + JSON.stringify(value1) + " to be equivalent to array " + JSON.stringify(value2) + " (different length)"
                            };
                        }

                        for (var i = 0 ; i < value1.length ; i++) {
                            if (value1[i] !== value2[i]) {
                                isEquivalent = false;
                                break;
                            }
                        }

                        if (isEquivalent) {
                            return {
                                pass: true,
                                message: "Expected " + JSON.stringify(value1) + " to NOT be equivalent to array " + JSON.stringify(value2)
                            };
                        } else {
                            return {
                                pass: false,
                                message: "Expected array " + JSON.stringify(value1) + " to be equivalent to array " + JSON.stringify(value2)
                            };
                        }

                    }
                };
            }
        });
    });

    beforeEach(function() {
        // ...
    });

    afterEach(function() {
        // ...
    });

    describe("Static methods", function() {

        it("ParseString can parse any supported color format to RGBA array", function() {
            expect(photonui.Color.ParseString("#c0ffee")).toBeEquivalentToArray([0xC0, 0xFF, 0xEE, 0xFF]);
            expect(photonui.Color.ParseString("#F40")).toBeEquivalentToArray([0xFF, 0x44, 0x00, 0xFF]);
            expect(photonui.Color.ParseString("rgb(0, 255, 255)")).toBeEquivalentToArray([0, 255, 255, 255]);

            expect(photonui.Color.ParseString("#ABadCafe")).toBeEquivalentToArray([0xAB, 0xAD, 0xCA, 0xFE]);
            expect(photonui.Color.ParseString("#dead")).toBeEquivalentToArray([0xDD, 0xEE, 0xAA, 0xDD]);
            expect(photonui.Color.ParseString("rgba(255, 0, 0, .2)")).toBeEquivalentToArray([255, 0, 0, 51]);

            expect(photonui.Color.ParseString("teal")).toBeEquivalentToArray([0x00, 0x80, 0x80, 0xFF]);
        });

        it("ParseNamedColor can parse valid CSS named colors", function() {
            // TODO Implements supports of all SVG colors https://www.w3.org/TR/css3-color/#svg-color

            expect(photonui.Color.ParseNamedColor("white")).toBeEquivalentToArray([0xFF, 0xFF, 0xFF]);
            expect(photonui.Color.ParseNamedColor("silver")).toBeEquivalentToArray([0xC0, 0xC0, 0xC0]);
            expect(photonui.Color.ParseNamedColor("gray")).toBeEquivalentToArray([0x80, 0x80, 0x80]);
            expect(photonui.Color.ParseNamedColor("black")).toBeEquivalentToArray([0x00, 0x00, 0x00]);
            expect(photonui.Color.ParseNamedColor("red")).toBeEquivalentToArray([0xFF, 0x00, 0x00]);
            expect(photonui.Color.ParseNamedColor("maroon")).toBeEquivalentToArray([0x80, 0x00, 0x00]);
            expect(photonui.Color.ParseNamedColor("yellow")).toBeEquivalentToArray([0xFF, 0xFF, 0x00]);
            expect(photonui.Color.ParseNamedColor("olive")).toBeEquivalentToArray([0x80, 0x80, 0x00]);
            expect(photonui.Color.ParseNamedColor("lime")).toBeEquivalentToArray([0x00, 0xFF, 0x00]);
            expect(photonui.Color.ParseNamedColor("green")).toBeEquivalentToArray([0x00, 0x80, 0x00]);
            expect(photonui.Color.ParseNamedColor("aqua")).toBeEquivalentToArray([0x00, 0xFF, 0xFF]);
            expect(photonui.Color.ParseNamedColor("teal")).toBeEquivalentToArray([0x00, 0x80, 0x80]);
            expect(photonui.Color.ParseNamedColor("blue")).toBeEquivalentToArray([0x00, 0x00, 0xFF]);
            expect(photonui.Color.ParseNamedColor("navy")).toBeEquivalentToArray([0x00, 0x00, 0x80]);
            expect(photonui.Color.ParseNamedColor("fuchsia")).toBeEquivalentToArray([0xFF, 0x00, 0xFF]);
            expect(photonui.Color.ParseNamedColor("purple")).toBeEquivalentToArray([0x80, 0x00, 0x80]);

            expect(photonui.Color.ParseNamedColor("rEd")).toBeEquivalentToArray([0xFF, 0, 0]);
        });

        it("ParseRgbHexString can parse RGB hexadecimal strings", function() {
            expect(photonui.Color.ParseRgbHexString("#ff4400")).toBeEquivalentToArray([0xFF, 0x44, 0x00]);
            expect(photonui.Color.ParseRgbHexString("#FF4400")).toBeEquivalentToArray([0xFF, 0x44, 0x00]);
            expect(photonui.Color.ParseRgbHexString("ff4400")).toBeEquivalentToArray([0xFF, 0x44, 0x00]);
            expect(photonui.Color.ParseRgbHexString("FF4400")).toBeEquivalentToArray([0xFF, 0x44, 0x00]);
            expect(photonui.Color.ParseRgbHexString("#f40")).toBeEquivalentToArray([0xFF, 0x44, 0x00]);
            expect(photonui.Color.ParseRgbHexString("#F40")).toBeEquivalentToArray([0xFF, 0x44, 0x00]);
            expect(photonui.Color.ParseRgbHexString("f40")).toBeEquivalentToArray([0xFF, 0x44, 0x00]);
            expect(photonui.Color.ParseRgbHexString("F40")).toBeEquivalentToArray([0xFF, 0x44, 0x00]);
        });

        it("ParseRgbaHexString can parse RGBA hexadecimal strings", function() {
            expect(photonui.Color.ParseRgbaHexString("#ff440033")).toBeEquivalentToArray([0xFF, 0x44, 0x00, 0x33]);
            expect(photonui.Color.ParseRgbaHexString("#FF440033")).toBeEquivalentToArray([0xFF, 0x44, 0x00, 0x33]);
            expect(photonui.Color.ParseRgbaHexString("ff440033")).toBeEquivalentToArray([0xFF, 0x44, 0x00, 0x33]);
            expect(photonui.Color.ParseRgbaHexString("FF440033")).toBeEquivalentToArray([0xFF, 0x44, 0x00, 0x33]);
            expect(photonui.Color.ParseRgbaHexString("#f403")).toBeEquivalentToArray([0xFF, 0x44, 0x00, 0x33]);
            expect(photonui.Color.ParseRgbaHexString("#F403")).toBeEquivalentToArray([0xFF, 0x44, 0x00, 0x33]);
            expect(photonui.Color.ParseRgbaHexString("f403")).toBeEquivalentToArray([0xFF, 0x44, 0x00, 0x33]);
            expect(photonui.Color.ParseRgbaHexString("F403")).toBeEquivalentToArray([0xFF, 0x44, 0x00, 0x33]);
        });

        it("ParseCssRgbString can parse CSS rgb() color notation", function() {
            expect(photonui.Color.ParseCssRgbString("rgb(255, 0, 0)")).toBeEquivalentToArray([255, 0, 0]);
            expect(photonui.Color.ParseCssRgbString("rgb(255,0,0)")).toBeEquivalentToArray([255, 0, 0]);
            expect(photonui.Color.ParseCssRgbString("rgb( 255 , 0 , 0 )")).toBeEquivalentToArray([255, 0, 0]);
            expect(photonui.Color.ParseCssRgbString("rgb(255,         0,\t0)")).toBeEquivalentToArray([255, 0, 0]);

            expect(photonui.Color.ParseCssRgbString("rgb(100%, 0%, 0%)")).toBeEquivalentToArray([255, 0, 0]);
            expect(photonui.Color.ParseCssRgbString("rgb( 100% , 0% , 0% )")).toBeEquivalentToArray([255, 0, 0]);

            expect(photonui.Color.ParseCssRgbString("rgb(110%, 0%, 0%)")).toBeEquivalentToArray([255, 0, 0]);
            expect(photonui.Color.ParseCssRgbString("rgb(3000, -10, 0)")).toBeEquivalentToArray([255, 0, 0]);
        });

        it("ParseCssRgbaString can parse CSS rgba() color notation", function() {
            expect(photonui.Color.ParseCssRgbaString("rgba(255, 0, 0, 1)")).toBeEquivalentToArray([255, 0, 0, 255]);
            expect(photonui.Color.ParseCssRgbaString("rgba(255,0,0,1)")).toBeEquivalentToArray([255, 0, 0, 255]);
            expect(photonui.Color.ParseCssRgbaString("rgba( 255 , 0 , 0 , 1 )")).toBeEquivalentToArray([255, 0, 0, 255]);
            expect(photonui.Color.ParseCssRgbaString("rgba(255,         0,\t0, 1)")).toBeEquivalentToArray([255, 0, 0, 255]);

            expect(photonui.Color.ParseCssRgbaString("rgba(100%, 0%, 0%, 1)")).toBeEquivalentToArray([255, 0, 0, 255]);
            expect(photonui.Color.ParseCssRgbaString("rgba( 100% , 0% , 0% , 1 )")).toBeEquivalentToArray([255, 0, 0, 255]);

            expect(photonui.Color.ParseCssRgbaString("rgba(110%, 0%, 0%, 1)")).toBeEquivalentToArray([255, 0, 0, 255]);
            expect(photonui.Color.ParseCssRgbaString("rgba(300, -10, 0, 1)")).toBeEquivalentToArray([255, 0, 0, 255]);

            expect(photonui.Color.ParseCssRgbaString("rgba(255, 0, 0, 0.2)")).toBeEquivalentToArray([255, 0, 0, 51]);
            expect(photonui.Color.ParseCssRgbaString("rgba(255, 0, 0, .2)")).toBeEquivalentToArray([255, 0, 0, 51]);
            expect(photonui.Color.ParseCssRgbaString("rgba(255, 0, 0, 0)")).toBeEquivalentToArray([255, 0, 0, 0]);
            expect(photonui.Color.ParseCssRgbaString("rgba(255, 0, 0, 1.0)")).toBeEquivalentToArray([255, 0, 0, 255]);

            expect(photonui.Color.ParseCssRgbaString("rgba(255, 0, 0, -42)")).toBeEquivalentToArray([255, 0, 0, 0]);
            expect(photonui.Color.ParseCssRgbaString("rgba(255, 0, 0, 42)")).toBeEquivalentToArray([255, 0, 0, 255]);
        });

        xit("ParseCssHslString can parse CSS hsl() color notation", function() {
            // TODO
        });

        xit("ParseCssHslaString can parse CSS hsla() color notation", function() {
            // TODO
        });

        it("FormatToRgbHexString can format a color to an hexadecimal RGB string", function() {
            expect(photonui.Color.FormatToRgbHexString(0xFF, 0x44, 0x00)).toEqual("#FF4400");
            expect(photonui.Color.FormatToRgbHexString(0x00, 0x01, 0x02)).toEqual("#000102");
        });

        it("FormatToRgbaHexString can format a color to an hexadecimal RGBA string", function() {
            expect(photonui.Color.FormatToRgbaHexString(0xFF, 0x44, 0x00, 0x00)).toEqual("#FF440000");
            expect(photonui.Color.FormatToRgbaHexString(0x00, 0x01, 0x02, 0xFF)).toEqual("#000102FF");
            expect(photonui.Color.FormatToRgbaHexString(0x00, 0x00, 0x00, 0x88)).toEqual("#00000088");
        });

        it("FormatToCssRgbString can format a color to a CSS RGB string", function() {
            expect(photonui.Color.FormatToCssRgbString(0xFF, 0x44, 0x00)).toEqual("rgb(255, 68, 0)");
            expect(photonui.Color.FormatToCssRgbString(0x00, 0x01, 0x02)).toEqual("rgb(0, 1, 2)");
        });

        it("FormatToCssRgbaString can format a color to a CSS RGBA string", function() {
            expect(photonui.Color.FormatToCssRgbaString(0xFF, 0x44, 0x00, 0xFF)).toEqual("rgba(255, 68, 0, 1.00)");
            expect(photonui.Color.FormatToCssRgbaString(0xFF, 0x44, 0x00, 0x00)).toEqual("rgba(255, 68, 0, 0.00)");
            expect(photonui.Color.FormatToCssRgbaString(0xFF, 0x44, 0x00, 0x88)).toEqual("rgba(255, 68, 0, 0.53)");
        });

    });

    it("hexString (deprecated) can take various input format and output a standard RGB hexadecimal string", function() {
        var color = new photonui.Color(0xC0, 0xFF, 0xEE);
        expect(color.hexString).toEqual("#C0FFEE");

        color.hexString = "#ABC";
        expect(color.hexString).toEqual("#AABBCC");

        color.hexString = "red";
        expect(color.hexString).toEqual("#FF0000");

        color.hexString = [0x12, 0x34, 0x56];
        expect(color.hexString).toEqual("#123456");
    });

    it("rgbString (deprecated) returns a CSS RGB string", function() {
        var color = new photonui.Color(0xC0, 0xFF, 0xEE);
        expect(color.rgbString).toEqual("rgb(192, 255, 238)");
    });

    it("rgbaString (deprecated) returns a CSS RGBA string", function() {
        var color = new photonui.Color(0xC0, 0xFF, 0xEE);
        expect(color.rgbaString).toEqual("rgba(192, 255, 238, 1.00)");
    });

    it("fromString() updates the color from the given string", function() {
        var color = new photonui.Color();

        color.fromString("#DeadBeef");

        expect(color.red).toEqual(0xDE);
        expect(color.green).toEqual(0xAD);
        expect(color.blue).toEqual(0xBE);
        expect(color.alpha).toEqual(0xEF);
    });

});

