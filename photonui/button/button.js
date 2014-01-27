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
 * @submodule Widget
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * Button.
 *
 *  wEvents:
 *
 *    * destroy:
 *      - description: called when the button was clicked.
 *      - callback:    function(widget, event)
 *
 * @class Button
 * @constructor
 * @extends photonui.Widget
 * @param {String} params.text The text of the button (optional, default = "Button").
 */
photonui.Button = function(params) {
    photonui.Widget.call(this, params);

    var params = params || {};

    // Attrs
    this.text = params.text || "Button";  // FIXME i18n

    this._e = {};  // HTML Elements

    this._registerWidgetEvents(["click"]);

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
    this._bindEvent("click", this._e.button, "click", function(event) {
        this._callCallbacks("click", [event]);
    }.bind(this));
}

photonui.Button.prototype = new photonui.Widget();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get button text.
 *
 * @method getText
 * @return {string} The button text.
 */
photonui.Button.prototype.getText = function() {
    return this.text;
}

/**
 * Set button text.
 *
 * @method setText
 * @param {string} text The button text.
 */
photonui.Button.prototype.setText = function(text) {
    this.text = text;
    this._e.button.innerHTML = photonui.Helpers.escapeHtml(text);
}

/**
 * Get the HTML of the button.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.Button.prototype.getHtml = function() {
    return this._e.button;
}

/**
 * Get the container DOM Element.
 *
 * @method getContainer
 * @return {HTMLElement}
 */
photonui.Button.prototype.getContainer = function() {
    return null;  // Cannot have a child
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the button.
 *
 * @method _buildHtml
 * @private
 */
photonui.Button.prototype._buildHtml = function() {
    this._e.button = document.createElement("button");
    this._e.button.className = "photonui-widget photonui-button";
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.Button.prototype._updateAttributes = function() {
    photonui.Widget.prototype._updateAttributes.call(this);
    this.setText(this.text);
}
