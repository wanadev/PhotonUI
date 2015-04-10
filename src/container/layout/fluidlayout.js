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
var Layout = require("./layout.js");

/**
 * Fluid Layout.
 *
 * @class FluidLayout
 * @constructor
 * @extends photonui.Layout
 */
var FluidLayout = Layout.$extend({

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The vertical spacing between children widgets.
     *
     * @property verticalSpacing
     * @type Number
     * @default 0
     */
    _verticalSpacing: 0,

    getVerticalSpacing: function() {
        return this._verticalSpacing;
    },

    setVerticalSpacing: function(verticalSpacing) {
        this._verticalSpacing = verticalSpacing;
        this._updateLayout();
    },

    /**
     * The horizontal spacing between children widgets.
     *
     * @property horizontalSpacing
     * @type Number
     * @default 2
     */
    _horizontalSpacing: 2,

    getHorizontalSpacing: function() {
        return this._horizontalSpacing;
    },

    setHorizontalSpacing: function(horizontalSpacing) {
        this._horizontalSpacing = horizontalSpacing;
        this._updateLayout();
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
        return this.__html.outerbox;
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======



    // ====== Private methods ======


    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.__html.outerbox = document.createElement("div");
        this.__html.outerbox.className = "photonui-widget photonui-fluidlayout";
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function() {
        var children = this.children
        var fragment = document.createDocumentFragment();

        var div = null;
        for (var i=0 ; i<children.length ; i++) {
            div = document.createElement("div");
            div.className = "photonui-container";
            div.style.padding = "0 " + this.horizontalSpacing + "px " + this.verticalSpacing + "px 0";
            div.appendChild(children[i].html);
            fragment.appendChild(div);
        }

        Helpers.cleanNode(this.__html.outerbox);
        this.__html.outerbox.appendChild(fragment);
    }
});

module.exports = FluidLayout;
