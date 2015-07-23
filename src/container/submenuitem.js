/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
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

var Widget = require("../widget.js");
var MenuItem = require("./menuitem.js");
var Menu = require("../layout/menu.js");

/**
 * Submenu Menu item (fold/unfold a submenu).
 *
 * @class SubMenuItem
 * @constructor
 * @extends photonui.MenuItem
 */
var SubMenuItem = MenuItem.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this.addClass("photonui-submenuitem");
        this.registerCallback("toggle-folding", "click", this.__onItemClicked, this);
        this._updateProperties(["menuName"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The submenu widget name.
     *
     * @property menuName
     * @type String
     * @default null
     */
    _menuName: null,

    getMenuName: function () {
        return this._menuName;
    },

    setMenuName: function (menuName) {
        var that = this;

        function _init() {
            if (!that.menu) return;
            that.menu.registerCallback("fold", "hide", that.__onToggleFold, that);
            that.menu.registerCallback("unfold", "show", that.__onToggleFold, that);
            that.active = that.menu.visible;
        }

        if (this.menuName && this.menu) {
            this.menu.removeCallback("fold");
            this.menu.removeCallback("unfold");
        }

        this._menuName = menuName;

        if (this.menuName) {
            if (this.menu) {
                _init();
            } else {
                setTimeout(_init, 10);
            }
        }
    },

    /**
     * The submenu widget.
     *
     * @property menu
     * @type photonui.Menu
     * @default null
     */
    getMenu: function () {
        return Widget.getWidget(this.menuName);
    },

    setMenu: function (menu) {
        if (menu instanceof Menu) {
            this.menuName = menu.name;
        } else {
            this.menuName = null;
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onToggleFold
     * @private
     */
    __onToggleFold: function (widget) {
        this.active = widget.visible;
    },

    /**
     * @method __onItemClicked
     * @private
     */
    __onItemClicked: function (widget) {
        this.menu.visible = !this.menu.visible;
    }
});

module.exports = SubMenuItem;
