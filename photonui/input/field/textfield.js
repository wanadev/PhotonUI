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
 * @class Field
 * @constructor
 * @extends photonui.Field
 */
photonui.TextField = function(params) {
    photonui.Field.call(this, params);

    var params = params || {};
    this.type = params.type || "text";

    // Build
    this._buildHtml();
    this._updateAttributes();
    this._bindEvents();
}

photonui.TextField.prototype = new photonui.Field();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the type of the text field.
 *
 * @method getType
 * @return {String} The type (`text`, `password`, `email`, `search`, `tel`, `url`).
 */
photonui.TextField.prototype.getType = function() {
    return this._e.field.type;
}

/**
 * Set the type of the text field.
 *
 * @method setType
 * @param {String} type The type (`text`, `password`, `email`, `search`, `tel`, `url`).
 */
photonui.TextField.prototype.setType = function(type) {
    if (type != "text" && type != "password" && type != "email" && type != "search" && type != "tel" && type != "url") {
        throw 'Error: The type should be "text", "password", "email", "search", "tel" or "url".';
        return;
    }
    this.type = type;
    this._e.field.type = type;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the text field.
 *
 * @method _buildHtml
 * @private
 */
photonui.TextField.prototype._buildHtml = function() {
    this._e.field = document.createElement("input");
    this._e.field.className = "photonui-widget photonui-field photonui-field-text";
    this._e.field.type = "text";
    this._e.field.name = this.name;
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.TextField.prototype._updateAttributes = function() {
    photonui.Field.prototype._updateAttributes.call(this);
    this.setType(this.type);
}
