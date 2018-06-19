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
 * @submodule Interactive
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var BaseIcon = require("../visual/baseicon.js");
var Image = require("../visual/image.js");

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
var Button = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["click"]);
        this.$super(params);

        // Bind js events
        this._bindEvent("click", this.__html.button, "click", this.__onButtonClicked.bind(this));

        // Update properties
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

    getText: function () {
        "@photonui-update";
        return this._text;
    },

    setText: function (text) {
        this._text = text;
        Helpers.cleanNode(this.__html.text);
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

    isTextVisible: function () {
        return this._textVisible;
    },

    setTextVisible: function (textVisible) {
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

    getLeftIconName: function () {
        "@photonui-update";
        return this._leftIconName;
    },

    setLeftIconName: function (leftIconName) {
        this._leftIconName = leftIconName;
        Helpers.cleanNode(this.__html.leftIcon);
        if (this._leftIconName) {
            this.__html.leftIcon.appendChild(this.leftIcon.html);
            this.leftIconVisible = true;
        }
    },

    /**
     * Left icon widget.
     *
     * @property leftIcon
     * @type BaseIcon
     * @default: null
     */
    getLeftIcon: function () {
        return Widget.getWidget(this._leftIconName);
    },

    setLeftIcon: function (leftIcon) {
        if (leftIcon instanceof BaseIcon || icon instanceof Image) {
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

    isLeftIconVisible: function () {
        return this._leftIconVisible;
    },

    setLeftIconVisible: function (leftIconVisible) {
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

    getRightIconName: function () {
        "@photonui-update";
        return this._rightIconName;
    },

    setRightIconName: function (rightIconName) {
        this._rightIconName = rightIconName;
        Helpers.cleanNode(this.__html.rightIcon);
        if (this._rightIconName) {
            this.__html.rightIcon.appendChild(this.rightIcon.html);
            this.rightIconVisible = true;
        }
    },

    /**
     * Right icon widget.
     *
     * @property rightIcon
     * @type BaseIcon
     * @default: null
     */
    getRightIcon: function () {
        return Widget.getWidget(this._rightIconName);
    },

    setRightIcon: function (rightIcon) {
        if (rightIcon instanceof BaseIcon || icon instanceof Image) {
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

    isRightIconVisible: function () {
        return this._rightIconVisible;
    },

    setRightIconVisible: function (rightIconVisible) {
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

    getAppearance: function () {
        return this._appearance;
    },

    setAppearance: function (appearance) {
        this._appearance = appearance;

        if (appearance == "flat") {
            this.addClass("photonui-button-appearance-flat");
        } else {
            this.removeClass("photonui-button-appearance-flat");
        }
    },

    /**
     * Button's color.
     *
     * The available colors depends on the theme. Particle, the
     * default PhotonUI theme provides the following colors:
     *
     *   * `blue`
     *   * `red`
     *   * `yellow`
     *   * `green`
     *   * null (default)
     *
     * @property buttonColor
     * @type string
     * @default null
     */
    _buttonColor: null,

    getButtonColor: function () {
        return this._buttonColor;
    },

    setButtonColor: function (buttonColor) {
        if (this._buttonColor) {
            this.__html.button.classList.remove("photonui-button-color-" + this._buttonColor);
        }
        this._buttonColor = buttonColor;
        if (buttonColor) {
            this.__html.button.classList.add("photonui-button-color-" + this._buttonColor);
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
    getHtml: function () {
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
    _update: function () {
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
    _buildHtml: function () {
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
    __onButtonClicked: function (event) {
        this._callCallbacks("click", [event]);
    }
});

// Button mixin for ToggleButton
Button._buttonMixin = {
    // Properties
    _text:               Button.prototype._text,
    getText:             Button.prototype.getText,
    setText:             Button.prototype.setText,
    _textVisible:        Button.prototype._textVisible,
    isTextVisible:       Button.prototype.isTextVisible,
    setTextVisible:      Button.prototype.setTextVisible,
    _leftIconName:       Button.prototype._leftIconName,
    getLeftIconName:     Button.prototype.getLeftIconName,
    setLeftIconName:     Button.prototype.setLeftIconName,
    getLeftIcon:         Button.prototype.getLeftIcon,
    setLeftIcon:         Button.prototype.setLeftIcon,
    _leftIconVisible:    Button.prototype._leftIconVisible,
    isLeftIconVisible:   Button.prototype.isLeftIconVisible,
    setLeftIconVisible:  Button.prototype.setLeftIconVisible,
    _rightIconName:      Button.prototype._rightIconName,
    getRightIconName:    Button.prototype.getRightIconName,
    setRightIconName:    Button.prototype.setRightIconName,
    getRightIcon:        Button.prototype.getRightIcon,
    setRightIcon:        Button.prototype.setRightIcon,
    _rightIconVisible:   Button.prototype._rightIconVisible,
    isRightIconVisible:  Button.prototype.isRightIconVisible,
    setRightIconVisible: Button.prototype.setRightIconVisible,
    _appearance:         Button.prototype._appearance,
    getAppearance:       Button.prototype.getAppearance,
    setAppearance:       Button.prototype.setAppearance,
    _buttonColor:        Button.prototype._buttonColor,
    getButtonColor:      Button.prototype.getButtonColor,
    setButtonColor:      Button.prototype.setButtonColor,
    // Private methods
    _update:             Button.prototype._update,
    _buildButtonHtml:    Button.prototype._buildHtml,
    // Internal Events Callbacks
    __onButtonClicked:   Button.prototype.__onButtonClicked
};

module.exports = Button;
