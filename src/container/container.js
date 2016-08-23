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
 * @submodule Container
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Base class for container widgets.
 *
 * @class Container
 * @constructor
 * @extends photonui.Widget
 */
var Container = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);

        // Force to update the parent of the child
        if (this._childName) {
            this.child._parentName = this.name;
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Horizontaly expand the container's child widget.
     *
     * @property horizontalChildExpansion
     * @type Boolean
     * @default true
     */
    _horizontalChildExpansion: true,

    getHorizontalChildExpansion: function () {
        "@photonui-update";
        return this._horizontalChildExpansion;
    },

    setHorizontalChildExpansion: function (expansion) {
        this._horizontalChildExpansion = Boolean(expansion);
        if (!this.containerNode) {
            return;
        }
        if (expansion) {
            this.containerNode.classList.add("photonui-container-expand-child-horizontal");
        } else {
            this.containerNode.classList.remove("photonui-container-expand-child-horizontal");
        }
    },

    /**
     * Verticaly expand the container's child widget.
     *
     * @property verticalChildExpansion
     * @type Boolean
     * @default false
     */
    _verticalChildExpansion: false,

    getVerticalChildExpansion: function () {
        "@photonui-update";
        return this._verticalChildExpansion;
    },

    setVerticalChildExpansion: function (expansion) {
        this._verticalChildExpansion = Boolean(expansion);
        if (!this.containerNode) {
            return;
        }
        if (expansion) {
            this.containerNode.classList.add("photonui-container-expand-child-vertical");
        } else {
            this.containerNode.classList.remove("photonui-container-expand-child-vertical");
        }
    },

    /**
     * The child widget name.
     *
     * @property childName
     * @type String
     * @default null (no child)
     */
    _childName: null,

    getChildName: function () {
        return this._childName;
    },

    setChildName: function (childName) {
        if (this.childName && this.containerNode && this.child && this.child.html) {
            this.containerNode.removeChild(this.child.html);
            this.child._parentName = null;
        }
        this._childName = childName;
        if (this.child && this.child._parentName) {
            this.child.parent.removeChild(this.child);
        }
        if (this.childName && this.containerNode && this.child && this.child.html) {
            this.containerNode.appendChild(this.child.html);
            this.child._parentName = this.name;
        }
    },

    /**
     * The child widget.
     *
     * @property child
     * @type photonui.Widget
     * @default null (no child)
     */
    getChild: function () {
        return Widget.getWidget(this.childName);
    },

    setChild: function (child) {
        if ((!child) || (!(child instanceof Widget))) {
            this.childName = null;
            return;
        }
        this.childName = child.name;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return null;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Remove the given child.
     *
     * @method removeChild
     * @param {photonui.Widget} widget The widget to remove/
     */
    removeChild: function (widget) {
        if (this.child === widget) {
            this.child = null;
        }
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        if (this.childName && this.child) {
            this.child.destroy();
        }
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        if (this.child instanceof Widget) {
            this.child._visibilityChanged(visibility);
        }
        this.$super(visibility);
    },

});

module.exports = Container;
