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
 
var Helpers = require("../../helpers.js");
var Widget = require("../../widget.js");
var Window = require("./window.js");

var _windowList = [];

/**
 * Dialog Window.
 *
 * @class Dialog
 * @constructor
 * @extends photonui.Window
 */
var Dialog = Window.$extend({

    // Constructor
    __init__: function(params) {
        this._buttonsNames = [];
        this.$super(params);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * Dialog button widgets name.
     *
     * @property buttonsNames
     * @type Array
     * @default []
     */
    _buttonsNames: [],

    getButtonsNames: function() {
        return this._buttonsNames;
    },

    setButtonsNames: function(buttonsNames) {
        this._buttonsNames = buttonsNames;
        this._updateButtons();
    },

    /**
     * Dialog buttons widgets.
     *
     * @property buttons
     * @type Array
     * @default []
     */
    getButtons: function() {
        var buttons = [];
        for (var i=0 ; i<this._buttonsNames.length ; i++) {
            buttons.push(Widget.getWidget(this._buttonsNames[i]));
        }
        return buttons;
    },

    setButtons: function(buttons) {
        var buttonsNames = [];
        for (var i=0 ; i<buttons.length ; i++) {
            if (buttons[i] instanceof Widget) {
                buttonsNames.push(buttons[i].name);
            }
        }
        this.buttonsNames = buttonsNames;
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======


    /**
     * Add a button to the dialog.
     *
     * @method addButton
     * @param {photonui.Widget} widget The button to add.
     */
    addButton: function(widget) {
        this._childrenNames.push(widget.name);
        this._updateButtons();
    },

    /**
     * Remove a button from the dialog.
     *
     * @method removeButton
     * @param {photonui.Widget} widget The button to remove.
     */
    removeButton: function(widget) {
        var index = this._buttonsNames.indexOf(widget.name);
        if (index >= 0) {
            this._buttonsNames.splice(widget.name, 1);
        }
        this._updateButtons();
    },


    // ====== Private methods ======


    /**
     * Update dialog buttons.
     *
     * @method _updateButtons
     * @private
     */
    _updateButtons: function() {
        Helpers.cleanNode(this.__html.buttons);
        var buttons = this.buttons;
        for (var i=buttons.length-1 ; i>=0 ; i--) {
            this.__html.buttons.appendChild(buttons[i].html);
        }
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.$super();
        this.addClass("photonui-dialog");

        this.__html.buttons = document.createElement("div");
        this.__html.buttons.className = "photonui-dialog-buttons";
        this.__html["window"].appendChild(this.__html.buttons);
    }
});

module.exports = Dialog;
