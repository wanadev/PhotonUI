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
 * @submodule Interactive
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var Color = require("../nonvisual/color.js");

/**
 * A Color Palette.
 *
 * wEvents:
 *
 *   * value-changed:
 *      - description: the selected color changed.
 *      - callback:    function(widget, color)
 *
 * @class ColorPalette
 * @constructor
 * @extends photonui.Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var ColorPalette = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this._color = new Color(ColorPalette.palette[0][0]);
        this._registerWEvents(["value-changed"]);
        this.$super(params);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The value (color in rgb hexadecimal format (e.g. "#ff0000")).
     *
     * @property value
     * @type String
     */
    getValue: function () {
        "@photonui-update";
        return this.color.rgbHexString;
    },

    setValue: function (value) {
        this.color.fromString(value);
    },

    /**
     * The color.
     *
     * @property color
     * @type photonui.Color
     */
    _color: null,

    getColor: function () {
        return this._color;
    },

    setColor: function (color) {
        if (color instanceof Color) {
            this._color = color;
        }
    },

    /**
     * The color palette.
     *
     * @property palette
     * @type Array
     * @default null (= `Color.palette`)
     */
    _palette: null,

    getPalette: function () {
        "@photonui-update";
        return this._palette || ColorPalette.palette;
    },

    setPalette: function (palette) {
        this._palette = palette;

        if (!palette) {
            palette = ColorPalette.palette;
        }

        // Update
        this.__html.palette.removeChild(this.__html.tbody);
        Helpers.cleanNode(this.__html.tbody);

        var e_tr;
        var e_td;
        var x;
        var y;
        for (y = 0 ; y < palette.length ; y++) {
            e_tr = document.createElement("tr");
            for (x = 0 ; x < palette[y].length ; x++) {
                e_td = document.createElement("td");
                e_td.style.backgroundColor = palette[y][x];
                e_td.onclick = this.__onColorClicked.bind(this, palette[y][x]);
                e_tr.appendChild(e_td);
            }
            this.__html.tbody.appendChild(e_tr);
        }

        this.__html.palette.appendChild(this.__html.tbody);
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.palette;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.palette = document.createElement("table");
        this.__html.palette.className = "photonui-widget photonui-colorpalette";
        this.__html.tbody = document.createElement("tbody");
        this.__html.palette.appendChild(this.__html.tbody);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    __onColorClicked: function (color, event) {
        if(!this.enabled) {
            return;
        }
        this.value = color;
        this._callCallbacks("value-changed", [this.color]);
    }
});

// The default palette

ColorPalette.palette = [
    ["#000000", "#424242", "#676767", "#989898", "#C5C5C5", "#FFFFFF"],
    ["#E52131", "#ED7130", "#F0902C", "#F0B922", "#EDE118", "#7DA638"],
    ["#EA4852", "#F08D52", "#F3A752", "#F9D246", "#F0EC51", "#A7CF41"],
    ["#F19096", "#F5BC93", "#F9CB94", "#F9E48A", "#F2F08E", "#C6DE84"],
    ["#F8D1D6", "#F9E2D2", "#F9E8D3", "#FDF8D2", "#F9F9CF", "#E7F1CD"],
    ["#1E9E85", "#2A7DB5", "#2751A1", "#6C3E98", "#A33E97", "#DF3795"],
    ["#2FB8A3", "#40A1D7", "#4072B5", "#8963AB", "#B462A7", "#E262A5"],
    ["#88CEC3", "#8CC9E9", "#87A8D3", "#D2A0C9", "#D2A0C9", "#EDA0C6"],
    ["#CEEAE7", "#CDE9F8", "#CFDEEF", "#EED9E9", "#EED9E9", "#F8D7E7"]
];

module.exports = ColorPalette;
