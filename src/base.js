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
 * @namespace photonui
 */

var Class = require("abitbol");
var uuid = require("uuid");

var Helpers = require("./helpers.js");

/**
 * Base class for all PhotonUI Classes.
 *
 * wEvents:
 *
 *   * destroy:
 *      - description: called before the widget was destroyed.
 *      - callback:    function (widget)
 *
 * @class Base
 * @constructor
 * @param {Object} params An object that can contain any property that will be set to the class (optional).
 */
var Base = Class.$extend({

    // Constructor
    __init__: function (params) {
        // New instances for object properties
        this.__events = {};
        this._data = {};

        // wEvents
        this._registerWEvents(["destroy"]);

        // Apply params
        params = params || {};
        for (var param in params) {
            if (this.$map.computedProperties[param]) {
                this[param] = params[param];
            }
        }

        // Update properties
        for (var propName in this.$map.computedProperties) {
            var prop = this.$map.computedProperties[propName];
            if (params[propName] === undefined &&
                prop.annotations["photonui-update"] &&
                prop.get && prop.set) {
                this[propName] = this[propName];
            }
        }

        // Register callbacks
        var ev = null;
        var i = 0;
        var evId = "";
        if (params.callbacks) {
            for (var wEvent in params.callbacks) {
                ev = params.callbacks[wEvent];
                if (typeof(ev) == "function") {
                    this.registerCallback(uuid.v4(), wEvent, ev);
                } else if (ev instanceof Array) {
                    for (i = 0 ; i < ev.length ; i++) {
                        this.registerCallback(uuid.v4(), wEvent, ev[i]);
                    }
                } else {
                    for (evId in ev) {
                        this.registerCallback(evId, wEvent, ev[evId]);
                    }
                }
            }
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Arbitrary data
     *
     * @property data
     * @type object
     * @default {}
     */
    _data: null,

    getData: function () {
        return this._data;
    },

    setData: function (data) {
        this._data = data;
    },

    // ====== Private properties ======

    /**
     * Object containing references javascript events binding (for widget
     * internal use).
     *
     * @property __events
     * @type Object
     * @private
     */
    __events: null,    // Javascript internal event

    /**
     * Object containing references to registered callbacks.
     *
     * @property __callbacks
     * @type Object
     * @private
     */
    __callbacks: null,  // Registered callback

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Destroy the class.
     *
     * @method destroy
     */
    destroy: function () {
        this._callCallbacks("destroy");
        for (var id in this.__events) {
            this._unbindEvent(id);
        }
    },

    /**
     * Register a callback for any PhotonUI/Widget event (called wEvent).
     *
     * Callback signature:
     *
     *     function (Object(Base/Widget) [, arg1 [, arg2 [, ...]]])
     *
     * @method registerCallback
     * @param {String} id An unique id for the callback.
     * @param {String} wEvent the PhotonUI/Widget event name.
     * @param {Function} callback The callback function.
     * @param {Object} thisArg The value of this (optionnal, default = current widget).
     */
    registerCallback: function (id, wEvent, callback, thisArg) {
        if (!this.__callbacks[wEvent]) {
            Helpers.log("error", "This widget has no '" + wEvent + "' wEvent.");
            return;
        }
        this.__callbacks[wEvent][id] = {
            callback: callback,
            thisArg: thisArg || null
        };
    },

    /**
     * Remove a registered callback.
     *
     * @method removeCallback
     * @param {String} id The id of the callback.
     */
    removeCallback: function (id) {
        for (var wEvent in this.__callbacks) {
            if (this.__callbacks[wEvent][id]) {
                delete this.__callbacks[wEvent][id];
            }
        }
    },

    // ====== Private methods ======

    /**
     * Force the update of the given properties.
     *
     * This method is deprecated.
     * One should use '@photonui-update' abitbol's annotation on concerned properties.
     *
     * @method _updateProperties
     * @private
     * @deprecated
     * @param {Array} properties The properties to update.
     */
    _updateProperties: function (properties) {
        Helpers.log("warn", "'photonui.Base._updateProperties()' is deprecated." +
                            " One should use '@photonui-update' abitbol's annotation on concerned properties.");

        for (var i = 0 ; i < properties.length ; i++) {
            this[properties[i]] = this[properties[i]];
        }
    },

    /**
     * Javascript event binding (for internal use).
     *
     * @method _bindEvent
     * @private
     * @param {String} id An unique id for the event.
     * @param {DOMElement} element The element on which the event will be bind.
     * @param {String} evName The event name (e.g. "mousemove", "click",...).
     * @param {Function} callback The function that will be called when the event occured.
     */
    _bindEvent: function (id, element, evName, callback) {
        this._unbindEvent(id);
        this.__events[id] = {
            evName: evName,
            element: element,
            callback: callback
        };
        this.__events[id].element.addEventListener(
                this.__events[id].evName,
                this.__events[id].callback,
                false
        );
    },

    /**
     * Unbind javascript event.
     *
     * @method _unbindEvent
     * @private
     * @param {String} id The id of the event.
     */
    _unbindEvent: function (id) {
        if (!this.__events[id]) {
            return;
        }
        this.__events[id].element.removeEventListener(
                this.__events[id].evName,
                this.__events[id].callback,
                false
        );
        delete this.__events[id];
    },

    /**
     * Register available wEvent.
     *
     * @method _registerWEvents
     * @private
     * @param {Array} wEvents
     */
    _registerWEvents: function (wEvents) {
        if (this.__callbacks === null) {
            this.__callbacks = {};
        }
        for (var i in wEvents) {
            this.__callbacks[wEvents[i]] = {};
        }
    },

    /**
     * Call all callbacks for the given wEvent.
     *
     * NOTE: the first argument passed to the callback is the current widget.
     * NOTE²: if the thisArg of the callback is null, this will be binded to the current widget.
     *
     * @method _callCallbacks
     * @private
     * @param {String} wEvent The widget event.
     * @param {Array} params Parametters that will be sent to the callbacks.
     */
    _callCallbacks: function (wEvent, params) {
        params = params || [];
        for (var id in this.__callbacks[wEvent]) {
            this.__callbacks[wEvent][id].callback.apply(
                    this.__callbacks[wEvent][id].thisArg || this,
                    [this].concat(params)
            );
        }
    }
});

module.exports = Base;
