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
 * Third party libraries.
 *
 * @class lib
 * @constructor
 */
var lib = {
    /**
     * Classy - A classy JavaScript class library.
     *
     * DOC: http://web.archive.org/web/20140331110526/http://classy.pocoo.org/
     *
     * @property Class
     * @static
     */
    Class: require("classyjs"),

    /**
     * KeyboardJS - A JavaScript library for binding keyboard combos.
     *
     * DOC: https://github.com/RobertWHurst/KeyboardJS
     *
     * @property KeyboardJS
     * @static
     */
    KeyboardJS: require("keyboardjs"),

    /**
     * Stone.js - gettext-like client-side Javascript Internationalization Library.
     *
     * DOC: https://github.com/flozz/stone.js
     *
     * @property Stone
     * @static
     */
    Stone: require("stonejs"),

    /**
     * node-uuid - Generate RFC-compliant UUIDs in JavaScript.
     *
     * DOC: https://github.com/broofa/node-uuid
     *
     * @property uuid
     * @static
     */
    uuid: require("uuid"),

    /**
     * sprintf.js - A complete open source JavaScript sprintf implementation.
     *
     * DOC: https://github.com/alexei/sprintf.js
     *
     * @property sprintf
     * @static
     */
    sprintf: require("sprintf-js"),

    /**
     * date-and-time - Date and time utilities.
     *
     * DOC: https://github.com/knowledgecode/date-and-time
     *
     * @property datetime
     * @static
     */
    datetime: require("date-and-time")
};

module.exports = lib;
