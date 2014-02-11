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
 * Font Awesome Icon.
 *
 * @class FAIcon
 * @constructor
 * @extends photonui.BaseIcon
 * @param {String} params.icon The Font Awesome icon name (optional, list: http://fontawesome.io/icons/, default="fa-square-o").
 * @param {String} params.size The Font Awesome icon size (optional, list: http://fontawesome.io/examples/#larger, default="").
 * @param {String} params.color The icon color (optional, default="").
 */
photonui.FAIcon = function(params) {
    photonui.BaseIcon.call(this, params);

    var params = params || {};

    // Attrs
    this.icon = params.icon || "fa-square-o";
    this.size = params.size || "";
    this.color = params.color || "";

    this._e = {};  // HTML Elements

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
}

photonui.FAIcon.prototype = new photonui.BaseIcon();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the icon name.
 *
 * @method getIcon
 * @return {String}
 */
photonui.FAIcon.prototype.getIcon = function() {
    return this.icon;
}

/**
 * Set the icon name.
 *
 * @method setIcon
 * @param {String} icon The Font Awesome icon name (eg. "fa-cog").
 */
photonui.FAIcon.prototype.setIcon = function(icon) {
    this.icon = icon;
    this._e.icon.className = "fa " + this.icon + " " + this.size;
}

/**
 * Get the icon size.
 *
 * @method getSize
 * @return {String}
 */
photonui.FAIcon.prototype.getSize = function() {
    return this.size;
}

/**
 * Set the icon size.
 *
 * @method setSize
 * @param {String} size The Font Awesome icon size ("", "fa-lg", "fa-2x".."fa-5x").
 */
photonui.FAIcon.prototype.setSize = function(size) {
    this.size = size;
    this._e.icon.className = "fa " + this.icon + " " + this.size;
}

/**
 * Get the icon color.
 *
 * @method getColor
 * @return {String}.
 */
photonui.FAIcon.prototype.getColor = function() {
    return this.color;
}

/**
 * Set the icon color.
 *
 * @method setColor
 * @param {String} color The HTML color ("" = default).
 */
photonui.FAIcon.prototype.setColor = function(color) {
    this.color = color;
    this._e.icon.style.color = color;
}

/**
 * Get the HTML of the icon.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.FAIcon.prototype.getHtml = function() {
    return this._e.outer;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the icon.
 *
 * @method _buildHtml
 * @private
 */
photonui.FAIcon.prototype._buildHtml = function() {
    this._e.outer = document.createElement("span");
    this._e.outer.className = "photonui-widget photonui-icon photonui-faicon";

    this._e.icon = document.createElement("i");
    this._e.outer.appendChild(this._e.icon);
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.FAIcon.prototype._updateAttributes = function() {
    photonui.BaseIcon.prototype._updateAttributes.call(this);
    this.setIcon(this.icon);
    this.setColor(this.color);
}
