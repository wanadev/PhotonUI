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
 * Viewport.
 *
 * @class Viewport
 * @constructor
 * @extends photonui.Container
 */
photonui.Viewport = photonui.Container.$extend({

    // Constructor
    __init__: function(params) {
        this.$super(params);
        this._updateProperties([
            "padding", "verticalScrollbar", "horizontalScrollbar"
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

    getPadding: function() {
        return this._padding;
    },

    setPadding: function(padding) {
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

    getVerticalScrollbar: function() {
        return this._verticalScrollbar;
    },

    setVerticalScrollbar: function(visibility) {
        this._verticalScrollbar = visibility;
        if (visibility === true) {
            this.__html.viewport.style.overflowY = "scroll";
        }
        else if (visibility === false) {
            this.__html.viewport.style.overflowY = "hidden";
        }
        else {
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

    getHorizontalScrollbar: function() {
        return this._horizontalScrollbar;
    },

    setHorizontalScrollbar: function(visibility) {
        this._horizontalScrollbar = visibility;
        if (visibility === true) {
            this.__html.viewport.style.overflowX = "scroll";
        }
        else if (visibility === false) {
            this.__html.viewport.style.overflowX = "hidden";
        }
        else {
            this.__html.viewport.style.overflowX = "auto";
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
    getHtml: function() {
        return this.__html.viewport;
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


    // ====== Private methods ======


    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.__html.viewport = document.createElement("div");
        this.__html.viewport.className = "photonui-widget photonui-viewport photonui-container";
    },
});
