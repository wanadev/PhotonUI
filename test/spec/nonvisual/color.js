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

});

