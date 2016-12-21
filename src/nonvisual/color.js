/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule NonVisual
 * @namespace photonui
 */

var lodash = require("lodash");

var Base = require("../base.js");
var helpers = require("../helpers.js");

var NAMED_COLORS = {
    aliceblue:             [0xF0, 0xF8, 0xFF],
    antiquewhite:          [0xFA, 0xEB, 0xD7],
    aqua:                  [0x00, 0xFF, 0xFF],
    aquamarine:            [0x7F, 0xFF, 0xD4],
    azure:                 [0xF0, 0xFF, 0xFF],
    beige:                 [0xF5, 0xF5, 0xDC],
    bisque:                [0xFF, 0xE4, 0xC4],
    black:                 [0x00, 0x00, 0x00],
    blanchedalmond:        [0xFF, 0xEB, 0xCD],
    blue:                  [0x00, 0x00, 0xFF],
    blueviolet:            [0x8A, 0x2B, 0xE2],
    brown:                 [0xA5, 0x2A, 0x2A],
    burlywood:             [0xDE, 0xB8, 0x87],
    cadetblue:             [0x5F, 0x9E, 0xA0],
    chartreuse:            [0x7F, 0xFF, 0x00],
    chocolate:             [0xD2, 0x69, 0x1E],
    coral:                 [0xFF, 0x7F, 0x50],
    cornflowerblue:        [0x64, 0x95, 0xED],
    cornsilk:              [0xFF, 0xF8, 0xDC],
    crimson:               [0xDC, 0x14, 0x3C],
    cyan:                  [0x00, 0xFF, 0xFF],
    darkblue:              [0x00, 0x00, 0x8B],
    darkcyan:              [0x00, 0x8B, 0x8B],
    darkgoldenrod:         [0xB8, 0x86, 0x0B],
    darkgray:              [0xA9, 0xA9, 0xA9],
    darkgreen:             [0x00, 0x64, 0x00],
    darkgrey:              [0xA9, 0xA9, 0xA9],
    darkkhaki:             [0xBD, 0xB7, 0x6B],
    darkmagenta:           [0x8B, 0x00, 0x8B],
    darkolivegreen:        [0x55, 0x6B, 0x2F],
    darkorange:            [0xFF, 0x8C, 0x00],
    darkorchid:            [0x99, 0x32, 0xCC],
    darkred:               [0x8B, 0x00, 0x00],
    darksalmon:            [0xE9, 0x96, 0x7A],
    darkseagreen:          [0x8F, 0xBC, 0x8F],
    darkslateblue:         [0x48, 0x3D, 0x8B],
    darkslategray:         [0x2F, 0x4F, 0x4F],
    darkslategrey:         [0x2F, 0x4F, 0x4F],
    darkturquoise:         [0x00, 0xCE, 0xD1],
    darkviolet:            [0x94, 0x00, 0xD3],
    deeppink:              [0xFF, 0x14, 0x93],
    deepskyblue:           [0x00, 0xBF, 0xFF],
    dimgray:               [0x69, 0x69, 0x69],
    dimgrey:               [0x69, 0x69, 0x69],
    dodgerblue:            [0x1E, 0x90, 0xFF],
    firebrick:             [0xB2, 0x22, 0x22],
    floralwhite:           [0xFF, 0xFA, 0xF0],
    forestgreen:           [0x22, 0x8B, 0x22],
    fuchsia:               [0xFF, 0x00, 0xFF],
    gainsboro:             [0xDC, 0xDC, 0xDC],
    ghostwhite:            [0xF8, 0xF8, 0xFF],
    gold:                  [0xFF, 0xD7, 0x00],
    goldenrod:             [0xDA, 0xA5, 0x20],
    gray:                  [0x80, 0x80, 0x80],
    green:                 [0x00, 0x80, 0x00],
    greenyellow:           [0xAD, 0xFF, 0x2F],
    grey:                  [0x80, 0x80, 0x80],
    honeydew:              [0xF0, 0xFF, 0xF0],
    hotpink:               [0xFF, 0x69, 0xB4],
    indianred:             [0xCD, 0x5C, 0x5C],
    indigo:                [0x4B, 0x00, 0x82],
    ivory:                 [0xFF, 0xFF, 0xF0],
    khaki:                 [0xF0, 0xE6, 0x8C],
    lavender:              [0xE6, 0xE6, 0xFA],
    lavenderblush:         [0xFF, 0xF0, 0xF5],
    lawngreen:             [0x7C, 0xFC, 0x00],
    lemonchiffon:          [0xFF, 0xFA, 0xCD],
    lightblue:             [0xAD, 0xD8, 0xE6],
    lightcoral:            [0xF0, 0x80, 0x80],
    lightcyan:             [0xE0, 0xFF, 0xFF],
    lightgoldenrodyellow:  [0xFA, 0xFA, 0xD2],
    lightgray:             [0xD3, 0xD3, 0xD3],
    lightgreen:            [0x90, 0xEE, 0x90],
    lightgrey:             [0xD3, 0xD3, 0xD3],
    lightpink:             [0xFF, 0xB6, 0xC1],
    lightsalmon:           [0xFF, 0xA0, 0x7A],
    lightseagreen:         [0x20, 0xB2, 0xAA],
    lightskyblue:          [0x87, 0xCE, 0xFA],
    lightslategray:        [0x77, 0x88, 0x99],
    lightslategrey:        [0x77, 0x88, 0x99],
    lightsteelblue:        [0xB0, 0xC4, 0xDE],
    lightyellow:           [0xFF, 0xFF, 0xE0],
    lime:                  [0x00, 0xFF, 0x00],
    limegreen:             [0x32, 0xCD, 0x32],
    linen:                 [0xFA, 0xF0, 0xE6],
    magenta:               [0xFF, 0x00, 0xFF],
    maroon:                [0x80, 0x00, 0x00],
    mediumaquamarine:      [0x66, 0xCD, 0xAA],
    mediumblue:            [0x00, 0x00, 0xCD],
    mediumorchid:          [0xBA, 0x55, 0xD3],
    mediumpurple:          [0x93, 0x70, 0xDB],
    mediumseagreen:        [0x3C, 0xB3, 0x71],
    mediumslateblue:       [0x7B, 0x68, 0xEE],
    mediumspringgreen:     [0x00, 0xFA, 0x9A],
    mediumturquoise:       [0x48, 0xD1, 0xCC],
    mediumvioletred:       [0xC7, 0x15, 0x85],
    midnightblue:          [0x19, 0x19, 0x70],
    mintcream:             [0xF5, 0xFF, 0xFA],
    mistyrose:             [0xFF, 0xE4, 0xE1],
    moccasin:              [0xFF, 0xE4, 0xB5],
    navajowhite:           [0xFF, 0xDE, 0xAD],
    navy:                  [0x00, 0x00, 0x80],
    oldlace:               [0xFD, 0xF5, 0xE6],
    olive:                 [0x80, 0x80, 0x00],
    olivedrab:             [0x6B, 0x8E, 0x23],
    orange:                [0xFF, 0xA5, 0x00],
    orangered:             [0xFF, 0x45, 0x00],
    orchid:                [0xDA, 0x70, 0xD6],
    palegoldenrod:         [0xEE, 0xE8, 0xAA],
    palegreen:             [0x98, 0xFB, 0x98],
    paleturquoise:         [0xAF, 0xEE, 0xEE],
    palevioletred:         [0xDB, 0x70, 0x93],
    papayawhip:            [0xFF, 0xEF, 0xD5],
    peachpuff:             [0xFF, 0xDA, 0xB9],
    peru:                  [0xCD, 0x85, 0x3F],
    pink:                  [0xFF, 0xC0, 0xCB],
    plum:                  [0xDD, 0xA0, 0xDD],
    powderblue:            [0xB0, 0xE0, 0xE6],
    purple:                [0x80, 0x00, 0x80],
    red:                   [0xFF, 0x00, 0x00],
    rosybrown:             [0xBC, 0x8F, 0x8F],
    royalblue:             [0x41, 0x69, 0xE1],
    saddlebrown:           [0x8B, 0x45, 0x13],
    salmon:                [0xFA, 0x80, 0x72],
    sandybrown:            [0xF4, 0xA4, 0x60],
    seagreen:              [0x2E, 0x8B, 0x57],
    seashell:              [0xFF, 0xF5, 0xEE],
    sienna:                [0xA0, 0x52, 0x2D],
    silver:                [0xC0, 0xC0, 0xC0],
    skyblue:               [0x87, 0xCE, 0xEB],
    slateblue:             [0x6A, 0x5A, 0xCD],
    slategray:             [0x70, 0x80, 0x90],
    slategrey:             [0x70, 0x80, 0x90],
    snow:                  [0xFF, 0xFA, 0xFA],
    springgreen:           [0x00, 0xFF, 0x7F],
    steelblue:             [0x46, 0x82, 0xB4],
    tan:                   [0xD2, 0xB4, 0x8C],
    teal:                  [0x00, 0x80, 0x80],
    thistle:               [0xD8, 0xBF, 0xD8],
    tomato:                [0xFF, 0x63, 0x47],
    turquoise:             [0x40, 0xE0, 0xD0],
    violet:                [0xEE, 0x82, 0xEE],
    wheat:                 [0xF5, 0xDE, 0xB3],
    white:                 [0xFF, 0xFF, 0xFF],
    whitesmoke:            [0xF5, 0xF5, 0xF5],
    yellow:                [0xFF, 0xFF, 0x00],
    yellowgreen:           [0x9A, 0xCD, 0x32]
};

