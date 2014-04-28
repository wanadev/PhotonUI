/*
 * Copyright (c) 2014, Wanadev <http://www.wanadev.fr/>
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
 * @submodule Container
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * Menu item.
 *
 * @class MenuItem
 * @constructor
 * @extends photonui.Container
 */
photonui.MenuItem = photonui.Container.$extend({

    // Constructor
    __init__: function(params) {
        this.$super(params);
        this._registerWEvents(["click"]);
        this._updateProperties(["text", "icon", "active"]);

        this._bindEvent("click", this.__html.outer, "click", function(event) {
            this._callCallbacks("click", [event]);
        }.bind(this));
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * An optional value for the item (can be used in select).
     *
     * @property value
     * @type String (maybe)
     * @default ""
     */
    _value: "",

    getValue: function() {
        return this._value;
    },

    setValue: function(value) {
        this._value = value;
    },

    /**
     * The item text.
     *
     * @property text
     * @type String
     * @default "Menu Item"
     */
    _text: "Menu Item",

    getText: function() {
        return this._text;
    },

    setText: function(text) {
        this._text = text;
        this.__html.text.innerHTML = photonui.Helpers.escapeHtml(text);
    },

    /**
     * Right icon widget name.
     *
     * @property iconName
     * @type String
     * @default: null
     */
    _iconName: null,

    getIconName: function() {
        return this._iconName;
    },

    setIconName: function(iconName) {
        this._iconName = iconName;
        photonui.Helpers.cleanNode(this.__html.icon);
        if (this._iconName) {
            this.__html.icon.appendChild(this.icon.html);
        }
    },

    /**
     * Right icon widget.
     *
     * @property icon
     * @type photonui.BaseIcon
     * @default: null
     */
    getIcon: function() {
        return photonui.getWidget(this._iconName);
    },

    setIcon: function(icon) {
        if (icon instanceof photonui.BaseIcon) {
            this.iconName = icon.name;
            return;
        }
        this.iconName = null;
    },

    /**
     * Determine if the item is active (highlighted).
     *
     * @property active
     * @type Boolean
     * @default false
     */
    _active: false,

    getActive: function() {
        return this._active;
    },

    setActive: function(active) {
        this._active = active;

        if (active) {
            this.addClass("photonui-menuitem-active");
        }
        else {
            this.removeClass("photonui-menuitem-active");
        }
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
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function() {
        return this.__html.widget;
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
    _buildHtml: function() {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-menuitem";

        this.__html.icon = document.createElement("span");
        this.__html.icon.className = "photonui-menuitem-icon";
        this.__html.outer.appendChild(this.__html.icon);

        this.__html.text = document.createElement("span");
        this.__html.text.className = "photonui-menuitem-text";
        this.__html.outer.appendChild(this.__html.text);

        this.__html.widget = document.createElement("span");
        this.__html.widget.className = "photonui-menuitem-widget";
        this.__html.outer.appendChild(this.__html.widget);
    },


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    // TODO Internal events callback here
});
