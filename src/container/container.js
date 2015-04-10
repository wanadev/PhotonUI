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

var Widget = require("../widget.js");

/**
 * Base class for container widgets.
 *
 * @class Container
 * @constructor
 * @extends photonui.Widget
 */
Container = Widget.$extend({

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The child widget name.
     *
     * @property childName
     * @type String
     * @default null (no child)
     */
    _childName: null,

    getChildName: function() {
        return this._childName;
    },

    setChildName: function(childName) {
        if (this.childName && this.containerNode && this.child && this.child.html) {
            this.containerNode.removeChild(this.child.html);
        }
        this._childName = childName;
        if (this.childName && this.containerNode && this.child && this.child.html) {
            this.containerNode.appendChild(this.child.html);
        }
    },

    /**
     * The child widget.
     *
     * @property child
     * @type photonui.Widget
     * @default null (no child)
     */
    getChild: function() {
        return Widget.getWidget(this.childName);
    },

    setChild: function(child) {
        if (!child instanceof Widget) {
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
    getContainerNode: function() {
        console.warn("getContainerNode() method not implemented for this widget.");
        return null;
    },


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======


    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function() {
        if (this.childName) {
            this.child.destroy();
        }
        this.$super();
    }
});

module.exports = Container;
