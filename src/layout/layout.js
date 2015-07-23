/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
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

var Widget = require("../widget.js");
var Container = require("../container/container.js");

/**
 * Base class for layout.
 *
 * @class Layout
 * @constructor
 * @extends photonui.Container
 */
var Layout = Container.$extend({

    // Constructor
    __init__: function (params) {
        this._childrenNames = [];  // new instance
        this.$super(params);

        // Force to update the parent of the children
        var children = this.children;
        for (var i = 0 ; i < children.length ; i++) {
            children[i]._parentName = this.name;
        }
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

    getChildrenNames: function () {
        return this._childrenNames;
    },

    setChildrenNames: function (childrenNames) {
        var i, widget;
        for (i = 0 ; i < this._childrenNames.length ; i++) {
            widget = Widget.getWidget(this._childrenNames[i]);
            var index = this._childrenNames.indexOf(widget.name);
            if (index >= 0) {
                widget._parentName = null;
            }
        }
        this._childrenNames = [];
        for (i = 0 ; i < childrenNames.length ; i++) {
            widget = Widget.getWidget(childrenNames[i]);
            if (widget) {
                if (widget.parent) {
                    widget.unparent();
                }
                this._childrenNames.push(widget.name);
                widget._parentName = this.name;
            }
        }
        this._updateLayout();
    },

    /**
     * Layout children widgets.
     *
     * @property children
     * @type Array
     * @default []
     */
    getChildren: function () {
        var children = [];
        var widget;
        for (var i = 0 ; i < this._childrenNames.length ; i++) {
            widget = Widget.getWidget(this._childrenNames[i]);
            if (widget instanceof Widget) {
                children.push(widget);
            }
        }
        return children;
    },

    setChildren: function (children) {
        var childrenNames = [];
        for (var i = 0 ; i < children.length ; i++) {
            if (children[i] instanceof Widget) {
                childrenNames.push(children[i].name);
            }
        }
        this.childrenNames = childrenNames;
    },

    // Override getChildName / setChildName / getChild / setChild

    getChildName: function () {
        return null;
    },

    setChildName: function (childName) {
        this.childrenNames = [childName];
    },

    getChild: function () {
        return null;
    },

    setChild: function (child) {
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
    addChild: function (widget, layoutOptions) {
        if (widget.parent) {
            widget.unparent();
        }
        if (layoutOptions) {
            widget.layoutOptions = layoutOptions;
        }
        this._childrenNames.push(widget.name);
        widget._parentName = this.name;
        this._updateLayout();
    },

    /**
     * Remove a widget from the layout.
     *
     * @method removeChild
     * @param {photonui.Widget} widget The widget to remove.
     */
    removeChild: function (widget) {
        var index = this._childrenNames.indexOf(widget.name);
        if (index >= 0) {
            this._childrenNames.splice(index, 1);
            widget._parentName = null;
        }
        this._updateLayout();
    },

    /**
     * Destroy all children of the layout
     *
     * @method empty
     */
    empty: function () {
        this._lockUpdate(true);

        var children = this.children;
        for (var i = 0 ; i < children.length ; i++) {
            if (children[i]) {
                children[i].destroy();
            }
        }

        this._lockUpdate(false);
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        this.empty();
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Lock the update of the layout.
     *
     * @method _lockUpdate
     * @private
     */
    _lockUpdate: function (lock) {
        if (lock) {
            this.__lockedUpdateLayout = this._updateLayout;
            this._updateLayout = function () {};
        } else {
            this._updateLayout = this.__lockedUpdateLayout;
            delete this.__lockedUpdateLayout;
            this._updateLayout();
        }
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function () {
        throw "Error: you should define the _updateLayout() method when you extend a layout widget.";
    },

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        var children = this.children;
        for (var i = 0 ; i < children.length ; i++) {
            if (!(this.child instanceof Widget)) {
                continue;
            }
            children[i]._visibilityChanged(visibility);
        }
        this.$super(visibility);
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
    __onLocaleChanged: function () {
        // pass
    }
});

module.exports = Layout;
