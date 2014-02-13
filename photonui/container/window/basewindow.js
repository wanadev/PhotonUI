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
 * Windows base class.
 *
 * wEvents:
 *
 *   * position-changed:
 *      - description: called when the widows is moved.
 *      - callback:    function(widget, x, y)
 *
 * @class BaseWindow
 * @constructor
 * @extends photonui.Container
 * @param {Number} params.x The window X position (optional, default = 0).
 * @param {Number} params.y The window Y position (optional, default = 0).
 * @param {Number} params.width The window content width (none = auto, optional, default = none).
 * @param {Number} params.height The window content height (none = auto, optional, default = none).
 * @param {Number} params.minWidth The window content minimum width (none = no limit, optional, default = none).
 * @param {Number} params.minHeight The window content minimum height (none = no limit, optional, default = none).
 * @param {Number} params.maxWidth The window content maximum width (none = no limit, optional, default = none).
 * @param {Number} params.maxHeight The window content maximum height (none = no limit, optional, default = none).
 * @param {Number} params.padding The window content padding (optional, default = 0).
 * @param {Boolean} params.visible Is the widget displayed or hidden (optional, default=false).
 * @param {HTMLElement} params.e_parent The DOM node where the window will be inserted (none = no limit, optional, default = none).
 */
photonui.BaseWindow = function(params) {
    photonui.Container.call(this, params);

    var params = params || {};

    // Attrs
    this.position = {x: params.x || 0, y: params.y || 0};
    this.width = params.width || null;
    this.height = params.height || null;
    this.minWidth = params.minWidth || null;
    this.minHeight = params.minHeight || null;
    this.maxWidth = params.maxWidth || null;
    this.maxHeight = params.maxHeight || null;
    this.padding = (params.padding != undefined) ? params.padding : 0;
    this.visible = (params.visible != undefined) ? params.visible : false;

    this._e_parent = params.e_parent || photonui.e_parent;
    this._e = {};  // HTML Elements

    this._registerWidgetEvents(["position-changed"]);
}

photonui.BaseWindow.prototype = new photonui.Container;


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the window position
 *
 * @method getPosition
 * @return {Object} The window position `{x: integer, y: integer}`.
 */
photonui.BaseWindow.prototype.getPosition = function() {
    return {x: this.position.x, y: this.position.y};
}

/**
 * Set the window position
 *
 * @method setPosition
 * @param {Integer} x
 * @param {Integer} y
 */
photonui.BaseWindow.prototype.setPosition = function(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.getHtml().style.left = x + "px";
    this.getHtml().style.top = y + "px";
    this._callCallbacks("position-changed", [x, y]);
}

/**
 * Get window content width.
 *
 * @method getWidth
 * @return {Number} the Width;
 */
photonui.BaseWindow.prototype.getWidth = function() {
    return this.getContainerNode().offsetWidth;
}

/**
 * Set window content width.
 *
 * @method setWidth
 * @param {Number} width the Width (`null` = auto);
 */
photonui.BaseWindow.prototype.setWidth = function(width) {
    this.width = width;
    if (width == null) {
        this.getContainerNode().style.width = "auto";
    }
    else {
        this.getContainerNode().style.width = width + "px";
        this.width = this.getContainerNode().offsetWidth;
    }
}

/**
 * Get window content height.
 *
 * @method getHeight
 * @return {Number} the Height;
 */
photonui.BaseWindow.prototype.getHeight = function() {
    return this.getContainerNode().offsetHeight;
}

/**
 * Set window content height.
 *
 * @method setHeight
 * @param {Number} height the Height (`null` = auto);
 */
photonui.BaseWindow.prototype.setHeight = function(height) {
    this.height = height;
    if (height == null) {
        this.getContainerNode().style.height = "auto";
    }
    else {
        this.getContainerNode().style.height = height + "px";
        this.height = this.getContainerNode().offsetHeight;
    }
}

/**
 * Get window content minimum width.
 *
 * @method getMinWidth
 * @return {Number} the minimum Width or `null`;
 */
photonui.BaseWindow.prototype.getMinWidth = function() {
    return this.minWidth;
}

/**
 * Set window content minimum width.
 *
 * @method setMinWidth
 * @param {Number} minWidth the minimum Width (`null` = no minimum);
 */
