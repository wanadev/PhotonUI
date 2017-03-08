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

var Helpers = require("../helpers");
var Image = require("../visual/image");
var FAIcon = require("../visual/faicon");

var FluidView = require("./fluidview");

/**
 * IconView container.
 *
 * @class IconView
 * @constructor
 * @extends photonui.FluidView
 */
var IconView = FluidView.$extend({

    // Constructor
    __init__: function (params) {
        params = lodash.merge({
            horizontalSpacing: 8,
            horizontalPadding: 8,
            verticalSpacing: 8,
            verticalPadding: 8,
            columnElement: "div",
            columns: [{
                id: "icon",
                value: function (item) {
                    return item.image ?
                            new Image({
                                url: item.image,
                                height: this.iconHeight,
                                width: this.iconWidth,
                            }) :
                        item.faIcon && item.faIcon.iconName ?
                            new FAIcon(item.faIcon) :
                        null;
                },
            },
            "label",
          ],
        }, params);

        this._addClassname("iconview");

        this._registerWEvents([]);
        this.$super(params);
    },

    /**
     * The width of the icons.
     *
     * @property iconWidth
     * @type Number
     * @default 0
     */
    getIconWidth: function () {
        return this.$data.iconWidth;
    },

    setIconWidth: function (iconWidth) {
        this.$data.iconWidth = iconWidth;
        this._buildItemsHtml();
    },

    /**
     * The width of the items.
     *
     * @property iconHeight
     * @type Number
     * @default 0
     */
    getIconHeight: function () {
        return this.$data.iconHeight;
    },

    setIconHeight: function (iconHeight) {
        this.$data.iconHeight = iconHeight;
        this._buildItemsHtml();
    },

    /**
     * Renders a given column.
     *
     * @method _renderColumn
     * @private
     * @param {photonui.Widget|String} content the content of the column
     * @param {String} columnId the identifier of the column
     * @return {Element} the rendered column
     */
    _renderColumn: function (content, columnId, rawHtml) {
        var node = this.$super.apply(this, arguments);

        if (columnId === "icon") {
            if (this.$data.iconWidth) {
                node.style.width = this.$data.iconWidth + "px";
            }
            if (this.$data.iconHeight) {
                node.style.height = this.$data.iconHeight + "px";

                var faIconNode = node.getElementsByClassName("fa")[0];

                if (faIconNode) {
                    faIconNode.style.lineHeight = this.$data.iconHeight + "px";
                }
            }
        }

        return node;
    },
});

module.exports = IconView;
