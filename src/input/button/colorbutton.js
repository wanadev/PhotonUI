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

var _ = require("../../../lib/stone.js").gettext;
var Button = require("./button.js");
var Color = require("../color/color.js");
var ColorPalette = require("../color/colorpalette.js");
var PopupWindow = require("../../container/window/popupwindow.js");
var BoxLayout = require("../../container/layout/boxlayout.js");
var ColorPickerDialog = require("../../composite/colorpickerdialog.js");

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
var ColorButton = Button.$extend({

    // Constructor
    __init__: function(params) {
        this.__widgets = {};
        this._color = new Color();
        this._registerWEvents(["value-changed"]);
        this.$super(params);
        this._buildUi();
        this._updateProperties(["color"]);
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
        if (color instanceof Color) {
            if (this._color) {
                this._color.removeCallback("photonui.colorbutton.value-changed::" + this.name);
            }
            this._color = color;
            this._color.registerCallback("photonui.colorbutton.value-changed::" + this.name, "value-changed", this.__onColorChanged, this);
        }
        this.__onColorChanged();
        if (color instanceof Color) {
            this._color = color;
        }
    },


    /**
     * Display only the color picker dialog instead of showing the palette first.
     *
     * @property dialogOnly
     * @type Boolean
     * @default false
     */
    _dialogOnly: false,

    isDialogOnly: function() {
        return this._dialogOnly;
    },

    setDialogOnly: function(dialogOnly) {
        this._dialogOnly = !!dialogOnly;
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======


    destroy: function() {
        this._color.removeCallback("photonui.colorbutton.value-changed::" + this.name);
        this.$super();
    },


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

    /**
     * Make the UI.
     *
     * @method _buildUi
     * @private
     */
     //TODO: Build UI
    _buildUi: function() {
        this.__widgets.popup = new PopupWindow();
        this.__widgets.vbox = new BoxLayout({verticalSpacing: 0, horizontalSpacing: 0});
        this.__widgets.popup.child = this.__widgets.vbox;

        this.__widgets.palette = new ColorPalette();
        this.__widgets.vbox.addChild(this.__widgets.palette);

        this.__widgets.custom = new Button({text: _("Custom color..."), appearance: "flat"});
        this.__widgets.custom.addClass("photonui-colorbutton-custombutton");
        this.__widgets.vbox.addChild(this.__widgets.custom);

        this.__widgets.colorPickerDialog = new ColorPickerDialog();

        // Callbacks
        this.__widgets.palette.registerCallback("value-changed", "value-changed", this.__onValueChanged, this);
        this.__widgets.colorPickerDialog.registerCallback("value-changed", "value-changed", this.__onValueChanged, this);
        this.__widgets.custom.registerCallback("click", "click", this.__onCustomButtonClicked, this);

        // Color
        this.__widgets.palette.color = this.color;
        this.__widgets.colorPickerDialog.color = this.color;
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
        if (this.dialogOnly) {
            this.__widgets.colorPickerDialog.show();
            this.__widgets.colorPickerDialog.center();
        }
        else {
            this.__widgets.popup.popupWidget(this);
        }
    },

    /**
     * Called when the palette color change.
     *
     * @method __onPaletteValueChanged
     * @private
     * @param {photonui.Widget} widget
     * @param {String} color
     */
    __onValueChanged: function(widget, color) {
        this._callCallbacks("value-changed", [this.color]);
    },

    /**
     *
     * @method __onColorChanged
     * @private
     */
    __onColorChanged: function() {
        this.__html.color.style.backgroundColor = this.color.hexString;
    },

    /**
     * @method __onCustomButtonClicked
     * @private
     */
    __onCustomButtonClicked: function() {
        this.__widgets.colorPickerDialog.show();
        this.__widgets.colorPickerDialog.center();
    }
});

module.exports = ColorButton;
