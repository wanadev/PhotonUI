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
 * @submodule Composite
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * Color Picker Dialog.
 *
 * wEvents:
 *
 *   * value-changed:
 *      - description: the selected color changed.
 *      - callback:    function(widget, color)
 *
 * @class ColorPickerDialog
 * @constructor
 * @extends photonui.Dialog
 */
photonui.ColorPickerDialog = photonui.Dialog.$extend({

    // Constructor
    __init__: function(params) {
        this.__widgets = {};
        this._color = new photonui.Color();

        var params = params || {};
        if (params.title == undefined) params.title = _("Select a color...");

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
            if (this._color) {
                this._color.removeCallback("photonui.colorpickerdialog.value-changed::" + this.name);
            }
            this._color = color;
            this._color.registerCallback("photonui.colorpickerdialog.value-changed::" + this.name, "value-changed", this.__onColorChanged, this);
        }
        this.__onColorChanged();
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======


    destroy: function() {
        this._color.removeCallback("photonui.colorpickerdialog.value-changed::" + this.name);
        this.$super();
    },


    // ====== Private methods ======


    /**
     * Make the UI.
     *
     * @method _buildUi
     * @private
     */
    _buildUi: function() {

        // == Main UI ==
        this.__widgets.hbox = new photonui.BoxLayout({orientation: "horizontal"});
        this.child = this.__widgets.hbox;

        // Color Picker
        this.__widgets.colorPicker = new photonui.ColorPicker();
        this.__widgets.hbox.addChild(this.__widgets.colorPicker);

        // Color Palette
        this.__widgets.colorPalette = new photonui.ColorPalette();
        this.__widgets.hbox.addChild(this.__widgets.colorPalette);

        // Separator
        this.__widgets.separator = new photonui.Separator({orientation: "vertical"});
        this.__widgets.hbox.addChild(this.__widgets.separator);

        this.__widgets.grid = new photonui.GridLayout();
        this.__widgets.hbox.addChild(this.__widgets.grid);

        // Red field + label
        this.__widgets.fieldRed = new photonui.Slider({
            min: 0,
            max: 255,
            decimalDigit: 0
        });

        this.__widgets.labelRed = new photonui.Label({
            text: _("Red:"),
            forInput: this.__widgets.fieldRed
        });

        this.__widgets.grid.addChild(this.__widgets.labelRed, {gridX: 0, gridY: 0, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldRed, {gridX: 1, gridY: 0, verticalExpansion: false});

        // Green field + label
        this.__widgets.fieldGreen = new photonui.Slider({
            min: 0,
            max: 255,
            decimalDigit: 0
        });

        this.__widgets.labelGreen = new photonui.Label({
            text: _("Green:"),
            forInput: this.__widgets.fieldGreen
        });

        this.__widgets.grid.addChild(this.__widgets.labelGreen, {gridX: 0, gridY: 1, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldGreen, {gridX: 1, gridY: 1, verticalExpansion: false});

        // Blue field + label
        this.__widgets.fieldBlue = new photonui.Slider({
            min: 0,
            max: 255,
            decimalDigit: 0
        });

        this.__widgets.labelBlue = new photonui.Label({
            text: _("Blue:"),
            forInput: this.__widgets.fieldBlue
        });

        this.__widgets.grid.addChild(this.__widgets.labelBlue, {gridX: 0, gridY: 2, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldBlue, {gridX: 1, gridY: 2, verticalExpansion: false});

        // Separator
        this.__widgets.separator2 = new photonui.Separator();
        this.__widgets.grid.addChild(this.__widgets.separator2, {gridX: 0, gridY: 3, verticalExpansion: false, gridWidth: 2});

        // Hue field + label
        this.__widgets.fieldHue = new photonui.Slider({
            min: 0,
            max: 360,
            decimalDigit: 0
        });

        this.__widgets.labelHue = new photonui.Label({
            text: _("Hue:"),
            forInput: this.__widgets.fieldHue
        });

        this.__widgets.grid.addChild(this.__widgets.labelHue, {gridX: 0, gridY: 4, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldHue, {gridX: 1, gridY: 4, verticalExpansion: false});

        // Saturation field + label
        this.__widgets.fieldSaturation = new photonui.Slider({
            min: 0,
            max: 100,
            decimalDigit: 0
        });

        this.__widgets.labelSaturation = new photonui.Label({
            text: _("Saturation:"),
            forInput: this.__widgets.fieldSaturation
        });

        this.__widgets.grid.addChild(this.__widgets.labelSaturation, {gridX: 0, gridY: 5, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldSaturation, {gridX: 1, gridY: 5, verticalExpansion: false});

        // Brightness field + label
        this.__widgets.fieldBrightness = new photonui.Slider({
            min: 0,
            max: 100,
            decimalDigit: 0
        });

        this.__widgets.labelBrightness = new photonui.Label({
            text: _("Brightness:"),
            forInput: this.__widgets.fieldBrightness
        });

        this.__widgets.grid.addChild(this.__widgets.labelBrightness, {gridX: 0, gridY: 6, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldBrightness, {gridX: 1, gridY: 6, verticalExpansion: false});

        // == Dialog Buttons ==
        this.__widgets.buttonOk = new photonui.Button({text: _("Ok")});
        if (photonui.FAIcon) this.__widgets.buttonOk.leftIcon = new photonui.FAIcon("fa-check");

        this.__widgets.buttonCancel = new photonui.Button({text: _("Cancel")});
        this.buttons = [this.__widgets.buttonOk, this.__widgets.buttonCancel];

        if (photonui.FAIcon) this.__widgets.buttonCancel.leftIcon = new photonui.FAIcon("fa-times");

        // == Bindings ==
        this.__widgets.colorPalette.color = this.__widgets.colorPicker.color;

        this.__widgets.colorPicker.color.registerCallback("colorpickerdialog.colorPicker.value-changed", "value-changed", function(color) {
            this.__widgets.fieldRed.value = color.red;
            this.__widgets.fieldGreen.value = color.green;
            this.__widgets.fieldBlue.value = color.blue;
            this.__widgets.fieldHue.value = color.hue;
            this.__widgets.fieldSaturation.value = color.saturation;
            this.__widgets.fieldBrightness.value = color.brightness;
        }, this);

        this.__widgets.fieldRed.registerCallback("colorpickerdialog.fieldRed.value-changed", "value-changed", function(widget, value) {
            this.__widgets.colorPicker.color.red = value;
        }, this);

        this.__widgets.fieldGreen.registerCallback("colorpickerdialog.fieldGreen.value-changed", "value-changed", function(widget, value) {
            this.__widgets.colorPicker.color.green = value;
        }, this);

        this.__widgets.fieldBlue.registerCallback("colorpickerdialog.fieldBlue.value-changed", "value-changed", function(widget, value) {
            this.__widgets.colorPicker.color.blue = value;
        }, this);

        this.__widgets.fieldHue.registerCallback("colorpickerdialog.fieldHue.value-changed", "value-changed", function(widget, value) {
            this.__widgets.colorPicker.color.hue = value;
        }, this);

        this.__widgets.fieldSaturation.registerCallback("colorpickerdialog.fieldSaturation.value-changed", "value-changed", function(widget, value) {
            this.__widgets.colorPicker.color.saturation = value;
        }, this);

        this.__widgets.fieldBrightness.registerCallback("colorpickerdialog.fieldBrightness.value-changed", "value-changed", function(widget, value) {
            this.__widgets.colorPicker.color.brightness = value;
        }, this);

        this.__widgets.buttonOk.registerCallback("colorpickerdialog.buttonOk.click", "click", this.__onValidate, this);
        this.__widgets.buttonCancel.registerCallback("colorpickerdialog.buttonCancel.click", "click", this.__onCancel, this);
        this.registerCallback("colorpickerdialog.close", "close-button-clicked", this.__onCancel, this);
    },



    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    /**
     * @method __onCancel
     * @private
     */
    __onCancel: function() {
        this.__widgets.colorPicker.color.setHSB(
                this._color.hue,
                this._color.saturation,
                this._color.brightness
        );
        this.hide();
    },

    /**
     * @method __onValidate
     * @private
     */
    __onValidate: function() {
        this._color.setHSB(
                this.__widgets.colorPicker.color.hue,
                this.__widgets.colorPicker.color.saturation,
                this.__widgets.colorPicker.color.brightness
        );
        this.hide();
        this._callCallbacks("value-changed", [this.color]);
    },

    /**
     * @method __onColorChanged
     * @private
     */
    __onColorChanged: function() {
        this.__widgets.colorPicker.color.setHSB(
                this._color.hue,
                this._color.saturation,
                this._color.brightness
        );
    }
});
