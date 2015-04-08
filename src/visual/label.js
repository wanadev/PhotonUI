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
var Helpers = require("../helpers.js");

/**
 * Label.
 *
 * @class Label
 * @constructor
 * @extends photonui.Widget
 */
var Label = Widget.$extend({

    // Constructor
    __init__: function(params) {
        var params = params || {};
        params.layoutOptions = params.layoutOptions || {};
        if (params.layoutOptions.verticalExpansion === undefined) {
            params.layoutOptions.verticalExpansion = false;
        }
        this.$super(params);
        this._updateProperties(["text", "textAlign", "forInputName"]);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The label text.
     *
     * @property text
     * @type String
     * @default "Label"
     */
    _text: "Label",

    getText: function() {
        return this._text;
    },

    setText: function(text) {
        this._text = text;
        photonui.Helpers.cleanNode(this.__html.label);
        this.__html.label.appendChild(document.createTextNode(text));
    },

    /**
     * The text horizontal alignement.
     *
     *   * "left",
     *   * "center",
     *   * "right".
     *
     * @property textAlign
     * @type String
     * @default "left"
     */
    _textAlign: "left",

    getTextAlign: function() {
        return this._textAlign;
    },

    setTextAlign: function(textAlign) {
        if (textAlign != "left" && textAlign != "center" && textAlign != "right") {
            throw "Text alignement sould be 'left', 'center' or 'right'.";
        }
        this._textAlign = textAlign;
        this.__html.label.style.textAlign = textAlign;
    },

    /**
     * Link the label with the given input (Field, CheckBox,...) widget.
     *
     * @property forInputName
     * @type String
     * @default null
     */
    _forInputName: null,

    getForInputName: function() {
        return this._forInputName;
    },

    setForInputName: function(forInputName) {
        this._forInputName = forInputName;
        if (this._forInputName) {
            this.__html.label.setAttribute("for",
                    Helpers.escapeHtml(this.forInput.inputId || this.forInput.name)
            );
        }
    },

    /**
     * Link the label with the given input (Field, CheckBox,...) widget.
     *
     * @property forInput
     * @type photonui.Field, photonui.CheckBox
     * @default null
     */
    getForInput: function() {
        return Widget.getWidget(this.forInputName);
    },

    setForInput: function(forInput) {
        this.forInputName = forInput.name;
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
        return this.__html.label;
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
        this.__html.label = document.createElement("label");
        this.__html.label.className = "photonui-widget photonui-label";
    }
});

module.exports = Label;
