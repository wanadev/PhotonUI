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


var photonui = photonui || {};


/**
 * Checkbox.
 *
 * wEvents:
 *
 *   * value-changed:
 *     - description: called when the value was modified.
 *     - callback:    function(widget, value)
 *
 * @class CheckBox
 * @constructor
 * @extends photonui.Widget
 */
photonui.CheckBox = photonui.Widget.$extend({

    // Constructor
    __init__: function(params) {
        this._registerWEvents(["value-changed", "click"]);
        this.$super(params);
        this.inputId = this.name + "-input";
        this._bindEvent("value-changed", this.__html.checkbox, "change", this.__onChange.bind(this));
        this._bindEvent("span-click", this.__html.span, "click", this.__onSpanClick.bind(this));
        this._bindEvent("checkbox-click", this.__html.checkbox, "click", this.__onCheckboxClick.bind(this));
        this._bindEvent("span-keypress", this.__html.span, "keypress", this.__onSpanKeypress.bind(this));
        this.__html.checkbox.name = this.name;
        this.__html.checkbox.id = this.inputId;
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The input value.
     *
     * @property value
     * @type Boolean
     * @default false
     */
    getValue: function() {
        return this.__html.checkbox.checked;
    },

    setValue: function(value) {
        this.__html.checkbox.checked = value;
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
        this.__html.outer.className = "photonui-widget photonui-checkbox";

        this.__html.checkbox = document.createElement("input");
        this.__html.checkbox.type = "checkbox";
        this.__html.outer.appendChild(this.__html.checkbox);

        this.__html.span = document.createElement("span");
        this.__html.span.tabIndex = "0";
        this.__html.outer.appendChild(this.__html.span);
    },


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    /**
     * @method __onChange
     * @private
     * @param event
     */
    __onChange: function(event) {
        this._callCallbacks("value-changed", [this.value]);
        // Focus the span if the real checkbox is hidden (happen when a label is clicked).
        if (window.getComputedStyle(this.__html.checkbox).display == "none") {
            this.__html.span.focus();
        }
    },

    /**
     * @method __onSpanClick
     * @private
     * @param event
     */
    __onSpanClick: function(event) {
        this.value = !this.value;
        this._callCallbacks("value-changed", [this.value]);
        this._callCallbacks("click", [event]);
    },

    /**
     * @method __onCheckboxClick
     * @private
     * @param event
     */
    __onCheckboxClick: function(event) {
        this._callCallbacks("click", [event]);
    },

    /**
     * @method __onSpanKeyPress
     * @private
     * @param event
     */
    __onSpanKeypress: function(event) {
        if (event.charCode == 32 || event.keyCode == 13) {
            this.value = !this.value;
            this._callCallbacks("value-changed", [this.value]);
        }
    }
});
