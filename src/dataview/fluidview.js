/*
 * Copyright (c) 2014-2016, Wanadev <http://www.wanadev.fr/>
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
 * Authored by: Valentin Ledrapier
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule DataView
 * @namespace photonui
 */

var lodash = require("lodash");

var DataView = require("./dataview");

/**
 * FluidView container.
 *
 * @class FluidView
 * @constructor
 * @extends photonui.DataView
 */
var FluidView = DataView.$extend({

    // Constructor
    __init__: function (params) {
        params = lodash.merge({
            verticalPadding: 0,
            horizontalPadding: 0,
            verticalSpacing: 0,
            horizontalSpacing: 0,
        }, params);

        this._addClassname("fluidview");
        this.$super(params);
    },

    /**
     * The width of the items.
     *
     * @property itemsWidth
     * @type Number
     * @default 0
     */
    getItemsWidth: function () {
        return this.$data.itemsWidth;
    },

    setItemsWidth: function (itemsWidth) {
        this.$data.itemsWidth = itemsWidth;
        this._buildItemsHtml();
    },

    /**
     * The height of the items.
     *
     * @property itemsHeight
     * @type Number
     * @default 0
     */
    getItemsHeight: function () {
        return this.$data.itemsHeight;
    },

    setItemsHeight: function (itemsHeight) {
        this.$data.itemsHeight = itemsHeight;
        this._buildItemsHtml();
    },

    /**
     * The vertical padding of the container element.
     *
     * @property verticalPadding
     * @type Number
     * @default 0
     */
    getVerticalPadding: function () {
        return this.$data.verticalPadding;
    },

    setVerticalPadding: function (verticalPadding) {
        this.$data.verticalPadding = verticalPadding;
        this._buildItemsHtml();
    },

    /**
     * The horizontal padding of the container element.
     *
     * @property horizontalPadding
     * @type Number
     * @default 0
     */
    getHorizontalPadding: function () {
        return this.$data.horizontalPadding;
    },

    setHorizontalPadding: function (horizontalPadding) {
        this.$data.horizontalPadding = horizontalPadding;
        this._buildItemsHtml();
    },

    /**
     * The vertical spacing between the elements.
     *
     * @property verticalSpacing
     * @type Number
     * @default 0
     */
    getVerticalSpacing: function () {
        return this.$data.verticalSpacing;
    },

    setVerticalSpacing: function (verticalSpacing) {
        this.$data.verticalSpacing = verticalSpacing;
        this._buildItemsHtml();
    },

    /**
     * The horizontal spacing between the elements.
     *
     * @property horizontalSpacing
     * @type Number
     * @default 0
     */
    getHorizontalSpacing: function () {
        return this.$data.horizontalSpacing;
    },

    setHorizontalSpacing: function (horizontalSpacing) {
        this.$data.horizontalSpacing = horizontalSpacing;
        this._buildItemsHtml();
    },

    /**
     * Build the items list HTML.
     *
     * @method _buildItemsHtml
     * @private
     */
    _buildItemsHtml: function () {
        this.$super.apply(this, arguments);

        this.__html.container.style.marginTop = this.$data.verticalSpacing ?
            -this.$data.verticalSpacing / 2 + "px" :
            "";

        this.__html.container.style.marginBottom = this.$data.verticalSpacing ?
            -this.$data.verticalSpacing / 2 + "px" :
            "";

        this.__html.container.style.marginLeft = this.$data.horizontalSpacing ?
            -this.$data.horizontalSpacing / 2 + "px" :
            "";

        this.__html.container.style.marginRight = this.$data.horizontalSpacing ?
            -this.$data.horizontalSpacing / 2 + "px" :
            "";

        this.__html.container.style.paddingTop = this.$data.verticalPadding ?
            this.$data.verticalPadding + "px" :
            "";

        this.__html.container.style.paddingBottom = this.$data.verticalPadding ?
            this.$data.verticalPadding + "px" :
            "";

        this.__html.container.style.paddingLeft = this.$data.horizontalPadding ?
            this.$data.horizontalPadding + "px" :
            "";

        this.__html.container.style.paddingRight = this.$data.horizontalPadding ?
            this.$data.horizontalPadding + "px" :
            "";
    },

    _renderItem: function (item) {
        var node = this.$super.apply(this, arguments);

        if (this.$data.itemsWidth) {
            node.style.width = this.$data.itemsWidth + "px";
        }
        if (this.$data.itemsHeight) {
            node.style.height = this.$data.itemsHeight + "px";
        }
        if (this.$data.horizontalSpacing) {
            node.style.marginLeft = this.$data.horizontalSpacing / 2 + "px";
            node.style.marginRight = this.$data.horizontalSpacing / 2 + "px";
        }
        if (this.$data.verticalSpacing) {
            node.style.marginTop = this.$data.verticalSpacing / 2 + "px";
            node.style.marginBottom = this.$data.verticalSpacing / 2 + "px";
        }

        return node;
    },
});

module.exports = FluidView;
