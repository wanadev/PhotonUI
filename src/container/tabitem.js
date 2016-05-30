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
var Widget = require("../widget.js");
var BaseIcon = require("../visual/baseicon.js");
var Container = require("./container.js");
var IconButton = require("../interactive/iconbutton.js");

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
        this._updateProperties(["title", "leftIconName", "rightIconName"]);

        this._bindEvent("tab-click", this.__html.tab, "click", this.__onClick.bind(this));
        this._update();
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
        Helpers.cleanNode(this.__html.title);
        this.__html.title.appendChild(document.createTextNode(title));
    },

    /**
     * Definie if the tabItem title is displayed or hidden.
     *
     * @property titleVisible
     * @type Boolean
     * @default true
     */
    _titleVisible: true,

    isTitleVisible: function () {
        return this._titleVisible;
    },

    setTitleVisible: function (titleVisible) {
        this._titleVisible = titleVisible;
        this._update();
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

    /**
        * Left icon widget name
        *
        * @property leftIconName
        * @type String
        * @default null
        */
    _leftIconName: null,

    getLeftIconName: function () {
        return this._leftIconName;
    },

    setLeftIconName: function (leftIconName) {
        this._leftIconName = leftIconName;
        Helpers.cleanNode(this.__html.leftIcon);
        if (this._leftIconName) {
            this.__html.leftIcon.appendChild(this.leftIcon.html);
            this.leftIconVisible = true;
        }
    },

    /**
    * Left icon widget
    *
    * @property leftIcon
    * @type photonui.Icon
    * @default null
    */
    getLeftIcon: function () {
        return Widget.getWidget(this._leftIconName);
    },

    setLeftIcon: function (leftIcon) {
        if (leftIcon instanceof BaseIcon || leftIcon instanceof IconButton) {
            this.leftIconName = leftIcon.name;
        } else {
            this.leftIconName = null;
        }
    },

    /**
     * Define if the left icon is displayed or hidden.
     *
     * @property leftIconVisible
     * @type Boolean
     * @default true
     */
    _leftIconVisible: true,

    isLeftIconVisible: function () {
        return this._leftIconVisible;
    },

    setLeftIconVisible: function (leftIconVisible) {
        this._leftIconVisible = leftIconVisible;
        this._update();
    },

    /**
     * Right icon widget name
     *
     * @property rigthIconName
     * @type String
     * @default null
     */

    _rightIconName: null,

    getRightIconName: function () {
        return this._rightIconName;
    },

    setRightIconName: function (rightIconName) {
        this._rightIconName = rightIconName;
        Helpers.cleanNode(this.__html.rightIcon);
        if (this._rightIconName) {
            this.__html.rightIcon.appendChild(this.rightIcon.html);
            this.rightIconVisible = true;
        }
    },

    /**
     * Right icon widget
     *
     * @property rightIcon
     * @type photonui.Icon
     * @default null
     */
    getRightIcon: function () {
        return Widget.getWidget(this._rightIconName);
    },

    setRightIcon: function (rightIcon) {
        if (rightIcon instanceof BaseIcon || rightIcon instanceof IconButton) {
            this.rightIconName = rightIcon.name;
        } else {
            this.rightIconName = null;
        }
    },

    /**
     * Define if the right icon is displayed or hidden.
     *
     * @property rightIconVisible
     * @type Boolean
     * @default true
     */
    _rightIconVisible: true,

    isRightIconVisible: function () {
        return this._rightIconVisible;
    },

    setRightIconVisible: function (rightIconVisible) {
        this._rightIconVisible = rightIconVisible;
        this._update();
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    _update: function () {
        if (this.__html.leftIcon.parentNode == this.__html.tab) {
            this.__html.tab.removeChild(this.__html.leftIcon);
        }
        if (this.__html.title.parentNode == this.__html.tab) {
            this.__html.tab.removeChild(this.__html.title);
        }
        if (this.__html.rightIcon.parentNode == this.__html.tab) {
            this.__html.tab.removeChild(this.__html.rightIcon);
        }

        if (this.leftIconName && this.leftIconVisible) {
            this.__html.tab.appendChild(this.__html.leftIcon);
        }

        if (this.title && this.titleVisible) {
            this.__html.tab.appendChild(this.__html.title);
        }

        if (this.rightIconName && this.rightIconVisible) {
            this.__html.tab.appendChild(this.__html.rightIcon);
        }
    },

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

        this.__html.leftIcon = document.createElement("span");
        this.__html.leftIcon.className = "photonui-tabitem-lefticon";
        this.__html.tab.appendChild(this.__html.leftIcon);

        this.__html.title = document.createElement("span");
        this.__html.title.className = "photonui-tabitem-title";
        this.__html.tab.appendChild(this.__html.title);

        this.__html.rightIcon = document.createElement("span");
        this.__html.rightIcon.className = "photonui-tabitem-righticon";
        this.__html.tab.appendChild(this.__html.rightIcon);

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

