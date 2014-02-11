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
 * @submodule Input
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * Button.
 *
 * wEvents:
 *
 *   * click:
 *     - description: called when the button was clicked.
 *     - callback:    function(widget, event)
 *
 * @class Button
 * @constructor
 * @extends photonui.Widget
 * @param {String} params.text The text of the button (optional, default = "Button").
 */
photonui.Button = function(params) {
    photonui.Widget.call(this, params);

    var params = params || {};

    // Attrs
    this.text = (params.text != undefined) ? params.text : "Button";  // FIXME i18n
    this.textVisible = (params.textVisible != undefined) ? params.textVisible : true;
    this.leftIcon = params.leftIcon || null;
    this.leftIconVisible = (params.leftIconVisible != undefined) ? params.leftIconVisible : true;
    this.rightIcon = params.rightIcon || null;
    this.rightIconVisible = (params.rightIconVisible != undefined) ? params.rightIconVisible : true;

    this._e = {};  // HTML Elements
    this._leftIcon = null;
    this._rightIcon = null;

    this._registerWidgetEvents(["click"]);

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
    this._bindEvent("click", this._e.button, "click", function(event) {
        this._callCallbacks("click", [event]);
    }.bind(this));
}

photonui.Button.prototype = new photonui.Widget();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get button text.
 *
 * @method getText
 * @return {string} The button text.
 */
photonui.Button.prototype.getText = function() {
    return this.text;
}

/**
 * Set button text.
 *
 * @method setText
 * @param {string} text The button text.
 */
photonui.Button.prototype.setText = function(text) {
    this.text = text;
    this._e.text.innerHTML = photonui.Helpers.escapeHtml(text);
}

/**
 * Know if the button text is visible.
 *
 * @method isTextVisible.
 * @return {Boolean}
 */
photonui.Button.prototype.isTextVisible = function() {
    return this.textVisible;
}

/**
 * Define if the button text is displayed or not.
 *
 * @method setTextVisible.
 * @param {Boolean} visible
 */
photonui.Button.prototype.setTextVisible = function(visible) {
    this.textVisible = visible;
    this._update();
}

/**
 * Know if the button left icon is visible.
 *
 * @method isLeftIconVisible.
 * @return {Boolean}
 */
photonui.Button.prototype.isLeftIconVisible = function() {
    return this.leftIconVisible;
}

/**
 * Define if the button left icon is displayed or not.
 *
 * @method setLeftIconVisible.
 * @param {Boolean} visible
 */
photonui.Button.prototype.setLeftIconVisible = function(visible) {
    this.leftIconVisible = visible;
    this._update();
}

/**
 * Know if the button right icon is visible.
 *
 * @method isRightIconVisible.
 * @return {Boolean}
 */
photonui.Button.prototype.isRightIconVisible = function() {
    return this.rightIconVisible;
}

/**
 * Define if the button right icon is displayed or not.
 *
 * @method setRightIconVisible.
 * @param {Boolean} visible
 */
photonui.Button.prototype.setRightIconVisible = function(visible) {
    this.rightIconVisible = visible;
    this._update();
}

/**
 * Get the button left icon name.
 *
 * @method getLeftIcon
 * @return {String}
 */
photonui.Button.prototype.getLeftIcon = function() {
    return this.leftIcon;
}

/**
 * Set the button left icon.
 *
 * @method setLeftIcon
 * @param {String} icon
 */
photonui.Button.prototype.setLeftIcon = function(icon) {
    this.leftIcon = icon;
    if (this.leftIcon) {
        this._leftIcon = photonui.iconFactory(icon);
        if (this._leftIcon) {
            photonui.Helpers.cleanNode(this._e.leftIcon);
            this._e.leftIcon.appendChild(this._leftIcon.getHtml());
        }
        else {
            this.leftIcon = null;
        }
    }
}

/**
 * Get the button right icon name.
 *
 * @method getRightIcon
 * @return {String}
 */
photonui.Button.prototype.getRightIcon = function() {
    return this.leftIcon;
}

/**
 * Set the button right icon.
 *
 * @method setRightIcon
 * @param {String} icon
 */
photonui.Button.prototype.setRightIcon = function(icon) {
    this.rightIcon = icon;
    if (this.rightIcon) {
        this._rightIcon = photonui.iconFactory(icon);
        if (this._rightIcon) {
            photonui.Helpers.cleanNode(this._e.rightIcon);
            this._e.rightIcon.appendChild(this._rightIcon.getHtml());
        }
        else {
            this.rightIcon = null;
        }
    }
}

/**
 * Get the HTML of the button.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.Button.prototype.getHtml = function() {
    return this._e.button;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Update the button content
 *
 * @method _update
 * @private
 */
photonui.Button.prototype._update = function() {
    this._e.button.removeChild(this._e.leftIcon);
    this._e.button.removeChild(this._e.text);
    this._e.button.removeChild(this._e.rightIcon);

    if (this.leftIcon && this.leftIconVisible) {
        this._e.button.appendChild(this._e.leftIcon);
    }

    if (this.text && this.textVisible) {
        this._e.button.appendChild(this._e.text);
    }

    if (this.rightIcon && this.rightIconVisible) {
        this._e.button.appendChild(this._e.rightIcon);
    }
}

/**
 * Build the HTML of the button.
 *
 * @method _buildHtml
 * @private
 */
photonui.Button.prototype._buildHtml = function() {
    this._e.button = document.createElement("button");
    this._e.button.className = "photonui-widget photonui-button";

    this._e.leftIcon = document.createElement("span");
    this._e.leftIcon.className = "photonui-button-icon";
    this._e.button.appendChild(this._e.leftIcon);

    this._e.text = document.createElement("span");
    this._e.text.className = "photonui-button-text";
    this._e.button.appendChild(this._e.text);

    this._e.rightIcon = document.createElement("span");
    this._e.rightIcon.className = "photonui-button-icon";
    this._e.button.appendChild(this._e.rightIcon);
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.Button.prototype._updateAttributes = function() {
    photonui.Widget.prototype._updateAttributes.call(this);
    this.setText(this.text);
    this.setLeftIcon(this.leftIcon);
    this.setRightIcon(this.rightIcon);
    this._update();
}
