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
 * Base class for fields.
 *
 * wEvents:
 *
 *   * value-changed:
 *     - description: called when the value was modified.
 *     - callback:    function(widget, value)
 *
 *   * keydown:
 *     - description: called when a key is pressed.
 *     - callback:    function(widget, event)
 *
 *   * keyup:
 *     - description: called when a key is released.
 *     - callback:    function(widget, event)
 *
 *   * keypress:
 *     - description: called just before the insertion of a char.
 *     - callback:    function(widget, event)
 *
 *   * selection-changed:
 *     - description: called when the selection was changed.
 *     - callback:    function(widget, selectionStart, selectionEnd, selectedText, event)
 *
 * @class Field
 * @constructor
 * @extends photonui.Widget
 */
photonui.Field = photonui.Widget.$extend({

    // Constructor
    __init__: function(params) {
        this._registerWEvents([
            "value-changed", "keydown", "keyup", "keypress",
            "selection-changed"
        ]);
        this.$super(params);
        this._updateProperties(["value", "placeholder"]);
        this.__html.field.name = this.name;
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The field value.
     *
     * @property value
     * @type String (maybe)
     * @default ""
     */
    getValue: function() {
        return this.__html.field.value;
    },

    setValue: function(value) {
        this.__html.field.value = value;
    },

    /**
     * The placeholder displayed if the field is empty.
     *
     * @property Placeholder
     * @type String
     * @default ""
     */
    _placeholder: "",

    getPlaceholder: function() {
        return this._placeholder;
    },

    setPlaceholder: function(placeholder) {
        this._placeholder = placeholder;
        this.__html.field.placeholder = placeholder;
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
        return this.__html.field;
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Private methods ======


    /**
     * Bind Field events.
     *
     * @method _bindFieldEvents
     * @private
     */
    _bindFieldEvents: function() {
        this._bindEvent("value-changed", this.__html.field, "change", function(event) {
            this._callCallbacks("value-changed", [this.getValue()]);
        }.bind(this));

        this._bindEvent("keydown", this.__html.field, "keydown", function(event) {
            this._callCallbacks("keydown", [event]);
        }.bind(this));

        this._bindEvent("keyup", this.__html.field, "keyup", function(event) {
            this._callCallbacks("keyup", [event]);
        }.bind(this));

        this._bindEvent("keypress", this.__html.field, "keypress", function(event) {
            this._callCallbacks("keypress", [event]);
        }.bind(this));

        this._bindEvent("selection-changed", this.__html.field, "select", function(event) {
            this._callCallbacks("selection-changed", [
                this.__html.field.selectionStart,
                this.__html.field.selectionEnd,
                ("" + this.getValue()).substring(this.__html.field.selectionStart, this.__html.field.selectionEnd),
                event]);
        }.bind(this));
    },


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    /**
     * Called when the context menu should be displayed.
     *
     * @method __onContextMenu
     * @private
     * @param event
     */
    __onContextMenu: function(event) {
        event.stopPropagation();  // Enable context menu on fields
    }
});
