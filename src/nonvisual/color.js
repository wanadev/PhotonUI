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
    white:   [0xFF, 0xFF, 0xFF],
    silver:  [0xC0, 0xC0, 0xC0],
    gray:    [0x80, 0x80, 0x80],
    black:   [0x00, 0x00, 0x00],
    red:     [0xFF, 0x00, 0x00],
    maroon:  [0x80, 0x00, 0x00],
    yellow:  [0xFF, 0xFF, 0x00],
    olive:   [0x80, 0x80, 0x00],
    lime:    [0x00, 0xFF, 0x00],
    green:   [0x00, 0x80, 0x00],
    aqua:    [0x00, 0xFF, 0xFF],
    teal:    [0x00, 0x80, 0x80],
    blue:    [0x00, 0x00, 0xFF],
    navy:    [0x00, 0x00, 0x80],
    fuchsia: [0xFF, 0x00, 0xFF],
    purple:  [0x80, 0x00, 0x80]
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

        ParseCssHslString: function (color) {
            // TODO
        },

        ParseCssHslaString: function (color) {
            // TODO
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
            var r = red.toString(16).toUpperCase();
            if (r.length == 1) {
                r = "0" + r;
            }
            var g = green.toString(16).toUpperCase();
            if (g.length == 1) {
                g = "0" + g;
            }
            var b = blue.toString(16).toUpperCase();
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
            var a = alpha.toString(16).toUpperCase();
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
        },

        NormalizeHslColor: function (hue, saturation, lightness) {
            // TODO
        },

        NormalizeHslaColor: function (hue, saturation, lightness, alpha) {
            // TODO
        }

    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The color in HTML RGB hexadecimal format (e.g. "#FF0000").
     *
     * @property hexString
     * @deprecated
     * @type String
     */
    getHexString: function () {
        helpers.log("warn", "'hexString' is deprecated, use 'rgbHexString' instead");
        return this.$class.FormatToRgbHexString(this.red, this.green, this.blue);
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
     * The color in HTML RGB format (e.g. "rgb(255, 0, 0)").
     *
     * @property rgbString
     * @type String
     * @readOnly
     */
    getRgbString: function () {
        helpers.log("warn", "'rgbString' is deprecated, use 'cssRgbString' instead");
        return this.$class.FormatToCssRgbString(this.red, this.green, this.blue);
    },

    /**
     * The color in HTML RGBA format (e.g. "rgba(255, 0, 0, 1.0)").
     *
     * @property rgbaString
     * @type String
     * @readOnly
     */
    getRgbaString: function () {
        helpers.log("warn", "'rgbaString' is deprecated, use 'cssRgbaString' instead");
        return this.$class.FormatToCssRgbaString(this.red, this.green, this.blue, this.alpha);
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
        return this.hexString;
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
