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
 * Separator.
 *
 * @class Separator
 * @constructor
 * @extends photonui.Widget
 * @param {String} params.orientation The orientation of the separator: `"vertical"` or `"horizontal"` (optional, default = "horizontal").
 */
photonui.Separator = function(params) {
    photonui.Widget.call(this, params);

    var params = params || {};
    params.__layout__ = params.__layout__ || {};

    // Attrs
    this.orientation = params.orientation || "horizontal";

    this.layoutOptions.verticalExpansion = (params.__layout__.verticalExpansion != undefined) ? params.__layout__.verticalExpansion : this.orientation == "vertical";

    this._e = {};  // HTML Elements

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
}

photonui.Separator.prototype = new photonui.Widget();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the orientation of the separator.
 *
 * @method getOrientation
 * @return {String} The separator orientation: `"vertical"` or `"horizontal"`.
 */
photonui.Separator.prototype.getOrientation = function() {
    return this.orientation;
}

/**
 * Set the orientation of the separator.
 *
 * @method setOrientation
 * @param {String} orientation The separator orientation: `"vertical"` or `"horizontal"`.
 */
photonui.Separator.prototype.setOrientation = function(orientation) {
    if (orientation != "vertical" && orientation != "horizontal") {
        throw "Error: The orientation should be \"vertical\" or \"horizontal\".";
        return;
    }
    this.orientation = orientation;
    this.removeClass("photonui-separator-vertical");
    this.removeClass("photonui-separator-horizontal");
    this.addClass("photonui-separator-" + this.orientation);
}

/**
 * Get the HTML of the separator.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.Separator.prototype.getHtml = function() {
    return this._e.outer;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the separator.
 *
 * @method _buildHtml
 * @private
 */
photonui.Separator.prototype._buildHtml = function() {
    this._e.outer = document.createElement("div");
    this._e.outer.className = "photonui-widget photonui-separator";
    this._e.hr = document.createElement("hr");
    this._e.outer.appendChild(this._e.hr);
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.Separator.prototype._updateAttributes = function() {
    photonui.Widget.prototype._updateAttributes.call(this);
    this.setOrientation(this.orientation);
}
