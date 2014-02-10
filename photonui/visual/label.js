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
 * @submodule Visual
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * Label.
 *
 * @class Label
 * @constructor
 * @extends photonui.Widget
 * @param {String} params.text The text of the label (optional, default = "Label").
 * @param {String} params.textAlign The text alignement (optional, default = "left").
 * @param {photonui.Widget|String} params.forInput The "for" attribute of the label (optional).
 */
photonui.Label = function(params) {
    photonui.Widget.call(this, params);

    var params = params || {};
    params.__layout__ = params.__layout__ || {};

    // Attrs
    this.text = (params.text != undefined) ? params.text : "Label";  // FIXME i18n
    this.forInput = (params.forInput != undefined) ? params.forInput : null;
    this.textAlign = params.textAlign || "left";
    this.layoutOptions.verticalExpansion = (params.__layout__.verticalExpansion != undefined) ? params.__layout__.verticalExpansion : false;

    this._e = {};  // HTML Elements

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
}

photonui.Label.prototype = new photonui.Widget();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get label text.
 *
 * @method getText
 * @return {String} The button text.
 */
photonui.Label.prototype.getText = function() {
    return this.text;
}

/**
 * Set label text.
 *
 * @method setText
 * @param {String} text The button text.
 */
photonui.Label.prototype.setText = function(text) {
    this.text = text;
    this._e.label.innerHTML = photonui.Helpers.escapeHtml(text);
}

/**
 * Get the text alignement.
 *
 * @method getTextAlign
 * @return {String} The alignement
 */
photonui.Label.prototype.getTextAlign = function() {
    return this.textAlign;
}

/**
 * Set the text alignement.
 *
 * @method setTextAlign
 * @param {String} textAlign the text alignement (`left`, `center`, `right`).
 */
photonui.Label.prototype.setTextAlign = function(textAlign) {
    if (textAlign != "left" && textAlign != "center" && textAlign != "right") {
        throw "Text alignement sould be 'left', 'center' or 'right'.";
    }
    this.textAlign = textAlign;
    this._e.label.style.textAlign = textAlign;
}

/**
 * Get the "for" attribute of the label.
 *
 * @method getFor
 * @return {String} The input id.
 */
photonui.Label.prototype.getFor = function() {
    return this.forInput;
}

/**
 * Set the "for" attribute of the label (link the label with an input).
 *
 * @method setFor
 * @param {phoronui.Widget|String} forInput The widget itself or its name.
 */
photonui.Label.prototype.setFor = function(forInput) {
    if (forInput instanceof photonui.Widget) {
        this.forInput = forInput.name;
    }
    else {
        this.forInput = forInput;
    }
    if (this.forInput) {
        this._e.label.setAttribute("for", photonui.Helpers.escapeHtml(this.forInput));
    }
}

/**
 * Get the HTML of the label.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.Label.prototype.getHtml = function() {
    return this._e.label;
}

//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the label.
 *
 * @method _buildHtml
 * @private
 */
photonui.Label.prototype._buildHtml = function() {
    this._e.label = document.createElement("label");
    this._e.label.className = "photonui-widget photonui-label";
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.Label.prototype._updateAttributes = function() {
    photonui.Widget.prototype._updateAttributes.call(this);
    this.setText(this.text);
    this.setFor(this.forInput);
    this.setTextAlign(this.textAlign);
}
