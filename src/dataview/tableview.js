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

var _ = require("lodash");

var BaseDataView = require("./basedataview");
var Helpers = require("../helpers.js");

/**
 * TableView container.
 *
 * @class TableView
 * @constructor
 * @extends photonui.BaseDataView
 */
var TableView = BaseDataView.$extend({

    // Constructor
    __init__: function (params) {
        this.isSelectable = true;
        this.isMultiSelectable = true;
        this._registerWEvents([]);
        this.$super(params);

        if (params.columns) {
            this._manuallySetColumns = true;
        } else {
            this._generateColumns();
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.container;
    },

    setColumns: function (columns) {
        this.$data.columns = columns.map(function (column) {
            return typeof(column) === "string" ? {label: column, key: column} :
                column.key ? {label: column.label || column.key, key: column.key} :
                null;
        }).filter(function (col) {
            return col !== null;
        });
    },

    // ====== Private properties ======

    _manuallySetColumns: false,

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    // TODO Public methods here

    // ====== Private methods ======

    /**
     * Build the widget container HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildContainerHtml: function () {
        this.__html.container = document.createElement("table");
        this.__html.container.className = "photonui-widget photonui-dataview-container photonui-tableview";
    },

    _renderItem: function (item) {
        var node = document.createElement("tr");
        node.className = "photonui-dataview-item photonui-tableview-item";
        node.setAttribute("data-photonui-dataview-item-index", item.index);

        if (this.$data.columns && this.$data.columns.length) {
            this.$data.columns.forEach(function (column) {
                node.appendChild(this._renderColumn(_.get(item.value, column.key)));
            }.bind(this));
        }

        return node;
    },

    _renderColumn: function (value) {
        var column = document.createElement("td");
        column.className = "photonui-tableview-column";
        column.innerHTML = value;

        return column;
    },

    _generateColumns: function () {
        var keys = [];
        this.$data.items.forEach(function (item) {
            Object.keys(item.value).forEach(function (key) {
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                }
            });
        });

        this.$data.columns = keys.map(function (key) {
            return {
                key: key,
                label: key,
            };
        });

        this._buildItemsHtml();
    }

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    // TODO Internal events callback here
});

module.exports = TableView;
