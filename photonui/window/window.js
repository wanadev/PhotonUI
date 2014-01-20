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
 * @class Window
 * @constructor
 * @param {String} params.title The window title.
 * @extends Widget
 */
photonui.Window = function(params) {
    photonui.Widget.call(this);

    var params = params || {};

    // Attrs
    this.title = params.title || "Window";
    this.position = {x: params.x || 0, y: params.y || 0};

    this._e_parent = params.e_parent || photonui.e_parent;
    this._e = {};  // HTML Elements

    // Build and bind
    this._buildHtml();
    this._bindEvent("move.dragstart", this._e.windowTitle, "mousedown", this._moveDragStart.bind(this));
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
    this.position.x = y;
    this._e["window"].style.left = x + "px";
    this._e["window"].style.top = y + "px";
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


//////////////////////////////////////////
// Public Methods                       //
//////////////////////////////////////////


/**
 * Bring the window to front.
 *
 * @method moveToFront
 */
photonui.Window.prototype.moveToFront = function() {
    for (var i=0 ; i<photonui._windowList.length ; i++) {
        if (photonui._windowList[i] == this) {
            photonui._windowList.splice(i, 1);
            break;
        }
    }
    photonui._windowList.unshift(this);
    for (var i=photonui._windowList.length-1, z=0 ; i>=0 ; i--, z++) {
        if (i == 0) {
            photonui._windowList[i].getHtml().style.zIndex = 2001;
        }
        else {
            photonui._windowList[i].getHtml().style.zIndex = 1000+z;
        }
    }
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
    this._e["window"].className = "photonui-window";

    this._e.windowTitle = document.createElement("div");
    this._e.windowTitle.className = "photonui-window-title";
    this._e["window"].appendChild(this._e.windowTitle);

    this._e.windowTitleText = document.createElement("span");
    this._e.windowTitleText.className = "photonui-window-title-text";
    this._e.windowTitle.appendChild(this._e.windowTitleText);

    this._e.windowContent = document.createElement("div");
    this._e.windowContent.className = "photonui-window-content";
    this._e["window"].appendChild(this._e.windowContent);

    // Update some part
    this.setTitle(this.title);
    this.setPosition(this.position.x, this.position.y);
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
    this.setPosition(event.pageX - offsetX, event.pageY - offsetY);
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
