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
 * Authored by: Clément LEVASSEUR <https://github.com/clementlevasseur>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Visual
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Image.
 *
 * @class Image
 * @constructor
 * @extends photonui.Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var Image_ = Widget.$extend({

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======

    /**
     * The image URL.
     *
     * @property url
     * @type String
     * @default ""
     */
    _url: "",

    getUrl: function() {
        return this._url;
    },

    setUrl: function(url) {
        this._url = url;
        this.__html.image.src = url;
    },

    /**
     * The image width (null = auto).
     *
     * @property width
     * @type Number
     * @default null
     */
    _width: null,

    getWidth: function() {
        return this._width;
    },

    setWidth: function(width) {
        if (width !== null) {
            this._width = width;
            this.__html.image.width = width;
        } else {
            this.__html.image.width = '';
        }
    },

    /**
     * The image height (null = auto).
     *
     * @property height
     * @type Number
     * @default null
     */
    _height: null,

    getHeight: function() {
        return this._height;
    },

    setHeight: function(height) {
        if (height !== null) {
            this._height = height;
            this.__html.image.height = height;
        } else {
            this.__html.image.height = '';
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
    _buildHtml: function() {
        this.__html.div = document.createElement("div");
        this.__html.div.className = "photonui-widget photonui-image";

        this.__html.image = document.createElement('img');
        this.__html.div.appendChild(this.__html.image);
    }

});

module.exports = Image_;
