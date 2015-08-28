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
 * @submodule Container
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Container = require("./container.js");

/**
 * Tab Item.
 *
 *  wEvents:
 *
 *   * click:
 *     - description: called when the tab was clicked.
 *     - callback:    function(widget, event)
 *
 * @class TabItem
 * @constructor
 * @extends photonui.Container
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var TabItem = Container.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["click"]);
        this.$super(params);
        this._updateProperties(["title"]);

        this._bindEvent("tab-click", this.__html.tab, "click", this.__onClick.bind(this));
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Tab title.
     *
     * @property title
     * @type String
     * @default "Tab"
     */
    _title: "Tab",

    getTitle: function () {
        return this._title;
    },

    setTitle: function (title) {
        this._title = title;
        Helpers.cleanNode(this.__html.tab);
        this.__html.tab.appendChild(document.createTextNode(title));
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
        return this.__html.div;
    },

    /**
     * Tab Html element.
     *
     * @property tabHtml
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getTabHtml: function () {
        return this.__html.tab;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.__html.div;
    },

    /**
     * Is the widget visible or hidden.
     *
     * @property visible
     * @type Boolean
     * @default false
     */
    _visible: false,

    setVisible: function (visible, noParent) {
        this.$super(visible);

        if (visible) {
            if (this.parent) {
                var children = this.parent.children;
                for (var i = 0 ; i < children.length ; i++) {
                    if (!(children[i] instanceof TabItem)) {
                        continue;
                    }
                    if (children[i] === this) {
                        continue;
                    }
                    if (children[i].visible) {
                        children[i].setVisible(false, true);
                    }
                }
                this.parent._activeTabName = this.name;
            }

            this.addClass("photonui-tabitem-active");
            this.__html.tab.className = "photonui-tabitem-tab photonui-tabitem-active";
        } else {
            if (this.parent && !noParent) {
                this.parent.activeTab = null;
            }
            this.removeClass("photonui-tabitem-active");
            this.__html.tab.className = "photonui-tabitem-tab";
        }
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
        this.__html.div = document.createElement("div");
        this.__html.div.className = "photonui-widget photonui-tabitem photonui-container";
        this.__html.tab = document.createElement("div");
        this.__html.tab.className = "photonui-tabitem-tab";
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the tab is clicked.
     *
     * @method __onClick
     * @private
     * @param event
     */
    __onClick: function (event) {
        this.show();
        this._callCallbacks("click", [event]);
    }

});

module.exports = TabItem;

