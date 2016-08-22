/*
 * Copyright (c) 2014-2016, Wanadev <http://www.wanadev.fr/>
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
 * Authored by: Fabien LOISON <https://github.com/flozz>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Interactive
 * @namespace photonui
 */

var Widget = require("../widget.js");
var BaseIcon = require("../visual/baseicon.js");
var Helpers = require("../helpers.js");

/**
 * A simple flat button that only contains an icon
 *
 * wEvents:
 *
 *   * click:
 *     - description: called when the button was clicked.
 *     - callback:    function(widget, event)
 *
 * @class IconButton
 * @constructor
 * @extends photonui.Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var IconButton = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["click"]);
        this.$super(params);

        this._bindEvent("click", this.__html.div, "click", this.__onButtonClicked.bind(this));
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Button width
     *
     * @property width
     * @type Number
     * @default 16
     */
    _width: 16,

    getWidth: function () {
        "@photonui-update";
        return this._width;
    },

    setWidth: function (width) {
        this._width = width;
        this.html.style.width = width + "px";
        this.html.style.minWidth = width + "px";
        this.html.style.maxWidth = width + "px";
    },

    /**
     * Button height
     *
     * @property height
     * @type Number
     * @default 16
     */
    _height: 16,

    getHeight: function () {
        "@photonui-update";
        return this._height;
    },

    setHeight: function (height) {
        this._height = height;
        this.html.style.height = height + "px";
        this.html.style.minHeight = height + "px";
        this.html.style.maxHeight = height + "px";
        this.html.style.lineHeight = height + "px";
    },

    /**
     * Icon widget name.
     *
     * @property iconName
     * @type String
     * @default: null
     */
    _iconName: null,

    getIconName: function () {
        return this._iconName;
    },

    setIconName: function (iconName) {
        this._iconName = iconName;
        Helpers.cleanNode(this.__html.div);
        if (this._iconName) {
            this.__html.div.appendChild(this.icon.html);
            this.iconVisible = true;
        }
    },

    /**
     * Icon widget.
     *
     * @property icon
     * @type BaseIcon
     * @default: null
     */
    getIcon: function () {
        return Widget.getWidget(this._iconName);
    },

    setIcon: function (icon) {
        if (icon instanceof BaseIcon) {
            this.iconName = icon.name;
            return;
        }
        this.iconName = null;
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
        return this.__html.div;
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
        this.__html.div = document.createElement("div");
        this.__html.div.className = "photonui-widget photonui-iconbutton";
        this.__html.div.className += " photonui-widget-fixed-width photonui-widget-fixed-height";
        this.__html.div.tabIndex = "0";
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the button is clicked.
     *
     * @method __onButtonClicked
     * @private
     * @param event
     */
    __onButtonClicked: function (event) {
        this._callCallbacks("click", [event]);
    }

});

module.exports = IconButton;
