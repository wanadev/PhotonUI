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
 * Checkbox.
 *
 * wEvents:
 *
 *   * value-changed:
 *     - description: called when the value was modified.
 *     - callback:    function(widget, value)
 *
 * @class Field
 * @constructor
 * @extends photonui.Widget
 * @param {Boolean} params.value The field value (optional, dafault=`false`).
 */
photonui.CheckBox = function(params) {
    photonui.Widget.call(this, params);

    var params = params || {};

    // Attrs
    this.inputId = this.name + "-input";
    this.value = (params.value != undefined) ? params.value : "";

    this._e = {};  // HTML Elements

    this._registerWidgetEvents(["value-changed"]);
    this._buildHtml();
    this._bindEvents();
}

photonui.CheckBox.prototype = new photonui.Widget();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the field value.
 *
 * @method getValue
 * @return {String} The value
 */
photonui.CheckBox.prototype.getValue = function() {
    return this._e.checkbox.checked;
}

/**
 * Set the field value.
 *
 * @method setValue
 * @param {String} value The value
 */
photonui.CheckBox.prototype.setValue = function(value) {
    this.value = value;
    this._e.checkbox.checked = value;
    this._callCallbacks("value-changed", [this.getValue()]);
}

/**
 * Get the HTML of the button.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.CheckBox.prototype.getHtml = function() {
    return this._e.outer;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the check.
 *
 * @method _buildHtml
 * @private
 */
photonui.CheckBox.prototype._buildHtml = function() {
    this._e.outer = document.createElement("div");
    this._e.outer.className = "photonui-widget photonui-checkbox";

    this._e.checkbox = document.createElement("input");
    this._e.checkbox.type = "checkbox";
    this._e.checkbox.name = this.name;
    this._e.checkbox.id = this.inputId;
    this._e.outer.appendChild(this._e.checkbox);

    this._e.span = document.createElement("span");
    this._e.span.tabIndex = "0";
    this._e.outer.appendChild(this._e.span);
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.CheckBox.prototype._updateAttributes = function() {
    photonui.Widget.prototype._updateAttributes.call(this);
    this.setValue(this.value);
}

/**
 * Bind events.
 *
 * @method _bindEvents
 * @private
 */
photonui.CheckBox.prototype._bindEvents = function() {
    this._bindEvent("value-changed", this._e.checkbox, "change", function(event) {
        this.setValue(this.getValue());
        // Focus the span ff the real checkbox is hidden (happen when a label is clicked).
        if (window.getComputedStyle(this._e.checkbox).display == "none") {
            this._e.span.focus();
        }
    }.bind(this));

    this._bindEvent("span-click", this._e.span, "click", function(event) {
        this.setValue(!this.getValue());
    }.bind(this));

    this._bindEvent("span-kbd", this._e.span, "keypress", function(event) {
        if (event.charCode == 32 || event.keyCode == 13) {
            this.setValue(!this.getValue());
        }
    }.bind(this));
}
