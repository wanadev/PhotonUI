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

var Widget = require("../widget");
var Helpers = require("../helpers.js");

var DataView = require("./dataview");

/**
 * TableView container.
 *
 * @class TableView
 * @constructor
 * @extends photonui.DataView
 */
var TableView = DataView.$extend({

    // Constructor
    __init__: function (params) {
        params = lodash.assign({
            containerElement: "table",
            itemElement: "tr",
            columnElement: "td",
            showHeader: true,
        }, params);

        this._addIdentifier("tableview");

        this._registerWEvents([]);
        this.$super(params);
    },

    /**
     * Defines if the header is displayed.
     *
     * @property showHeader
     * @type Boolean
     * @default true
     */
    getShowHeader: function () {
        return this.$data.showHeader;
    },

    setShowHeader: function (showHeader) {
        this.$data.showHeader = showHeader;
    },

    /**
     * Build the items list HTML.
     *
     * @method _buildItemsHtml
     * @private
     */
    _buildItemsHtml: function () {
        this.$super.apply(this, arguments);
        if (this.$data.showHeader) {
            this.__html.container.insertBefore(this._renderHeader(), this.__html.container.firstChild);
        }
    },

    /**
     * Renders the table header.
     *
     * @method _renderHeader
     * @private
     * @return {Element} the rendered header
     */
    _renderHeader: function () {
        var node = document.createElement("tr");
        this._addIdentifiersClasses(node, "header");

        if (this.$data.columns) {
            this.$data.columns.forEach(function (column) {
                var columnNode = document.createElement("th");
                this._addIdentifiersClasses(columnNode, "column");
                columnNode.textContent = column.label === undefined ? column.id : column.label;
                node.appendChild(columnNode);
            }.bind(this));
        }

        return node;
    }
});

module.exports = TableView;
