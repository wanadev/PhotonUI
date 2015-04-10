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
 * @submodule Input
 * @namespace photonui
 */

var CheckBox = require("./checkbox.js");
var Button = require("../button/button.js");

/**
 * Toogle Button.
 *
 * @class ToggleButton
 * @constructor
 * @extends photonui.CheckBox
 * @uses photonui.Button
 */
var ToggleButton = CheckBox.$extend({

    // Constructor
    __init__: function(params) {
        this._registerWEvents(["click"]);
        this.$super(params);
        this.__buttonInit();
        this.removeClass("photonui-checkbox");
        this.addClass("photonui-togglebutton");
    },

    // photonui.Button constructor (without the call to $super)
    __buttonInit: function() {
        // Bind js events
        this._bindEvent("click", this.__html.button, "click", this.__onButtonClicked.bind(this));

        // Update properties
        this._updateProperties(["text", "leftIconName", "rightIconName"]);
        this._update();
    },

    // Mixin
    __include__: [Button._buttonMixin],


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
        this.$super();
        this._buildButtonHtml();
        this.__html.outer.appendChild(this.__html.button);
        this.__html.outer.removeChild(this.__html.span);
        this.__html.span = this.__html.button;
    }
});

module.exports = ToggleButton;
