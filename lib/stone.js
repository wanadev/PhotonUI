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

(function (root, factory) {
    // Assign to module.exports if the environment supports CommonJS.
    // If root.Stone is already defined/truthy, use a Browser version nonetheless.
    // ^ Useful for nw.js or atom-shell where you might want to still use the global version.
    if (typeof module === "object" && module.exports && !root.Stone) {
        module.exports = factory();
    }
    // Otherwise use a global variable.
    else {
        root.Stone = factory();
    }

} (this, function() {

    var catalogs = {};
    var locale = null;
    var domScan = false;

    function LazyString(string, replacements) {
        this.toString = gettext.bind(this, string, replacements);

        var props = Object.getOwnPropertyNames(String.prototype);
        for (var i=0 ; i<props.length ; i++) {
            if (props[i] == "toString") continue;
            if (typeof(String.prototype[props[i]]) == "function") {
                this[props[i]] = function() {
                    var translatedString = this.self.toString();
                    return translatedString[this.prop].apply(translatedString, arguments);
                }.bind({self: this, prop: props[i]});
            }
            else {
                Object.defineProperty(this, props[i], {
                    get: function() {
                        var translatedString = this.self.toString();
                        return translatedString[this.prop]
                    }.bind({self: this, prop: props[i]}),
                    enumerable: false,
                    configurable: false
                });
            }
        }
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
        if (domScan) {
            updateDomTranslation();
        }
        _sendEvent("stonejs-locale-changed");
    }

    function guessUserLanguage() {
        var lang = navigator.language || navigator.userLanguage || navigator.systemLanguage || navigator.browserLanguage || null;

        if (lang) {
            lang = lang.toLowerCase();
        }

        if (lang && lang.length > 3) {
            lang = lang.split(";")[0];
            lang = lang.split(",")[0];
            lang = lang.split("-")[0];
            lang = lang.split("_")[0];
            if (lang.length > 3) {
                lang = null;
            }
        }

        return lang || "en";
    }

    function _sendEvent(name, data) {
        var data = data || {};
        var ev = null;
        try {
            ev = new Event(name);
        }
        catch (e) {
            // The old-fashioned way... THANK YOU MSIE!
            ev = document.createEvent("Event");
            ev.initEvent(name, true, false);
        }
        for (var i in data) {
            ev[i] = data[i];
        }
        document.dispatchEvent(ev);
    }

    function _autoloadCatalogs(event) {
        addCatalogs(event.catalog);
    }

    document.addEventListener("stonejs-autoload-catalogs", _autoloadCatalogs, true);

    function enableDomScan(enable) {
        domScan = !!enable;
        if (domScan) {
            updateDomTranslation();
        }
    }

    function updateDomTranslation() {
        var elements = document.getElementsByTagName("*");
        var params = null;
        var attrs = null;
        var i = 0;
        var j = 0;
        for (i=0 ; i<elements.length ; i++) {
            if (elements[i].hasAttribute("stonejs")) {
                // First pass
                if (!elements[i].hasAttribute("stonejs-orig-string")) {
                    elements[i].setAttribute("stonejs-orig-string", elements[i].innerHTML);
                }

                params = {};
                attrs = elements[i].attributes;
                for (j=0 ; j<attrs.length ; j++) {
                    if (attrs[j].name.indexOf("stonejs-param-") == 0) {
                        params[attrs[j].name.substr(14)] = attrs[j].value;
                    }
                }

                __gettext = gettext;  // Avoid false detection
                elements[i].innerHTML = __gettext(elements[i].getAttribute("stonejs-orig-string"), params);
            }
        }
    }

    return {
        LazyString: LazyString,
        gettext: gettext,
        lazyGettext: lazyGettext,
        addCatalogs: addCatalogs,
        getLocale: getLocale,
        setLocale: setLocale,
        guessUserLanguage: guessUserLanguage,
        enableDomScan: enableDomScan,
        updateDomTranslation: updateDomTranslation
    }
}));
