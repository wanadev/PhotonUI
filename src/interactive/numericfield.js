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

var Field = require("./field.js");

/**
 * Numeric field.
 *
 * @class NumericField
 * @constructor
 * @extends photonui.Field
 */
var NumericField = Field.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties(["value"]);
        this._bindFieldEvents();
        this._unbindEvent("value-changed");
        this._bindEvent("keypress", this.__html.field, "keypress", this.__onKeypress.bind(this));
        this._bindEvent("keyup", this.__html.field, "keyup", this.__onKeyup.bind(this));
        this._bindEvent("keydown", this.__html.field, "keydown", this.__onKeydown.bind(this));
        this._bindEvent("change", this.__html.field, "change", this.__onChange.bind(this));
        this._bindEvent("mousewheel", this.__html.field, "mousewheel", this.__onMouseWheel.bind(this));
        this._bindEvent("mousewheel-firefox", this.__html.field, "DOMMouseScroll", this.__onMouseWheel.bind(this));
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The minimum value of the field.
     *
     * @property min
     * @type Number
     * default null (no minimum);
     */
    _min: null,

    getMin: function () {
        return this._min;
    },

    setMin: function (min) {
        this._min = min;
    },

    /**
     * The maximum value of the field.
     *
     * @property max
     * @type Number
     * default null (no maximum);
     */
    _max: null,

    getMax: function () {
        return this._max;
    },

    setMax: function (max) {
        this._max = max;
    },

    /**
     * The incrementation step of the field.
     *
     * @property step
     * @type Number
     * default 1
     */
    _step: 1,

    getStep: function () {
        return this._step;
    },

    setStep: function (step) {
        this._step = Math.abs(step);
    },

    /**
     * The number of digit after the decimal dot.
     *
     * @property decimalDigits
     * @type Number
     * @default null (no limite)
     */
    _decimalDigits: null,

    getDecimalDigits: function () {
        return this._decimalDigits;
    },

    setDecimalDigits: function (decimalDigits) {
        this._decimalDigits = decimalDigits;
    },

    /**
     * The decimal symbol ("." or ",").
     *
     * @property decimalSymbol
     * @type String
     * @default: "."
     */
    _decimalSymbol: ".",

    getDecimalSymbol: function () {
        return this._decimalSymbol;
    },

    setDecimalSymbol: function (decimalSymbol) {
        this._decimalSymbol = decimalSymbol;
    },

    /**
     * The field value.
     *
     * @property value
     * @type Number
     * @default 0
     */
    _value: 0,

    getValue: function () {
        return parseFloat(this._value);
    },

    setValue: function (value) {
        this._updateValue(value);
        this._updateFieldValue();
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Update the value (in the widget).
     *
     * @method _updateValue
     * @private
     * @param {String|Number} value The raw value.
     */
    _updateValue: function (value) {
        value = ("" + value).replace(",", "."); // ","
        value = value.replace(/ /g, "");  // remove spaces
        value = parseFloat(value);
        if (isNaN(value)) {
            value = 0;
        }

        if (this.min !== null) {
            value = Math.max(this.min, value);
        }

        if (this.max !== null) {
            value = Math.min(this.max, value);
        }

        if (this.decimalDigits !== null) {
            value = value.toFixed(this.decimalDigits);
        }

        this._value = value;
    },

    /**
     * Update the value in the html field.
     *
     * @method _updateFieldValue
     * @private
     */
    _updateFieldValue: function () {
        this.__html.field.value = ("" + this._value).replace(".", this.decimalSymbol);
    },

    /**
     * Validate the user inputs.
     *
     * @method _validateInput
     * @private
     * @param {String} value
     * @return {Boolean}
     */
    _validateInput: function (value) {
        value = "" + value;
        value = value.replace(/ /g, "");  // remove spaces
        if (/^-?[0-9]*(\.|,)?[0-9]*$/.test(value)) {
            if (this.decimalDigits === 0 && !/^-?[0-9]*$/.test(value)) {
                return false;
            }
            if (this.min !== null && this.min >= 0 && value[0] == "-") {
                return false;
            }
            return true;
        }
        return false;
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.field = document.createElement("input");
        this.__html.field.className = "photonui-widget photonui-field photonui-field-numeric";
        this.__html.field.type = "text";
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onKeypress
     * @private
     * @param event
     */
    __onKeypress: function (event) {
        if (event.ctrlKey || event.key == "ArrowLeft" || event.key == "ArrowRight" || event.key == "Backspace" || event.key == "Delete") {
            return;
        } else if (event.keyCode == 13) {  // Enter
            this._updateFieldValue();
            this._callCallbacks("value-changed", [this.value]);
        } else {
            var field = this.__html.field;
            var value = field.value.slice(0, field.selectionStart) +
                        String.fromCharCode(event.charCode) +
                        field.value.slice(field.selectionEnd);
            if (!this._validateInput(value)) {
                event.preventDefault();
            }
        }
    },

    /**
     * @method __onKeyup
     * @private
     * @param event
     */
    __onKeyup: function (event) {
        var value = this.__html.field.value.replace(/[^0-9.,-]*/g, "");
        if (value != this.__html.field.value) {
            this.__html.field.value = value;
        }
        this._updateValue(this.__html.field.value);
    },

    /**
     * @method __onChange
     * @private
     * @param event
     */
    __onChange: function (event) {
        this._updateFieldValue();
        this._callCallbacks("value-changed", [this.value]);
    },

    /**
     * @method __onMouseWheel
     * @private
     * @param event
     */
    __onMouseWheel: function (event) {
        if (document.activeElement != this.__html.field) {
            return;
        }

        var wheelDelta = null;

        // Webkit
        if (event.wheelDeltaY !== undefined) {
            wheelDelta = event.wheelDeltaY;
        }
        // MSIE
        if (event.wheelDelta !== undefined) {
            wheelDelta = event.wheelDelta;
        }
        // Firefox
        if (event.axis !== undefined && event.detail !== undefined) {
            if (event.axis == 2) { // Y
                wheelDelta = -event.detail;
            }
        }

        if (wheelDelta !== null) {
            if (wheelDelta >= 0) {
                this.value += this.step;
            } else {
                this.value -= this.step;
            }
            event.preventDefault();
        }
        this._callCallbacks("value-changed", [this.value]);
    },

    /**
     * @method __onKeydown
     * @private
     * @param event
     */
    __onKeydown: function (event) {
        if (event.keyCode == 38) {
            this.setValue(this.getValue() + this.step);
            event.preventDefault();
            this._callCallbacks("value-changed", [this.value]);
        } else if (event.keyCode == 40) {
            this.setValue(this.getValue() - this.step);
            event.preventDefault();
            this._callCallbacks("value-changed", [this.value]);
        }
    }
});

module.exports = NumericField;
