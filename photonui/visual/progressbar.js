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
 * @submodule Visual
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * ProgressBar.
 *
 * @class ProgressBar
 * @constructor
 * @extends photonui.Widget
 * @param {Number} params.value The progress fraction (0..1, optional, default=0).
 * @param {Number} params.showText Display or hide the progression text (optional, default=true).
 * @param {String} params.orientation The orientation of the progress bar: `"vertical"` or `"horizontal"` (optional, default = "horizontal").
 * @param {Boolean} params.pulsate Does the progressbar pulsate? (optional, default = `false`).
 */
photonui.ProgressBar = function(params) {
    photonui.Widget.call(this, params);

    var params = params || {};

    // Attrs
    this.value = (params.value != undefined) ? params.value : 0;
    this.showText = (params.showText != undefined) ? params.showText : true;
    this.pulsate = (params.pulsate != undefined) ? params.pulsate : false;
    this.orientation = params.orientation || "horizontal";

    this._e = {};  // HTML Elements

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
}

photonui.ProgressBar.prototype = new photonui.Widget();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get progression.
 *
 * @method getValue
 * @return {Number} The progression (0..1).
 */
photonui.ProgressBar.prototype.getValue = function() {
    return this.value;
}

/**
 * Set progression.
 *
 * @method setValue
 * @param {Number} value The progression (0..1).
 */
photonui.ProgressBar.prototype.setValue = function(value) {
    this.value = Math.min(Math.max(value, 0), 1);
    if (this.getOrientation() == "horizontal") {
        this._e.bar.style.width = Math.floor(this.value * 100) + "%";
    }
    else {
        this._e.bar.style.height = Math.floor(this.value * 100) + "%";
    }
    this._e.textContent.innerHTML = Math.floor(this.value * 100) + " %";
}

/**
 * Get the orientation of the progress bar.
 *
 * @method getOrientation
 * @return {String} The progressbar orientation: `"vertical"` or `"horizontal"`.
 */
photonui.ProgressBar.prototype.getOrientation = function() {
    return this.orientation;
}

/**
 * Set the orientation of the progress bar.
 *
 * @method setOrientation
 * @param {String} orientation The progressbar orientation: `"vertical"` or `"horizontal"`.
 */
photonui.ProgressBar.prototype.setOrientation = function(orientation) {
    if (orientation != "vertical" && orientation != "horizontal") {
        throw "Error: The orientation should be \"vertical\" or \"horizontal\".";
        return;
    }
    this.orientation = orientation;
    this.removeClass("photonui-progressbar-vertical");
    this.removeClass("photonui-progressbar-horizontal");
    this.addClass("photonui-progressbar-" + this.orientation);
}

/**
 * Know if the pulsate mode is enabled or not.
 *
 * @method getPulsate
 * @return {Boolean}
 */
photonui.ProgressBar.prototype.getPulsate = function() {
    return this.pulsate;
}

/**
 * Enable/Disable the pulsate mode.
 *
 * @method setPulsate
 * @param {Boolean} pulsate
 */
photonui.ProgressBar.prototype.setPulsate = function(pulsate) {
    this.pulsate = pulsate;
    if (pulsate) {
        this.addClass("photonui-progressbar-pulsate");
        if (this.getOrientation() == "horizontal") {
            this._e.bar.style.width = "";
        }
        else {
            this._e.bar.style.height = "";
        }
    }
    else {
        this.removeClass("photonui-progressbar-pulsate");
        this.setValue(this.value);
    }
}

/**
 * Know if the progression text is displayed or not.
 *
 * @method getShowText
 * @return {Boolean}
 */
photonui.ProgressBar.prototype.getShowText = function() {
    return this.showText;
}

/**
 * Display/hide the progression text.
 *
 * @method setShowText
 * @param {Boolean} showText
 */
photonui.ProgressBar.prototype.setShowText = function(showText) {
    this.showText;
    if (showText) {
        this._e.text.style.display = "";
    }
    else {
        this._e.text.style.display = "none";
    }
}

/**
 * Get the HTML of the progress bar.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.ProgressBar.prototype.getHtml = function() {
    return this._e.outer;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the progressbar.
 *
 * @method _buildHtml
 * @private
 */
photonui.ProgressBar.prototype._buildHtml = function() {
    this._e.outer = document.createElement("div");
    this._e.outer.className = "photonui-widget photonui-progressbar";

    this._e.text = document.createElement("div");
    this._e.text.className = "photonui-progressbar-text";
    this._e.outer.appendChild(this._e.text);

    this._e.textContent = document.createElement("span");
    this._e.text.appendChild(this._e.textContent);

    this._e.bar = document.createElement("div");
    this._e.bar.className = "photonui-progressbar-bar";
    this._e.outer.appendChild(this._e.bar);
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.ProgressBar.prototype._updateAttributes = function() {
    photonui.Widget.prototype._updateAttributes.call(this);
    this.setOrientation(this.orientation);
    this.setValue(this.value);
    this.setPulsate(this.pulsate);
}
