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

var Container = require("./container.js");
var numberToCssSize = require("../helpers.js").numberToCssSize;

/**
 * Viewport.
 *
 * @class Viewport
 * @constructor
 * @extends photonui.Container
 */
var Viewport = Container.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties([
            "padding", "verticalScrollbar", "horizontalScrollbar",
            "minWidth", "maxWidth", "width",
            "minHeight", "maxHeight", "height"
        ]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Window container node padding.
     *
     * @property padding
     * @type Number
     * @default 0
     */
    _padding: 0,

    getPadding: function () {
        return this._padding;
    },

    setPadding: function (padding) {
        this._padding = padding;
        this.containerNode.style.padding = padding + "px";
    },

    /**
     * Visibility of the vertical scrollbar.
     *
     *   * `true`: displayed,
     *   * `false`: hidden,
     *   * `null`: auto.
     *
     * @property verticalScrollbar
     * @type Boolean
     * @default null
     */
    _verticalScrollbar: null,

    getVerticalScrollbar: function () {
        return this._verticalScrollbar;
    },

    setVerticalScrollbar: function (visibility) {
        this._verticalScrollbar = visibility;
        if (visibility === true) {
            this.__html.viewport.style.overflowY = "scroll";
        } else if (visibility === false) {
            this.__html.viewport.style.overflowY = "hidden";
        } else {
            this.__html.viewport.style.overflowY = "auto";
        }
    },

    /**
     * Visibility of the horizontal scrollbar.
     *
     *   * `true`: displayed,
     *   * `false`: hidden,
     *   * `null`: auto.
     *
     * @property horizontalScrollbar
     * @type Boolean
     * @default null
     */
    _horizontalScrollbar: null,

    getHorizontalScrollbar: function () {
        return this._horizontalScrollbar;
    },

    setHorizontalScrollbar: function (visibility) {
        this._horizontalScrollbar = visibility;
        if (visibility === true) {
            this.__html.viewport.style.overflowX = "scroll";
        } else if (visibility === false) {
            this.__html.viewport.style.overflowX = "hidden";
        } else {
            this.__html.viewport.style.overflowX = "auto";
        }
    },

    /**
     * Minimum width.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent width
     *     * null: no minimum width
     *
     * @property minWidth
     * @type Number
     * @default null
     */
    _minWidth: null,

    getMinWidth: function () {
        return this._minWidth;
    },

    setMinWidth: function (minWidth) {
        this._minWidth = minWidth;
        this.__html.viewport.style.minWidth = numberToCssSize(minWidth, null, 0);
    },

    /**
     * Maximum width.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent width
     *     * null: no maximum width
     *
     * @property maxWidth
     * @type Number
     * @default null
     */
    _maxWidth: null,

    getMaxWidth: function () {
        return this._maxWidth;
    },

    setMaxWidth: function (maxWidth) {
        this._maxWidth = maxWidth;
        this.__html.viewport.style.maxWidth = numberToCssSize(maxWidth, null, Infinity);
    },

    /**
     * Width.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent width
     *     * null: auto
     *
     * @property width
     * @type Number
     * @default Infinity
     */
    _width: Infinity,

    getWidth: function () {
        return this._width;
    },

    setWidth: function (width) {
        this._width = width;
        this.__html.viewport.style.width = numberToCssSize(width, null);
    },

    /**
     * Minimum height.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent height
     *     * null: no minimum height
     *
     * @property minHeight
     * @type Number
     * @default null
     */
    _minHeight: null,

    getMinHeight: function () {
        return this._minHeight;
    },

    setMinHeight: function (minHeight) {
        this._minHeight = minHeight;
        this.__html.viewport.style.minHeight = numberToCssSize(minHeight, null, 0);
    },

    /**
     * Maximum height.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent height
     *     * null: no maximum height
     *
     * @property maxHeight
     * @type Number
     * @default null
     */
    _maxHeight: null,

    getMaxHeight: function () {
        return this._maxHeight;
    },

    setMaxHeight: function (maxHeight) {
        this._maxHeight = maxHeight;
        this.__html.viewport.style.maxHeight = numberToCssSize(maxHeight, null, Infinity);
    },

    /**
     * Height.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent height
     *     * null: auto
     *
     * @property height
     * @type Number
     * @default Infinity
     */
    _height: Infinity,

    getHeight: function () {
        return this._height;
    },

    setHeight: function (height) {
        this._height = height;
        this.__html.viewport.style.height = numberToCssSize(height, null);
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
        setTimeout(this._sizingHack.bind(this), 10);
        return this.__html.viewport;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.__html.viewport;
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
        this.__html.viewport = document.createElement("div");
        this.__html.viewport.className = "photonui-widget photonui-viewport photonui-container";
    },

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        if (visibility) this._sizingHack();
        this.$super(visibility);
    },

    /**
     * HACK: set the right height.
     *
     * @method _sizingHack
     * @private
     */
    _sizingHack: function () {
        if (this.height !== Infinity) {
            return;
        }
        if (this.visible && this.__html.viewport.parentNode) {
            var node = this.__html.viewport;
            var height = 0;

            this.__html.viewport.style.display = "none";

            while (node = node.parentNode) {  // jshint ignore:line
                if (!node) break;
                if (node.offsetHeight > 0) {
                    height = node.offsetHeight;
                    var style = getComputedStyle(node);
                    height -= parseFloat(style.paddingTop);
                    height -= parseFloat(style.paddingBottom);
                    height -= parseFloat(style.borderTopWidth);
                    height -= parseFloat(style.borderBottomWidth);
                    break;
                }
            }

            if (this.maxHeight !== null) height = Math.min(this.maxHeight, height);
            if (this.minHeight !== null) height = Math.max(this.minHeight, height);
            this.__html.viewport.style.height = height + "px";
            this.__html.viewport.style.display = "";
        }
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

module.exports = Viewport;
