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
 * Authored by: Fabien LOISON <https://github.com/flozz>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Layout
 * @namespace photonui
 */


var Helpers = require("../helpers.js");
var Layout = require("./layout.js");
var TabItem = require("../container/tabitem.js");
var Widget = require("../widget.js");


/**
 * Tab Layout
 *
 * @class TabLayout
 * @constructor
 * @extends photonui.Layout
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var TabLayout = Layout.$extend({

    // Constructor
    __init__: function(params) {
        this._registerWEvents([]);
        this.$super(params);
        this._updateProperties(["tabsPosition", "padding"]);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======

    /**
     * Define the tabs position.
     *
     *   * top
     *   * bottom
     *   * left
     *   * right
     *
     * @property tabsPosition
     * @type String
     * @default "top"
     */
    _tabsPosition: "top",

    getTabsPosition: function() {
        return this._tabsPosition;
    },

    setTabsPosition: function(position) {
        if (["top", "bottom", "left", "right"].indexOf(position) < 0 ) {
            throw "Error: The tabs position should be \"top\", \"bottom\", \"left\" or \"right\".";
            return;
        }
        this._tabsPosition = position;
        this.removeClass("photonui-tablayout-tabposition-top");
        this.removeClass("photonui-tablayout-tabposition-bottom");
        this.removeClass("photonui-tablayout-tabposition-left");
        this.removeClass("photonui-tablayout-tabposition-right");
        this.addClass("photonui-tablayout-tabposition-" + position);
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

    /**
     * Define the active tab name.
     *
     * @property activeTabName
     * @type String
     * @default null
     */
    _activeTabName: null,

    getActiveTabName: function() {
        return this._activeTabName;
    },

    setActiveTabName: function(tabName) {
        var activeTab = Widget.getWidget(tabName);
        if (activeTab instanceof TabItem) {
            activeTab.show();
            return;
        }

        if (!this._activeTabName) {
            var children = this.children;
            for (var i=0 ; i<children.length ; i++) {
                if (!(children[i] instanceof TabItem)) {
                    continue;
                }
                children[i].show();
                break;
            }
        }
    },

    /**
     * Container node padding.
     *
     * @property padding
     * @type Number
     * @default 10
     */
    _padding: 10,

    getPadding: function() {
        return this._padding;
    },

    setPadding: function(padding) {
        this._padding = padding;
        this.__html.content.style.padding = padding + "px";
    },

    /**
     * Define the active tab.
     *
     * @property activeTab
     * @type photonui.Widget
     * @default null
     */
    getActiveTab: function() {
        return Widget.getWidget(this.activeTabName);
    },

    setActiveTab: function(tab) {
        if (tab instanceof Widget) {
            this.activeTabName = tab.name;
        }
        else {
            this.activeTabName = null;
        }
    },

    //
    setChildrenNames: function(childrenNames) {
        this.$super(childrenNames);
        if (!this.activeTabName) {
            this.activeTabName = null;
        }
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======


    addChild: function(widget, layoutOptions) {
        this.$super(widget, layoutOptions);
        if (!this.activeTabName && widget instanceof TabItem) {
            this.activeTabName = widget.name;
        }
    },


    // ====== Private methods ======


    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-tablayout";

        this.__html.inner = document.createElement("div");
        this.__html.inner.className = "photonui-tablayout-innerbox";
        this.__html.outer.appendChild(this.__html.inner);

        this.__html.tabs = document.createElement("div");
        this.__html.tabs.className = "photonui-tablayout-tabs";
        this.__html.inner.appendChild(this.__html.tabs);

        this.__html.content = document.createElement("div");
        this.__html.content.className = "photonui-tablayout-content";
        this.__html.inner.appendChild(this.__html.content);
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function() {
        Helpers.cleanNode(this.__html.tabs);
        Helpers.cleanNode(this.__html.content);

        var children = this.children;  // Cache for perf
        var tabsFragment = document.createDocumentFragment();
        var contentFragment = document.createDocumentFragment();

        for (var i=0 ; i<children.length ; i++) {
            if (!(children[i] instanceof TabItem)) {
                continue;
            }

            tabsFragment.appendChild(children[i].tabHtml);
            contentFragment.appendChild(children[i].html);
        }

        this.__html.tabs.appendChild(tabsFragment);
        this.__html.content.appendChild(contentFragment);
    }

});


module.exports = TabLayout;

