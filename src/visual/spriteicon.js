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
 * @submodule Visual
 * @namespace photonui
 */

var BaseIcon = require("./baseicon.js");
var SpriteSheet = require("../nonvisual/spritesheet.js");

/**
 * Sprite sheet based icons.
 *
 * Special contructor params:
 *
 *      new photonui.SpriteIcon( {optional params...} )
 *      new photonui.SpriteIcon( "spriteSheetName/iconName", {optional params...} )
 *
 * @class SpriteIcon
 * @constructor
 * @extends photonui.BaseIcon
 */
var SpriteIcon = BaseIcon.$extend({

    // Constructor
    __init__: function(params1, params2) {
        var params = {};
        if (params1 && typeof(params1) == "string") {
            params.icon = params1;
            if (params2 && typeof(params2) == "object") {
                for (var i in params2) {
                    params[i] = params2[i];
                }
            }
        }
        else if (params1) {
            params = params1;
        }
        this.$super(params);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The sprite sheet name.
     *
     * @property spriteSheetName
     * @type String
     * @default ""
     */
    _spriteSheetName: "",

    getSpriteSheetName: function() {
        return this._spriteSheetName;
    },

    setSpriteSheetName: function(spriteSheetName) {
        this._spriteSheetName = spriteSheetName || "";
        this._update();
    },

    /**
     * The icon name.
     *
     * @property iconName
     * @type String
     * @default ""
     */
    _iconName: "",

    getIconName: function() {
        return this._iconName;
    },

    setIconName: function(iconName) {
        this._iconName = iconName || "";
        this._update();
    },

    /**
     * The icon id.
     *
     *     "spriteSheetName/iconName"
     *
     * @property icon
     * @type String
     * @default "/"
     */
    getIcon: function() {
        return this.spriteSheetName + "/" + this.iconName;
    },

    setIcon: function(icon) {
        var names = icon.split("/");
        this.spriteSheetName = names[0];
        this.iconName = names[1];
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


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Private methods ======

    /**
     * Update the icon.
     *
     * @method _update
     * @private
     */
    _update: function() {
        var style = "";
        if (this.spriteSheetName && this.iconName) {
            style = SpriteSheet.getSpriteSheet(this.spriteSheetName).getIconCss(this.iconName);
        }
        this.__html.icon.setAttribute("style", style);
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        this.__html.outer = document.createElement("span");
        this.__html.outer.className = "photonui-widget photonui-icon photonui-spriteicon";

        this.__html.icon = document.createElement("span");
        this.__html.outer.appendChild(this.__html.icon);
    }
});

module.exports = SpriteIcon;
