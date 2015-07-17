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
var Widget = require("../widget.js");

/**
 * Windows base class.
 *
 * wEvents:
 *
 *   * position-changed:
 *      - description: called when the widows is moved.
 *      - callback:    function(widget, x, y)
 *
 * @class BaseWindow
 * @constructor
 * @extends photonui.Container
 */
var BaseWindow = Container.$extend({

    // Constructor
    __init__: function(params) {
        this._registerWEvents(["position-changed"]);
        this.$super(params);

        // Windows are hidden by default
        params = params || {};
        if (params.visible === undefined) {
            this.visible = false;
        }

        // Insert the window in the DOM tree
        Widget.domInsert(this);

        // Update properties
        this._updateProperties([
            "position", "width", "height", "minWidth", "minHeight",
            "maxWidth", "maxHeight", "padding"
        ]);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * Window position.
     *
     *     {x: Number, y: Number}
     *
     * @property position
     * @type Object
     * @default {x: 0, y: 0}
     */
    getPosition: function() {
        if (this.visible && this.html.parentNode) {
            return this.absolutePosition;
        }
        return {x: this._x, y: this._y};
    },

    setPosition: function(x, y) {
        if (typeof(x) == "object" && y === undefined) {
            this.html.style.left = x.x + "px";
            this.html.style.top = x.y + "px";
            this._x = x.x;
            this._y = x.y;
        }
        else {
            if (typeof(x) == "number") {
                this.html.style.left = x + "px";
                this._x = x;
            }
            if (typeof(y) == "number") {
                this.html.style.top = y + "px";
                this._y = y;
            }
        }
        this._callCallbacks("position-changed", [this.x, this.y]);
    },

    /**
     * The X position of the Window.
     *
     * @property x
     * @type Number
     * @default 0
     */
    _x: 0,

    getX: function() {
        return this.position.x;
    },

    setX: function(x) {
        this.setPosition(x, null);
    },

    /**
     * The Y position of the Window.
     *
     * @property y
     * @type Number
     * @default 0
     */
    _y: 0,

    getY: function() {
        return this.position.y;
    },

    setY: function(y) {
        this.setPosition(null, y);
    },

    /**
     * Width of the container node.
     *
     * @property width
     * @type Number
     * @default: null (auto)
     */
    _width: null,

    getWidth: function() {
        if (this.visible && this.html.parenNode) {
            return this.containerNode.offsetWidth;
        }
        return this._width || 0;
    },

    setWidth: function(width) {
        this._width = width || null;
        if (this._width) {
            this.containerNode.style.width = width + "px";
        }
        else {
            this.containerNode.style.width = "auto";
        }
    },

    /**
     * Height of the container node.
     *
     * @property height
     * @type Number
     * @default: null (auto)
     */
    _height: null,

    getHeight: function() {
        if (this.visible && this.html.parenNode) {
            return this.containerNode.offsetHeight;
        }
        return this._height || 0;
    },

    setHeight: function(height) {
        this._height = height || null;
        if (this._height) {
            this.containerNode.style.height = height + "px";
        }
        else {
            this.containerNode.style.height = "auto";
        }
    },

    /**
     * Minimum width of the container node.
     *
     * @property minWidth
     * @type Number
     * @default: null (no minimum)
     */
    _minWidth: null,

    getMinWidth: function() {
        return this._minWidth;
    },

    setMinWidth: function(minWidth) {
        this._minWidth = minWidth || null;
        if (this._minWidth) {
            this.containerNode.style.minWidth = minWidth + "px";
        }
        else {
            this.containerNode.style.minWidth = "0";
        }
    },

    /**
     * Minimum height of the container node.
     *
     * @property minHeight
     * @type Number
     * @default: null (no minimum)
     */
    _minHeight: null,

    getMinHeight: function() {
        return this._minHeight;
    },

    setMinHeight: function(minHeight) {
        this._minHeight = minHeight || null;
        if (this._minHeight) {
            this.containerNode.style.minHeight = minHeight + "px";
        }
        else {
            this.containerNode.style.minHeight = "0";
        }
    },

    /**
     * Maximum width of the container node.
     *
     * @property maxWidth
     * @type Number
     * @default: null (no maximum)
     */
    _maxWidth: null,

    getMaxWidth: function() {
        return this._maxWidth;
    },

    setMaxWidth: function(maxWidth) {
        this._maxWidth = maxWidth || null;
        if (this._maxWidth) {
            this.containerNode.style.maxWidth = maxWidth + "px";
        }
        else {
            this.containerNode.style.maxWidth = "auto";
        }
    },

    /**
     * Maximum height of the container node.
     *
     * @property maxHeight
     * @type Number
     * @default: null (no maximum)
     */
    _maxHeight: null,

    getMaxHeight: function() {
        return this._maxHeight;
    },

    setMaxHeight: function(maxHeight) {
        this._maxHeight = maxHeight || null;
        if (this._maxHeight) {
            this.containerNode.style.maxHeight = maxHeight + "px";
        }
        else {
            this.containerNode.style.maxHeight = "auto";
        }
    },

    /**
     * Window container node padding.
     *
     * @property padding
     * @type Number
     * @default 0
     */
    _padding: 0,

    getPadding: function() {
        return this._padding;
    },

    setPadding: function(padding) {
        this._padding = padding;
        this.containerNode.style.padding = padding + "px";
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function() {
        return this.__html.window;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function() {
        return this.html;
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======


    /**
     * Center the window.
     *
     * @method center
     */
    center: function() {
        var node = Widget.e_parent || document.getElementsByTagName("body")[0];
        if (!node) return;
        this.setPosition(
                Math.max((node.offsetWidth - this.offsetWidth) / 2, 0)|0,
                Math.max((node.offsetHeight - this.offsetHeight) / 2, 0)|0
        );
    },


    // ====== Private methods ======


    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.__html.window = document.createElement("div");
        this.__html.window.className = "photonui-widget photonui-basewindow";
    }
});

module.exports = BaseWindow;
