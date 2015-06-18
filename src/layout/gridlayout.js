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
 * @submodule Layout
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Layout = require("./layout.js");

/**
 * Grid layout.
 *
 * Layout Options:
 *
 *     {
 *          x: <Number, default: 0>,
 *          y: <Number, default: 0>,
 *          cols: <Number, default: 1>,
 *          rows: <Number, default: 1>,
 *
 *          horizontalAlign: <String (stretch|expand, start|left, center, end|right), default: stretch>,
 *          verticalAlign: <String (stretch|expand, start|top, center|middle, end|bottom), default: stretch>,
 *
 *          minWidth: <Number, default: null>,
 *          maxWidth: <Number, default: null>,
 *          width: <Number, default: null>,
 *
 *          minHeight: <Number, default: null>,
 *          maxHeight: <Number, default: null>,
 *          height: <Number, default: null>,
 *     }
 *
 * @class GridLayout
 * @constructor
 * @extends photonui.Layout
 */
var GridLayout = Layout.$extend({

    // Constructor
    __init__: function(params) {
        this.$super(params);
        this._updateProperties(["verticalSpacing"]);

        // XXX Sizing Hack
        if (window.MutationObserver) {
            this.__sizinghack_observer = new MutationObserver(this._sizingHack.bind(this));
            this.__sizinghack_observer_params = {attributes: true, childList: true, characterData: true, subtree: true};
            this.__sizinghack_observer.observe(this.__html.gridBody, this.__sizinghack_observer_params);
        }
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======

    /**
     * Vertical padding (px).
     *
     * @property verticalPadding
     * @type Number
     * @default 0
     */
    _verticalPadding: 0,

    getVerticalPadding: function() {
        return this._verticalPadding;
    },

    setVerticalPadding: function(padding) {
        this._verticalPadding = padding|0;
        this._updatingLayout = true;
        this.__html.outerbox.style.paddingLeft = this._verticalPadding + "px";
        this.__html.outerbox.style.paddingRight = this._verticalPadding + "px";
        this._updatingLayout = false;
        this._sizingHack();
    },

    /**
     * Horizontal padding (px).
     *
     * @property horizontalPadding
     * @type Number
     * @default 0
     */
    _horizontalPadding: 0,

    getHorizontalPadding: function() {
        return this._horizontalPadding;
    },

    setHorizontalPadding: function(padding) {
        this._horizontalPadding = padding|0;
        this._updatingLayout = true;
        this.__html.outerbox.style.paddingTop = this._horizontalPadding + "px";
        this.__html.outerbox.style.paddingBottom = this._horizontalPadding + "px";
        this._updatingLayout = false;
        this._sizingHack();
    },

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
        this._updatingLayout = true;
        this._updateSpacing();
        this._updatingLayout = false;
        this._sizingHack();
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
        this._horizontalSpacing = horizontalSpacing;
        this._updatingLayout = true;
        this._updateSpacing();
        this._updatingLayout = false;
        this._sizingHack();
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

    // ====== Public properties ======

    /**
     * Flag to indicate that the layout is actually been updated.
     *
     * @property _updatingLayout
     * @private
     * @type Boolean
     * @default false
     */
    _updatingLayout: false,

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
        this._updatingLayout = true;
        if (this.__sizinghack_observer) {  // XXX
            this.__sizinghack_observer.disconnect();
        }

        var children = this.children;

        // Determine the grid geometry (min x, min y, max x, max y)
        var minX = + Infinity;
        var minY = + Infinity;
        var maxX = - Infinity;
        var maxY = - Infinity;

        var options;
        for (var i=0 ; i<children.length ; i++) {
            options = this._computeLayoutOptions(children[i]);
            minX = Math.min(options.x, minX);
            minY = Math.min(options.y, minY);
            maxX = Math.max(options.x, maxX);
            maxY = Math.max(options.y, maxY);
            maxX = Math.max(options.x + options.cols - 1, maxX);
            maxY = Math.max(options.y + options.rows - 1, maxY);
        }

        var gridWidth = maxX - minX + 1;
        var gridHeight = maxY - minY + 1;

        // Clean
        this.__html.grid.removeChild(this.__html.gridBody);
        photonui.Helpers.cleanNode(this.__html.gridBody);

        // Build the layout
        var that = this;
        function _findWidgetAt(x, y) {
            var options;
            for (var i=0 ; i<children.length ; i++) {
                options = that._computeLayoutOptions(children[i]);
                if (options.x == x && options.y == y) {
                    return {w: children[i], o: options};
                }
            }
            return null;
        }

        var map = [];
        for (var y=0 ; y<gridHeight ; y++) {
            map[y] = [];
            map[y].length = gridWidth;
        }

        var child;
        var tr, td, div;
        var cellX, cellY;
        for (var y=0 ; y<gridHeight ; y++) {
            tr = document.createElement("tr");
            for (var x=0 ; x<gridWidth ; x++) {
                if (map[y][x]) {
                    continue;
                }

                td = document.createElement("td");
                td.className = "photonui-gridlayout-cell";
                div = document.createElement("div");
                div.className = "photonui-container photonui-gridlayout-wrapper";
                td.appendChild(div);
                tr.appendChild(td);

                // Spacing
                if (x == gridWidth-1) td.className += " photonui-gridlayout-lastcol";
                if (y == gridHeight-1) td.className += " photonui-gridlayout-lastrow";

                child = _findWidgetAt(x + minX, y + minY);
                if (child) {
                    div.appendChild(child.w.html);

                    // layout options: vertical/horizontal Align
                    td.className += " photonui-layout-verticalalign-" + child.o.verticalAlign;
                    td.className += " photonui-layout-horizontalalign-" + child.o.horizontalAlign;

                    // layout options: *width
                    if (child.o.minWidth !== null) {
                        div.style.minWidth = child.o.minWidth + "px";
                        td.style.minWidth = child.o.minWidth + "px";
                    }
                    if (child.o.maxWidth !== null) {
                        div.style.maxWidth = child.o.maxWidth + "px";
                        td.style.maxWidth = child.o.maxWidth + "px";
                    }
                    if (child.o.width !== null) {
                        div.style.width = child.o.width + "px";
                        td.style.width = child.o.width + "px";
                    }

                    // layout options: *height
                    if (child.o.minHeight !== null) {
                        div.style.minHeight = child.o.minHeight + "px";
                        td.style.minHeight = child.o.minHeight + "px";
                    }
                    if (child.o.maxHeight !== null) {
                        div.style.maxHeight = child.o.maxHeight + "px";
                        td.style.maxHeight = child.o.maxHeight + "px";
                    }
                    if (child.o.height !== null) {
                        div.style.height = child.o.height + "px";
                        td.style.height = child.o.height + "px";
                    }

                    // rowspan / colspan
                    if (child.o.cols > 1 || child.o.rows > 1) {
                        td.colSpan = child.o.cols;
                        td.rowSpan = child.o.rows;

                        for (var cellY=y ; cellY<y+child.o.rows ; cellY++) {
                            for (var cellX=x ; cellX<x+child.o.cols ; cellX++) {
                                map[cellY][cellX] = true;
                            }
                        }
                    }
                }
            }
            this.__html.gridBody.appendChild(tr);
        }

        // Attach nodes to the DOM
        this.__html.grid.appendChild(this.__html.gridBody);

        //
        this._updateSpacing();
        this._updatingLayout = false;
        if (this.__sizinghack_observer) {  // XXX
            this.__sizinghack_observer.observe(this.__html.gridBody, this.__sizinghack_observer_params);
        }
        this._sizingHack();
    },

    /**
     * Returns a normalized layoutOption for a given widget.
     *
     * @method _computeLayoutOptions
     * @private
     * @param {photonui.Widget} widget
     * @return {Object} the layout options
     */
    _computeLayoutOptions: function(widget) {
        var woptions = widget.layoutOptions || {};

        var options = {
            x: 0,
            y: 0,
            cols: 1,
            rows: 1,
            verticalAlign: "stretch",
            horizontalAlign: "stretch",
            minWidth: null,
            maxWidth: null,
            width: null,
            minHeight: null,
            maxHeight: null,
            height: null
        }

        // [Compatibility with old GridLayout] position / place
        if (woptions.gridX !== undefined && woptions.gridX !== null) {
            options.x = woptions.gridX|0;
        }
        if (woptions.gridY !== undefined && woptions.gridY !== null) {
            options.y = woptions.gridY|0;
        }
        if (woptions.gridWidth !== undefined && woptions.gridWidth !== null) {
            options.cols = woptions.gridWidth|0;
        }
        if (woptions.gridHeight !== undefined && woptions.gridHeight !== null) {
            options.rows = woptions.gridHeight|0;
        }

        // position / place
        if (woptions.x !== undefined && woptions.x !== null) {
            options.x = woptions.x|0;
        }
        if (woptions.y !== undefined && woptions.y !== null) {
            options.y = woptions.y|0;
        }
        if (woptions.cols !== undefined && woptions.cols !== null) {
            options.cols = woptions.cols|0;
        }
        if (woptions.rows !== undefined && woptions.rows !== null) {
            options.rows = woptions.rows|0;
        }

        // verticalAlign
        if (["stretch", "expand"].indexOf(woptions.verticalAlign) > -1) {
            options.verticalAlign = "stretch";
        }
        else if (["center", "middle"].indexOf(woptions.verticalAlign) > -1) {
            options.verticalAlign = "center";
        }
        else if (["start", "begin", "top"].indexOf(woptions.verticalAlign) > -1) {
            options.verticalAlign = "start";
        }
        else if (["end", "bottom"].indexOf(woptions.verticalAlign) > -1) {
            options.verticalAlign = "end";
        }

        // horizontalAlign
        if (["stretch", "expand"].indexOf(woptions.horizontalAlign) > -1) {
            options.horizontalAlign = "stretch";
        }
        else if (["center", "middle"].indexOf(woptions.horizontalAlign) > -1) {
            options.horizontalAlign = "center";
        }
        else if (["start", "begin", "left"].indexOf(woptions.horizontalAlign) > -1) {
            options.horizontalAlign = "start";
        }
        else if (["end", "right"].indexOf(woptions.horizontalAlign) > -1) {
            options.horizontalAlign = "end";
        }

        // [Compatibility with old GridLayout] horizontalAlign / verticalAlign
        if (woptions.verticalExpansion === true) {
            options.verticalAlign = "stretch";
        }
        else if (woptions.verticalExpansion === false) {
            if (woptions.verticalAlign === undefined) {
                options.verticalAlign = "center";
            }
        }
        if (woptions.horizontalExpansion === true) {
            options.horizontalAlign = "stretch";
        }
        else if (woptions.horizontalExpansion === false) {
            if (woptions.horizontalAlign === undefined) {
                options.horizontalAlign = "center";
            }
        }

        // *width
        if (woptions.minWidth !== undefined && woptions.minWidth !== null) {
            options.minWidth = woptions.minWidth|0;
        }
        if (woptions.maxWidth !== undefined && woptions.maxWidth !== null) {
            options.maxWidth = woptions.maxWidth|0;
        }
        if (woptions.width !== undefined && woptions.width !== null) {
            options.width = woptions.width|0;
            options.minWidth = woptions.width|0;
            options.maxWidth = woptions.width|0;
        }

        // *height
        if (woptions.minHeight !== undefined && woptions.minHeight !== null) {
            options.minHeight = woptions.minHeight|0;
        }
        if (woptions.maxHeight !== undefined && woptions.maxHeight !== null) {
            options.maxHeight = woptions.maxHeight|0;
        }
        if (woptions.height !== undefined && woptions.height !== null) {
            options.height = woptions.height|0;
            options.minHeight = woptions.height|0;
            options.maxHeight = woptions.height|0;
        }

        return options;
    },

    /**
     * Update the spacing between widgets
     *
     * @method _updateSpacing
     * @private
     */
    _updateSpacing: function() {
        var nodes = this.__html.outerbox.querySelectorAll("#" + this.name + " > table > tbody > tr > td");
        for (var i=0 ; i<nodes.length ; i++) {
            nodes[i].style.paddingRight = this._verticalSpacing + "px";
            nodes[i].style.paddingBottom = this._horizontalSpacing + "px";
        }
    },

    /**
     * Hack to get thing working with Gecko and Trident.
     *
     * MSIE 11:
     *
     *   * The hack fixes all the issues,
     *
     * MSIE 10:
     *
     *   * There is issues with rowspan
     *   * The dynamic resizing does not works
     *
     * Firefox:
     *
     *   * There is some minor issues with rowspan
     *
     * @method _sizingHack
     * @private
     */
    _sizingHack: function() {
        if (this._updatingLayout) {
            return;
        }

        // Automatically disable the hack for webkit browsers
        if (localStorage._photonui_gridlayout_sizinghack == "disabled") {
            return;
        }
        else if (localStorage._photonui_gridlayout_sizinghack === undefined) {
            var isWebkit = false;
            if ("WebkitAppearance" in document.documentElement.style) isWebkit = true;
            if ("WebKitCSSMatrix" in window) isWebkit = true;
            if (isWebkit) {
                localStorage._photonui_gridlayout_sizinghack = "disabled";
                return;
            }
            else {
                localStorage._photonui_gridlayout_sizinghack = "enabled";
            }
        }

        this._updatingLayout = true;
        if (this.__sizinghack_observer) {
            this.__sizinghack_observer.disconnect();
        }

        function _hack() {
            var nodes = this.__html.outerbox.querySelectorAll("#" + this.name + " > table > tbody > tr > td");
            for (var i=0 ; i<nodes.length ; i++) {
                nodes[i].style.height = "auto";
            }
            var tdHeight;
            for (var i=0 ; i<nodes.length ; i++) {
                if (nodes[i].style.minHeight && nodes[i].style.minHeight == nodes[i].style.maxHeight) {
                    tdHeight = parseFloat(nodes[i].style.minHeight);
                }
                else if (nodes[i].classList.contains("photonui-gridlayout-lastrow")) {
                    tdHeight = nodes[i].offsetHeight;
                }
                else {
                    tdHeight = nodes[i].offsetHeight - this.verticalSpacing;
                }
                nodes[i].style.height = tdHeight + "px";
            }

            this._updatingLayout = false;
            if (this.__sizinghack_observer) {
                this.__sizinghack_observer.observe(this.__html.gridBody, this.__sizinghack_observer_params);
            }
        }

        setTimeout(_hack.bind(this), 1);
    }
});

module.exports = GridLayout;
