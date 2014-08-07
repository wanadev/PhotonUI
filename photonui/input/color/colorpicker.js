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
photonui.ColorPicker = photonui.Widget.$extend({

    // Constructor
    __init__: function(params) {
        //this._registerWEvents(["value-changed"]);   // TODO
        this._color = new photonui.Color();
        this.__buffH = document.createElement("canvas");
        this.__buffH.width = 200;
        this.__buffH.height = 200;
        this.__buffSB = document.createElement("canvas");
        this.__buffSB.width = 100;
        this.__buffSB.height = 100;
        this.$super(params);
        this._updateH();
        this._updateSB();
        this._updateCanvas();
        this._updateProperties(["color"]);
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
    getValue: function() {
        return this.color.hexString;
    },

    setValue: function(value) {
        this.color.hexString = value;
        this._updateSB();
        this._updateCanvas();
    },

    /**
     * The color.
     *
     * @property color
     * @type kzd.Color
     */
    _color: null,

    getColor: function() {
        return this._color;
    },

    setColor: function(color) {
        if (color instanceof photonui.Color) {
            if (this._color) {
                this._color.removeCallback("photonui.colorpicker.value-changed");
            }
            this._color = color;
            this._color.registerCallback("photonui.colorpicker.value-changed", "value-changed", function() {
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
    getHtml: function() {
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


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-colorpicker";
        this.__html.canvas = document.createElement("canvas");
        this.__html.canvas.width = 200;
        this.__html.canvas.height = 200;
        this.__html.outer.appendChild(this.__html.canvas);
    },

    /**
     * Update hue circle
     *
     * @method _updateH
     * @private
     */
    _updateH: function() {
        var canvas = this.__buffH;
        var ctx = canvas.getContext("2d");
        var color = new photonui.Color();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i=0 ; i<360 ; i++) {
            color.hue = 360 - i;
            ctx.beginPath();
            ctx.fillStyle = color.hexString;
            ctx.arc(100, 100, 96, Math.PI*i/180, Math.PI*((i+2)%360)/180, false);
            ctx.lineTo(100, 100);
            ctx.fill();
        }

        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.arc(100, 100, 73, 2*Math.PI, false);
        ctx.globalCompositeOperation = "destination-out";
        ctx.fill()
    },

    /**
     * Update saturation/brightness square
     *
     * @method _updateSB
     * @private
     */
    _updateSB: function() {
        var canvas = this.__buffSB;
        var ctx = canvas.getContext("2d");
        var pix = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var color = new photonui.Color(this.color.hexString);

        var i = 0;
        var b = 0;
        var s = 0;
        for (b=0 ; b<100 ; b++) {
            color.brightness = 100-b;
            for (s=0 ; s<100 ; s++) {
                color.saturation = s;
                i = 400 * b + 4 * s;
                pix.data[i+0] = color.red;
                pix.data[i+1] = color.green;
                pix.data[i+2] = color.blue;
                pix.data[i+3] = 255;
            }
        }

        ctx.putImageData(pix, 0, 0);
    },

    /**
     * Update the canvas
     *
     * @method _updateCanvas
     */
    _updateCanvas: function() {
        var canvas = this.__html.canvas;
        var ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(this.__buffH, 0, 0);
        ctx.drawImage(this.__buffSB, 50, 50);
    }


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    // TODO
});
