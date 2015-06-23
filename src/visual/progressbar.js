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
 * @submodule Visual
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * ProgressBar.
 *
 * @class ProgressBar
 * @constructor
 * @extends photonui.Widget
 */
var ProgressBar = Widget.$extend({

    // Constructor
    __init__: function(params) {
        this.$super(params);
        this._updateProperties(["orientation", "value", "pulsate"]);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


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
     * The progression (form 0.00 to 1.00).
     *
     * @property value
     * @type Number
     * @default 0
     */
    _value: 0,

    getValue: function() {
        return this._value;
    },

    setValue: function(value) {
        this._value = Math.min(Math.max(value, 0), 1);
        if (this.orientation == "horizontal") {
            this.__html.bar.style.width = Math.floor(this.value * 100) + "%";
            this.__html.bar.style.height = "";
        }
        else {
            this.__html.bar.style.height = Math.floor(this.value * 100) + "%";
            this.__html.bar.style.width = "";
        }
        this.__html.textContent.innerHTML = Math.floor(this.value * 100) + " %";
    },

    /**
     * The progressbar orientation ("vertical" or "horizontal").
     *
     * @property orientation
     * @type String
     * @default "horizontal"
     */
    _orientation: "horizontal",

    getOrientation: function() {
        return this._orientation;
    },

    setOrientation: function(orientation) {
        if (orientation != "vertical" && orientation != "horizontal") {
            throw "Error: The orientation should be \"vertical\" or \"horizontal\".";
            return;
        }
        this._orientation = orientation;
        this.removeClass("photonui-progressbar-vertical");
        this.removeClass("photonui-progressbar-horizontal");
        this.addClass("photonui-progressbar-" + this.orientation);

        // Refresh the value...
        this.value = this.value;
    },

    /**
     * Enable or disable the progressbar pulsate mode.
     *
     * @property pulsate
     * @type Boolean
     * @default false
     */
    _pulsate: false,

    isPulsate: function() {
        return this._pulsate;
    },

    setPulsate: function(pulsate) {
        this._pulsate = pulsate;
        if (pulsate) {
            this.addClass("photonui-progressbar-pulsate");
            if (this.orientation == "horizontal") {
                this.__html.bar.style.width = "";
            }
            else {
                this.__html.bar.style.height = "";
            }
        }
        else {
            this.removeClass("photonui-progressbar-pulsate");
            this.value = this.value;
        }
    },

    /**
     * Display/hide the progression text.
     *
     * @property textVisible
     * @type Boolean
     * @default true
     */
    _textVisible: true,

    isTextVisible: function() {
        return this._textVisible;
    },

    setTextVisible: function(textVisible) {
        this._textVisible = textVisible;
        if (this.textVisible) {
            this.__html.text.style.display = "";
        }
        else {
            this.__html.text.style.display = "none";
        }
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-progressbar";

        // Hack: needed to help grid layout (<table>) to size properly its cells...
        this.__html.filldiv = document.createElement("div");
        this.__html.filldiv.className = "photonui-progressbar-fill";
        this.__html.filldiv.innerHTML = "xxxxxxxxxxx";
        this.__html.filldiv.style.opacity = 0;
        this.__html.filldiv.style.pointerEvents = "none";
        this.__html.outer.appendChild(this.__html.filldiv);

        this.__html.text = document.createElement("div");
        this.__html.text.className = "photonui-progressbar-text";
        this.__html.outer.appendChild(this.__html.text);

        this.__html.textContent = document.createElement("span");
        this.__html.text.appendChild(this.__html.textContent);

        this.__html.bar = document.createElement("div");
        this.__html.bar.className = "photonui-progressbar-bar";
        this.__html.outer.appendChild(this.__html.bar);
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
        // pass
    }
});

module.exports = ProgressBar;
