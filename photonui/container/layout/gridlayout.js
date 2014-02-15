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
 * Grid layout.
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
 *          horizontalAlign: <String (left, center, right), default: center>,
 *          gridX: <Number, default: 0>,
 *          gridY: <Number, default: 0>,
 *          gridWidth: <Number, default: 1>,
 *          gridHeight: <Number, default: 1>,
 *     }
 *
 * @class GridLayout
 * @constructor
 * @extends photonui.Layout
 */
photonui.GridLayout = photonui.Layout.$extend({

    // Constructor
    __init__: function(params) {
        this.$super(params);
        this._updateProperties(["verticalSpacing"]);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The vertical spacing between children widgets.
     *
     * @property verticalSpacing
     * @type Number
     * @default 5
     */
    _verticalSpacing: 5,

    getVerticalSpacing: function() {
        return this._verticalSpacing;
    },

    setVerticalSpacing: function(verticalSpacing) {
        this._verticalSpacing = verticalSpacing;
        this.__html.grid.style.borderSpacing = this.verticalSpacing + "px " + this.horizontalSpacing + "px";
    },

    /**
     * The horizontal spacing between children widgets.
     *
     * @property horizontalSpacing
     * @type Number
     * @default 5
     */
    _horizontalSpacing: 5,

    getHorizontalSpacing: function() {
        return this._horizontalSpacing;
    },

    setHorizontalSpacing: function(horizontalSpacing) {
        this._verticalSpacing = horizontalSpacing;
        this.__html.grid.style.borderSpacing = this.verticalSpacing + "px " + this.horizontalSpacing + "px";
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
        return this.__html.outerbox;
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
        this.__html.outerbox = document.createElement("div");
        this.__html.outerbox.className = "photonui-widget photonui-gridlayout";

        this.__html.grid = document.createElement("table");
        this.__html.outerbox.appendChild(this.__html.grid);

        this.__html.gridBody = document.createElement("tbody");
        this.__html.grid.appendChild(this.__html.gridBody);
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function() {
        // Calculate geometry
        var ox = Infinity;  // Offset X
        var oy = Infinity;  // Offset Y
        var nc = 0;  // Number of columns
        var nr = 0;  // Number of rows
        var children = this.children;
        for (var i=0 ; i<children.length ; i++) {
            children[i].layoutOptions.gridX = (children[i].layoutOptions.gridX != undefined) ? children[i].layoutOptions.gridX : 0;
            children[i].layoutOptions.gridY = (children[i].layoutOptions.gridY != undefined) ? children[i].layoutOptions.gridY : 0;
            children[i].layoutOptions.gridWidth = Math.max(children[i].layoutOptions.gridWidth, 1) || 1;
            children[i].layoutOptions.gridHeight = Math.max(children[i].layoutOptions.gridHeight, 1) || 1;
            ox = Math.min(ox, children[i].layoutOptions.gridX);
            oy = Math.min(oy, children[i].layoutOptions.gridY);
            nc = Math.max(nc, children[i].layoutOptions.gridX + children[i].layoutOptions.gridWidth);
            nr = Math.max(nr, children[i].layoutOptions.gridY + children[i].layoutOptions.gridHeight);
        }
        nc -= ox;
        nr -= oy;

        // Find and fix conflicts
        // TODO

        // Build
        photonui.Helpers.cleanNode(this.__html.gridBody);
        var map = [];
        for (var y=0 ; y<nr ; y++) {
            var row = [];
            for (var x=0 ; x<nc ; x++) {
                row.push(false);
            }
            map.push(row);
        }
        for (var y=0 ; y<nr ; y++) {
            var e_tr = document.createElement("tr");
            this.__html.gridBody.appendChild(e_tr);
            for (var x=0 ; x<nc ; x++) {
                if (map[y][x]) {
                    continue;
                }
                var widget = false;
                var e_td = document.createElement("td");
                e_td.className = "photonui-container photonui-gridlayout-cell";
                e_tr.appendChild(e_td);
                for (var i=0 ; i<children.length ; i++) {
                    if (children[i].layoutOptions.gridX - ox == x && children[i].layoutOptions.gridY - oy == y) {
                        widget = true;
                        var cs = children[i].layoutOptions.gridWidth;
                        var rs = children[i].layoutOptions.gridHeight;
                        e_td.colSpan = cs;
                        e_td.rowSpan = rs;
                        e_td.appendChild(children[i].html);

                        if (children[i].layoutOptions.horizontalExpansion == undefined
                        ||  children[i].layoutOptions.horizontalExpansion) {
                            e_td.className += " photonui-container-expand-child-horizontal"
                        }
                        if (children[i].layoutOptions.verticalExpansion == undefined
                        ||  children[i].layoutOptions.verticalExpansion) {
                            e_td.className += " photonui-container-expand-child-vertical"
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
                            e_td.style.minWidth = children[i].layoutOptions.minWidth + "px";
                        }
                        // Layout Options: minHeight
                        if (children[i].layoutOptions.minHeight != undefined) {
                            e_td.style.minHeight = children[i].layoutOptions.minHeight + "px";
                        }
                        // Layout Options: maxWidth
                        if (children[i].layoutOptions.maxWidth != undefined) {
                            e_td.style.maxWidth = children[i].layoutOptions.maxWidth + "px";
                        }
                        // Layout Options: maxHeight
                        if (children[i].layoutOptions.maxHeight != undefined) {
                            e_td.style.maxHeight = children[i].layoutOptions.maxHeight + "px";
                        }
                        // Layout Options: horizontalAlign
                        if (children[i].layoutOptions.horizontalAlign != undefined) {
                            e_td.style.textAlign = children[i].layoutOptions.horizontalAlign;
                        }

                        if (cs > 1 || rs > 1) {
                            for (var r=y ; r<y+rs ; r++) {
                                for (var c=x ; c<x+cs ; c++) {
                                    map[r][c] = true;
                                }
                            }
                        }
                        break;
                    }
                }
                if (!widget) {
                    e_td.innerHTML = "&nbsp;";
                }
            }
        }

        // Hack for Gecko and Trident
        var cells = document.querySelectorAll("#" + this.name + " td");
        var heights = [];
        var padding = 0;
        for (var i=0 ; i<cells.length ; i++) {
            if (cells[i].childNodes.length == 1 && cells[i].childNodes[0] instanceof HTMLElement) {
                padding = parseInt(getComputedStyle(cells[i].childNodes[0]).paddingTop);
                padding += parseInt(getComputedStyle(cells[i].childNodes[0]).paddingBottom);
            }
            heights[i] = (cells[i].offsetHeight - padding) + "px";
        }
        for (var i=0 ; i<cells.length ; i++) {
            cells[i].style.height = heights[i];
        }
    }
});
