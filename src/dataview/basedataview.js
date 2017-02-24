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

var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var Text = require("../visual/text.js");

/**
 * BaseDataView container.
 *
 * wEvents:
 *
 *   * item-click:
 *     - description: called when an item is clicked.
 *     - callback:    function(event, item)
 *
 *   * item-select:
 *     - description: called when an item is selected.
 *     - callback:    function(item)
 *
 *   * item-unselect:
 *     - description: called when an item is unselected.
 *     - callback:    function(item)
 *
 * @class BaseDataView
 * @constructor
 * @extends photonui.Widget
 */
var BaseDataView = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this.$data.selectable = true;
        this.$data.multiSelectable = true;
        this.$data.containerElement = "ul";
        this.$data.itemElement = "li";
        this.$data.columnElement = "span";
        this.$data._manuallySetColumns = (params && params.columns) ? true : false;

        this._addClassname("dataview");
        this._addClassname(params && params.classname);

        this._initialSelectionItemIndex = null;

        this.$super(params);

        // Bind js events
        this._bindEvent("click", this.__html.container, "click", this.__onClick.bind(this));
    },

    /**
     * The collection of items displayed by the data view widget.
     *
     * @property items
     * @type Array
     * @default null
     */
    getItems: function () {
        return this.$data.items;
    },

    setItems: function (items) {
        this.$data.items = items.map(function (item, index) {
            return typeof(item) === "string" ? {
                index: index,
                selected: false,
                value: {
                    _string: item
                },
            } : {
                index: index,
                selected: false,
                value: item,
            };
        });

        if (!this.$data._manuallySetColumns) {
            this._generateColumns();
        }

        this._buildItemsHtml();
    },

    /**
     * Defines if the data items can be selected.
     *
     * @property selectable
     * @type Boolean
     * @default false
     */
    isSelectable: function () {
        return this.$data.selectable;
    },

    setSelectable: function (selectable) {
        this.$data.selectable = selectable;
    },

    /**
     * Defines if the data items can be multi-selected.
     *
     * @property multiSelectable
     * @type Boolean
     * @default false
     */
    isMultiSelectable: function () {
        return this.$data.multiSelectable;
    },

    setMultiSelectable: function (multiSelectable) {
        this.$data.multiSelectable = multiSelectable;
    },

    /**
     * A custom formater function which overrides the default rendering process
     * of the widget.
     *
     * @property customFormater
     * @type Function
     * @default null
     */
    getCustomFormater: function () {
        return this.$data.customFormater;
    },

    setCustomFormater: function (customFormater) {
        this.$data.customFormater = customFormater;
    },

    /**
     * The currently selected items.
     *
     * @property selectedItems
     * @type Array
     * @default []
     */
    getSelectedItems: function () {
        return this.$data.items ?
            this.$data.items.filter(function (item) {
                return item.selected;
            }) : [];
    },

    /**
     * The list of columns which defines the structure of the items (if not
     * setted manually, the columns are automatically generated).
     *
     * @property columns
     * @type Array
     * @default null
     */
    setColumns: function (columns) {
        this.$data.columns = columns.map(function (column, index) {
            return typeof(column) === "string" ? {
                    id: column,
                    value: column
                } :
                column.value ? {
                    id: column.id ? column.id : typeof(column.value) === "string" ? column.value : "column" + index,
                    value: column.value,
                    rawHtml: column.rawHtml
                } :
                null;
        }).filter(function (col) {
            return col !== null;
        });
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
        return this.__html.container;
    },

    /**
     * The type of the container DOM element which will be created during the
     * render process.
     *
     * @property containerElement
     * @type String
     * @default "ul"
     */
    getContainerElement: function () {
        return this.$data.containerElement;
    },

    setContainerElement: function (containerElement) {
        this.$data.containerElement =  containerElement;
    },

    /**
     * The type of the items DOM elements which will be created during the
     * render process.
     *
     * @property itemElement
     * @type String
     * @default "li"
     */
    getItemElement: function () {
        return this.$data.itemElement;
    },

    setItemElement: function (itemElement) {
        this.$data.itemElement = itemElement;
    },

    /**
     * The type of the columns DOM elements which will be created during the
     * render process.
     *
     * @property columnElement
     * @type String
     * @default "span"
     */
    getColumnElement: function () {
        return this.$data.columnElement;
    },

    setColumnElement: function (columnElement) {
        this.$data.columnElement = columnElement;
    },

    /**
     * The list of classnames wich will be added to every generated elements
     * of the widget.
     *
     * @property classnames
     * @type Array
     * @default []
     */
    _addClassname: function (classname) {
        if (!classname) {
            return;
        }
        if (!this.$data._classnames) {
            this.$data._classnames = [classname];
        } else if (this.$data._classnames.indexOf(classname) === -1) {
            this.$data._classnames.push(classname);
        }
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    // TODO Public methods here

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this._buildContainerHtml();
    },

    /**
     * Build the widget container HTML.
     *
     * @method _buildContainerHtml
     * @private
     */
    _buildContainerHtml: function () {
        this.__html.container = document.createElement(this.containerElement);
        this.__html.container.className = "photonui-widget";

        this._addClasses(this.__html.container);
        this._addClasses(this.__html.container, "container");
    },

    /**
     * Build the items list HTML.
     *
     * @method _buildItemsHtml
     * @private
     */
    _buildItemsHtml: function () {
        Helpers.cleanNode(this.__html.container);

        if (this.$data.items) {
            var fragment = document.createDocumentFragment();

            this.$data.items.forEach(function (item) {
                var itemNode = this._renderItem(item);
                item.node = itemNode;
                fragment.appendChild(itemNode);
            }.bind(this));

            this.__html.container.appendChild(fragment);
        }

    },

    /**
     * Renders a given item.
     *
     * @method _renderItem
     * @private
     * @param {Object} item
     * @return {Element} the rendered item
     */
    _renderItem: function (item) {
        var node = document.createElement(this.itemElement);
        node.className = "photonui-dataview-item";
        node.setAttribute("data-photonui-dataview-item-index", item.index);

        this._addClasses(node, "item");

        if (this.customFormater && typeof(this.customFormater) === "function") {
            var widget = this.customFormater(item.value);

            if (widget && widget instanceof Widget) {
                node.appendChild(widget.getHtml());
                return node;
            }
        }

        return this._renderItemInner(node, item);
    },

    /**
     * Renders all the columns of a given item.
     *
     * @method _renderItemInner
     * @private
     * @param {Element} itemNode the container element of the item
     * @param {Object} item the rendered item
     * @return {Element} the rendered item
     */
    _renderItemInner: function (itemNode, item) {
        if (this.$data.columns) {
            this.$data.columns.forEach(function (column) {
                var content = typeof(column.value) === "string" ? lodash.get(item.value, column.value) :
                    typeof(column.value) === "function" ? column.value.call(this.$data, item.value) :
                    null;

                itemNode.appendChild(this._renderColumn(content, column.id, column.rawHtml));
            }.bind(this));
        }

        return itemNode;
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
        var node = document.createElement(this.columnElement);

        this._addClasses(node, "column");
        this._addClasses(node, "column-" + columnId);

        if (content instanceof Widget) {
            node.appendChild(content.getHtml());
        } else if (rawHtml) {
            node.innerHTML = content || "";
        } else {
            node.textContent = content || "";
        }

        return node;
    },

    /**
     * Generate the list of columns.
     *
     * @method _generateColumns
     * @private
     */
    _generateColumns: function () {
        var keys = [];

        if (this.$data.items) {
            this.$data.items.forEach(function (item) {
                if (typeof(item.value) !== "string") {
                    Object.keys(item.value).forEach(function (key) {
                        if (keys.indexOf(key) === -1) {
                            keys.push(key);
                        }
                    });
                }
            });

            this.$data.columns = keys.map(function (key) {
                return {
                    value: key,
                    id: key,
                };
            });

            this._buildItemsHtml();
        }
    },

    /**
     * Adds classes defined by the classname property to a given element, with
     * a given suffix.
     *
     * @method _addClasses
     * @private
     * @param {Element} node the node
     * @param {String} suffix the suffix of the classes
     */
    _addClasses: function (node, suffix) {
        if (this.$data._classnames) {
            this.$data._classnames.forEach(function (classname) {
                node.classList.add(
                    suffix ?
                    "photonui-" + classname + "-" + suffix :
                    "photonui-" + classname
                );
            });
        }
    },

    /**
     * Selects an item.
     *
     * @method _selectItem
     * @private
     * @param {Object} item the item
     */
    _selectItem: function (item) {
        item.selected = true;
        item.node.classList.add("selected");
        this._callCallbacks("item-select", [item]);
    },

    /**
     * Unselects an item.
     *
     * @method _unselectItem
     * @private
     * @param {Object} item the item
     */
    _unselectItem: function (item) {
        item.selected = false;
        item.node.classList.remove("selected");
        this._callCallbacks("item-unselect", [item]);
    },

    /**
     * Selects all items from the current selection to a given item.
     *
     * @method _selectItemsTo
     * @private
     * @param {Object} item the item
     */
    _selectItemsTo: function (item) {
        this._unselectAllItems();

        if (this._initialSelectionItemIndex < item.index) {
            for (var i = this._initialSelectionItemIndex; i <= item.index; i++) {
                this._selectItem(this.items[i]);
            }
        } else {
            for (var j = this._initialSelectionItemIndex; j >= item.index; j--) {
                this._selectItem(this.items[j]);
            }
        }
    },

    /**
     * Unselects all items.
     *
     * @method _unselectAllItems
     * @private
     */
    _unselectAllItems: function () {
        this.getSelectedItems().forEach(function (item) {
            this._unselectItem(item);
        }.bind(this));
    },

    /**
     * Gets an item of the collection from a given item DOM element.
     *
     * @method _getItemFromNode
     * @private
     * @param {Element} itemNode the item DOM element
     * @return {Object} the item
     */
    _getItemFromNode: function (itemNode) {
        var index = itemNode.getAttribute("data-photonui-dataview-item-index");
        return index ? this.$data.items[parseInt(index, 10)] : null;
    },

    /**
     * Handle item click events.
     *
     * @method _handleClick
     * @private
     * @param {Object} item the item
     * @param {Object} modifiers the modifiers states
     * @param {Object} modifiers.ctrl
     * @param {Object} modifiers.shift
     */
    _handleClick: function (clickedItem, modifiers) {
        if (this.selectable) {
            if (this.multiSelectable) {
                if (this.selectedItems.length === 0) {
                    this._selectItem(clickedItem);
                    this._initialSelectionItemIndex = clickedItem.index;
                } else {
                    if (modifiers.shift) {
                        this._selectItemsTo(clickedItem);
                    } else if (modifiers.ctrl) {
                        if (clickedItem.selected) {
                            this._unselectItem(clickedItem);
                        } else {
                            this._selectItem(clickedItem);
                        }
                    } else {
                        this._unselectAllItems();
                        this._selectItem(clickedItem);
                        this._initialSelectionItemIndex = clickedItem.index;
                    }
                }
            } else {
                if (modifiers.ctrl && clickedItem.selected) {
                    this._unselectItem(clickedItem);
                } else {
                    this._unselectAllItems();
                    this._selectItem(clickedItem);
                }
            }
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when an element is clicked.
     *
     * @method __onClick
     * @private
     * @param {Object} e the click event
     */
    __onClick: function (e) {
        var clickedItemNode = Helpers.getClosest(e.target, ".photonui-dataview-item");

        if (clickedItemNode) {
            this.__onItemClick(e, this._getItemFromNode(clickedItemNode));
        } else {
            this._unselectAllItems();
        }
    },

    /**
     * Called when an item is clicked.
     *
     * @method __onItemClick
     * @private
     * @param {Object} e the click event
     * @param {item} item the clicked item
     */
    __onItemClick: function (e, item) {
        this._handleClick(item, {
            shift: e.shiftKey,
            ctrl: e.ctrlKey,
        });
        this._callCallbacks("item-click", [e, item]);
    }
});

module.exports = BaseDataView;