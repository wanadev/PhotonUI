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
 * @submodule Widget
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
 *          maxHeight: <Number, default: undefined>
 *     }
 *
 * @class BoxLayout
 * @constructor
 * @extends photonui.Layout
 * @param {String} params.orientation The orientation of the box layout: `"vertical"` or `"horizontal"` (optional, default = "vertical").
 * @param {Number} params.spacing Spacing between widgets (optional, default = 5).
 */
photonui.BoxLayout = function(params) {
    photonui.Layout.call(this, params);

    var params = params || {};

    // Attrs
    this.orientation = params.orientation || "vertical";
    this.spacing = (params.spacing != undefined) ? params.spacing : 5;

    this._e = {};  // HTML elements

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
}

photonui.BoxLayout.prototype = new photonui.Layout();


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
 * Get the spacing.
 *
 * @method getSpacing
 * @return {Number} The spacing between widgets.
 */
photonui.BoxLayout.prototype.getSpacing = function() {
    return this.spacing;
}

/**
 * Set widgets spacing.
 *
 * @method setSpacing
 * @param {Number} spacing The spacing between widgets.
 */
photonui.BoxLayout.prototype.setSpacing = function(spacing) {
    this.spacing = spacing;
    this._updateLayout();
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
 * Build the HTML of the bow layout.
 *
 * @method _buildHtml
 * @private
 */
photonui.BoxLayout.prototype._buildHtml = function() {
    this._e.outerbox = document.createElement("div");
    this._e.outerbox.className = "photonui-widget photonui-boxlayout photonui-boxlayout-outerbox";

    this._e.innerbox = document.createElement("div");
    this._e.innerbox.className = "photonui-boxlayout-innerbox";
    this._e.outerbox.appendChild(this._e.innerbox);
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
}

/**
 * Update the layout.
 *
 * @method _updateLayout
 * @private
 */
photonui.BoxLayout.prototype._updateLayout = function() {
    this._e.innerbox.innerHTML = "";
    for (var i in this.childrenWidgets) {
        var widgetOuterbox = document.createElement("div");
        widgetOuterbox.className = "photonui-boxlayout-widgetouterbox";

        var widgetInnerbox = document.createElement("div");
        widgetInnerbox.className = "photonui-boxlayout-widgetinnerbox";
        widgetOuterbox.appendChild(widgetInnerbox);

        // Padding
        if (i > 0 && this.orientation == "vertical") {
            widgetInnerbox.style.paddingTop = this.spacing + "px";
        }
        else if (i > 0 && this.orientation == "horizontal") {
            widgetInnerbox.style.paddingLeft = this.spacing + "px";
        }

        // Layout Options: Expansion
        if (this.childrenWidgets[i].layoutOptions.horizontalExpansion == undefined
        ||  this.childrenWidgets[i].layoutOptions.horizontalExpansion) {
            widgetInnerbox.className += " photonui-container-expand-child-horizontal"
        }
        if (this.childrenWidgets[i].layoutOptions.verticalExpansion == undefined
        ||  this.childrenWidgets[i].layoutOptions.verticalExpansion) {
            widgetInnerbox.className += " photonui-container-expand-child-vertical"
        }
        // Layout Options: width
        if (this.childrenWidgets[i].layoutOptions.width != undefined) {
            widgetInnerbox.style.height = this.childrenWidgets[i].layoutOptions.width + "px";
        }
        // Layout Options: height
        if (this.childrenWidgets[i].layoutOptions.height != undefined) {
            widgetInnerbox.style.height = this.childrenWidgets[i].layoutOptions.height + "px";
        }
        // Layout Options: minWidth
        if (this.childrenWidgets[i].layoutOptions.minWidth != undefined) {
            widgetInnerbox.style.minWidth = this.childrenWidgets[i].layoutOptions.minWidth + "px";
        }
        // Layout Options: minHeight
        if (this.childrenWidgets[i].layoutOptions.minHeight != undefined) {
            widgetInnerbox.style.minHeight = this.childrenWidgets[i].layoutOptions.minHeight + "px";
        }
        // Layout Options: maxWidth
        if (this.childrenWidgets[i].layoutOptions.maxWidth != undefined) {
            widgetInnerbox.style.maxWidth = this.childrenWidgets[i].layoutOptions.maxWidth + "px";
        }
        // Layout Options: maxHeight
        if (this.childrenWidgets[i].layoutOptions.maxHeight != undefined) {
            widgetInnerbox.style.maxHeight = this.childrenWidgets[i].layoutOptions.maxHeight + "px";
        }


        widgetInnerbox.appendChild(this.childrenWidgets[i].getHtml());
        this.childrenWidgets[i]._updateAttributes();  // Fix for MSIE
        this._e.innerbox.appendChild(widgetOuterbox);
    }
}
