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
 * @submodule Composite
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * Popup Menu.
 *
 * @class PopupMenu
 * @constructor
 * @extends photonui.PopupWindow
 */
photonui.PopupMenu = function(params) {
    photonui.PopupWindow.call(this, params);
    photonui.Layout.call(this, params);

    // Build and bind
    //this._updateAttributes();
}

photonui.PopupMenu.prototype = new photonui.PopupWindow;


//////////////////////////////////////////
// "Multiple inheritance"...            //
//////////////////////////////////////////


// Cannot change the child of the popup window
photonui.PopupMenu.prototype.setChild = function(){};

/**
 * Add a widget to the menu.
 *
 * @method addChild
 * @param {photonui.Widget} widget The widget to add.
 * @param {Object} layoutOption Specific option for the layout (optional).
 */
photonui.PopupMenu.prototype.addChild = photonui.Menu.prototype.addChild;

/**
 * Remove a widget from the menu.
 *
 * @method removeChild
 * @param {photonui.Widget} widget The widget to remove.
 */
photonui.PopupMenu.prototype.removeChild = photonui.Menu.prototype.removeChild;

/**
 *
 * @method getHideIcons
 * @return {Boolean}
 */
photonui.PopupMenu.prototype.getHideIcons = photonui.Menu.prototype.getHideIcons;

/**
 * Hide or display menu item icons.
 *
 * @method setHideIcons
 * @param {Boolean} hide
 */
photonui.PopupMenu.prototype.setHideIcons = photonui.Menu.prototype.setHideIcons;

/**
 * Update the layout.
 *
 * @method _updateLayout
 * @private
 */
photonui.PopupMenu.prototype._updateLayout = photonui.Menu.prototype._updateLayout;


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


photonui.PopupMenu.prototype._buildHtml = function() {
    photonui.PopupWindow.prototype._buildHtml.call(this);
    photonui.Menu.prototype._buildHtml.call(this);

    this._e["window"].appendChild(this._e.outer);
    this._e["window"].className += " phontui-popupmenu";
    this._e.outer.className = "photonui-widget photonui-menu photonui-menu-style-popupmenu";
}
