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
photonui._windowList = [];


/**
 * Window.
 *
 * wEvents:
 *
 *   * position-changed:
 *      - description: called when the widows is moved.
 *      - callback:    function(widget, x, y)
 *
 *   * close-button-clicked:
 *      - description: called when the close button was clicked.
 *      - callback:    function(widget)
 *
 * @class Window
 * @constructor
 * @param {String} params.title The window title (optional, default = "Window").
 * @param {Number} params.x The window X position (optional, default = 0).
 * @param {Number} params.y The window Y position (optional, default = 0).
 * @param {Boolean} params.movable Define if the window can be moved (optional, default = true).
 * @param {Boolean} params.closeButton Define if the window have a "close" button (optional, default = true).
 * @param {Number} params.width The window content width (none = auto, optional, default = none).
 * @param {Number} params.height The window content height (none = auto, optional, default = none).
 * @param {Number} params.minWidth The window content minimum width (none = no limit, optional, default = none).
 * @param {Number} params.minHeight The window content minimum height (none = no limit, optional, default = none).
 * @param {Number} params.maxWidth The window content maximum width (none = no limit, optional, default = none).
 * @param {Number} params.maxHeight The window content maximum height (none = no limit, optional, default = none).
 * @param {Number} params.padding The window content padding (optional, default = 5).
 * @param {HTMLElement} params.e_parent The DOM node where the window will be inserted (none = no limit, optional, default = none).
 * @extends photonui.Widget
 */
photonui.Window = function(params) {
    photonui.Widget.call(this);

    var params = params || {};

    // Attrs
    this.title = params.title || "Window";  // FIXME i18n
    this.position = {x: params.x || 0, y: params.y || 0};
    this.movable = (params.movable != undefined) ? params.movable : true;
    this.closeButton = (params.closeButton != undefined) ? params.closeButton : true;
    this.width = params.width || null;
    this.height = params.height || null;
    this.minWidth = params.minWidth || null;
    this.minHeight = params.minHeight || null;
    this.maxWidth = params.maxWidth || null;
    this.maxHeight = params.maxHeight || null;
    this.padding = (params.padding != undefined) ? params.padding : 5;

    this._e_parent = params.e_parent || photonui.e_parent;
    this._e = {};  // HTML Elements

    this._registerWidgetEvents(["position-changed", "close-button-clicked"]);

    // Build and bind
    this._buildHtml();
    this._bindEvent("move.dragstart", this._e.windowTitle, "mousedown", this._moveDragStart.bind(this));
    this._bindEvent("closeButton.click", this._e.windowTitleCloseButton, "click", this._closeButtonClicked.bind(this));
    this._bindEvent("totop", this._e["window"], "mousedown", this.moveToFront.bind(this));
    this.moveToFront();
    this.hide();
    this._e_parent.appendChild(this.getHtml());
}

photonui.Window.prototype = new photonui.Widget();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get window title.
 *
 * @method getTitle
 * @return {string} The window title.
 */
photonui.Window.prototype.getTitle = function() {
    return this.title;
}

/**
 * Set window title.
 *
 * @method setTitle
 * @param {string} title The window title.
 */
photonui.Window.prototype.setTitle = function(title) {
    this.title = title;
    this._e.windowTitleText.innerHTML = title;
}

/**
 * Get the window position
 *
 * @method getPosition
 * @return {Object} The window position `{x: integer, y: integer}`.
 */
photonui.Window.prototype.getPosition = function() {
    return {x: this.position.x, y: this.position.y};
}

/**
 * Set the window position
 *
 * @method setPosition
 * @param {Integer} x
 * @param {Integer} y
 */
photonui.Window.prototype.setPosition = function(x, y) {
    this.position.x = x;
    this.position.y = y;
    this._e["window"].style.left = x + "px";
    this._e["window"].style.top = y + "px";
    this._callCallbacks("position-changed", [x, y]);
}

/**
 * Know if the window can be moved or not.
 *
 * @method isMovable
 * @return {Boolean}
 */
photonui.Window.prototype.isMovable = function() {
    return this.movable;
}

/**
 * Define if the window can be moved or not.
 *
 * @method setMovable
 * @param {Boolean} movable
 */
photonui.Window.prototype.setMovable = function(movable) {
    this.movable = movable;
}

/**
 * Know if the window have a "close" button.
 *
 * @method haveCloseButton
 * @return {Boolean}
 */
photonui.Window.prototype.haveCloseButton = function() {
    return this.movable;
}

/**
 * Define if the window have a "close" button.
 *
 * @method setCloseButton
 * @param {Boolean} closeButton
 */
photonui.Window.prototype.setCloseButton = function(closeButton) {
    this.closeButton = closeButton;
    if (closeButton) {
        this.addClass("photonui-window-have-button");
        this._e.windowTitleCloseButton.style.display = "block";
    }
    else {
        this.removeClass("photonui-window-have-button");
        this._e.windowTitleCloseButton.style.display = "none";
    }
}

/**
 * Get window content width.
 *
 * @method getWidth
 * @return {Number} the Width;
 */
