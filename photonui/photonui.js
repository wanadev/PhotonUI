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
 * @main PhotonUI
 * @namespace photonui
 */


var photonui = photonui || {};


photonui.e_parent = document.getElementsByTagName("body")[0];
photonui.widgets = {};


/*
 * Get a widget.
 *
 * @method getWidget
 * @param {String} name The widget name.
 *
 * @return {photonui.Widget} The widget or null.
 */
photonui.getWidget = function(name) {
    if (photonui.widgets[name]) {
        return photonui.widgets[name];
    }
    return null;
}

/*
 * Build widgets for an object or a list of object.
 *
 * @method build
 * @param {Object/Array} widgets
 */
photonui.build = function(widgets) {
    if (!(widgets instanceof Array)) {
        var widgets = [widgets];
    }

    function buildWidget(parentWidget, widget) {
        if (widget.__widget__ == undefined) {
            throw "Structure error: __widget__ is not defined";
        }
        if (photonui[widget.__widget__] == undefined) {
            throw "Structure error: The '" + widget.__widget__ + "'widget does not exist";
        }

        var w = new photonui[widget.__widget__](widget);
        if (parentWidget) {
            parentWidget.setChild(w);
        }

        if (widget.__child__ != undefined) {
            buildWidget(w, widget.__child__);
        }

        if (widget.__children__ != undefined) {
            for (var i in widget.__children__) {
                w.addChild(buildWidget(null, widget.__children__[i]));
            }
        }

        return w;
    }

    for (var i in widgets) {
        buildWidget(null, widgets[i]);
    }
}
