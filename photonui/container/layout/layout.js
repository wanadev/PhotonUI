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
photonui.Layout = photonui.Container.$extend({

    // Constructor
    __init__: function(params) {
        this._childrenNames = [];  // new instance
        this.$super(params);
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * Layout children widgets name.
     *
     * @property childrenNames
     * @type Array
     * @default []
     */
    _childrenNames: [],

    getChildrenNames: function() {
        return this._childrenNames;
    },

    setChildrenNames: function(childrenNames) {
        this._childrenNames = childrenNames;
        this._updateLayout();
    },

    /**
     * Layout children widgets.
     *
     * @property children
     * @type Array
     * @default []
     */
    getChildren: function() {
        var children = [];
        for (var i=0 ; i<this._childrenNames.length ; i++) {
            children.push(photonui.getWidget(this._childrenNames[i]));
        }
        return children;
    },

    setChildren: function(children) {
        var childrenNames = [];
        for (var i=0 ; i<children.length ; i++) {
            if (children[i] instanceof photonui.Widget) {
                childrenNames.push(children[i].name);
            }
        }
        this.childrenNames = childrenNames;
    },

    // Override getChildName / setChildName / getChild / setChild

    getChildName: function() {
        console.warn("Warning: You cannot use getChild() on layout widgets, please use getChildren() instead.");
        return null;
    },

    setChildName: function(childName) {
        this.childrenNames = [childName];
    },

    getChild: function() {
        console.warn("Warning: You cannot use getChild() on layout widgets, please use getChildren() instead.");
        return null;
    },

    setChild: function(child) {
        this.children = [child];
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======


    /**
     * Add a widget to the layout.
     *
     * @method addChild
     * @param {photonui.Widget} widget The widget to add.
     * @param {Object} layoutOption Specific option for the layout (optional).
     */
    addChild: function(widget, layoutOptions) {
        if (layoutOptions) {
            widget.layoutOptions = layoutOptions;
        }
        this._childrenNames.push(widget.name);
        this._updateLayout();
    },

    /**
     * Remove a widget from the layout.
     *
     * @method removeChild
     * @param {photonui.Widget} widget The widget to remove.
     */
    removeChild: function(widget) {
        var index = this._childrenNames.indexOf(widget.name);
        if (index >= 0) {
            this._childrenNames.splice(index, 1);
        }
        this._updateLayout();
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function() {
        var children = this.children;
        for (var i=0 ; i<children.length ; i++) {
            children[i].destroy();
        }
        this.$super();
    },


    // ====== Private methods ======


    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function() {
        throw "Error: you should define the _updateLayout() method when you extend a layout widget.";
    },


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function() {
        // pass
    }
});