/**
 * Handle colors.
 *
 * wEvents:
 *
 *   * value-changed:
 *      - description: the selected color changed.
 *      - callback:    function(photonui.Color)
 *
 * @class Color
 * @constructor
 * @extends photonui.Base
 * @param {Object} * An object that can contain any property of the Color class (optional).
 */
var Color = Base.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["value-changed"]);
        if (typeof(params) == "object" && !Array.isArray(params)) {
            this.$super(params);
        } else {
            this.$super();
            if (typeof(params) == "string") {
                this.fromString(params);
            } else if (Array.isArray(params)) {
                this.setRGBA(params);
            } else if (arguments.length >= 3) {
                this.setRGBA.apply(this, arguments);
            }
        }
    },

    //////////////////////////////////////////
    // Static methods                       //
    //////////////////////////////////////////

    __classvars__: {

        /**
         * Object containing all known named colors (`colorName: [r, g, b]`).
         *
         * @property NAMED_COLORS
         * @static
         * @type Object
         */
        NAMED_COLORS: NAMED_COLORS,

        /**
         * Converts any supported color format to an `[r, g, b, a]` array.
         *
         * @method ParseString
         * @static
         * @param {String} color
         * @return {Array} `[r, g, b, a]` where each components is an integer between 0-255
         */
        ParseString: function (color) {
            // #FF4400 #F40
            if (color.match(/^#([0-9a-f]{3}){1,2}$/i)) {
                return Color.NormalizeRgbaColor.apply(undefined, Color.ParseRgbHexString(color));
            }

            // #FF4400FF #F40F
            if (color.match(/^#([0-9a-f]{4}){1,2}$/i)) {
                return Color.ParseRgbaHexString(color);
            }

            // rgb(255, 70, 0)
            if (color.match(/^rgb\(.+\)$/)) {
                try {
                    return Color.NormalizeRgbaColor.apply(undefined, Color.ParseCssRgbString(color));
                } catch (error) {
                    // pass
                }
            }

            // rgba(255, 70, 0, 1.0)
            if (color.match(/^rgba\(.+\)$/)) {
                try {
                    return Color.ParseCssRgbaString(color);
                } catch (error) {
                    // pass
                }
            }

            // Named color
            if (lodash.includes(lodash.keys(NAMED_COLORS), color.toLowerCase())) {
                return Color.NormalizeRgbaColor.apply(undefined, Color.ParseNamedColor(color));
            }

            // Invalid color... thow...
            throw new Error("InvalidColorFormat: '" + color + "' is not in a supported format");
        },

        /**
         * Converts a named color (e.g. "red") to an `[r, g, b]` array.
         *
         * @method ParseNamedColor
         * @static
         * @param {String} color The named color
         * @return {Array} `[r, g, b]` where each component is an integer between 0-255
         */
        ParseNamedColor: function (color) {
            color = color.toLowerCase();
            if (!NAMED_COLORS[color]) {
                throw new Error("InvalidColorFormat: '" + color + "' is not a supported named color");
            }
            return lodash.clone(NAMED_COLORS[color]);
        },

        /**
         * Converts an hexadecimal RGB color (e.g. `#FF0000`, `#F00`) to an `[r, g, b]` array.
         *
         * @method ParseRgbHexString
         * @static
         * @param {String} color The hexadecimal RGB color
         * @return {Array} `[r, g, b]` where each component is an integer between 0-255
         */
        ParseRgbHexString: function (color) {
            if (color[0] != "#") {
                color = "#" + color;
            }

            // #ff0000
            if (color.match(/^#[a-z0-9]{6}$/i)) {
                return Color.NormalizeRgbColor(
                    parseInt(color[1] + color[2], 16),  // red
                    parseInt(color[3] + color[4], 16),  // green
                    parseInt(color[5] + color[6], 16)   // blue
                );

            // #f00
            } else if (color.match(/^#[a-z0-9]{3}$/i)) {
                return Color.NormalizeRgbColor(
                    parseInt(color[1] + color[1], 16),  // red
                    parseInt(color[2] + color[2], 16),  // green
                    parseInt(color[3] + color[3], 16)   // blue
                );
            }

            throw new Error("InvalidColorFormat: " + color + " is not a valid hexadecimal RGB color");
        },

        /**
         * Converts an hexadecimal RGBA color (e.g. `#FF0000FF`, `#F00F`) to an `[r, g, b, a]` array.
         *
         * @method ParseRgbaHexString
         * @static
         * @param {String} color The hexadecimal RGBA color
         * @return {Array} `[r, g, b, a]` where each component is an integer between 0-255
         */
        ParseRgbaHexString: function (color) {
            if (color[0] != "#") {
                color = "#" + color;
            }

            // #ff0000ff
            if (color.match(/^#[a-z0-9]{8}$/i)) {
                return Color.NormalizeRgbaColor(
                    parseInt(color[1] + color[2], 16),  // red
                    parseInt(color[3] + color[4], 16),  // green
                    parseInt(color[5] + color[6], 16),  // blue
                    parseInt(color[7] + color[8], 16)   // alpha
                );

            // #f00f
            } else if (color.match(/^#[a-z0-9]{4}$/i)) {
                return Color.NormalizeRgbaColor(
                    parseInt(color[1] + color[1], 16),  // red
                    parseInt(color[2] + color[2], 16),  // green
                    parseInt(color[3] + color[3], 16),  // blue
                    parseInt(color[4] + color[4], 16)   // alpha
                );
            }

            throw new Error("InvalidColorFormat: " + color + " is not a valid hexadecimal RGBA color");
        },

        /**
         * Converts a CSS RGB color (e.g. `rgb(255, 0, 0)`) to an `[r, g, b]` array.
         *
         * @method ParseCssRgbString
         * @static
         * @param {String} color The CSS RGB color
         * @return {Array} `[r, g, b]` where each component is an integer between 0-255
         */
        ParseCssRgbString: function (color) {
            // rgb(255, 0, 0)
            var match = color.match(/^rgb\(\s*(-?[0-9]+)\s*,\s*(-?[0-9]+)\s*,\s*(-?[0-9]+)\s*\)$/);
            if (match) {
                return Color.NormalizeRgbColor(
                    parseInt(match[1], 10),
                    parseInt(match[2], 10),
                    parseInt(match[3], 10)
                );
            }

            // rgb(100%, 0%, 0%)
            match = color.match(/^rgb\(\s*(-?[0-9]+)%\s*,\s*(-?[0-9]+)%\s*,\s*(-?[0-9]+)%\s*\)$/);
            if (match) {
                return Color.NormalizeRgbColor(
                    parseInt(match[1], 10) / 100 * 255,
                    parseInt(match[2], 10) / 100 * 255,
                    parseInt(match[3], 10) / 100 * 255
                );
            }

            throw new Error("InvalidColorFormat: " + color + " is not a valid CSS RGB color");
        },

        /**
         * Converts a CSS RGBA color (e.g. `rgba(255, 0, 0, 0.3)`) to an `[r, g, b, a]` array.
         *
         * @method ParseCssRgbaString
         * @static
         * @param {String} color The CSS RGBA color
         * @return {Array} `[r, g, b, a]` where each component is an integer between 0-255
         */
        ParseCssRgbaString: function (color) {
            // rgba(255, 0, 0)
            // jscs:disable
            var match = color.match(/^rgba\(\s*(-?[0-9]+)\s*,\s*(-?[0-9]+)\s*,\s*(-?[0-9]+)\s*,\s*(-?[0-9]*\.?[0-9]+)\s*\)$/);
            // jscs:enable
            if (match) {
                return Color.NormalizeRgbaColor(
                    parseInt(match[1], 10),
                    parseInt(match[2], 10),
                    parseInt(match[3], 10),
                    parseFloat(match[4], 10) * 255
                );
            }

            // rgba(100%, 0%, 0%)
            // jscs:disable
            match = color.match(/^rgba\(\s*(-?[0-9]+)%\s*,\s*(-?[0-9]+)%\s*,\s*(-?[0-9]+)%\s*,\s*(-?[0-9]*\.?[0-9]+)\s*\)$/);
            // jscs:enable
            if (match) {
                return Color.NormalizeRgbaColor(
                    parseInt(match[1], 10) / 100 * 255,
                    parseInt(match[2], 10) / 100 * 255,
                    parseInt(match[3], 10) / 100 * 255,
                    parseFloat(match[4], 10) * 255
                );
            }

            throw new Error("InvalidColorFormat: " + color + " is not a valid CSS RGBA color");
        },

        /**
         * Format an RGB color to hexadecimal RGB string (e.g. `#FF0000`).
         *
         * @method FormatToRgbHexString
         * @static
         * @param {Number} red The red component
         * @param {Number} green The green component
         * @param {Number} blue The blue component
         * @return {String} The formatted color string.
         */
        FormatToRgbHexString: function (red, green, blue) {
            var r = (red | 0).toString(16).toUpperCase();
            if (r.length == 1) {
                r = "0" + r;
            }
            var g = (green | 0).toString(16).toUpperCase();
            if (g.length == 1) {
                g = "0" + g;
            }
            var b = (blue | 0).toString(16).toUpperCase();
            if (b.length == 1) {
                b = "0" + b;
            }
            return "#" + r + g + b;
        },

        /**
         * Format an RGBA color to hexadecimal RGBA string (e.g. `#FF0000FF`).
         *
         * @method FormatToRgbaHexString
         * @static
         * @param {Number} red The red component
         * @param {Number} green The green component
         * @param {Number} blue The blue component
         * @param {Number} alpha The opacity of the color
         * @return {String} The formatted color string.
         */
        FormatToRgbaHexString: function (red, green, blue, alpha) {
            var a = (alpha | 0).toString(16).toUpperCase();
            if (a.length == 1) {
                a = "0" + a;
            }
            return Color.FormatToRgbHexString(red, green, blue) + a;
        },

        /**
         * Format an RGB color to CSS RGB string (e.g. `rgb(255, 0, 0)`).
         *
         * @method FormatToCssRgbString
         * @static
         * @param {Number} red The red component
         * @param {Number} green The green component
         * @param {Number} blue The blue component
         * @return {String} The formatted color string.
         */
        FormatToCssRgbString: function (red, green, blue) {
            return "rgb(" + red + ", " + green + ", " + blue + ")";
        },

        /**
         * Format an RGBA color to CSS RGBA string (e.g. `rgba(255, 0, 0, 1.00)`).
         *
         * @method FormatToCssRgbaString
         * @static
         * @param {Number} red The red component
         * @param {Number} green The green component
         * @param {Number} blue The blue component
         * @param {Number} alpha The opacity of the color
         * @return {String} The formatted color string.
         */
        FormatToCssRgbaString: function (red, green, blue, alpha) {
            var a = (alpha / 255).toFixed(2);
            return "rgba(" + red + ", " + green + ", " + blue + ", " + a + ")";
        },

        /**
         * Normalize an RGB color.
         *
         * @method NormalizeRgbColor
         * @static
         * @param {Number} red The red component
         * @param {Number} green The green component
         * @param {Number} blue The blue component
         * @return {Array} The normalized array `[r, g, b]` where each component is an integer between 0-255.
         */
        NormalizeRgbColor: function (red, green, blue) {
            return [
                lodash.clamp(red | 0, 0, 255),
                lodash.clamp(green | 0, 0, 255),
                lodash.clamp(blue | 0, 0, 255)
            ];
        },

        /**
         * Normalize an RGBA color.
         *
         * @method NormalizeRgbaColor
         * @static
         * @param {Number} red The red component
         * @param {Number} green The green component
         * @param {Number} blue The blue component
         * @param {Number} alpha The opacity of the color
         * @return {Array} The normalized array `[r, g, b, a]` where each component is an integer between 0-255.
         */
        NormalizeRgbaColor: function (red, green, blue, alpha) {
            if (alpha === undefined) {
                alpha = 255;
            }
            return [
                lodash.clamp(red | 0, 0, 255),
                lodash.clamp(green | 0, 0, 255),
                lodash.clamp(blue | 0, 0, 255),
                lodash.clamp(alpha | 0, 0, 255)
            ];
        }

    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The color in RGB hexadecimal format (e.g. "#FF0000").
     *
     * @property hexString
     * @deprecated
     * @type String
     */
    getHexString: function () {
        helpers.log("warn", "'hexString' is deprecated, use 'rgbHexString' instead");
        return this.rgbHexString;
    },

    setHexString: function (value) {
        helpers.log("warn", "'hexString' is deprecated, use 'fromString()' method instead");

        var color = null;

        if (typeof value == "string") {
            if (value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
                color = this.$class.ParseRgbHexString(value);
            } else {
                try {
                    color = this.$class.ParseNamedColor(value);
                } catch (e) {
                    // pass
                }
            }
        } else if (lodash.isArray(value)) {
            color = value;
        }

        if (color) {
            this.setRGB(color);
        } else {
            helpers.log("warn", "Unrecognized color format " + JSON.stringify(value));
        }
    },

    /**
     * The color in CSS RGB format (e.g. "rgb(255, 0, 0)").
     *
     * @property rgbString
     * @type String
     * @readOnly
     * @deprecated
     */
    getRgbString: function () {
        helpers.log("warn", "'rgbString' is deprecated, use 'cssRgbString' instead");
        return this.$class.FormatToCssRgbString(this.red, this.green, this.blue);
    },

    /**
     * The color in CSS RGBA format (e.g. "rgba(255, 0, 0, 1.0)").
     *
     * @property rgbaString
     * @type String
     * @readOnly
     * @deprecated
     */
    getRgbaString: function () {
        helpers.log("warn", "'rgbaString' is deprecated, use 'cssRgbaString' instead");
        return this.$class.FormatToCssRgbaString(this.red, this.green, this.blue, this.alpha);
    },

    /**
     * The color in RGB hexadecimal format (e.g. "#FF0000").
     *
     * @property rgbHexString
     * @type String
     */
    getRgbHexString: function () {
        return this.$class.FormatToRgbHexString(this.red, this.green, this.blue);
    },

    setRgbHexString: function (color) {
        try {
            this.setRGB(this.$class.ParseRgbHexString(color));
        } catch (error) {
            helpers.log("warn", error);
        }
    },

    /**
     * The color in RGBA hexadecimal format (e.g. "#FF0000FF").
     *
     * @property rgbaHexString
     * @type String
     */
    getRgbaHexString: function () {
        return this.$class.FormatToRgbaHexString(this.red, this.green, this.blue, this.alpha);
    },

    setRgbaHexString: function (color) {
        try {
            this.setRGBA(this.$class.ParseRgbaHexString(color));
        } catch (error) {
            helpers.log("warn", error);
        }
    },

    /**
     * The color in CSS RGB format (e.g. "rgb(255, 0, 0)").
     *
     * @property cssRgbString
     * @type String
     */
    getCssRgbString: function () {
        return this.$class.FormatToCssRgbString(this.red, this.green, this.blue);
    },

    setCssRgbString: function (color) {
        try {
            this.setRGB(this.$class.ParseCssRgbString(color));
        } catch (error) {
            helpers.log("warn", error);
        }
    },

    /**
     * The color in CSS RGBA format (e.g. "rgb(255, 0, 0, 1.0)").
     *
     * @property cssRgbaString
     * @type String
     */
    getCssRgbaString: function () {
        return this.$class.FormatToCssRgbaString(this.red, this.green, this.blue, this.alpha);
    },

    setCssRgbaString: function (color) {
        try {
            this.setRGBA(this.$class.ParseCssRgbaString(color));
        } catch (error) {
            helpers.log("warn", error);
        }
    },

    /**
     * Red (0-255).
     *
     * @property red
     * @type Number
     */
    _red: 255,

    getRed: function () {
        return this._red;
    },

    setRed: function (red) {
        this._red = lodash.clamp(red | 0, 0, 255);
        this._updateHSB();
    },

    /**
     * Green (0-255).
     *
     * @property green
     * @type Number
     */
    _green: 0,

    getGreen: function () {
        return this._green;
    },

    setGreen: function (green) {
        this._green = lodash.clamp(green | 0, 0, 255);
        this._updateHSB();
    },

    /**
     * Blue (0-255).
     *
     * @property blue
     * @type Number
     */
    _blue: 0,

    getBlue: function () {
        return this._blue;
    },

    setBlue: function (blue) {
        this._blue = lodash.clamp(blue | 0, 0, 255);
        this._updateHSB();
    },

    /**
     * Alpha channel (0-255)
     *
     * @property alpha
     * @type Number
     */
    _alpha: 255,

    getAlpha: function () {
        return this._alpha;
    },

    setAlpha: function (alpha) {
        this._alpha = lodash.clamp(alpha | 0, 0, 255);
        this._callCallbacks("value-changed");
    },

    /**
     * Hue (0-360).
     *
     * @property hue
     * @type Number
     */
    _hue: 0,

    getHue: function () {
        return this._hue;
    },

    setHue: function (hue) {
        this._hue = lodash.clamp(hue | 0, 0, 360);
        this._updateRGB();
    },

    /**
     * Saturation (0-100).
     *
     * @property saturation
     * @type Number
     */
    _saturation: 100,

    getSaturation: function () {
        return this._saturation;
    },

    setSaturation: function (saturation) {
        this._saturation = lodash.clamp(saturation | 0, 0, 100);
        this._updateRGB();
    },

    /**
     * Brightness (0-100).
     *
     * @property brightness
     * @type Number
     */
    _brightness: 100,

    getBrightness: function () {
        return this._brightness;
    },

    setBrightness: function (brightness) {
        this._brightness = lodash.clamp(brightness | 0, 0, 100);
        this._updateRGB();
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Defines the color from any supported string format.
     *
     * @method fromString
     * @param {String} color
     */
    fromString: function (color) {
        try {
            this.setRGBA(this.$class.ParseString(color));
        } catch (error) {
            helpers.log("warn", error);
        }
    },

    /**
     * Set RGB(A) color (alias for setRGBA).
     *
     * The params can also be replaced by an array.
     *
     * @method setRGB
     * @param {Number} red (0-255)
     * @param {Number} green (0-255)
     * @param {Number} blue (0-255)
     */
    setRGB: function () {
        this.setRGBA.apply(this, arguments);
    },

    /**
     * Set RGBA color.
     *
     * The params can also be replaced by an array.
     *
     * @method setRGBA
     * @param {Number} red (0-255)
     * @param {Number} green (0-255)
     * @param {Number} blue (0-255)
     * @param {Number} alpha (optional, 0-255)
     */
    setRGBA: function () {
        var args = arguments;
        if (arguments.length == 1 && Array.isArray(arguments[0])) {
            args = arguments[0];
        }
        if (args.length < 3) {
            return;
        }

        this._red = Math.max(0, Math.min(255, args[0] | 0));
        this._green = Math.max(0, Math.min(255, args[1] | 0));
        this._blue = Math.max(0, Math.min(255, args[2] | 0));
        if (args[3] !== undefined) {
            this._alpha = Math.max(0, Math.min(255, args[3] | 0));
        }

        this._updateHSB();
    },

    /**
     * Get RGB.
     *
     * @method getRGB
     * @return {Array} [red(0-255), green(0-255), blue(0-255)]
     */
    getRGB: function () {
        return [this._red, this._green, this._blue];
    },

    /**
     * Get RGBA.
     *
     * @method getRGBA
     * @return {Array} [red(0-255), green(0-255), blue(0-255), alpha(0-255)]
     */
    getRGBA: function () {
        return [this._red, this._green, this._blue, this._alpha];
    },

    /**
     * Set HSB color
     *
     * The params can also be replaced by an array.
     *
     * @method setHSB
     * @param {Number} hue (0-360)
     * @param {Number} saturation (0-100)
     * @param {Number} brightness (0-100)
     */
    setHSB: function () {
        var args = arguments;
        if (arguments.length == 1 && Array.isArray(arguments[0])) {
            args = arguments[0];
        }
        if (args.length != 3) {
            return;
        }

        this._hue = Math.max(0, Math.min(360, args[0] | 0));
        this._saturation = Math.max(0, Math.min(100, args[1] | 0));
        this._brightness = Math.max(0, Math.min(100, args[2] | 0));

        this._updateRGB();
    },

    toString: function () {
        return this.rgbHexString;
    },

    // ====== Private methods ======

    /**
     * Update HSB from RGB.
     *
     * @method _updateHSB
     * @private
     */
    _updateHSB: function () {
        // http://fr.wikipedia.org/wiki/Teinte_Saturation_Valeur#Conversion_de_RVB_vers_TSV

        var r = this._red / 255;
        var g = this._green / 255;
        var b = this._blue / 255;

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);

        // Hue
        if (max == min) {
            this._hue = 0;
        } else if (max == r) {
            this._hue = Math.round((60 * (g - b) / (max - min) + 360) % 360);
        } else if (max == g) {
            this._hue = Math.round(60 * (b - r) / (max - min) + 120);
        } else if (max == b) {
            this._hue = Math.round(60 * (r - g) / (max - min) + 240);
        }

        // Saturation
        if (max === 0) {
            this._saturation = 0;
        } else {
            this._saturation = Math.round((1 - min / max) * 100);
        }

        // Brightness
        this._brightness = Math.round(max * 100);

        //
        this._callCallbacks("value-changed");
    },

    /**
     * Update RGB from HSB.
     *
     * @method _updateRGB
     * @private
     */
    _updateRGB: function () {
        // http://fr.wikipedia.org/wiki/Teinte_Saturation_Valeur#Conversion_de_TSV_vers_RVB

        var h = this.hue % 360;
        var s = this.saturation / 100;
        var b = this.brightness / 100;

        var ti = ((h / 60) | 0) % 6;
        var f = h / 60 - ti;
        var l = b * (1 - s);
        var m = b * (1 - f * s);
        var n = b * (1 - (1 - f) * s);

        switch (ti) {
            case 0:
                this._red = (b * 255) | 0;
                this._green = (n * 255) | 0;
                this._blue = (l * 255) | 0;
                break;
            case 1:
                this._red = (m * 255) | 0;
                this._green = (b * 255) | 0;
                this._blue = (l * 255) | 0;
                break;
            case 2:
                this._red = (l * 255) | 0;
                this._green = (b * 255) | 0;
                this._blue = (n * 255) | 0;
                break;
            case 3:
                this._red = (l * 255) | 0;
                this._green = (m * 255) | 0;
                this._blue = (b * 255) | 0;
                break;
            case 4:
                this._red = (n * 255) | 0;
                this._green = (l * 255) | 0;
                this._blue = (b * 255) | 0;
                break;
            case 5:
                this._red = (b * 255) | 0;
                this._green = (l * 255) | 0;
                this._blue = (m * 255) | 0;
                break;
        }

        this._callCallbacks("value-changed");
    }

});

module.exports = Color;
