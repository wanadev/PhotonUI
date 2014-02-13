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
 * Menu item.
 *
 * @class MenuItem
 * @constructor
 * @extends photonui.Container
 * @param {String} text The item text (optional, default="Menu Item").
 * @param icon The item icon (optional, default="").
 * @param {Boolean} active Highlight the menu item if true (optional, default=`false`).
 */
photonui.MenuItem = function(params) {
    photonui.Container.call(this, params);

    var params = params || {};

    // Attrs
    this.text = params.text || "Menu Item";  // FIXME i18n
    this.icon = params.icon || "";
    this.active = (params.active != undefined) ? params.active : false;

    this._e = {};  // HTML Elements
    this._icon = null;

    this._registerWidgetEvents(["click"]);

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
    this._bindEvent("click", this._e.outer, "click", function(event) {
        this._callCallbacks("click", [event]);
    }.bind(this));
}

photonui.MenuItem.prototype = new photonui.Container;


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the item text.
 *
 * @method getText
 * @return {String}
 */
photonui.MenuItem.prototype.getText = function() {
    return this.text;
}

/**
 * Set the item text.
 *
 * @method setText
 * @param {string} text
 */
photonui.MenuItem.prototype.setText = function(text) {
    this.text = text;
    this._e.text.innerHTML = photonui.Helpers.escapeHtml(text);
}

/**
 * Get the item icon.
 *
 * @method getIcon
 */
photonui.MenuItem.prototype.getIcon = function() {
    return this.icon;
}

/**
 * Set the item icon.
 *
 * @method setIcon
 * @param icon
 */
photonui.MenuItem.prototype.setIcon = function(icon) {
    this.icon = icon;
    if (this.icon) {
        this._icon = photonui.iconFactory(icon);
        if (this._icon) {
            photonui.Helpers.cleanNode(this._e.icon);
            this._e.icon.appendChild(this._icon.getHtml());
        }
        else {
            this.icon = null;
        }
    }
}

/**
 * Get the active state of the item (highlight).
 *
 * @method isActive
 * @return {Boolean}
 */
photonui.MenuItem.prototype.isActive = function() {
    return this.active;
}

/**
 * Set the active state of the item (highlight).
 *
 * @method setActive
 * @param {Boolean} active
 */
photonui.MenuItem.prototype.setActive = function(active) {
    this.active = active;

    if (active) {
        this.addClass("photonui-menuitem-active");
    }
    else {
        this.removeClass("photonui-menuitem-active");
    }
}

/**
 * Get the HTML of the item.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.MenuItem.prototype.getHtml = function() {
    return this._e.outer;
}

/**
 * Get the container DOM Element.
 *
 * @method getContainerNode
 * @return {HTMLElement}
 */
photonui.MenuItem.prototype.getContainerNode = function() {
    return this._e.widget;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the item.
 *
 * @method _buildHtml
 * @private
 */
photonui.MenuItem.prototype._buildHtml = function() {
    this._e.outer = document.createElement("div");
    this._e.outer.className = "photonui-widget photonui-menuitem";

    this._e.icon = document.createElement("span");
    this._e.icon.className = "photonui-menuitem-icon";
    this._e.outer.appendChild(this._e.icon);

    this._e.text = document.createElement("span");
    this._e.text.className = "photonui-menuitem-text";
    this._e.outer.appendChild(this._e.text);

    this._e.widget = document.createElement("span");
    this._e.widget.className = "photonui-menuitem-widget";
    this._e.outer.appendChild(this._e.widget);
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.MenuItem.prototype._updateAttributes = function() {
    photonui.Container.prototype._updateAttributes.call(this);

    this.setText(this.text);
    this.setIcon(this.icon);
    this.setActive(this.active);
}
