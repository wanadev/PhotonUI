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
var Color = require("../nonvisual/color.js");
var MouseManager = require("../nonvisual/mousemanager.js");

/**
 * A Color Picker.
 *
 * wEvents:
 *
 *   * value-changed:
 *      - description: the selected color changed.
 *      - callback:    function(widget, color)
 *
 * @class ColorPicker
 * @constructor
 * @extends photonui.Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var ColorPicker = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["value-changed"]);
        this._color = new Color();
        this.__buffH = document.createElement("canvas");
        this.__buffH.width = 200;
        this.__buffH.height = 200;
        this.__buffSB = document.createElement("canvas");
        this.__buffSB.width = 100;
        this.__buffSB.height = 100;
        this.__buffSBmask = document.createElement("canvas");
        this.__buffSBmask.width = 100;
        this.__buffSBmask.height = 100;
        this.$super(params);
        this._updateH();
        this._updateSBmask();
        this._updateSB();
        this._updateCanvas();

        this.__mouseManager = new MouseManager(this.__html.canvas);

        this.__mouseManager.registerCallback("click", "mouse-move", this.__onMouseMove.bind(this));
        this.__mouseManager.registerCallback("mouse-down", "mouse-down", this.__onMouseDown.bind(this));
        this.__mouseManager.registerCallback("drag-start", "drag-start", this.__onDragStart.bind(this));

        // Bind js events
        this._bindEvent("value-changed", this.__html.preview, "change", this.__onValueChanged.bind(this));
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The value (color in rgb hexadecimal format (e.g. "#ff0000")).
     *
     * @property value
     * @type String
     */
    getValue: function () {
        return this.color.rgbHexString;
    },

    setValue: function (value) {
        this.color.fromString(value);
        this._updateSB();
        this._updateCanvas();
    },

    /**
     * The color.
     *
     * @property color
     * @type photonui.Color
     */
    _color: null,

    getColor: function () {
        "@photonui-update";
        return this._color;
    },

    setColor: function (color) {
        if (color instanceof Color) {
            if (this._color) {
                this._color.removeCallback("photonui.colorpicker.value-changed::" + this.name);
            }
            this._color = color;
            this._color.registerCallback("photonui.colorpicker.value-changed::" +
                                         this.name, "value-changed", function () {
                this._updateSB();
                this._updateCanvas();
            }.bind(this));
            this._updateSB();
            this._updateCanvas();
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
        return this.__html.outer;
    },

    // ====== Private properties ======

    /**
     * Buffer canvas for hue circle.
     *
     * @property __buffH
     * @private
     * @type HTMLCanvasElement
     */
    __buffH: null,

    /**
     * Buffer canvas for saturation/brightness square.
     *
     * @property __buffSB
     * @private
     * @type HTMLCanvasElement
     */
    __buffSB: null,

    /**
     * Mouse manager.
     *
     * @property __mouseManager
     * @private
     * @type photonui.MouseManager
     */
    __mouseManager: null,

    /**
     * FLAG: Disable SB square update.
     *
     * @property __disableSBUpdate
     * @private
     * @type Boolean
     * @default false
     */
    __disableSBUpdate: false,

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    destroy: function () {
        this.__mouseManager.destroy();
        this._color.removeCallback("photonui.colorpicker.value-changed::" + this.name);
        this.$super();
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-colorpicker";
        this.__html.canvas = document.createElement("canvas");
        this.__html.canvas.width = 200;
        this.__html.canvas.height = 200;
        this.__html.outer.appendChild(this.__html.canvas);

        this.__html.previewOuter = document.createElement("span");
        this.__html.previewOuter.className = "photonui-colorpicker-previewouter";
        this.__html.outer.appendChild(this.__html.previewOuter);

        this.__html.preview = document.createElement("input");
        this.__html.preview.type = "text";
        this.__html.preview.autocomplete = "off";
        this.__html.preview.spellcheck = false;
        this.__html.preview.className = "photonui-colorpicker-preview";
        this.__html.previewOuter.appendChild(this.__html.preview);
    },

    /**
     * Update hue circle
     *
     * @method _updateH
     * @private
     */
    _updateH: function () {
        var canvas = this.__buffH;
        var ctx = canvas.getContext("2d");
        var color = new Color();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0 ; i < 360 ; i++) {
            color.hue = 360 - i;
            ctx.beginPath();
            ctx.fillStyle = color.rgbHexString;
            ctx.arc(100, 100, 90, Math.PI * i / 180, Math.PI * ((i + 2) % 360) / 180, false);
            ctx.lineTo(100, 100);
            ctx.fill();
        }

        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.arc(100, 100, 73, 2 * Math.PI, false);
        ctx.globalCompositeOperation = "destination-out";
        ctx.fill();
    },

    /**
     * Update saturation/brightness square mask
     *
     * @method _updateSBmask
     * @private
     */
    _updateSBmask: function () {
        var canvas = this.__buffSBmask;
        var ctx = canvas.getContext("2d");
        var pix = ctx.getImageData(0, 0, canvas.width, canvas.height);

        var i = 0;
        var saturation = 0;
        var b = 0;
        var s = 0;
        for (b = 0 ; b < 100 ; b++) {
            for (s = 0 ; s < 100 ; s++) {
                i = 400 * b + 4 * s;

                // some magic here
                saturation = ((0.5 * (1 - s / 100) + 0.5) * (1 - b / 100) * 255) << 0;

                pix.data[i + 0] = saturation;
                pix.data[i + 1] = saturation;
                pix.data[i + 2] = saturation;

                // more magic
                pix.data[i + 3] = ((1 - (((s / 100)) * (1 - (b / 100)))) * 255) << 0;
            }
        }

        ctx.putImageData(pix, 0, 0);
    },

    /**
     * Update saturation/brightness square
     *
     * @method _updateSB
     * @private
     */
    _updateSB: function () {
        if (this.__disableSBUpdate) {
            return;
        }

        var canvas = this.__buffSB;
        var ctx = canvas.getContext("2d");

        var color = new Color({
            hue: this.color.hue,
            saturation: 100,
            brightness: 100
        });

        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // fill the whole canvas with the current color
        ctx.fillStyle = color.rgbHexString;
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();

        // draw a mask on it, it will do the trick
        ctx.drawImage(this.__buffSBmask, 0, 0);

        ctx.restore();
    },

    /**
     * Update the canvas
     *
     * @method _updateCanvas
     * @private
     */
    _updateCanvas: function () {
        var canvas = this.__html.canvas;
        var ctx = canvas.getContext("2d");

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(this.__buffH, 0, 0);
        ctx.drawImage(this.__buffSB, 50, 50);

        ctx.strokeStyle = "#fff";
        ctx.shadowColor = "rgba(0, 0, 0, .7)";
        ctx.shadowBlur = 3;
        ctx.lineWidth = 2;

        // Square cursor
        ctx.beginPath();
        ctx.arc(this.color.saturation + 50, 100 - this.color.brightness + 50, 6, 2 * Math.PI, false);
        ctx.stroke();

        // Square cursor
        ctx.translate(100, 100);
        ctx.rotate(-this.color.hue * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(81, 0, 6, 2 * Math.PI, false);
        ctx.stroke();

        ctx.restore();

        // Color preview
        this.__html.preview.style.backgroundColor = this.color.cssRgbaString;
        this.__html.preview.value = this.color.rgbHexString;
    },

    /**
     * Is the pointer on the SB Square?
     *
     * @method _pointerOnSquare
     * @private
     * @param mstate
     * @return {Boolean}
     */
    _pointerOnSquare: function (mstate) {
        return (mstate.x >= 50 && mstate.x <= 150 && mstate.y >= 50 && mstate.y <= 150);
    },

    /**
     * Is the pointer on the hue circle?
     *
     * @method _pointerOnCircle
     * @private
     * @param mstate
     * @return {Boolean}
     */
    _pointerOnCircle: function (mstate) {
        var dx = Math.abs(100 - mstate.x);
        var dy = Math.abs(100 - mstate.y);
        var h = Math.sqrt(dx * dx + dy * dy);
        return (h >= 74 && h <= 90);
    },

    /**
     * the angle of the pointer with the horizontal line that pass by the center of the hue circle.
     *
     * @method _pointerAngle
     * @private
     * @param mstate
     * @return {Number} the angle in degree.
     */
    _pointerAngle: function (mstate) {
        var dx = Math.abs(100 - mstate.x);
        var dy = Math.abs(100 - mstate.y);
        var angle = Math.atan(dy / dx) * 180 / Math.PI;

        if (mstate.x < 100 && mstate.y < 100) {
            angle = 180 - angle;
        } else if (mstate.x < 100 && mstate.y >= 100) {
            angle += 180;
        } else if (mstate.x >= 100 && mstate.y > 100) {
            angle = 360 - angle;
        }

        return angle | 0;
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onMouseMove
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onMouseMove: function (manager, mstate) {
        if (this._pointerOnSquare(mstate) || this._pointerOnCircle(mstate)) {
            this.__html.canvas.style.cursor = "crosshair";
        } else {
            this.__html.canvas.style.cursor = "default";
        }
    },

    /**
     * @method __onMouseDown
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onMouseDown: function (manager, mstate) {
        if (this._pointerOnSquare(mstate)) {
            this.__disableSBUpdate = true;
            this.color.saturation = mstate.x - 50;
            this.color.brightness = 150 - mstate.y;
            this.__disableSBUpdate = false;
            this._callCallbacks("value-changed", this.color);
        } else if (this._pointerOnCircle(mstate)) {
            this.color.hue = this._pointerAngle(mstate);
            this._callCallbacks("value-changed", this.color);
        }
    },

    /**
     * @method __onDragStart
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onDragStart: function (manager, mstate) {
        if (this._pointerOnSquare(mstate)) {
            this.__disableSBUpdate = true;
            this.__mouseManager.registerCallback("dragging", "dragging", this.__onDraggingSquare.bind(this));
            this.__mouseManager.registerCallback("drag-end", "drag-end", this.__onDragEnd.bind(this));
        } else if (this._pointerOnCircle(mstate)) {
            this.__mouseManager.registerCallback("dragging", "dragging", this.__onDraggingCircle.bind(this));
            this.__mouseManager.registerCallback("drag-end", "drag-end", this.__onDragEnd.bind(this));
        }
    },

    /**
     * @method __onDraggingSquare
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onDraggingSquare: function (manager, mstate) {
        this.color.saturation = mstate.x - 50;
        this.color.brightness = 150 - mstate.y;
        this._callCallbacks("value-changed", this.color);
    },

    /**
     * @method __onDraggingCircle
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onDraggingCircle: function (manager, mstate) {
        this.color.hue = this._pointerAngle(mstate);
        this._callCallbacks("value-changed", this.color);
    },

    /**
     * @method __onDragEnd
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onDragEnd: function (manager, mstate) {
        this.__mouseManager.removeCallback("dragging");
        this.__mouseManager.removeCallback("drag-end");
        this.__disableSBUpdate = false;
    },

    /**
     * @method __onValueChanged
     * @private
     */
    __onValueChanged: function () {
        this.color.fromString(this.__html.preview.value);
        this.__html.preview.value = this.color.rgbHexString;
        this._callCallbacks("value-changed", this.color);
    },
});

module.exports = ColorPicker;
