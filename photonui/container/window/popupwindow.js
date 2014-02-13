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
 * Popup Window.
 *
 * @class PopupWindow
 * @constructor
 * @extends photonui.BaseWindow
 */
photonui.PopupWindow = function(params) {
    photonui.BaseWindow.call(this, params);

    // Build and bind
    this._buildHtml();
    this._updateAttributes();

    this._bindEvent("document-mousedown-close", document, "mousedown", this.hide.bind(this));
    this._bindEvent("popup-click-close", this.getHtml(), "click", this.hide.bind(this));
    this._bindEvent("mousedown-preventclose", this.getHtml(), "mousedown", function(event) {
        event.stopPropagation();
    }.bind(this));
}

photonui.PopupWindow.prototype = new photonui.BaseWindow;


//////////////////////////////////////////
// Public Methods                       //
//////////////////////////////////////////


/**
 * Pop the window at the given position.
 *
 * @method popupXY
 * @param {Number} x
 * @param {Number} y
 */
photonui.PopupWindow.prototype.popupXY = function(x, y) {
    this.setPosition(-1337, -1337);
    this.show();

    var bw = document.getElementsByTagName("body")[0].offsetWidth;
    var bh = document.getElementsByTagName("body")[0].offsetHeight;
    var pw = this.getWidth();
    var ph = this.getHeight();

    if (x + pw > bw) {
        x = bw - pw;
    }

    if (y + ph > bh) {
        y -= ph;
    }

    if (x < 0) {
        x = 0;
    }
    if (y < 0) {
        y = 0;
    }

    this.setPosition(x, y);
}

/**
 * Pop the window at the best position for the given widget.
 *
 * @method popupWidget
 * @param {photonui.Widget} widget
 */
photonui.PopupWindow.prototype.popupWidget = function(widget) {
    this.setPosition(-1337, -1337);
    this.show();

    var e_body = document.getElementsByTagName("body")[0];
    var x = 0;
    var y = 0;
    var wpos = widget.getAbsolutePosition();
    var wh = widget.getHeight();
    var ww = widget.getWidth();
    var pw = this.getWidth();
    var ph = this.getHeight();

    if (wpos.x + pw < e_body.offsetWidth) {
        x = wpos.x;
    }
    else if (wpos.x + ww < e_body.offsetWidth) {
        x = wpos.x + ww - pw;
    }
    else {
        x = e_body.offsetWidth - pw;
    }

    if (wpos.y + wh + ph < e_body.offsetHeight) {
        y = wpos.y + wh + 1;
    }
    else if (wpos.y - ph >= 0) {
        y = wpos.y - ph - 1;
    }

    if (x < 0) { x = 0 };
    if (y < 0) { y = 0 };

    this.setPosition(x, y);
}

//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the window.
 *
 * @method _buildHtml
 * @private
 */
photonui.PopupWindow.prototype._buildHtml = function() {
    photonui.BaseWindow.prototype._buildHtml.call(this);
    // Builde the HTML
    this._e["window"].className += " photonui-popupwindow";
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.PopupWindow.prototype._updateAttributes = function() {
    photonui.BaseWindow.prototype._updateAttributes.call(this);
}
