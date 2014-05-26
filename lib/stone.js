/*
 * Copyright (c) 2014, Fabien LOISON <http://flozz.fr>
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
 *   * Neither the name of the author nor the names of its contributors may be used
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
 */


var Stone = (function(window, undefined) {

    var catalogs = {};
    var locale = null;

    function LazyString(string, replacements) {
        this.toString = gettext.bind(this, string, replacements);
    }

    function gettext(string, replacements) {
        var result = string;

        if (locale && catalogs[locale] && catalogs[locale][string]) {
            result = catalogs[locale][string];
        }

        if (replacements) {
            for (var r in replacements) {
                result = result.replace(new RegExp("\{" + r + "\}", "g"), replacements[r]);
            }
        }

        return result;
    }

    function lazyGettext(string, replacements) {
        return new LazyString(string, replacements);
    }

    function addCatalogs(newCatalogs) {
        for (var locale in newCatalogs) {
            catalogs[locale] = newCatalogs[locale];
        }
    }

    function getLocale() {
        return locale;
    }

    function setLocale(l) {
        locale = l;
        var ev = new Event("stonejs-locale-changed");
        document.dispatchEvent(ev);
    }

    return {
        gettext: gettext,
        lazyGettext: lazyGettext,
        addCatalogs: addCatalogs,
        getLocale: getLocale,
        setLocale: setLocale
    }

})(window);
