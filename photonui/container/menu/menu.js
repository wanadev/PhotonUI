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
 * Menu.
 *
 * @class Menu
 * @constructor
 * @extends photonui.Layout
 * @param {Boolean} hideIcon Hide the icons of the menu items (optional, default=`false`).
 */
photonui.Menu = function(params) {
    photonui.Layout.call(this, params);

    var params = params || {};

    // Args
    this.hideIcons = (params.hideIcons != undefined) ? params.hideIcons : false;

    this._e = {};  // HTML elements

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
}

photonui.Menu.prototype = new photonui.Layout;


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * 
 * @method getHideIcons
 * return {Boolean}
 */
photonui.Menu.prototype.getHideIcons = function() {
    return this.hideIcons;
}

/**
 * Hide or display menu item icons.
 *
 * @method setHideIcons
 * param {Boolean} hide
 */
photonui.Menu.prototype.setHideIcons = function(hide) {
    this.hideIcons = hide;

    if (hide) {
        this.addClass("photonui-menu-noicon");
    }
    else {
        this.removeClass("photonui-menu-noicon");
    }
}

/**
 * Get the HTML of the menu.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.Menu.prototype.getHtml = function() {
    return this._e.outer;
}


//////////////////////////////////////////
// Public Methods                       //
//////////////////////////////////////////


/**
 * Add submenu.
 *
 * @method addSubmenu
 * @param {photonui.MenuItem} menuItem The menu item that will fold/unfold the submenu
 * @param {photonui.Menu} menu The submenu
 */
photonui.Menu.prototype.addSubmenu = function (menuItem, menu) {
    // Prepare item
    menuItem.addClass("photonui-menuitem-submenu");
    menuItem.registerCallback("toggle-folding", "click", function(widget, event) {
        menu.setVisible(!menu.isVisible());
    });

    // Prepare menu
    menu.registerCallback("fold", "hide", function(widget, event) {
        menuItem.removeClass("photonui-menuitem-active");
    });
    menu.registerCallback("unfold", "show", function(widget, event) {
        menuItem.addClass("photonui-menuitem-active");
    });
    menu.setVisible(menu.isVisible());

    // Append to current menu
    this.addChild(menuItem);
    this.addChild(menu);
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the menu.
 *
 * @method _buildHtml
 * @private
 */
photonui.Menu.prototype._buildHtml = function() {
    this._e.outer = document.createElement("div");
    this._e.outer.className = "photonui-widget photonui-menu photonui-menu-style-default";
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.Menu.prototype._updateAttributes = function() {
    photonui.Layout.prototype._updateAttributes.call(this);
}

/**
 * Update the layout.
 *
 * @method _updateLayout
 * @private
 */
photonui.Menu.prototype._updateLayout = function() {
    // Detache the outer element from the document tree
    //TODO

    // Clean
    photonui.Helpers.cleanNode(this._e.outer);

    // Append children
    for (var i=0 ; i<this.childrenWidgets.length ; i++) {
        this._e.outer.appendChild(this.childrenWidgets[i].getHtml());
    }

    // Attache the outer element into the document tree
    // TODO
}
