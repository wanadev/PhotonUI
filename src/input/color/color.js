/*
 * Copyright (c) 2014, Wanadev <http://www.wanadev.fr/>
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
 * @submodule Input
 * @namespace photonui
 */

var Base = require("../../base.js");

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
    __init__: function(params) {
        this._registerWEvents(["value-changed"]);
        if (typeof(params) == "object" && !Array.isArray(params)) {
            this.$super(params);
        }
        else {
            this.$super();
            if (typeof(params) == "string") {
                this.hexString = params;
            }
            else if (Array.isArray(params)) {
                this.setRGBA(params);
            }
            else if (arguments.length >= 3) {
                this.setRGBA.apply(this, arguments);
            }
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
     * @type String
     */
    getHexString: function() {
        var r = this.red.toString(16).toUpperCase();
        if (r.length == 1) r = "0" + r;
        var g = this.green.toString(16).toUpperCase();
        if (g.length == 1) g = "0" + g;
        var b = this.blue.toString(16).toUpperCase();
        if (b.length == 1) b = "0" + b;
        return "#" + r + g + b;
    },

    setHexString: function(value) {
        var value = value.replace(" ", "");
        // #FF0000
        if (value.match(/^#[0-9a-f]{6}$/i)) {
            this._red = parseInt(value[1]+value[2], 16);
            this._green = parseInt(value[3]+value[4], 16);
            this._blue = parseInt(value[5]+value[6], 16);
            this._updateHSB();
        }
        // #F00
        else if (value.match(/^#[0-9a-f]{3}$/i)) {
            this._red = parseInt(value[1]+value[1], 16);
            this._green = parseInt(value[2]+value[2], 16);
            this._blue = parseInt(value[3]+value[3], 16);
            this._updateHSB();
        }
        // Named colors
        else {
            var colors = {
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
            if (colors[value] != undefined) {
                this.setRGB(colors[value]);
            }
        }

    },

    /**
     * The color in HTML RGB format (e.g. "rgb(255, 0, 0)").
     *
     * @property rgbString
     * @type String
     * @readOnly
     */
    getRgbString: function() {
        return "rgb(" + this._red + ", " + this._green + ", " + this._blue + ")";
    },

    /**
     * The color in HTML RGBA format (e.g. "rgba(255, 0, 0, 1.0)").
     *
     * @property rgbaString
     * @type String
     * @readOnly
     */
    getRgbaString: function() {
        return "rgba(" + this._red + ", " + this._green + ", " + this._blue + ", " + (this._alpha / 255) + ")";
    },

    /**
     * Red (0-255).
     *
     * @property red
     * @type Number
     */
    _red: 255,

    getRed: function() {
        return this._red;
    },

    setRed: function(red) {
        this._red = Math.max(0, Math.min(255, red|0));
        this._updateHSB();
    },

    /**
     * Green (0-255).
     *
     * @property green
     * @type Number
     */
    _green: 0,

    getGreen: function() {
        return this._green;
    },

    setGreen: function(green) {
        this._green = Math.max(0, Math.min(255, green|0));
        this._updateHSB();
    },

    /**
     * Blue (0-255).
     *
     * @property blue
     * @type Number
     */
    _blue: 0,

    getBlue: function() {
        return this._blue;
    },

    setBlue: function(blue) {
        this._blue = Math.max(0, Math.min(255, blue|0));
        this._updateHSB();
    },

    /**
     * Alpha channel (0-255)
     *
     * @property alpha
     * @type Number
     */
    _alpha: 255,

    getAlpha: function() {
        return this._alpha;
    },

    setAlpha: function(alpha) {
        this._alpha = Math.max(0, Math.min(255, alpha|0));
        this._callCallbacks("value-changed");
    },

    /**
     * Hue (0-360).
     *
     * @property hue
     * @type Number
     */
    _hue: 0,

    getHue: function() {
        return this._hue;
    },

    setHue: function(hue) {
        this._hue = Math.max(0, Math.min(360, hue|0));
        this._updateRGB();
    },

    /**
     * Saturation (0-100).
     *
     * @property saturation
     * @type Number
     */
    _saturation: 100,

    getSaturation: function() {
        return this._saturation;
    },

    setSaturation: function(saturation) {
        this._saturation = Math.max(0, Math.min(100, saturation|0));
        this._updateRGB();
    },

    /**
     * Brightness (0-100).
     *
     * @property brightness
     * @type Number
     */
    _brightness: 100,

    getBrightness: function() {
        return this._brightness;
    },

    setBrightness: function(brightness) {
        this._brightness = Math.max(0, Math.min(100, brightness|0));
        this._updateRGB();
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======

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
    setRGB: function() {
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
    setRGBA: function() {
        var args = arguments;
        if (arguments.length == 1 && Array.isArray(arguments[0])) args = arguments[0];
        if (args.length < 3) return;

        this._red = Math.max(0, Math.min(255, args[0]|0));
        this._green = Math.max(0, Math.min(255, args[1]|0));
        this._blue = Math.max(0, Math.min(255, args[2]|0));
        if (args[3] != undefined) this._alpha = Math.max(0, Math.min(255, args[3]|0));

        this._updateHSB();
    },

    /**
     * Get RGB.
     *
     * @method getRGB
     * @return {Array} [red(0-255), green(0-255), blue(0-255)]
     */
    getRGB: function() {
        return [this._red, this._green, this._blue];
    },

    /**
     * Get RGBA.
     *
     * @method getRGBA
     * @return {Array} [red(0-255), green(0-255), blue(0-255), alpha(0-255)]
     */
    getRGBA: function() {
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
    setHSB: function() {
        var args = arguments;
        if (arguments.length == 1 && Array.isArray(arguments[0])) args = arguments[0];
        if (args.length != 3) return;

        this._hue = Math.max(0, Math.min(360, args[0]|0));
        this._saturation = Math.max(0, Math.min(100, args[1]|0));
        this._brightness = Math.max(0, Math.min(100, args[2]|0));

        this._updateRGB();
    },

    toString: function() {
        return this.hexString;
    },

    // ====== Private methods ======

    /**
     * Update HSB from RGB.
     *
     * @method _updateHSB
     * @private
     */
    _updateHSB: function() {
        // http://fr.wikipedia.org/wiki/Teinte_Saturation_Valeur#Conversion_de_RVB_vers_TSV

        var r = this._red / 255;
        var g = this._green / 255;
        var b = this._blue / 255;

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);

        // Hue
        if (max == min) {
            this._hue = 0;
        }
        else if (max == r) {
            this._hue = Math.round((60 * (g - b) / (max - min) + 360) % 360);
        }
        else if (max == g) {
            this._hue = Math.round(60 * (b - r) / (max - min) + 120);
        }
        else if (max == b) {
            this._hue = Math.round(60 * (r - g) / (max - min) + 240);
        }

        // Saturation
        if (max == 0) {
            this._saturation = 0;
        }
        else {
            this._saturation = Math.round((1 - min/max) * 100);
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
    _updateRGB: function() {
        // http://fr.wikipedia.org/wiki/Teinte_Saturation_Valeur#Conversion_de_TSV_vers_RVB

        var h = this.hue % 360;
        var s = this.saturation / 100;
        var b = this.brightness / 100;

        var ti = ((h / 60)|0) % 6;
        var f = h / 60 - ti;
        var l = b * (1 - s);
        var m = b * (1 - f * s);
        var n = b * (1 - (1 - f) * s);

        switch (ti) {
            case 0:
                this._red = (b * 255)|0;
                this._green = (n * 255)|0;
                this._blue = (l * 255)|0;
                break;
            case 1:
                this._red = (m * 255)|0;
                this._green = (b * 255)|0;
                this._blue = (l * 255)|0;
                break;
            case 2:
                this._red = (l * 255)|0;
                this._green = (b * 255)|0;
                this._blue = (n * 255)|0;
                break;
            case 3:
                this._red = (l * 255)|0;
                this._green = (m * 255)|0;
                this._blue = (b * 255)|0;
                break;
            case 4:
                this._red = (n * 255)|0;
                this._green = (l * 255)|0;
                this._blue = (b * 255)|0;
                break;
            case 5:
                this._red = (b * 255)|0;
                this._green = (l * 255)|0;
                this._blue = (m * 255)|0;
                break;
        }

        this._callCallbacks("value-changed");
    }
});

module.exports = Color;
