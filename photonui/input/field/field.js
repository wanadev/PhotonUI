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
 * Base class for fields.
 *
 * wEvents:
 *
 *   * value-changed:
 *     - description: called when the value was modified.
 *     - callback:    function(widget, value)
 *
 *   * keydown:
 *     - description: called when a key is pressed.
 *     - callback:    function(widget, event)
 *
 *   * keyup:
 *     - description: called when a key is released.
 *     - callback:    function(widget, event)
 *
 *   * keypress:
 *     - description: called just before the insertion of a char.
 *     - callback:    function(widget, event)
 *
 *   * selection-changed:
 *     - description: called when the selection was changed.
 *     - callback:    function(widget, selectionStart, selectionEnd, selectedText, event)
 *
 * @class Field
 * @constructor
 * @extends photonui.Widget
 */
photonui.Field = function(params) {
    photonui.Widget.call(this, params);

    var params = params || {};

    // Attrs
    this.value = (params.value != undefined) ? params.value : "";
    this.placeholder = (params.placeholder != undefined) ? params.placeholder : "";

    this._e = {};  // HTML Elements

    this._registerWidgetEvents(["value-changed", "keydown", "keyup", "keypress", "selection-changed"]);
}

photonui.Field.prototype = new photonui.Widget();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the field value.
 *
 * @method getValue
 * @return {String} The value
 */
photonui.Field.prototype.getValue = function() {
    return this._e.field.value;
}

/**
 * Set the field value.
 *
 * @method setValue
 * @param {String} value The value
 */
photonui.Field.prototype.setValue = function(value) {
    this.value = value;
    this._e.field.value = value;
    this._callCallbacks("value-changed", [this.getValue()]);
}

/**
 * Get the field placeholder.
 *
 * @method getPlaceholder
 * @return {String} The placeholder
 */
photonui.Field.prototype.getPlaceholder = function() {
    return this._e.field.placeholder;
}

/**
 * Set the field value.
 *
 * @method setPlaceholder
 * @param {String} placeholder The placeholder
 */
photonui.Field.prototype.setPlaceholder = function(placeholder) {
    this.placeholder = placeholder;
    this._e.field.placeholder = placeholder;
}

/**
 * Get the HTML of the button.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.Field.prototype.getHtml = function() {
    return this._e.field;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.Field.prototype._updateAttributes = function() {
    photonui.Widget.prototype._updateAttributes.call(this);
    this.setValue(this.value);
    this.setPlaceholder(this.placeholder);
}

/**
 * Bind events.
 *
 * @method _bindEvents
 * @private
 */
photonui.Field.prototype._bindEvents = function() {
    this._bindEvent("value-changed", this._e.field, "change", function(event) {
        this._callCallbacks("value-changed", [this.getValue()]);
    }.bind(this));

    this._bindEvent("keydown", this._e.field, "keydown", function(event) {
        this._callCallbacks("keydown", [event]);
    }.bind(this));

    this._bindEvent("keyup", this._e.field, "keyup", function(event) {
        this._callCallbacks("keyup", [event]);
    }.bind(this));

    this._bindEvent("keypress", this._e.field, "keypress", function(event) {
        this._callCallbacks("keypress", [event]);
    }.bind(this));

    this._bindEvent("selection-changed", this._e.field, "select", function(event) {
        this._callCallbacks("selection-changed", [
            this._e.field.selectionStart,
            this._e.field.selectionEnd,
            this.getValue().substring(this._e.field.selectionStart, this._e.field.selectionEnd),
            event]);
    }.bind(this));
}
