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
 * @submodule Composite
 * @namespace photonui
 */

var Stone  = require("stonejs");
var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var PopupMenu = require("./popupmenu.js");
var MenuItem = require("../container/menuitem.js");

/**
 * Select input.
 *
 * wEvents:
 *
 *   * value-changed:
 *     - description: called when the value was modified.
 *     - callback:    function(widget, value)
 *
 * @class Select
 * @constructor
 * @extends photonui.Widget
 */
var Select = Widget.$extend({

    // Constructor
    __init__: function (params) {
        params = params || {};

        // Attach popup & special mixin
        this.__popupMenu = new PopupMenu({
            maxHeight: 300,
            className: "photonui-select-popup",
            iconVisible: false
        });

        this._registerWEvents(["value-changed"]);
        this.$super(params);

        this._updateProperties(["value", "iconVisible"]);
        this._bindEvent("popup", this.html, "click", this.__onClick.bind(this));

        this.setValue(params.value || this.value, true);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The field value.
     *
     * @property value
     * @type String (maybe)
     * @default ""
     */
    _value: "",

    getValue: function () {
        return this._value;
    },

    setValue: function (value, force) {
        if (this.value == value && !force) {
            return;
        }

        var items = this.__popupMenu.children;

        for (var i = 0 ; i < items.length ; i++) {
            if (items[i] instanceof MenuItem && items[i].value == value) {
                this._value = value;
                Helpers.cleanNode(this.__html.select);
                this.__html.select.appendChild(items[i].html.cloneNode(true));
                return;
            }
        }

        this._value = "";
        var item = new MenuItem({text: this.placeholder, className: "photonui-select-placeholder"});
        Helpers.cleanNode(this.__html.select);
        this.__html.select.appendChild(item.html);
    },

    /**
     * The placeholder displayed if nothing is selected.
     *
     * @property placeholder
     * @type String
     * @default "Select..."
     */
    _placeholder: Stone.lazyGettext("Select..."),

    getPlaceholder: function () {
        return this._placeholder;
    },

    setPlaceholder: function (placeholder) {
        this._placeholder = placeholder;
    },

    /**
     * Layout children widgets.
     *
     * @property children
     * @type Array
     * @default []
     */
    getChildren: function () { return this.__popupMenu.getChildren(); },
    setChildren: function (p) {
        this.__popupMenu.setChildren(p);
        this._updateItemsBinding();
    },

    /**
     * Layout children widgets name.
     *
     * @property childrenNames
     * @type Array
     * @default []
     */
    getChildrenNames: function () { return this.__popupMenu.getChildrenNames(); },
    setChildrenNames: function (p) {
        this.__popupMenu.setChildrenNames(p);
        this._updateItemsBinding();
    },

    /**
     * Width of the container node.
     *
     * @property popupWidth
     * @type Number
     * @default: null (auto)
     */
    getPopupWidth: function () { return this.__popupMenu.getWidth(); },
    setPopupWidth: function (p) { this.__popupMenu.setWidth(p); },

    /**
     * Height of the popup container node.
     *
     * @property popupHeight
     * @type Number
     * @default: null (auto)
     */
    getPopupHeight: function () { return this.__popupMenu.getHeight(); },
    setPopupHeight: function (p) { this.__popupMenu.setHeight(p); },

    /**
     * Maximum width of the popup container node.
     *
     * @property popupMaxWidth
     * @type Number
     * @default: null (no maximum)
     */
    getPopupMaxWidth: function () { return this.__popupMenu.getMaxWidth(); },
    setPopupMaxWidth: function (p) { this.__popupMenu.setMaxWidth(p); },

    /**
     * Minimum width of the popup container node.
     *
     * @property popupMinWidth
     * @type Number
     * @default: null (no minimum)
     */
    _minWidthDefined: false,
    getPopupMinWidth: function () { return this.__popupMenu.getMinWidth(); },
    setPopupMinWidth: function (p) { this._minWidthDefined = true ; this.__popupMenu.setMinWidth(p); },

    /**
     * Maximum height of the popup container node.
     *
     * @property popupMaxHeight
     * @type Number
     * @default: 300
     */
    getPopupMaxHeight: function () { return this.__popupMenu.getMaxHeight(); },
    setPopupMaxHeight: function (p) { this.__popupMenu.setMaxHeight(p); },

    /**
     * Minimum height of the popup container node.
     *
     * @property popupMinHeight
     * @type Number
     * @default: null (no minimum)
     */
    getPopupMinHeight: function () { return this.__popupMenu.getMinHeight(); },
    setPopupMinHeight: function (p) { this.__popupMenu.setMinHeight(p); },

    /**
     * Popup width (outer HTML element).
     *
     * @property popupOffsetWidth
     * @type Number
     * @readOnly
     */
    getPopupOffsetWidth: function () { return this.__popupMenu.getOffsetWidth(); },

    /**
     * Popup height (outer HTML element).
     *
     * @property popupOffsetHeight
     * @type Number
     * @readOnly
     */
    getPopupOffsetHeight: function () { return this.__popupMenu.getOffsetHeight(); },

    /**
     * Window container node padding.
     *
     * @property popupPadding
     * @type Number
     * @default 0
     */
    getPopupPadding: function () { return this.__popupMenu.getPadding(); },
    setPopupPadding: function (p) { this.__popupMenu.setPadding(p); },

    /**
     * Define if icon on menu items are visible.
     *
     * @property iconVisible
     * @type Boolean
     * @default: false
     */
    isIconVisible: function () { return this.__popupMenu.isIconVisible(); },
    setIconVisible: function (p) {
        if (!p) {
            this.addClass("photonui-select-noicon");
        } else {
            this.removeClass("photonui-select-noicon");
        }
        this.__popupMenu.setIconVisible(p);
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
        return this.__html.select;
    },

    /**
     * The popupMenu.
     *
     * @property __popupMenu
     * @private
     * @type photonui.PopupMenu
     */
    __popupMenu: null,

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    setVisible: function (visible) {
        this.$super(visible);
        if (!visible) {
            this.__popupMenu.hide();
        }
    },

    /**
     * Add a widget to the layout.
     *
     * @method addChild
     * @param {photonui.Widget} widget The widget to add.
     * @param {Object} layoutOption Specific option for the layout (optional).
     */
    addChild: function (w, l) {
        this.__popupMenu.addChild(w, l);
        this._updateItemsBinding();
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        this.__popupMenu.destroy();
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.select = document.createElement("div");
        this.__html.select.className = "photonui-widget photonui-select";
        this.__html.select.tabIndex = "0";
    },

    /**
     * Update the popup items binding.
     *
     * @method _updateItemsBinding
     * @private
     */
    _updateItemsBinding: function () {
        var items = this.__popupMenu.children;

        for (var i = 0 ; i < items.length ; i++) {
            if (items[i] instanceof MenuItem) {
                items[i].registerCallback(this.name + "-click",
                        "click", this.__onItemClicked, this);
            }
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onClick
     * @private
     * @param event
     */
    __onClick: function (event) {
        if (!this._minWidthDefined) {
            this.popupMinWidth = this.offsetWidth;
        }
        this.__popupMenu.popupWidget(this);
    },

    /**
     * @method __onItemClicked
     * @private
     * @param {photonui.MenuItem} widget
     */
    __onItemClicked: function (widget) {
        this.value = widget.value;
        this._callCallbacks("value-changed", [this.value]);
    }
});

module.exports = Select;
