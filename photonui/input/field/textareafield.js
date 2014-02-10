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
 * Multiline text field.
 *
 * @class TextAreaField
 * @constructor
 * @extends photonui.Field
 * @params {Number} params.cols Number of columns in the textarea (optional, default=20).
 * @params {Number} params.rows Number of rows in the textarea (optional, default=3).
 */
photonui.TextAreaField = function(params) {
    photonui.Field.call(this, params);

    var params = params || {};
    this.cols = params.cols || 20;
    this.rows = params.rows || 3;

    // Build
    this._buildHtml();
    this._updateAttributes();
    this._bindEvents();
}

photonui.TextAreaField.prototype = new photonui.Field();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the number of columns.
 *
 * @method getCols
 * @return {Number}
 */
photonui.TextAreaField.prototype.getCols = function() {
    return this.cols;
}

/**
 * Set the number of columns.
 *
 * @method setCols
 * @params {Number} cols
 */
photonui.TextAreaField.prototype.setCols = function(cols) {
    this.cols = cols;
    this._e.field.cols = this.cols;
}

/**
 * Get the number of rows.
 *
 * @method getRows
 * @return {Number}
 */
photonui.TextAreaField.prototype.getRows = function() {
    return this.rows;
}

/**
 * Set the number of rowns.
 *
 * @method setRows
 * @params {Number} rows
 */
photonui.TextAreaField.prototype.setRows = function(rows) {
    this.rows = rows;
    this._e.field.rows = this.rows;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the field.
 *
 * @method _buildHtml
 * @private
 */
photonui.TextAreaField.prototype._buildHtml = function() {
    this._e.field = document.createElement("textarea");
    this._e.field.className = "photonui-widget photonui-field photonui-field-textarea";
    this._e.field.name = this.name;
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.TextAreaField.prototype._updateAttributes = function() {
    photonui.Field.prototype._updateAttributes.call(this);
    this.setCols(this.cols);
    this.setRows(this.rows);
}
