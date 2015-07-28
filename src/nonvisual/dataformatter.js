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

var sprintf = require("sprintf-js").sprintf;
var datetime = require("date-and-time");

/**
 * A set of functions to format data for DataView widgets.
 *
 * @class DataFormatter
 * @constructor
 */
var DataFormatter = {

    /**
     * Format strings using a sprintf like syntax.
     *
     * DOC: https://github.com/alexei/sprintf.js
     *
     * available options:
     *
     *     {
     *         format: "%s"  // The string format (optional, default = "%s")
     *     }
     *
     * @method stringFormatter
     * @static
     * @param value The value to format.
     * @param row The data row (usually an object).
     * @param {photonui.DataField} options The DataField with all available options.
     * @return {String} the formated string.
     */
    stringFormatter: function (value, row, options) {
        var format = (options && options.format) ? options.format : "%s";
        return sprintf(format, value);
    },

    /**
     * Simple date formatter
     *
     * DOC: https://github.com/knowledgecode/date-and-time/blob/master/LICENSE
     *
     * available options:
     *
     *     {
     *         format: "YYYY-MM-DD HH:mm:ss",  // The date format (optional, default = "YYYY-MM-DD HH:mm:ss")
     *     }
     *
     * @method dateFormatter
     * @static
     * @param date The date to format.
     * @param row The data row (usually an object).
     * @param {photonui.DataField} options The DataField with all available options.
     * @return {String} the formated date.
     */
    dateFormatter: function (date, row, options) {
        var format = (options && options.format) ? options.format : "YYYY-MM-DD HH:mm:ss";
        return datetime.format(date, format);
    }
};

module.exports = DataFormatter;
