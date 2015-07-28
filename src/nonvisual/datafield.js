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
 * Authored by: Fabien LOISON <https://github.com/flozz>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule NonVisual
 * @namespace photonui
 */

var Base = require("../base.js");
var DataFormatter = require("./dataformatter.js");

/**
 * Indicates to DataView widgets how accessing and displaying your data.
 *
 * @class DataField
 * @constructor
 * @extends photonui.Base
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var DataField = Base.$extend({

    // Constructor
    __init__: function (params) {
        this._formatterOptions = {};
        this.$super(params);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Title of the data field. Displayed in some DataView widget (like GridView).
     *
     * if set to null, it will be equal to the `key` property.
     *
     * @property title
     * @type String
     * @default null
     */
    _title: null,

    getTitle: function () {
        return (this._title !== null && this._title !== undefined) ? this._title : this.key;
    },

    setTitle: function (title) {
        this._title = title;
    },

    /**
     * The data key binded to this field.
     *
     *  * if setted to an empty string (`""`), this means that the entire row is the data.
     *  * you can access to sub keys using dots¹: (e.g. `user.firstName`, `profile.photo-url`).
     *
     *  ¹ the separator can be configured with the `keySeparator` property.
     *
     * @property key
     * @type string
     * @default ""
     */
    _key: "",

    getKey: function () {
        return this._key;
    },

    setKey: function (key) {
        this._key = key;
    },

    /**
     * Key separator used to separate neested object keys in the `key` property.
     *
     * @property keySeparator
     * @type string
     * @default "."
     */
    _keySeparator: ".",

    getKeySeparator: function () {
        return this._keySeparator;
    },

    setKeySeparator: function (separator) {
        this._keySeparator = separator;
    },

    /**
     * The formatter to use to format the data.
     *
     * This can be set to one of the following built-in formatters or to a custom formatter (function):
     *
     *   * stringFormatter
     *   * dateFormatter
     *   * widgetFormatter
     *
     * @property formatter
     * @type {String|Function}
     * @default "stringFormatter"
     */
    _formatter: DataFormatter.stringFormatter,

    getFormatter: function () {
        return this._formatter;
    },

    setFormatter: function (formatter) {
        if (typeof formatter == "string") {
            if (DataFormatter[formatter]) {
                this._formatter = DataFormatter[formatter];
            } else {
                throw new Error("Unknown built-in formatter " + formatter);
            }
        } else {
            this._formatter = formatter;
        }
    },

    /**
     * Options for the formatter (properties depends on the selected formatter).
     *
     * @property formatterOptions
     * @type Object
     * @default {}
     */
    _formatterOptions: {},

    getFormatterOptions: function () {
        return this._formatterOptions;
    },

    setFormatterOptions: function (options) {
        this._formatterOptions = options;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Format the given data row.
     *
     * @method format
     * @param row The data row from which the field will be extracted and formatted.
     * @return {String|photonui.Widget} The formatted string or widget.
     */
    format: function (row) {
        var value = row;
        if (this.key !== "") {
            var keys = this.key.split(this.keySeparator);
            for (var i = 0 ; i < keys.length ; i++) {
                if (value[keys[i]]) {
                    value = value[keys[i]];
                } else {
                    break;
                }
            }
        }
        return this.formatter(value, row, this.formatterOptions);
    }

});

module.exports = DataField;
