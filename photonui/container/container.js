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
 * Base class for container widgets.
 *
 * @class Container
 * @constructor
 * @extends photonui.Widget
 */
photonui.Container = function(params) {
    photonui.Widget.call(this, params);

    var params = params || {};
    this.childWidget = null;
}

photonui.Container.prototype = new photonui.Widget;


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the container DOM Element.
 *
 * @method getContainerNode
 * @return {HTMLElement}
 */
photonui.Container.prototype.getContainerNode = function() {
    console.warn("getContainerNode() method not implemented for this widget.");
    return null;
}

/**
 * Get the child of the current Widget.
 *
 * @method getChild
 * @return {photonui.Widget} The child widget or null.
 */
photonui.Container.prototype.getChild = function() {
    return this.childWidget;
}

/**
 * Set the child of the current widget.
 *
 * @method setChild
 * @param {photonui.Widget} child The new child of the widget.
 */
photonui.Container.prototype.setChild = function(child) {
    if (child == this.childWidget || !this.getContainerNode()) {
        return;
    }

    if (this.childWidget) {
        var e = this.getContainerNode();
        while (e.firstChild) {
            e.removeChild(e.firstChild);
        }
    }

    this.childWidget = child;

    if (this.childWidget) {
        this.getContainerNode().appendChild(this.childWidget.getHtml())
    }
}

/**
 * Destroy the widget and all its children.
 *
 * @method destroy
 */
photonui.Container.prototype.destroy = function() {
    if (this.childWidget) {
        this.childWidget.destroy();
    }
    this.childWidget = null;
    photonui.Widget.prototype.destroy.call(this);
}
