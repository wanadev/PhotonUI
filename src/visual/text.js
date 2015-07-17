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
 * @submodule Visual
 * @namespace photonui
 */

var Stone = require("stonejs");
var Widget = require("../widget.js");
var Helpers = require("../helpers.js");

/**
 * Text / Raw HTML widget
 *
 * @class Text
 * @constructor
 * @extends photonui.Widget
 */
var Text_ = Widget.$extend({


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======

    // meta for i18n
    _lastSet: "text",
    _raw: "",

    /**
     * Text
     *
     * @property text
     * @type String
     * @default ""
     */
    getText: function() {
        return this.__html.outer.textContent;
    },

    setText: function(text) {
        this._lastSet = "text";
        this._raw = text;
        Helpers.cleanNode(this.__html.outer);
        this.__html.outer.appendChild(document.createTextNode(text));
    },

    /**
     * Raw HTML.
     *
     * @property rawHtml
     * @type String
     * @default ""
     */
    getRawHtml: function() {
        return this.__html.outer.innerHTML;
    },

    setRawHtml: function(html) {
        this._lastSet = "rawHtml";
        this._raw = html;
        this.__html.outer.innerHTML = html;
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
    _buildHtml: function() {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-text";
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
    __onLocaleChanged: function() {
        this.$super();
        if (this._raw instanceof Stone.LazyString) {
            this[this._lastSet] = this._raw;
        }
    }
});

module.exports = Text_;
