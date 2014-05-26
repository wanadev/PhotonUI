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
 * @submodule Misc
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * Open files from the standard "FileOpen" dialog and drag & drop.
 *
 * Documentation: https://github.com/flozz/stone.js/blob/master/README.md
 *
 * wEvents:
 *
 *   * locale-changed:
 *      - description: The locale changed.
 *      - callback:    function(widget, locale)
 *
 * @class Translation
 * @constructor
 * @extends photonui.Base
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
photonui.Translation = photonui.Base.$extend({

    // Constructor
    __init__: function(params) {
        this.$super(params);
        this._bindEvent("locale-changed", document, "stonejs-locale-changed", this.__onStonejsLocaleChanged.bind(this));
        this._registerWEvents(["locale-changed"]);
        window._ = this.lazyGettext;
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The current locale (e.g. "fr", "en", "it",...).
     *
     * @property locale
     * @type String
     * @default null
     */
    getLocale: Stone.getLocale,
    setLocale: Stone.setLocale,


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======


    /**
     * Add one or more Stone.js catalog (a catalog contain all translated strings for a specific locale).
     *
     * @method addCatalogs
     * @param {Object} catalogs
     */
    addCatalogs: Stone.addCatalogs,

    /**
     * Make a string translatable.
     *
     * @method gettext
     * @param {String} string the Translatable string
     * @param {Object} replacements An object that contain replacements for the string.
     * @return {String}
     */
    gettext: Stone.gettext,

    /**
     * Make a string translatable.
     *
     * Tthe main difference between this method and the `gettext` method is 
     * that this method does not return a translated sting but an object that
     * will translate the sting when it will be displayed (.toString() method
     * called).
     *
     * @method lazyGettext
     * @param {String} string the Translatable string
     * @param {Object} replacements An object that contain replacements for the string.
     * @return {LazyString}
     */
    lazyGettext: Stone.lazyGettext,


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    /**
     * @method __onStonejsLocaleChanged
     * @private
     */
    __onStonejsLocaleChanged: function() {
        this._callCallbacks("click", [this.locale]);
    }
});
