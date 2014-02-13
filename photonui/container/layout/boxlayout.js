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
 * @extends photonui.Layout
 * @param {String} params.orientation The orientation of the box layout: `"vertical"` or `"horizontal"` (optional, default = "vertical").
 * @param {Number} params.verticalSpacing Vertical spacing between widgets (optional, default = 5).
 * @param {Number} params.horizontalSpacing Horizontal spacing between widgets (optional, default = 5).
 */
photonui.BoxLayout = function(params) {
    photonui.Layout.call(this, params);

    var params = params || {};

    // Attrs
    this.orientation = params.orientation || "vertical";
    this.verticalSpacing = (params.verticalSpacing != undefined) ? params.verticalSpacing : 5;
    this.horizontalSpacing = (params.horizontalSpacing != undefined) ? params.horizontalSpacing : 5;

    this._e = {};  // HTML elements

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
}

photonui.BoxLayout.prototype = new photonui.Layout;


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the orientation of the layout.
 *
 * @method getOrientation
 * @return {String} The layout orientation: `"vertical"` or `"horizontal"`.
 */
photonui.BoxLayout.prototype.getOrientation = function() {
    return this.orientation;
}

/**
 * Set the orientation of the layout.
 *
 * @method setOrientation
 * @param {String} orientation The layout orientation: `"vertical"` or `"horizontal"`.
 */
photonui.BoxLayout.prototype.setOrientation = function(orientation) {
    if (orientation != "vertical" && orientation != "horizontal") {
        throw "Error: The orientation should be \"vertical\" or \"horizontal\".";
        return;
    }
    this.orientation = orientation;
    this.removeClass("photonui-layout-orientation-vertical");
    this.removeClass("photonui-layout-orientation-horizontal");
    this.addClass("photonui-layout-orientation-" + this.orientation);
    this._updateLayout();
}

/**
 * Get the vertical spacing.
 *
 * @method getVerticalSpacing
 * @return {Number} The vertical spacing between widgets.
 */
photonui.BoxLayout.prototype.getVerticalSpacing = function() {
    return this.verticalSpacing;
}

/**
 * Set the vertical spacing.
 *
 * @method setVerticalSpacing
 * @param {Number} spacing The vertical spacing between widgets.
 */
photonui.BoxLayout.prototype.setVerticalSpacing = function(spacing) {
    this.verticalSpacing = spacing;
    this._e.grid.style.borderSpacing = this.horizontalSpacing + "px " + this.verticalSpacing + "px";
}

/**
 * Get the horizontal spacing.
 *
 * @method getHorizontalSpacing
 * @return {Number} The horizontal spacing between widgets.
 */
photonui.BoxLayout.prototype.getHorizontalSpacing = function() {
    return this.horizontalSpacing;
}

/**
 * Set the horizontal spacing.
 *
 * @method setHorizontalSpacing
 * @param {Number} spacing The horizontal spacing between widgets.
 */
photonui.BoxLayout.prototype.setHorizontalSpacing = function(spacing) {
    this.horizontalSpacing = spacing;
    this._e.grid.style.borderSpacing = this.horizontalSpacing + "px " + this.verticalSpacing + "px";
}

/**
 * Get the HTML of the layout.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.BoxLayout.prototype.getHtml = function() {
    return this._e.outerbox;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the box layout.
 *
 * @method _buildHtml
 * @private
 */
photonui.BoxLayout.prototype._buildHtml = function() {
    this._e.outerbox = document.createElement("div");
    this._e.outerbox.className = "photonui-widget photonui-boxlayout";

    this._e.grid = document.createElement("table");
    this._e.outerbox.appendChild(this._e.grid);

    this._e.gridBody = document.createElement("tbody");
    this._e.grid.appendChild(this._e.gridBody);
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.BoxLayout.prototype._updateAttributes = function() {
    photonui.Layout.prototype._updateAttributes.call(this);
    this.setOrientation(this.orientation);
    this.setVerticalSpacing(this.verticalSpacing);
}

/**
 * Update the layout.
 *
 * @method _updateLayout
 * @private
 */
photonui.BoxLayout.prototype._updateLayout = function() {
    photonui.Helpers.cleanNode(this._e.gridBody);

    var e_tr = null;
    if (this.getOrientation() == "horizontal") {
        e_tr = document.createElement("tr");
        this._e.gridBody.appendChild(e_tr);
    }

    for (var i=0 ; i<this.childrenWidgets.length ; i++) {
        if (this.getOrientation() == "vertical") {
            e_tr = document.createElement("tr");
            this._e.gridBody.appendChild(e_tr);
        }

        var e_td = document.createElement("td");
        e_td.className = "photonui-container photonui-boxlayout-cell";
        e_tr.appendChild(e_td);

        // Layout Options: Expansion
        if (this.childrenWidgets[i].layoutOptions.horizontalExpansion == undefined
        ||  this.childrenWidgets[i].layoutOptions.horizontalExpansion) {
            e_td.className += " photonui-container-expand-child-horizontal";
        }
        if (this.childrenWidgets[i].layoutOptions.verticalExpansion == undefined
        ||  this.childrenWidgets[i].layoutOptions.verticalExpansion) {
            e_td.className += " photonui-container-expand-child-vertical";
        }

        // Layout Options: width
        if (this.childrenWidgets[i].layoutOptions.width != undefined) {
            e_td.style.height = this.childrenWidgets[i].layoutOptions.width + "px";
        }
        // Layout Options: height
        if (this.childrenWidgets[i].layoutOptions.height != undefined) {
            e_td.style.height = this.childrenWidgets[i].layoutOptions.height + "px";
        }
        // Layout Options: minWidth
        if (this.childrenWidgets[i].layoutOptions.minWidth != undefined) {
            e_td.style.minWidth = this.childrenWidgets[i].layoutOptions.minWidth + "px";
        }
        // Layout Options: minHeight
        if (this.childrenWidgets[i].layoutOptions.minHeight != undefined) {
            e_td.style.minHeight = this.childrenWidgets[i].layoutOptions.minHeight + "px";
        }
        // Layout Options: maxWidth
        if (this.childrenWidgets[i].layoutOptions.maxWidth != undefined) {
            e_td.style.maxWidth = this.childrenWidgets[i].layoutOptions.maxWidth + "px";
        }
        // Layout Options: maxHeight
        if (this.childrenWidgets[i].layoutOptions.maxHeight != undefined) {
            e_td.style.maxHeight = this.childrenWidgets[i].layoutOptions.maxHeight + "px";
        }
        // Layout Options: horizontalAlign
        if (this.childrenWidgets[i].layoutOptions.horizontalAlign != undefined) {
            e_td.style.textAlign = this.childrenWidgets[i].layoutOptions.horizontalAlign; console.log("hhhh");
        }

        e_td.appendChild(this.childrenWidgets[i].getHtml());
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