photonui.Window.prototype.getWidth = function() {
    return this._e.windowContent.offsetWidth;
}

/**
 * Set window content width.
 *
 * @method setWidth
 * @param {Number} width the Width (`null` = auto);
 */
photonui.Window.prototype.setWidth = function(width) {
    this.width = width;
    if (width == null) {
        this._e.windowContent.style.width = "auto";
    }
    else {
        this._e.windowContent.style.width = width + "px";
        this.width = this._e.windowContent.offsetWidth;
    }
}

/**
 * Get window content height.
 *
 * @method getHeight
 * @return {Number} the Height;
 */
photonui.Window.prototype.getHeight = function() {
    return this._e.windowContent.offsetHeight;
}

/**
 * Set window content height.
 *
 * @method setHeight
 * @param {Number} height the Height (`null` = auto);
 */
photonui.Window.prototype.setHeight = function(height) {
    this.height = height;
    if (height == null) {
        this._e.windowContent.style.height = "auto";
    }
    else {
        this._e.windowContent.style.height = height + "px";
        this.height = this._e.windowContent.offsetHeight;
    }
}

/**
 * Get window content minimum width.
 *
 * @method getMinWidth
 * @return {Number} the minimum Width or `null`;
 */
photonui.Window.prototype.getMinWidth = function() {
    return this.minWidth;
}

/**
 * Set window content minimum width.
 *
 * @method setMinWidth
 * @param {Number} minWidth the minimum Width (`null` = no minimum);
 */
photonui.Window.prototype.setMinWidth = function(minWidth) {
    this.minWidth = minWidth;
    if (minWidth == null) {
        this._e.windowContent.style.minWidth = "0px";
    }
    else {
        this._e.windowContent.style.minWidth = minWidth + "px";
    }
}

/**
 * Get window content minimum height.
 *
 * @method getMinHeight
 * @return {Number} the minimum Height or `null`;
 */
photonui.Window.prototype.getMinHeight = function() {
    return this.minHeight;
}

/**
 * Set window content minimum height.
 *
 * @method setMinHeight
 * @param {Number} minHeight the minimum Height (`null` = no minimum);
 */
photonui.Window.prototype.setMinHeight = function(minHeight) {
    this.minHeight = minHeight;
    if (minHeight == null) {
        this._e.windowContent.style.minHeight = "0px";
    }
    else {
        this._e.windowContent.style.minHeight = minHeight + "px";
    }
}

/**
 * Get window content maximum width.
 *
 * @method getMaxWidth
 * @return {Number} the maximum Width or `null`;
 */
photonui.Window.prototype.getMaxWidth = function() {
    return this.maxWidth;
}

/**
 * Set window content maximum width.
 *
 * @method setMaxWidth
 * @param {Number} maxWidth the maximum Width (`null` = no maximum);
 */
photonui.Window.prototype.setMaxWidth = function(maxWidth) {
    this.maxWidth = maxWidth;
    if (maxWidth == null) {
        this._e.windowContent.style.maxWidth = "none";
    }
    else {
        this._e.windowContent.style.maxWidth = maxWidth + "px";
    }
}

/**
 * Get window content maximum height.
 *
 * @method getMaxHeight
 * @return {Number} the maximum Height or `null`;
 */
photonui.Window.prototype.getMaxHeight = function() {
    return this.maxHeight;
}

/**
 * Set window content maximum height.
 *
 * @method setMaxHeight
 * @param {Number} maxHeight the maximum Height (`null` = no maximum);
 */
photonui.Window.prototype.setMaxHeight = function(maxHeight) {
    this.maxHeight = maxHeight;
    if (maxHeight == null) {
        this._e.windowContent.style.maxHeight = "none";
    }
    else {
        this._e.windowContent.style.maxHeight = maxHeight + "px";
    }
}

/**
 * Get the window content padding.
 *
 * @method getPadding
 * @return {Number} The padding.
 */
photonui.Window.prototype.getPadding = function() {
    return this.padding;
}

/**
 * Set the window content padding.
 *
 * @method setPadding
 * @param {Number} padding The padding.
 */
photonui.Window.prototype.setPadding = function(padding) {
    this.padding = padding;
    this._e.windowContent.style.padding = padding + "px";
}

/**
 * Get the HTML of the window.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.Window.prototype.getHtml = function() {
    return this._e["window"];
}

/**
 * Get the container DOM Element.
 *
 * @method getContainer
 * @return {HTMLElement}
 */
photonui.Window.prototype.getContainer = function() {
    return this._e.windowContent;
}

// Documentation in photonui.Widget
photonui.Window.prototype.setVisible = function(visible) {
    photonui.Widget.prototype.setVisible.call(this, visible);
    if (visible) {
        this.moveToFront();
    }
    else {
        this.moveToBack();
    }
}


//////////////////////////////////////////
// Public Methods                       //
//////////////////////////////////////////


/**
 * Bring the window to front.
 *
 * @method moveToFront
 */
