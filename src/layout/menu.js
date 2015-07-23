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
 * @submodule Layout
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Layout = require("./layout.js");

/**
 * Menu.
 *
 * @class Menu
 * @constructor
 * @extends photonui.Layout
 */
var Menu = Layout.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties(["iconVisible"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Define if icon on menu items are visible.
     *
     * @property iconVisible
     * @type Boolean
     * @default: true
     */
    _iconVisible: true,

    isIconVisible: function () {
        return this._iconVisible;
    },

    setIconVisible: function (iconVisible) {
        this._iconVisible = iconVisible;
        if (iconVisible) {
            this.__html.outer.classList.remove("photonui-menu-noicon");
        } else {
            this.__html.outer.classList.add("photonui-menu-noicon");
        }
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.outer;
    },

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
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-menu photonui-menu-style-default";
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function () {
        // Detache the outer element from the document tree
        //TODO

        // Clean
        Helpers.cleanNode(this.__html.outer);

        // Append children
        var children = this.children;
        for (var i = 0 ; i < children.length ; i++) {
            this.__html.outer.appendChild(children[i].html);
        }

        // Attache the outer element into the document tree
        // TODO
    }
});

module.exports = Menu;
