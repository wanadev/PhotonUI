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
photonui._windowList = [];


/**
 * Window.
 *
 * wEvents:
 *
 *   * close-button-clicked:
 *      - description: called when the close button was clicked.
 *      - callback:    function(widget)
 *
 * @class Window
 * @constructor
 * @extends photonui.BaseWindow
 * @param {String} params.title The window title (optional, default = "Window").
 * @param {Boolean} params.movable Define if the window can be moved (optional, default = true).
 * @param {Boolean} params.closeButton Define if the window have a "close" button (optional, default = true).
 */
photonui.Window = function(params) {
    photonui.BaseWindow.call(this, params);

    var params = params || {};

    // Attrs
    this.title = params.title || "Window";  // FIXME i18n
    this.movable = (params.movable != undefined) ? params.movable : true;
    this.closeButton = (params.closeButton != undefined) ? params.closeButton : true;

    this._registerWidgetEvents(["close-button-clicked"]);

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
    this._bindEvent("move.dragstart", this._e.windowTitle, "mousedown", this._moveDragStart.bind(this));
    this._bindEvent("closeButton.click", this._e.windowTitleCloseButton, "click", this._closeButtonClicked.bind(this));
    this._bindEvent("totop", this._e["window"], "mousedown", this.moveToFront.bind(this));
    this._bindEvent("closeButton.mousedown", this._e.windowTitleCloseButton, "mousedown", function (event) { event.stopPropagation(); });
    this.moveToFront();
}

photonui.Window.prototype = new photonui.BaseWindow();


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
    this._e.windowTitleText.innerHTML = photonui.Helpers.escapeHtml(title);
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
 * Get the container DOM Element.
 *
 * @method getContainerNode
 * @return {HTMLElement}
 */
photonui.Window.prototype.getContainerNode = function() {
    return this._e.windowContent;
}

/**
 * Display or hide the window.
 *
 * @method setVisible
 * @param {Boolean} visible The window visibility
 */
photonui.Window.prototype.setVisible = function(visible) {
    photonui.BaseWindow.prototype.setVisible.call(this, visible);
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
 * Destroy the window.
 *
 * @method destroy
 */
photonui.Window.prototype.destroy = function() {
    var index = photonui._windowList.indexOf(this);
    if (index >= 0) {
        photonui._windowList.splice(index, 1);
    }
    photonui.BaseWindow.prototype.destroy.call(this);
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
photonui.Window.prototype._buildHtml = function() {
    photonui.BaseWindow.prototype._buildHtml.call(this);
    // Builde the HTML
    this._e["window"].className += " photonui-window";

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
    this._e.windowContent.className = "photonui-container photonui-window-content photonui-container-expand-child";
    this._e["window"].appendChild(this._e.windowContent);
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.Window.prototype._updateAttributes = function() {
    photonui.BaseWindow.prototype._updateAttributes.call(this);

    this.setTitle(this.title);
    this.setCloseButton(this.closeButton);
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
    var offsetX = (event.offsetX != undefined) ? event.offsetX : event.layerX;
    var offsetY = (event.offsetY != undefined) ? event.offsetY : event.layerY;
    this._e.windowTitle.style.cursor = "move";
    this._bindEvent("move.dragging", document, "mousemove", this._moveDragging.bind(this, offsetX, offsetY));
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
