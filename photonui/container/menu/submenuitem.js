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
 * Submenu Menu item.
 *
 * @class SubMenuItem
 * @constructor
 * @extends photonui.MenuItem
 * @param {String} subMenuName The name of the menu (optional, default=null).
 */
photonui.SubMenuItem = function(params) {
    photonui.MenuItem.call(this, params);

    var params = params || {};

    // Attrs
    this.subMenuName = params.subMenuName || null;

    this.addClass("photonui-submenuitem");

    this.registerCallback("toggle-folding", "click", this._onItemClicked, this);
    this._updateAttributes();
}

photonui.SubMenuItem.prototype = new photonui.MenuItem;


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the submenu.
 *
 * @method getSubMenu
 * @return {photonui.Menu}
 */
photonui.SubMenuItem.prototype.getSubMenu = function() {
    if (this.subMenuName) {
        return photonui.getWidget(this.subMenuName);
    }
    return null;
}

/**
 * Set the submenu
 *
 * @method setSubMenu
 * @param {photonui.Menu} menu The submenu
 * @param {String} menu The menu name.
 */
photonui.SubMenuItem.prototype.setSubMenu = function(menu) {
    if (this.subMenuName) {
        this.getSubMenu().removeCallback("fold");
        this.getSubMenu().removeCallback("unfold");
    }
    this.subMenuName = null;
    if (menu instanceof photonui.Menu) {
        this.subMenuName = menu.name;
    }
    else if (typeof(menu) == "string") {
        this.subMenuName = menu;
    }
    if (this.subMenuName) {
        var submenu = this.getSubMenu();
        submenu.registerCallback("fold", "hide", this._onToggleFold, this);
        submenu.registerCallback("unfold", "show", this._onToggleFold, this);
        this.setActive(submenu.isVisible());
    }
}


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.SubMenuItem.prototype._updateAttributes = function() {
    photonui.MenuItem.prototype._updateAttributes.call(this);
    this.setSubMenu(this.subMenuName);
}


//////////////////////////////////////////
// Internal Events Callbacks            //
//////////////////////////////////////////


/**
 *
 * @method _onToggleFold
 * @private
 */
photonui.SubMenuItem.prototype._onToggleFold = function(widget) {
    this.setActive(widget.isVisible());
}

/**
 *
 * @method _onItemClicked
 * @private
 */
photonui.SubMenuItem.prototype._onItemClicked = function(widget) {
    var submenu = this.getSubMenu();
    submenu.setVisible(!submenu.isVisible());
}
