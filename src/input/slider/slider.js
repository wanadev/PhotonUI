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

var Helpers = require("../../helpers.js");
var NumericField = require("../field/numericfield.js");

/**
 * Slider
 *
 * @class Slider
 * @constructor
 * @extends photonui.NumericField
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var Slider = NumericField.$extend({

    // Constructor
    __init__: function(params) {
        this.$super(params);

        this.inputId = this.name + "-field";
        this.__html.field.id = this.inputId;

        this._updateProperties(["fieldVisible"]);

        this._bindEvent("slider-mousedown", this.__html.slider, "mousedown", this.__onSliderMouseDown.bind(this));
        this._bindEvent("slider-keydown", this.__html.slider, "keydown", this.__onSliderKeyDown.bind(this));
        this._bindEvent("slider-mousewheel", this.__html.slider, "mousewheel", this.__onSliderMouseWheel.bind(this));
        this._bindEvent("slider-mousewheel-firefox", this.__html.slider, "DOMMouseScroll", this.__onSliderMouseWheel.bind(this));
        this._bindEvent("field-contextmenu", this.__html.field, "contextmenu", this.__onFieldContextMenu.bind(this));
    },


    // Default value (!= NumericField)
    _min: 0,
    _max: 100,
    _decimalDigits: 0,


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * Define if the numeric field should be displayed.
     *
     * @property fieldVisible
     * @type Boolean
     * @default: true
     */
    _fieldVisible: true,

    isFieldVisible: function() {
        return this._fieldVisible;
    },

    setFieldVisible: function(fieldVisible) {
        this._fieldVisible = fieldVisible;

        if (fieldVisible) {
            this.__html.field.style.display = "";
            this.removeClass("photonui-slider-nofield");
        }
        else {
            this.__html.field.style.display = "none";
            this.addClass("photonui-slider-nofield");
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
        // Hack: force grip position after insertion into the DOM...
        setTimeout(function() {
            this.value = this.value;
        }.bind(this), .01);

        return this.__html.outer;
    },

    // Update the slider when setting the value...
    setValue: function(value) {
        this.$super(value);

        var v = value - this.min;
        var m = this.max - this.min;
        var p = Math.min(Math.max(v/m, 0), 1);
        var w = this.__html.slider.offsetWidth - this.__html.grip.offsetWidth - 4;
        this.__html.grip.style.left = Math.floor(p*w) + 2 + "px";
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
        this.$super();

        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-slider";

        this.__html.slider = document.createElement("div");
        this.__html.slider.className = "photonui-slider-slider";
        this.__html.slider.tabIndex = 0;
        this.__html.outer.appendChild(this.__html.slider);

        this.__html.grip = document.createElement("div");
        this.__html.grip.className = "photonui-slider-grip";
        this.__html.slider.appendChild(this.__html.grip);

        this.__html.outer.appendChild(this.__html.field)
    },

    /**
     * Update the value form a mouse event occured on the slider.
     *
     * @method _updateFromMouseEvent
     * @private
     * @param event
     */
    _updateFromMouseEvent: function(event) {
        var wx = Helpers.getAbsolutePosition(this.__html.slider).x;
        var gw = this.__html.grip.offsetWidth;
        var x = Math.round(event.pageX - wx - gw/2);
        var w = this.__html.slider.offsetWidth - gw - 3;
        var v = (this.max - this.min) * x / w + this.min;
        this.value = Math.round(v/this.step) * this.step;
        this._callCallbacks("value-changed", [this.value]);
    },


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    /**
     * @method __onSliderMouseDown
     * @private
     * @param event
     */
    __onSliderMouseDown: function(event) {
        this._updateFromMouseEvent(event);
        this._bindEvent("slider-mousemove", document, "mousemove", this.__onSliderMouseMove.bind(this));
        this._bindEvent("slider-mouseup", document, "mouseup", this.__onSliderMouseUp.bind(this));
    },

    /**
     * @method __onSliderMouseMove
     * @private
     * @param event
     */
    __onSliderMouseMove: function(event) {
        this._updateFromMouseEvent(event);
    },

    /**
     * @method __onSliderMouseUp
     * @private
     * @param event
     */
    __onSliderMouseUp: function(event) {
        this._unbindEvent("slider-mousemove");
        this._unbindEvent("slider-mouseup");
        this._updateFromMouseEvent(event);
    },

    /*
     * @method __onSliderKeyPress
     * @private
     * @param event
     */
    __onSliderKeyDown: function(event) {
        if (event.keyCode == 38 || event.keyCode == 39) {  // Up, Right
            this.value += this.step;
            this._callCallbacks("value-changed", [this.value]);
        }
        else if (event.keyCode == 40 || event.keyCode == 37) {  // Down, Left
            this.value -= this.step;
            this._callCallbacks("value-changed", [this.value]);
        }
    },

    /**
     * @method __onSliderMouseWheel
     * @private
     * @param event
     */
    __onSliderMouseWheel: function(event) {
        var wheelDelta = null;

        // Webkit
        if (event.wheelDeltaY != undefined) {
            wheelDelta = event.wheelDeltaY;
        }
        // MSIE
        if (event.wheelDelta != undefined) {
            wheelDelta = event.wheelDelta;
        }
        // Firefox
        if (event.axis != undefined && event.detail != undefined) {
            if (event.axis == 2) { // Y
                wheelDelta = - event.detail;
            }
        }

        if (wheelDelta != null) {
            if (wheelDelta >= 0) {
                this.value += this.step;
            }
            else {
                this.value -= this.step;
            }
            event.preventDefault();
            event.stopPropagation();
        }
        this._callCallbacks("value-changed", [this.value]);
    },

    /**
     * Called when the context menu should be displayed.
     *
     * @method __onContextMenu
     * @private
     * @param event
     */
    __onContextMenu: function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.contextMenuName) {
            this.contextMenu.popupXY(event.pageX, event.pageY);
        }
    },

    /**
     * @method __onFieldContextMenu
     * @private
     * @param event
     */
    __onFieldContextMenu: function(event) {
        event.stopPropagation();
    }
});

module.exports = Slider;
