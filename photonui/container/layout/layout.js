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
 * Base class for layout.
 *
 * @class Layout
 * @constructor
 * @extends photonui.Container
 */
photonui.Layout = function(params) {
    photonui.Container.call(this, params);

    var params = params || {};

    // Attrs
    this.childrenWidgets = [];
}

photonui.Layout.prototype = new photonui.Container();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get children widgets.
 *
 * @method getChildren
 * @return {Array} List of `photonui.Widget`.
 */
photonui.Layout.prototype.getChildren = function() {
    return this.childrenWidgets;
}

/**
 * Get the layout options of the given widget.
 *
 * @method getLayoutOptions
 * @param {photonui.Widget} widget
 * @return {Object} The layoutOptions widget.
 */
photonui.Layout.prototype.getLayoutOptions = function(widget) {
    return widget.layoutOptions;
}

/**
 * Set the layout options of the given widget.
 *
 * @method setLayoutOptions
 * @param {photonui.Widget} widget
 * @param {Object} options The layoutOptions widget.
 */
photonui.Layout.prototype.setLayoutOptions = function(widget, options) {
    widget.layoutOptions = options || {};
    this._updateLayout();
}

// Documentation in photonui.Widget
photonui.Layout.prototype.getChild = function() {
    console.warn("Warning: You cannot use getChild() on layout widgets, please use getChildren() instead.");
}

// Documentation in photonui.Widget
photonui.Layout.prototype.setChild = function(child) {
    console.warn("Warning: You cannot use setChild() on layout widgets, please use addChild() instead.");
}


//////////////////////////////////////////
// Public Methods                       //
//////////////////////////////////////////


/**
 * Add a widget to the layout.
 *
 * @method addChild
 * @param {photonui.Widget} widget The widget to add.
 * @param {Object} layoutOption Specific option for the layout (optional).
 */
photonui.Layout.prototype.addChild = function(widget, layoutOptions) {
    if (layoutOptions) {
        for (var option in layoutOptions) {
            widget.layoutOptions[option] = layoutOptions[option];
        }
    }
    this.childrenWidgets.push(widget);
    this._updateLayout();
}

/**
 * Remove a widget from the layout.
 *
 * @method removeChild
 * @param {photonui.Widget} widget The widget to remove.
 */
photonui.Layout.prototype.removeChild = function(widget) {
    var index = this.childrenWidgets.indexOf(widget);
    if (index >= 0) {
        this.childrenWidgets.splice(widget, 1);
    }
    this._updateLayout();
}

// Documentation in photonui.Widget
photonui.Layout.prototype.destroy = function() {
    for (var i in this.childrenWidgets) {
        this.childrenWidgets[i].destroy();
    }
    photonui.Container.prototype.destroy.call(this);
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Update the layout.
 *
 * @method _updateLayout
 * @private
 */
photonui.Layout.prototype._updateLayout = function() {
    throw "Error: you should define the _updateLayout() method when you extend a layout widget.";
}
