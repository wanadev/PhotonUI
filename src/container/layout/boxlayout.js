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
 * Vertical and horizontal box layout.
 *
 * @class BoxLayout
 * @constructor
 * @extends photonui.Layout
 */
var BoxLayout = Layout.$extend({

    // Constructor
    __init__: function(params) {
        this.$super(params);
        this._updateProperties(["orientation"]);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The layout orientation ("vertical" or "horizontal").
     *
     * @property orientation
     * @type String
     * @default "vertical"
     */
    _orientation: "vertical",

    getOrientation: function() {
        return this._orientation;
    },

    setOrientation: function(orientation) {
        if (orientation != "vertical" && orientation != "horizontal") {
            throw "Error: The orientation should be \"vertical\" or \"horizontal\".";
            return;
        }
        this._orientation = orientation;
        this.removeClass("photonui-layout-orientation-vertical");
        this.removeClass("photonui-layout-orientation-horizontal");
        this.addClass("photonui-layout-orientation-" + this.orientation);
        this._updateProperties(["spacing"]);
    },

    /**
     * Vertical padding (px).
     *
     * @property verticalPadding
     * @type Number
     * @default 0
     */
    _verticalPadding: 0,

    getVerticalPadding: function() {
        return this._verticalPadding;
    },

    setVerticalPadding: function(padding) {
        this._verticalPadding = padding|0;
        this.__html.outerbox.style.paddingTop = this._verticalPadding + "px";
        this.__html.outerbox.style.paddingBottom = this._verticalPadding + "px";
    },

    /**
     * Horizontal padding (px).
     *
     * @property horizontalPadding
     * @type Number
     * @default 0
     */
    _horizontalPadding: 0,

    getHorizontalPadding: function() {
        return this._horizontalPadding;
    },

    setHorizontalPadding: function(padding) {
        this._horizontalPadding = padding|0;
        this.__html.outerbox.style.paddingLeft = this._horizontalPadding + "px";
        this.__html.outerbox.style.paddingRight = this._horizontalPadding + "px";
    },

    /**
     * Spacing between children widgets.
     *
     * @property spacing
     * @type Number
     * @default 5
     */
    _spacing: 5,

    getSpacing: function() {
        return this._spacing;
    },

    setSpacing: function(spacing) {
        this._spacing = spacing|0;

        var nodes = this.__html.outerbox.childNodes;
        for (var i=0 ; i<nodes.length-1 ; i++) {
            if (this.orientation == "horizontal") {
                nodes[i].style.marginRight = this._spacing + "px";
                nodes[i].style.marginBottom = "0px";
            }
            else {
                nodes[i].style.marginRight = "0px";
                nodes[i].style.marginBottom = this._spacing + "px";
            }
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
        return this.__html.outerbox;
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
        this.__html.outerbox = document.createElement("div");
        this.__html.outerbox.className = "photonui-widget photonui-boxlayout";
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function() {
        Helpers.cleanNode(this.__html.outerbox);

        var fragment = document.createDocumentFragment();
        var children = this.children;

        var container = null;
        for (var i=0 ; i<children.length ; i++) {
            container = document.createElement("div");
            container.className = "photonui-container photonui-boxlayout-item";
            container.appendChild(children[i].html);
            fragment.appendChild(container);
        }

        this.__html.outerbox.appendChild(fragment);

        this._updateProperties(["spacing"]);
    }
});

module.exports = BoxLayout;
