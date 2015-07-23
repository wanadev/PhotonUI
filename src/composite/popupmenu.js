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
 * @submodule Composite
 * @namespace photonui
 */

var PopupWindow = require("../container/popupwindow.js");
var Menu = require("../layout/menu.js");

/**
 * Popup Menu.
 *
 * @class PopupMenu
 * @constructor
 * @extends photonui.PopupWindow
 * @uses photonui.Layout
 * @uses photonui.Menu
 */
var PopupMenu = PopupWindow.$extend({

    // Constructor
    __init__: function (params) {
        this._childrenNames = [];  // new instance
        this.$super(params);
    },

    // Mixin
    __include__: [{
        getChildrenNames: Menu.prototype.getChildrenNames,
        setChildrenNames: Menu.prototype.setChildrenNames,
        getChildren:      Menu.prototype.getChildren,
        setChildren:      Menu.prototype.setChildren,
        getChildName:     Menu.prototype.getChildName,
        setChildName:     Menu.prototype.setChildName,
        getChild:         Menu.prototype.getChild,
        setChild:         Menu.prototype.setChild,
        _iconVisible:     Menu.prototype._iconVisible,
        isIconVisible:    Menu.prototype.isIconVisible,
        setIconVisible:   Menu.prototype.setIconVisible,
        addChild:         Menu.prototype.addChild,
        removeChild:      Menu.prototype.removeChild,
        empty:            Menu.prototype.empty,
        destroy:          Menu.prototype.destroy,
        _updateLayout:    Menu.prototype._updateLayout,
        _lockUpdate:      Menu.prototype._lockUpdate
    }],

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.$super();
        Menu.prototype._buildHtml.call(this);

        this.__html.inner.appendChild(this.__html.outer);
        this.__html.window.className += " photonui-popupmenu";
        this.__html.outer.className = "photonui-widget photonui-menu photonui-menu-style-popupmenu";
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // pass
    }
});

module.exports = PopupMenu;
