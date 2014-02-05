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
 * Numeric field.
 *
 * @class NumericField
 * @constructor
 * @extends photonui.Field
 * @param {Number} params.min The minimum value of the field (optional, default=`null` (no minimum)).
 * @param {Number} params.max The maximum value of the field (optional, default=`null` (no maximum)).
 * @param {Number} params.step The incrementation step when user scroll over the field (optional, default=1).
 * @param {Number} params.decimalDigits The number of digit after the decimal dot (optional, `null` = no limit, default=0 (integer))
 * @param {String} params.decimalSymbol The decimal symbol: dot (`"."`) or comma (`","`) (optional, default=".")
 */
photonui.NumericField = function(params) {
    photonui.Field.call(this, params);

    var params = params || {};

    // Args
    this.min = (params.min !== undefined) ? params.min : null;
    this.max = (params.max !== undefined) ? params.max : null;
    this.step = params.step || 1;
    this.decimalDigits = (params.decimalDigits !== undefined) ? params.decimalDigits : 0;
    this.decimalSymbol = params.decimalSymbol || ".";  // "." or ","

    // Build
    this._buildHtml();
    this._updateAttributes();
    this._bindEvents();

    this._bindEvent("keypress", this._e.field, "keypress", this._onKeypress.bind(this));
    this._bindEvent("keyup", this._e.field, "keyup", this._onKeyup.bind(this));
    this._bindEvent("change", this._e.field, "change", this._onChange.bind(this));
    this._bindEvent("mousewheel", this._e.field, "mousewheel", this._onMouseWheel.bind(this));
    this._bindEvent("mousewheel-firefox", this._e.field, "DOMMouseScroll", this._onMouseWheel.bind(this));
}

photonui.NumericField.prototype = new photonui.Field();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the minimum value of the field.
 *
 * @method getMin
 * @return {Number} The minumum value or `null` (no minimum).
 */
photonui.NumericField.prototype.getMin = function() {
    return this.min;
}

/**
 * Set the minimum value of the field.
 *
 * @method setMin
 * @param {Number} min The minumum value or `null` (no minimum).
 */
photonui.NumericField.prototype.setMin = function(min) {
    this.min = min;
}

/**
 * Get the maximum value of the field.
 *
 * @method getMax
 * @return {Number} The maximum value or `null` (no maximum).
 */
photonui.NumericField.prototype.getMax = function() {
    return this.max;
}

/**
 * Set the maximum value of the field.
 *
 * @method setMax
 * @param {Number} max The minumum value or `null` (no maximum).
 */
photonui.NumericField.prototype.setMax = function(max) {
    this.max = max;
}

/**
 * Get the incrementation step of the field.
 *
 * @method getStep
 * @return {Number} The step.
 */
photonui.NumericField.prototype.getStep = function() {
    return this.step;
}

/**
 * Set the incrementation step of the field.
 *
 * @method setStep
 * @param {Number} step The step.
 */
photonui.NumericField.prototype.setStep = function(step) {
    this.step = Math.abs(step);
}

/**
 * Get the number of digit after the decimal dot.
 *
 * @method getDecimalDigits
 * @return {Number} The number of digit after the decimal dot or `null` (no limite).
 */
photonui.NumericField.prototype.getDecimalDigits = function() {
    return this.decimalDigits;
}

/**
 * Set the number of digit after the decimal dot.
 *
 * @method setDecimalDigits
 * @param {Number} decimalDigits The number of digit after the decimal dot or `null` (no limit).
 */
photonui.NumericField.prototype.setDecimalDigits = function(decimalDigits) {
    this.decimalDigits = decimalDigits;
}

/**
 * Get the decimal symbol.
 *
 * @method getDecimalSymbol
 * @return {String} The decimal symbol: dot (`"."`) or comma (`","`).
 */
photonui.NumericField.prototype.getDecimalSymbol = function() {
    return this.DecimalSymbol;
}

/**
 * Set the decimal symbol.
 *
 * @method setDecimalSymbol
 * @param {String} decimalSymbol The decimal symbol: dot (`"."`) or comma (`","`).
 */
photonui.NumericField.prototype.setDecimalSymbol = function(decimalSymbol) {
    this.decimalSymbol = decimalSymbol;
}

/**
 * Get the field value.
 *
 * @method getValue
 * @return {String} The value
 */
