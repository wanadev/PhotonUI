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
 * Authored by: Alexis BREUST
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
var Container = require("./container.js");

/**
 * Expander container.
 *
 * @class Expander
 * @constructor
 * @extends photonui.Container
 */
var Expander = Container.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["click"]);
        this.$super(params);
        this._bindEvent("click", this.__html.title, "click", this.__onTitleClicked);
        this._updateProperties(["title", "folded", "padding"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The title.
     *
     * @property title
     * @type String
     * @default "Expander"
     */
    _title: "Expander",

    getTitle: function () {
        return this._title;
    },

    setTitle: function (title) {
        this._title = title;
        Helpers.cleanNode(this.__html.title);
        this.__html.title.appendChild(document.createTextNode(title));
    },

    /**
     * Whether the expander is folded.
     *
     * @property folded
     * @type Boolean
     * @default false
     */
    _folded: false,

    getFolded: function () {
        return this._folded;
    },

    setFolded: function (folded) {
        this._folded = folded;

        if (this._folded) {
            this.addClass("photonui-expander-folded");
        } else {
            this.removeClass("photonui-expander-folded");
        }

        if (this.child !== null) {
            this.child.visible = !folded;
        }
    },

    /**
     * Container node padding.
     *
     * @property padding
     * @type Number
     * @default 0
     */
    _padding: 0,

    getPadding: function () {
        return this._padding;
    },

    setPadding: function (padding) {
        this._padding = padding;
        this.__html.content.style.padding = padding + "px";
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
        return this.__html.outer;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.__html.content;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-expander";

        this.__html.title = document.createElement("div");
        this.__html.title.className = "photonui-expander-title";
        this.__html.outer.appendChild(this.__html.title);

        this.__html.content = document.createElement("div");
        this.__html.content.className = "photonui-expander-content";
        this.__html.outer.appendChild(this.__html.content);
    },

    /**
     * @method __onTitleClicked
     * @private
     */
    __onTitleClicked: function (widget, event) {
        this.folded = !this._folded;
        this._callCallbacks("click", [event, this._folded]);
    }

});

module.exports = Expander;