photonui.BaseWindow.prototype.setMinWidth = function(minWidth) {
    this.minWidth = minWidth;
    if (minWidth == null) {
        this.getContainerNode().style.minWidth = "0px";
    }
    else {
        this.getContainerNode().style.minWidth = minWidth + "px";
    }
}

/**
 * Get window content minimum height.
 *
 * @method getMinHeight
 * @return {Number} the minimum Height or `null`;
 */
photonui.BaseWindow.prototype.getMinHeight = function() {
    return this.minHeight;
}

/**
 * Set window content minimum height.
 *
 * @method setMinHeight
 * @param {Number} minHeight the minimum Height (`null` = no minimum);
 */
photonui.BaseWindow.prototype.setMinHeight = function(minHeight) {
    this.minHeight = minHeight;
    if (minHeight == null) {
        this.getContainerNode().style.minHeight = "0px";
    }
    else {
        this.getContainerNode().style.minHeight = minHeight + "px";
    }
}

/**
 * Get window content maximum width.
 *
 * @method getMaxWidth
 * @return {Number} the maximum Width or `null`;
 */
photonui.BaseWindow.prototype.getMaxWidth = function() {
    return this.maxWidth;
}

/**
 * Set window content maximum width.
 *
 * @method setMaxWidth
 * @param {Number} maxWidth the maximum Width (`null` = no maximum);
 */
photonui.BaseWindow.prototype.setMaxWidth = function(maxWidth) {
    this.maxWidth = maxWidth;
    if (maxWidth == null) {
        this.getContainerNode().style.maxWidth = "none";
    }
    else {
        this.getContainerNode().style.maxWidth = maxWidth + "px";
    }
}

/**
 * Get window content maximum height.
 *
 * @method getMaxHeight
 * @return {Number} the maximum Height or `null`;
 */
photonui.BaseWindow.prototype.getMaxHeight = function() {
    return this.maxHeight;
}

/**
 * Set window content maximum height.
 *
 * @method setMaxHeight
 * @param {Number} maxHeight the maximum Height (`null` = no maximum);
 */
photonui.BaseWindow.prototype.setMaxHeight = function(maxHeight) {
    this.maxHeight = maxHeight;
    if (maxHeight == null) {
        this.getContainerNode().style.maxHeight = "none";
    }
    else {
        this.getContainerNode().style.maxHeight = maxHeight + "px";
    }
}

/**
 * Get the window content padding.
 *
 * @method getPadding
 * @return {Number} The padding.
 */
photonui.BaseWindow.prototype.getPadding = function() {
    return this.padding;
}

/**
 * Set the window content padding.
 *
 * @method setPadding
 * @param {Number} padding The padding.
 */
photonui.BaseWindow.prototype.setPadding = function(padding) {
    this.padding = padding;
    this.getContainerNode().style.padding = padding + "px";
}

/**
 * Get the HTML of the window.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.BaseWindow.prototype.getHtml = function() {
    return this._e["window"];
}

/**
 * Get the container DOM Element.
 *
 * @method getContainerNode
 * @return {HTMLElement}
 */
photonui.BaseWindow.prototype.getContainerNode = function() {
    return this.getHtml();
}


//////////////////////////////////////////
// Public Methods                       //
//////////////////////////////////////////


/**
 * Center the window on its parent.
 *
 * @method center
 */
photonui.BaseWindow.prototype.center = function() {
    this.setPosition(
            Math.round((this._e_parent.offsetWidth - this.getWidth()) / 2),
            Math.round((this._e_parent.offsetHeight - this.getHeight()) / 2)
    );
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the window.
 *
 * @method _buildHtml
 * @private
 */
photonui.BaseWindow.prototype._buildHtml = function() {
    // Builde the HTML
    this._e["window"] = document.createElement("div");
    this._e["window"].className = "photonui-widget photonui-basewindow";
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.BaseWindow.prototype._updateAttributes = function() {
    photonui.Container.prototype._updateAttributes.call(this);

    this.setPosition(this.position.x, this.position.y);
    this.setWidth(this.width);
    this.setHeight(this.height);
    this.setMinWidth(this.minWidth);
    this.setMinHeight(this.minHeight);
    this.setMaxWidth(this.maxWidth);
    this.setMaxHeight(this.maxHeight);
    this.setPadding(this.padding);

    this._e_parent.appendChild(this.getHtml());
}