photonui.NumericField.prototype.getValue = function() {
    return parseFloat(this.value);
}

/**
 * Set the field value.
 *
 * @method setValue
 * @param {String} value The value
 */
photonui.NumericField.prototype.setValue = function(value) {
    this._updateValue(value);
    this._updateFieldValue();
    this._callCallbacks("value-changed", [this.getValue()]);
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the text field.
 *
 * @method _buildHtml
 * @private
 */
photonui.NumericField.prototype._buildHtml = function() {
    this._e.field = document.createElement("input");
    this._e.field.className = "photonui-widget photonui-field photonui-field-numeric";
    this._e.field.type = "text";
    this._e.field.name = this.name;
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.NumericField.prototype._updateAttributes = function() {
    photonui.Field.prototype._updateAttributes.call(this);
}

/**
 * Update the value (in the widget).
 *
 * @method _updateValue
 * @private
 * @param {String|Number} value The raw value.
 */
photonui.NumericField.prototype._updateValue = function(value) {
    value = ("" + value).replace(",", "."); // ","
    value = value.replace(/ /g, "");  // remove spaces
    value = parseFloat(value);
    if (isNaN(value)) {
        value = 0;
    }

    if (this.min != null) {
        value = Math.max(this.min, value);
    }

    if (this.max != null) {
        value = Math.min(this.max, value);
    }

    if (this.decimalDigits != null) {
        value = value.toFixed(this.decimalDigits);
    }

    this.value = value;
}

/**
 * Update the value in the html field.
 *
 * @method _updateFieldValue
 * @private
 */
photonui.NumericField.prototype._updateFieldValue = function() {
    this._e.field.value = ("" + this.value).replace(".", this.decimalSymbol);
}


//////////////////////////////////////////
// Internal Events Callbacks            //
//////////////////////////////////////////


photonui.NumericField.prototype._onKeypress = function(event) {
    if (event.ctrlKey) {
        return;
    }
    if (event.charCode == 45) {  // Minus
        if (this._e.field.selectionStart > 0 || (this.min != null && this.min >= 0)) {
            event.preventDefault();
        }
        else if (this.getValue() < 0 && this._e.field.selectionStart - this._e.field.selectionEnd == 0) {
            event.preventDefault();
        }
    }
    else if ((event.charCode == 46 || event.charCode == 44) && (this.decimalDigits > 0 || this.decimalDigits == null)) {  // Dot & Comma
        var value = this._e.field.value;
        if (value.indexOf(".") >= 0 || value.indexOf(",") >= 0) {
            if (this._e.field.selectionStart == this._e.field.selectionEnd) {
                event.preventDefault();
            }
            else {
                var selected = value.substring(this._e.field.selectionStart, this._e.field.selectionEnd);
                if (selected.indexOf(".") < 0 && selected.indexOf(",") < 0) {
                    event.preventDefault();
                }
            }
        }
    }
    else if (event.keyCode == 13) {  // Enter
        this._updateFieldValue();
    }
    else if ((event.charCode < 48 || event.charCode > 57) && event.charCode != 32 && event.charCode != 0) {  // Not (digit, space or special key)
        event.preventDefault();
    }
}

photonui.NumericField.prototype._onKeyup = function(event) {
    var value = this._e.field.value.replace(/[^0-9.,-]*/g, "");
    if (value != this._e.field.value) {
        this._e.field.value = value;
    }
    this._updateValue(this._e.field.value);
}

photonui.NumericField.prototype._onChange = function(event) {
    this._updateFieldValue();
}

photonui.NumericField.prototype._onMouseWheel = function(event) {
    if (document.activeElement != this._e.field) {
        return;
    }

    var wheelDelta = null;

    // Webkit
    if (event.wheelDeltaY != undefined) {
        wheelDelta = event.wheelDeltaY;
    }
    // MSIE
    if (event.wheelDelta != undefined) {
        wheelDelta = event.wheelDelta;
    }
    // Firefox
    if (event.axis != undefined && event.detail != undefined) {
        if (event.axis == 2) { // Y
            wheelDelta = - event.detail;
        }
    }

    if (wheelDelta != null) {
        if (wheelDelta >= 0) {
            this.setValue(this.getValue() + this.step);
        }
        else {
            this.setValue(this.getValue() - this.step);
        }
        event.preventDefault();
    }
}
