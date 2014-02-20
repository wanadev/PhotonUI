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


var photonui = photonui || {};


// The default palette
photonui.palette = [
    ["#000000", "#400000", "#404000", "#004000", "#004040", "#000040", "#400040"],
    ["#303030", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080"],
    ["#606060", "#C00000", "#C0C000", "#00C000", "#00C0C0", "#0000C0", "#C000C0"],
    ["#909090", "#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"],
    ["#C0C0C0", "#FF8080", "#FFFF80", "#80FF80", "#80FFFF", "#8080FF", "#FF80FF"],
    ["#FFFFFF", "#FFC0C0", "#FFFFC0", "#C0FFC0", "#C0FFFF", "#C0C0FF", "#FFC0FF"]
];


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
photonui.ColorPalette = photonui.Widget.$extend({

    // Constructor
    __init__: function(params) {
        this.$super(params);
        this._registerWEvents(["value-changed"]);
        this._updateProperties(["palette", "value"]);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The value (color).
     *
     * @property value
     * @type String
     * @default: "#FF0000"
     */
    _value: "#FF0000",

    getValue: function() {
        return this._value;
    },

    setValue: function(value) {
        this._value = value;
    },

    /**
     * The color palette.
     *
     * @property palette
     * @type Array
     * @default null (= `photonui.palette`)
     */
    _palette: null,

    getPalette: function() {
        return this._palette || photonui.palette;
    },

    setPalette: function(palette) {
        this._palette = palette;

        if (!palette) {
            var palette = photonui.palette;
        }

        // Update
        this.__html.palette.removeChild(this.__html.tbody);
        photonui.Helpers.cleanNode(this.__html.tbody);

        var e_tr, e_td, x, y;
        for (y=0 ; y<palette.length ; y++) {
            var e_tr = document.createElement("tr");
            for (x=0 ; x<palette[y].length ; x++) {
                var e_td = document.createElement("td");
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
    getHtml: function() {
        return this.__html.palette;
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.__html.palette = document.createElement("table");
        this.__html.palette.className = "photonui-widget photonui-colorpalette";
        this.__html.tbody = document.createElement("tbody");
        this.__html.palette.appendChild(this.__html.tbody)
    },


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    __onColorClicked: function(color, event) {
        this.value = color;
        this._callCallbacks("value-changed", [color]);
    }
});
