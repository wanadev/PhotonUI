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
 * @submodule Container
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * Viewport.
 *
 * @class Viewport
 * @constructor
 * @extends photonui.Container
 * @param {Number} params.padding The padding (optional, default = 0).
 * @param {Boolean} params.verticalScrollbar Enable the vertical scrollbar: `true`=display, `false`=hide, `null`=auto (optional, default = `null`).
 * @param {Boolean} params.horizontalScrollbar Enable the vertical scrollbar: `true`=display, `false`=hide, `null`=auto (optional, default = `null`).
 */
photonui.Viewport = function(params) {
    photonui.Container.call(this, params);

    var params = params || {};

    // Attrs
    this.padding = (params.padding != undefined) ? params.padding : 0;
    this.verticalScrollbar = (params.verticalScrollbar != undefined) ? params.verticalScrollbar : null;
    this.horizontalScrollbar = (params.horizontalScrollbar != undefined) ? params.horizontalScrollbar : null;

    this._e = {};  // HTML Elements

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
}

photonui.Viewport.prototype = new photonui.Container();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get padding.
 *
 * @method getPadding
 * @return {Number} The padding.
 */
photonui.Viewport.prototype.getPadding = function() {
    return this.padding;
}

/**
 * Set the padding.
 *
 * @method setPadding
 * @param {Number} padding The padding.
 */
photonui.Viewport.prototype.setPadding = function(padding) {
    this.padding = padding;
    this._e.viewport.style.padding = padding + "px";
}

/**
 * Get the visibility of the vertical scrollbar.
 *
 * @method getVerticalScrollbar
 * @return {Boolean} `true`=displayed, `false`=hidden, `null`=auto.
 */
photonui.Viewport.prototype.getVerticalScrollbar = function() {
    return this.verticalScrollbar;
}

/**
 * Set the visibility of the vertical scrollbar.
 *
 * @method setVerticalScrollbar
 * @param {Boolean} visibility `true`=display, `false`=hide, `null`=auto.
 */
photonui.Viewport.prototype.setVerticalScrollbar = function(visibility) {
    this.verticalScrollbar = visibility;
    if (visibility == true) {
        this._e.viewport.style.overflowY = "scroll";
    }
    else if (visibility == false) {
        this._e.viewport.style.overflowY = "hidden";
    }
    else {
        this._e.viewport.style.overflowY = "auto";
    }
}

/**
 * Get the visibility of the horizontal scrollbar.
 *
 * @method getHorizontalScrollbar
 * @return {Boolean} `true`=displayed, `false`=hidden, `null`=auto.
 */
photonui.Viewport.prototype.getHorizontalScrollbar = function() {
    return this.horizontalScrollbar;
}

/**
 * Set the visibility of the horizontal scrollbar.
 *
 * @method setHorizontalScrollbar
 * @param {Boolean} visibility `true`=display, `false`=hide, `null`=auto.
 */
photonui.Viewport.prototype.setHorizontalScrollbar = function(visibility) {
    this.horizontalScrollbar = visibility;
    if (visibility == true) {
        this._e.viewport.style.overflowX = "scroll";
    }
    else if (visibility == false) {
        this._e.viewport.style.overflowX = "hidden";
    }
    else {
        this._e.viewport.style.overflowX = "auto";
    }
}

/**
 * Get the HTML of the viewport.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.Viewport.prototype.getHtml = function() {
    return this._e.viewport;
}

/**
 * Get the container DOM Element.
 *
 * @method getContainerNode
 * @return {HTMLElement}
 */
photonui.Viewport.prototype.getContainerNode = function() {
    return this._e.viewport;
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
photonui.Viewport.prototype._buildHtml = function() {
    this._e.viewport = document.createElement("div");
    this._e.viewport.className = "photonui-widget photonui-viewport";
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.Viewport.prototype._updateAttributes = function() {
    photonui.Container.prototype._updateAttributes.call(this);

    this.setPadding(this.padding);
    this.setVerticalScrollbar(this.verticalScrollbar);
    this.setHorizontalScrollbar(this.horizontalScrollbar);
}
