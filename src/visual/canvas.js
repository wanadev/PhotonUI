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
 * @submodule Visual
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Canvas.
 *
 * @class Canvas
 * @constructor
 * @extends photonui.Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var Canvas = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);

        // --- Canvas methods proxies ---

        /**
         * Returns a drawing context on the canvas.
         *
         * Proxy of the native canvas method. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method getContext
         * @param {String} contextId
         * @return The drawing context.
         */
        this.getContext = this.__html.canvas.getContext.bind(this.__html.canvas);

        /**
         * Indicate if the given context is supported by this canvas.
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method supportsContext
         * @param {String} contextId
         * @return {Boolean}
         */
        if (this.__html.canvas.supportsContext) {
            this.supportsContext = this.__html.canvas.supportsContext.bind(this.__html.canvas);
        }

        /**
         * Changes the context the element is related to to the given one.
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method setContext
         * @param {String} contextId
         */
        if (this.__html.canvas.setContext) {
            this.setContext = this.__html.canvas.setContext.bind(this.__html.canvas);
        }

        /**
         * Gives back a proxy to allow the canvas to be used in another Worker.
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method transferControlToProxy
         */
        if (this.__html.canvas.transferControlToProxy) {
            this.transferControlToProxy = this.__html.canvas.transferControlToProxy.bind(this.__html.canvas);
        }

        /**
         * Returns a "data:" URL containing a representation of the image (at 96dpi).
         *
         * Proxy of the native canvas method. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method toDataURL
         * @param {String} type The image format (optional, e.g: "image/png", "image/jpeg",..., default="image/png")
         * @return {String} The data URL
         */
        this.toDataURL = this.__html.canvas.toDataURL.bind(this.__html.canvas);

        /**
         * Returns a "data:" URL containing a representation of the image (at the native resolution of the canvas).
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method toDataURLHD
         * @param {String} type The image format (optional, e.g: "image/png", "image/jpeg",..., default="image/png")
         * @return {String} The data URL
         */
        if (this.__html.canvas.toDataURLHD) {
            this.toDataURLHD = this.__html.canvas.toDataURLHD.bind(this.__html.canvas);
        }

        /**
         * Returns a Blob object representing the image contained in the canvas (at 96dpi).
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method toBlob
         * @param {String} type The image format (optional, e.g: "image/png", "image/jpeg",..., default="image/png")
         * @return {Blob}
         */
        if (this.__html.canvas.toBlob) {
            this.toBlob = this.__html.canvas.toBlob.bind(this.__html.canvas);
        }

        /**
         * Returns a Blob object representing the image contained in the canvas (at the native
         * resolution of the canvas).
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method toBlobHD
         * @param {String} type The image format (optional, e.g: "image/png", "image/jpeg",..., default="image/png")
         * @return {Blob}
         */
        if (this.__html.canvas.toBlobHD) {
            this.toBlobHD = this.__html.canvas.toBlobHD.bind(this.__html.canvas);
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Canvas width.
     *
     * @property width
     * @type Number
     * default 300
     */
    getWidth: function () {
        "@photonui-update";
        return this.__html.canvas.width;
    },

    setWidth: function (width) {
        this.__html.canvas.width = width || 300;
    },

    /**
     * Canvas height.
     *
     * @property height
     * @type Number
     * default 150
     */
    getHeight: function () {
        "@photonui-update";
        return this.__html.canvas.height;
    },

    setHeight: function (height) {
        this.__html.canvas.height = height || 150;
    },

    /**
     * The Canvas HTML Element.
     *
     * @property canvas
     * @readOnly
     * @type HTMLElement
     */
    getCanvas: function () {
        return this.__html.canvas;
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

    /**
     * The interactive HTML element (for event managers).
     *
     * @property interactiveNode
     * @type HTMLElement
     * @readOnly
     */
    getInteractiveNode: function () {
        return this.__html.canvas;
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
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-canvas";

        this.__html.canvas = document.createElement("canvas");
        this.__html.outer.appendChild(this.__html.canvas);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // pass
    }
});

module.exports = Canvas;
