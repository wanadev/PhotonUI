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
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule NonVisual
 * @namespace photonui
 */

var Base = require("../base.js");
var KeyboardJS = require("keyboardjs");

/**
 * Manage keyboard accelerators.
 *
 *
 * @class AccelManager
 * @constructor
 * @extends photonui.Base
 */
var AccelManager = Base.$extend({

    // Constructor
    __init__: function () {
        this.__kbd = {};
        this.$super();
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Private properties ======

    /**
     * Keyboard bindings.
     *
     *     {
     *         "id": {
     *             safe: Boolean,
     *             callback: Function,
     *             binding: Object
     *         },
     *         ...
     *     }
     *
     * @property __kbd
     * @type Object
     */
    __kbd: null,

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Add an accelerator.
     *
     * @method addAccel
     * @param {String} id An unique id for the accelerator.
     * @param {String} kays The keys of the accelerator (see the keyCombo section of http://robertwhurst.github.io/KeyboardJS/ ).
     * @param {Function} callback
     * @param {Boolean} safe If true, the accelerator is disable if a field/textArea is focused (optional, default=true)
     */
    addAccel: function (id, keys, callback, safe) {
        keys = keys.toLowerCase().replace(/ *\+ */, " + ").replace(/ *, */, ", ").replace(/ *> */, " > ");
        this.removeAccel(id);
        this.__kbd[id] = {
            keys: keys,
            safe: ((safe === undefined) ? true : safe),
            callback: callback,
            binding: KeyboardJS.on(keys, this.__onAccell.bind(this))
        };
    },

    /**
     * Remove an accelerator.
     *
     * @method removeAccel
     * @param {String} id the accelerator id.
     */
    removeAccel: function (id) {
        if (!this.__kbd[id]) {
            return;
        }
        this.__kbd[id].binding.clear();
        delete this.__kbd[id];
    },

    destroy: function () {
        for (var id in this.__kbd) {
            this.removeAccel(id);
        }
        this.$super();
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onAccell
     * @private
     * @param event
     * @param keys
     * @param combo
     */
    __onAccell: function (event, keys, combo) {
        for (var id in this.__kbd) {
            if (this.__kbd[id].keys != combo) {
                continue;
            }

            if (this.__kbd[id].safe) {
                if (document.activeElement instanceof HTMLInputElement ||
                    document.activeElement instanceof HTMLSelectElement ||
                    document.activeElement instanceof HTMLTextAreaElement) {
                    continue;
                }
            }

            this.__kbd[id].callback();
            event.stopPropagation();
            event.preventDefault();
        }
    }

});

module.exports = AccelManager;
