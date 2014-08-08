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


/**
 * Color Button.
 *
 * wEvents:
 *
 *   * value-changed:
 *      - description: the selected color changed.
 *      - callback:    function(widget, color)
 *
 * @class ColorButton
 * @constructor
 * @extends photonui.Widget
 */
photonui.ColorButton = photonui.Button.$extend({

    // Constructor
    __init__: function(params) {
        this._color = new photonui.Color(photonui.palette[0][0]);
        this._registerWEvents(["value-changed"]);
        this.$super(params);
        this.popup = new photonui.PopupWindow();
        this.palette = new photonui.ColorPalette();
        this.palette.registerCallback("value-changed", "value-changed", this.__onPaletteValueChanged, this);
        this.popup.child = this.palette;
        this._updateProperties(["value"]);
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
    getValue: function() {
        return this.color.hexString;
    },

    setValue: function(value) {
        this.color.hexString = value;
        this.__html.color.style.backgroundColor = this.color.hexString;
    },

    /**
     * The color.
     *
     * @property color
     * @type kzd.Color
     */
    _color: null,

    getColor: function() {
        return this._color;
    },

    setColor: function(color) {
        if (color instanceof photonui.Color) {
            this._color = color;
        }
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Private methods ======

    /**
     * Update the button content
     *
     * @method _update
     * @private
     */
    _update: function() {
        // Do nothing
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.$super();
        this.__html.button = document.createElement("button");
        this.__html.button.className = "photonui-widget photonui-button";

        this.__html.button.className += " photonui-colorbutton";

        this.__html.color = document.createElement("span");
        this.__html.button.appendChild(this.__html.color);
    },


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    /**
     * Called when the button is clicked.
     *
     * @method __onButtonClicked
     * @private
     * @param event
     */
    __onButtonClicked: function(event) {
        this._callCallbacks("click", [event]);
        this.popup.popupWidget(this);
    },

    /**
     * Called when the palette color change.
     *
     * @method __onPaletteValueChanged
     * @private
     * @param {photonui.Widget} widget
     * @param {String} color
     */
    __onPaletteValueChanged: function(widget, color) {
        this.value = color;
        this._callCallbacks("value-changed", [color]);
    }
});
