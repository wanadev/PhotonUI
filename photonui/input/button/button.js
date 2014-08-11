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
 * Button.
 *
 * wEvents:
 *
 *   * click:
 *     - description: called when the button was clicked.
 *     - callback:    function(widget, event)
 *
 * @class Button
 * @constructor
 * @extends photonui.Widget
 */
photonui.Button = photonui.Widget.$extend({

    // Constructor
    __init__: function(params) {
        this._registerWEvents(["click"]);
        this.$super(params);

        // Bind js events
        this._bindEvent("click", this.__html.button, "click", this.__onButtonClicked.bind(this));

        // Update properties
        this._updateProperties(["text", "leftIconName", "rightIconName"]);
        this._update();
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The button text.
     *
     * @property text
     * @type String
     * @default "Button"
     */
    _text: "Button",

    getText: function() {
       return this._text;
    },

    setText: function(text) {
        this._text = text;
        photonui.Helpers.cleanNode(this.__html.text);
        this.__html.text.appendChild(document.createTextNode(text));
    },

    /**
     * Define if the button text is displayed or hidden.
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
        this._update();
    },

    /**
     * Left icon widget name.
     *
     * @property leftIconName
     * @type String
     * @default: null
     */
    _leftIconName: null,

    getLeftIconName: function() {
        return this._leftIconName;
    },

    setLeftIconName: function(leftIconName) {
        this._leftIconName = leftIconName;
        photonui.Helpers.cleanNode(this.__html.leftIcon);
        if (this._leftIconName) {
            this.__html.leftIcon.appendChild(this.leftIcon.html);
            this.leftIconVisible = true;
        }
    },

    /**
     * Left icon widget.
     *
     * @property leftIcon
     * @type photonui.BaseIcon
     * @default: null
     */
    getLeftIcon: function() {
        return photonui.getWidget(this._leftIconName);
    },

    setLeftIcon: function(leftIcon) {
        if (leftIcon instanceof photonui.BaseIcon) {
            this.leftIconName = leftIcon.name;
            return;
        }
        this.leftIconName = null;
    },

    /**
     * Define if the left icon is displayed or hidden.
     *
     * @property leftIconVisible
     * @type Boolean
     * @default true
     */
    _leftIconVisible: true,

    isLeftIconVisible: function() {
        return this._leftIconVisible;
    },

    setLeftIconVisible: function(leftIconVisible) {
        this._leftIconVisible = leftIconVisible;
        this._update();
    },

    /**
     * Right icon widget name.
     *
     * @property rightIconName
     * @type String
     * @default: null
     */
    _rightIconName: null,

    getRightIconName: function() {
        return this._rightIconName;
    },

    setRightIconName: function(rightIconName) {
        this._rightIconName = rightIconName;
        photonui.Helpers.cleanNode(this.__html.rightIcon);
        if (this._rightIconName) {
            this.__html.rightIcon.appendChild(this.rightIcon.html);
            this.rightIconVisible = true;
        }
    },

    /**
     * Right icon widget.
     *
     * @property rightIcon
     * @type photonui.BaseIcon
     * @default: null
     */
    getRightIcon: function() {
        return photonui.getWidget(this._rightIconName);
    },

    setRightIcon: function(rightIcon) {
        if (rightIcon instanceof photonui.BaseIcon) {
            this.rightIconName = rightIcon.name;
            return;
        }
        this.rightIconName = null;
    },

    /**
     * Define if the right icon is displayed or hidden.
     *
     * @property rightIconVisible
     * @type Boolean
     * @default true
     */
    _rightIconVisible: true,

    isRightIconVisible: function() {
        return this._rightIconVisible;
    },

    setRightIconVisible: function(rightIconVisible) {
        this._rightIconVisible = rightIconVisible;
        this._update();
    },

    /**
     * Define the button appearance.
     *
     *   * `normal`
     *   * `flat`
     *
     * @property appearance
     * @type String
     * @default "normal"
     */
    _appearance: "normal",

    getAppearance: function() {
        return this._appearance;
    },

    setAppearance: function(appearance) {
        this._appearance = appearance;

        if (appearance == "flat") {
            this.addClass("photonui-button-appearance-flat");
        }
        else {
            this.removeClass("photonui-button-appearance-flat");
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
        return this.__html.button;
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Private methods ======


    /**
     * Update the button content
     *
     * @method _update
     * @private
     */
    _update: function() {
        if (this.__html.leftIcon.parentNode == this.__html.button) {
            this.__html.button.removeChild(this.__html.leftIcon);
        }
        if (this.__html.text.parentNode == this.__html.button) {
            this.__html.button.removeChild(this.__html.text);
        }
        if (this.__html.rightIcon.parentNode == this.__html.button) {
            this.__html.button.removeChild(this.__html.rightIcon);
        }

        if (this.leftIconName && this.leftIconVisible) {
            this.__html.button.appendChild(this.__html.leftIcon);
        }

        if (this.text && this.textVisible) {
            this.__html.button.appendChild(this.__html.text);
        }

        if (this.rightIconName && this.rightIconVisible) {
            this.__html.button.appendChild(this.__html.rightIcon);
        }
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.__html.button = document.createElement("button");
        this.__html.button.className = "photonui-widget photonui-button";

        this.__html.leftIcon = document.createElement("span");
        this.__html.leftIcon.className = "photonui-button-icon";
        this.__html.button.appendChild(this.__html.leftIcon);

        this.__html.text = document.createElement("span");
        this.__html.text.className = "photonui-button-text";
        this.__html.button.appendChild(this.__html.text);

        this.__html.rightIcon = document.createElement("span");
        this.__html.rightIcon.className = "photonui-button-icon";
        this.__html.button.appendChild(this.__html.rightIcon);
    },


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    /**
     * Called when the button is clicked.
     *
     * @method __onButtonClicked
     * @private
     * @param event
     */
    __onButtonClicked: function(event) {
        this._callCallbacks("click", [event]);
    }
});


// Button mixin for ToggleButton
var _buttonMixin = {
    // Properties
    _text:               photonui.Button.prototype._text,
    getText:             photonui.Button.prototype.getText,
    setText:             photonui.Button.prototype.setText,
    _textVisible:        photonui.Button.prototype._textVisible,
    isTextVisible:       photonui.Button.prototype.isTextVisible,
    setTextVisible:      photonui.Button.prototype.setTextVisible,
    _leftIconName:       photonui.Button.prototype._leftIconName,
    getLeftIconName:     photonui.Button.prototype.getLeftIconName,
    setLeftIconName:     photonui.Button.prototype.setLeftIconName,
    getLeftIcon:         photonui.Button.prototype.getLeftIcon,
    setLeftIcon:         photonui.Button.prototype.setLeftIcon,
    _leftIconVisible:    photonui.Button.prototype._leftIconVisible,
    isLeftIconVisible:   photonui.Button.prototype.isLeftIconVisible,
    setLeftIconVisible:  photonui.Button.prototype.setLeftIconVisible,
    _rightIconName:      photonui.Button.prototype._rightIconName,
    getRightIconName:    photonui.Button.prototype.getRightIconName,
    setRightIconName:    photonui.Button.prototype.setRightIconName,
    getRightIcon:        photonui.Button.prototype.getRightIcon,
    setRightIcon:        photonui.Button.prototype.setRightIcon,
    _rightIconVisible:   photonui.Button.prototype._rightIconVisible,
    isRightIconVisible:  photonui.Button.prototype.isRightIconVisible,
    setRightIconVisible: photonui.Button.prototype.setRightIconVisible,
    _appearance:         photonui.Button.prototype._appearance,
    getAppearance:       photonui.Button.prototype.getAppearance,
    setAppearance:       photonui.Button.prototype.setAppearance,
    // Private methods
    _update:             photonui.Button.prototype._update,
    _buildButtonHtml:    photonui.Button.prototype._buildHtml,
    // Internal Events Callbacks
    __onButtonClicked:   photonui.Button.prototype.__onButtonClicked
};