photonui.Window.prototype.moveToFront = function() {
    var index = photonui._windowList.indexOf(this);
    if (index >= 0) {
        photonui._windowList.splice(index, 1);
    }
    photonui._windowList.unshift(this);
    this._updateWindowList();
}

/**
 * Bring the window to the back.
 *
 * @method moveToBack
 */
photonui.Window.prototype.moveToBack = function() {
    var index = photonui._windowList.indexOf(this);
    if (index >= 0) {
        photonui._windowList.splice(index, 1);
    }
    photonui._windowList.push(this);
    this._updateWindowList();
}

/**
 * Center the window on its parent.
 *
 * @method center
 */
photonui.Window.prototype.center = function() {
    this.setPosition(
            Math.round((this._e_parent.offsetWidth - this.getWidth()) / 2),
            Math.round((this._e_parent.offsetHeight - this.getHeight()) / 2)
    );
}

// Documentation in photonui.Widget
photonui.Window.prototype.destroy = function() {
    var index = photonui._windowList.indexOf(this);
    if (index >= 0) {
        photonui._windowList.splice(index, 1);
    }
    photonui.Widget.prototype.destroy.call(this);
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Get the HTML of the window.
 *
 * @method _buildHtml
 * @private
 * @return {HTMLElement}
 */
photonui.Window.prototype._buildHtml = function() {
    // Builde the HTML
    this._e["window"] = document.createElement("div");
    this._e["window"].className = "photonui-widget photonui-window";

    this._e.windowTitle = document.createElement("div");
    this._e.windowTitle.className = "photonui-window-title";
    this._e["window"].appendChild(this._e.windowTitle);

    this._e.windowTitleCloseButton = document.createElement("button");
    this._e.windowTitleCloseButton.className = "photonui-window-title-close-button";
    this._e.windowTitleCloseButton.title = "Close";  // FIXME i18n
    this._e.windowTitle.appendChild(this._e.windowTitleCloseButton);

    this._e.windowTitleText = document.createElement("span");
    this._e.windowTitleText.className = "photonui-window-title-text";
    this._e.windowTitle.appendChild(this._e.windowTitleText);

    this._e.windowContent = document.createElement("div");
    this._e.windowContent.className = "photonui-window-content photonui-container-expend-child";
    this._e["window"].appendChild(this._e.windowContent);

    // Update
    this.setTitle(this.title);
    this.setPosition(this.position.x, this.position.y);
    this.setCloseButton(this.closeButton);
    this.setWidth(this.width);
    this.setHeight(this.height);
    this.setMinWidth(this.minWidth);
    this.setMinHeight(this.minHeight);
    this.setMaxWidth(this.maxWidth);
    this.setMaxHeight(this.maxHeight);
    this.setPadding(this.padding);
}

/**
 * Update all the windows.
 *
 * @method _updateWindowList
 * @private
 */
photonui.Window.prototype._updateWindowList = function() {
    for (var i=photonui._windowList.length-1, z=0 ; i>=0 ; i--, z++) {
        if (i == 0) {
            photonui._windowList[i].getHtml().style.zIndex = 2001;
            photonui._windowList[i].addClass("photonui-active");
        }
        else {
            photonui._windowList[i].getHtml().style.zIndex = 1000+z;
            photonui._windowList[i].removeClass("photonui-active");
        }
    }
}


//////////////////////////////////////////
// Internal Events Callbacks            //
//////////////////////////////////////////


/**
 * Start moving the window.
 *
 * @method _moveDragStart
 * @private
 * @param {Object} event
 */
photonui.Window.prototype._moveDragStart = function(event) {
    if (!this.movable || event.button > 0) {
        return;
    }
    this._e.windowTitle.style.cursor = "move";
    this._bindEvent("move.dragging", document, "mousemove", this._moveDragging.bind(this, event.layerX, event.layerY));
    this._bindEvent("move.dragend", document, "mouseup", this._moveDragEnd.bind(this));
}

/**
 * Move the window.
 *
 * @method _moveDragging
 * @private
 * @param {Number} offsetX
 * @param {Number} offsetY
 * @param {Object} event
 */
photonui.Window.prototype._moveDragging = function(offsetX, offsetY, event) {
    var e_body = document.getElementsByTagName("body")[0];
    var x = Math.min(Math.max(event.pageX - offsetX, 40 - this.getWidth()), e_body.offsetWidth - 40);
    var y = Math.max(event.pageY - offsetY, 0);
    if (e_body.offsetHeight > 0) {
        y = Math.min(y, e_body.offsetHeight - this._e.windowTitle.offsetHeight);
    }
    this.setPosition(x, y);
}

/**
 * Stop moving the window.
 *
 * @method _moveDragEnd
 * @private
 * @param {Object} event
 */
photonui.Window.prototype._moveDragEnd = function(event) {
    this._e.windowTitle.style.cursor = "default";
    this._unbindEvent("move.dragging");
    this._unbindEvent("move.dragend");
}

/**
 * Close button clicked.
 *
 * @method _closeButtonClicked
 * @private
 * @param {Object} event
 */
photonui.Window.prototype._closeButtonClicked = function(event) {
    this._callCallbacks("close-button-clicked");
}
