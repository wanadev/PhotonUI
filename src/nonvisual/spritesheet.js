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
 * @submodule NonVisual
 * @namespace photonui
 */

var Base = require("../base.js");

var _spritesheets = {};

/**
 * Sprite sheet (to use with SpriteIcon).
 *
 * @class SpriteSheet
 * @constructor
 * @extends photonui.Base
 */
var SpriteSheet = Base.$extend({

    // Constructor
    __init__: function(params) {
        this._icons = {};
        this.$super(params);
        this._updateProperties(["name"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The sprit sheet name.
     *
     * @property name
     * @type String
     * @default "default"
     */
    _name: "default",

    getName: function() {
        return this._name;
    },

    setName: function(name) {
        if (_spritesheets[this.name] == this) {
            delete _spritesheets[this.name];
        }
        this._name = name;
        _spritesheets[this.name] = this;
    },

    /**
     * The spritesheet image URL.
     *
     * @property imageUrl
     * @type String
     * @default null
     */
    _imageUrl: null,

    getImageUrl: function() {
        return this._imageUrl;
    },

    setImageUrl: function(url) {
        if (!url) {
            this._imageUrl = null;
            return;
        }
        if (this._imageUrl != url) {
            this._imageUrl = url;
            // Preload
            var img = new Image();
            img.src = url;
        }
    },

    /**
     * Icon size (width = height).
     *
     * @property size
     * @type Number
     * @default 16
     */
    _size: 16,

    getSize: function() {
        return this._size;
    },

    setSize: function(size) {
        this._size = size;
    },

    /**
     * Icons.
     *
     *     {
     *          "iconName": [x, y],
     *          "icon2": [x2, y2],
     *          ...
     *     }
     *
     * @property icons
     * @type Object
     * @default: {}
     */
    _icons: {},

    getIcons: function() {
        return this._icons;
    },

    setIcons: function(icons) {
        for (icon in icons) {
            this._icons[icon] = icons[icon];
        }
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======


    /**
     * Get icon position.
     *
     * @method getIconPosition
     * @param {String} iconName
     * @return {Object} `{x: Number, y: Number}`
     */
    getIconPosition: function(iconName) {
        return {x: this.icons[iconName][0], y: this.icons[iconName][1]};
    },

    /**
     * Get the right CSS for the given icon.
     *
     * @method getIconCss
     * @param {String} iconName
     * @return {String} the CSS.
     */
    getIconCss: function(iconName) {
        return "width: "      + this.size + "px; " +
               "height: "     + this.size + "px; " +
               "background: " + "url(" + this.imageUrl + ") " +
                                "-" + this.getIconPosition(iconName).x + "px " +
                                "-" + this.getIconPosition(iconName).y + "px;" ;
    },

    /**
     * Add an icon (set its position).
     *
     * @method addIcon
     * @param {String} iconName
     * @param {Number} x
     * @param {Number} y
     */
    addIcon: function(iconName, x ,y) {
        this.icons = {iconName: [x, y]};
    },

    /**
     * Remove an icon.
     *
     * @method removeIcon
     * @param {String} iconName
     */
    removeIcon: function(iconName) {
        delete this._icons[iconName];
    }
});

/*
 * Get a sprite sheet.
 *
 * @method getSpriteSheet
 * @param {String} name The sprite sheet name.
 *
 * @return {photonui.SpriteSheet} The sprite sheet or null.
 */
SpriteSheet.getSpriteSheet = function(name) {
    if (_spritesheets[name] !== undefined) {
        return _spritesheets[name];
    }
    return null;
}

module.exports = SpriteSheet;
