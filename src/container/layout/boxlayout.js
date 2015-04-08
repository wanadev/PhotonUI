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

var Helpers = require("../../helpers.js");
var GridLayout = require("./gridlayout.js");

/**
 * Vertical and horizontal box layout.
 *
 * Layout Options:
 *
 *     {
 *          verticalExpansion: <Boolean, default: true>,
 *          horizontalExpansion: <Boolean, default: true>,
 *          width: <Number, default: undefined>,
 *          height: <Number, default: undefined>,
 *          minWidth: <Number, default: undefined>,
 *          minHeight: <Number, default: undefined>,
 *          maxWidth: <Number, default: undefined>,
 *          maxHeight: <Number, default: undefined>,
 *          horizontalAlign: <String (left, center, right), default: undefined>
 *     }
 *
 * @class BoxLayout
 * @constructor
 * @extends photonui.GridLayout
 */
var BoxLayout = GridLayout.$extend({

    // Constructor
    __init__: function(params) {
        this.$super(params);
        this._updateProperties(["orientation"]);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The layout orientation ("vertical" or "horizontal").
     *
     * @property orientation
     * @type String
     * @default "vertical"
     */
    _orientation: "vertical",

    getOrientation: function() {
        return this._orientation;
    },

    setOrientation: function(orientation) {
        if (orientation != "vertical" && orientation != "horizontal") {
            throw "Error: The orientation should be \"vertical\" or \"horizontal\".";
            return;
        }
        this._orientation = orientation;
        this.removeClass("photonui-layout-orientation-vertical");
        this.removeClass("photonui-layout-orientation-horizontal");
        this.addClass("photonui-layout-orientation-" + this.orientation);
        this._updateLayout();
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
        this.$super();
        this.__html.outerbox.className = "photonui-widget photonui-boxlayout";
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function() {
        Helpers.cleanNode(this.__html.gridBody);

        var e_tr = null;
        if (this.getOrientation() == "horizontal") {
            e_tr = document.createElement("tr");
            this.__html.gridBody.appendChild(e_tr);
        }

        var children = this.children;

        for (var i=0 ; i<children.length ; i++) {
            if (this.getOrientation() == "vertical") {
                e_tr = document.createElement("tr");
                this.__html.gridBody.appendChild(e_tr);
            }

            var e_td = document.createElement("td");
            e_td.className = "photonui-container photonui-boxlayout-cell";
            e_tr.appendChild(e_td);

            // Layout Options: Expansion
            if (children[i].layoutOptions.horizontalExpansion == undefined
            ||  children[i].layoutOptions.horizontalExpansion) {
                e_td.className += " photonui-container-expand-child-horizontal";
            }
            if (children[i].layoutOptions.verticalExpansion == undefined
            ||  children[i].layoutOptions.verticalExpansion) {
                e_td.className += " photonui-container-expand-child-vertical";
            }

            // Layout Options: width
            if (children[i].layoutOptions.width != undefined) {
                e_td.style.height = children[i].layoutOptions.width + "px";
            }
            // Layout Options: height
            if (children[i].layoutOptions.height != undefined) {
                e_td.style.height = children[i].layoutOptions.height + "px";
            }
            // Layout Options: minWidth
            if (children[i].layoutOptions.minWidth != undefined) {
                e_td.style.minWidth = this.childrenWidgets[i].layoutOptions.minWidth + "px";
            }
            // Layout Options: minHeight
            if (children[i].layoutOptions.minHeight != undefined) {
                e_td.style.minHeight = this.childrenWidgets[i].layoutOptions.minHeight + "px";
            }
            // Layout Options: maxWidth
            if (children[i].layoutOptions.maxWidth != undefined) {
                e_td.style.maxWidth = this.childrenWidgets[i].layoutOptions.maxWidth + "px";
            }
            // Layout Options: maxHeight
            if (children[i].layoutOptions.maxHeight != undefined) {
                e_td.style.maxHeight = this.childrenWidgets[i].layoutOptions.maxHeight + "px";
            }
            // Layout Options: horizontalAlign
            if (children[i].layoutOptions.horizontalAlign != undefined) {
                e_td.style.textAlign = this.childrenWidgets[i].layoutOptions.horizontalAlign; console.log("hhhh");
            }

            e_td.appendChild(children[i].html);
        }

        // Hack for Gecko and Trident
        //var cells = document.querySelectorAll("#" + this.name + " td");
        //var heights = [];
        //var padding = 0;
        //for (var i=0 ; i<cells.length ; i++) {
            //if (cells[i].childNodes.length == 1 && cells[i].childNodes[0] instanceof HTMLElement) {
                //padding = parseInt(getComputedStyle(cells[i].childNodes[0]).paddingTop);
                //padding += parseInt(getComputedStyle(cells[i].childNodes[0]).paddingBottom);
            //}
            //heights[i] = (cells[i].offsetHeight - padding) + "px";
        //}
        //for (var i=0 ; i<cells.length ; i++) {
            //cells[i].style.height = heights[i];
        //}
    }
});

module.exports = BoxLayout;
