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
 * @submodule Helpers
 * @main helpers
 * @namespace photonui
 */


var photonui = require("./photonui.js");


/**
 * Helpers.
 *
 * @class Helpers
 * @constructor
 */
var Helpers = function() {
}

/**
 * Escape HTML.
 *
 * @method escapeHtml
 * @static
 * @param {String} string
 * @return {String}
 */
Helpers.escapeHtml = function(string) {
    return string
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/**
 * Generate an UUID version 4 (RFC 4122)
 *
 * From:
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 *
 * @method uuid4
 * @static
 * @return {String} The generated UUID
 */
Helpers.uuid4 = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

/**
 * Clean node (remove all children of the node).
 *
 * @method cleanNode
 * @static
 * @param {HTMLElement} node
 */
Helpers.cleanNode = function(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

/**
 * Get the absolute position of an HTML Element.
 *
 * @method getAbsolutePosition
 * @static
 * @param {HTMLElement} element The HTML element (or its id)
 * @return {Object} `{x: <Number>, y: <Number>}
 */
Helpers.getAbsolutePosition = function(element) {
    if (typeof(element) == "string") element = document.getElementById(element);
    if (!element instanceof Element) return {x: 0, y: 0};
    try {
        var css = getComputedStyle(element);
    }
    catch (e) {
        return {x: 0, y: 0};
    }
    if (!css) return {x: 0, y: 0};

    var x = - parseInt(css.borderLeftWidth);
    var y = - parseInt(css.borderTopWidth);;

    while (element.offsetParent) {
        css = getComputedStyle(element);

        x += element.offsetLeft || 0;
        x += parseInt(css.borderLeftWidth);

        y += element.offsetTop || 0;
        y += parseInt(css.borderTopWidth);

        element = element.offsetParent;
    }

    return {x: x, y: y};
}

/**
 * Check and compute size to valid CSS size
 *
 * Valid values and transformations:
 *     undefined  -> defaultValue
 *     null       -> "auto" (if "auto" is alowed, "0px" else)
 *     +Infinity  -> "100%"
 *     Number     -> "<Number>px"
 *
 * @method numberToCssSize
 * @param {Number} value
 * @param {Number} defaultValue (opt, default=nullValue)
 * @param {String} nullValue (opt, default="auto")
 * @return {String} sanitized version of the size.
 */
Helpers.numberToCssSize = function(value, defaultValue, nullValue) {
    var nullValue = (nullValue === undefined) ? "auto" : nullValue;
    var defaultValue = (nullValue === undefined) ? null : defaultValue;
    var value = (value === undefined) ? defaultValue : value;

    if (value === Infinity) {
        return "100%";
    }
    else if (!isNaN(parseFloat(value))) {
        return Math.max(0, parseFloat(value)|0) + "px";
    }
    else if (value !== defaultValue) {
        return Helpers.numberToCssSize(defaultValue, defaultValue, nullValue);
    }
    else {
        return nullValue;
    }
}

module.exports = Helpers;
