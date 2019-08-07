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
 * Authored by: A. Breust <https://github.com/Breush>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule NonVisual
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Base = require("../base.js");
var Widget = require("../widget.js");

/**
 * Manage document-wide keyboard events.
 *
 * wEvents:
 *
 *   * key-down:
 *      - description: When a key is pushed (event launched just once until key is released).
 *      - callback:    function(manager, kstate)
 *
 *   * key-up:
 *      - description: When a key is released.
 *      - callback:    function(manager, kstate)
 *
 *   * key-hold:
 *      - description: When the last key pressed is held down.
 *      - callback:    function(manager, kstate)
 *
 *
 * kstate:
 *
 *   A snapshot of the keyboard state when the event occured.
 *
 *     {
 *         event: <Object>,       // The original js event
 *         action: <String>,      // The event name (key-down/up, key-hold)
 *         keys: <String>,        // The object of active keys
 *         key: <String>,         // User-friendly key name
 *     }
 *
 * @class KeyboardManager
 * @constructor
 * @extends photonui.Base
 * @param {photonui.Widget} element Any PhotonUI Widget (optional).
 * @param {HTMLElement} element Any HTML element (optional).
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var KeyboardManager = Base.$extend({

    // Constructor
    __init__: function (element, params) {
        this._registerWEvents(["key-down", "key-up", "key-hold"]);

        this.__keys = {};

        if (element && (element instanceof Widget || element instanceof HTMLElement || element === document)) {
            this.$super(params);
            this.element = element;
        } else {
            this.$super(element);
        }

        this._initKeyCache();

        // NOTE Holding event might be broken on old versions of Ubuntu + GTK
        // for an event "keyup" is fired before the "keydown" repeat.
        // One work-around would be to send by ourself the events inside an animation loop,
        // according to the last and the current states of active keys.
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Disable the keyboard manager callbacks when focusing a input field-like element.
     *
     * @property safe
     * @type Boolean
     * @default true
     */
    _safe: true,

    getSafe: function () {
        "@photonui-update";
        return this._safe;
    },

    setSafe: function (safe) {
        this._safe = safe;
    },

    /**
     * Disable concerned events default actions.
     *
     * @property noPreventDefault
     * @type Boolean
     * @default false
     */
    _noPreventDefault: false,

    getNoPreventDefault: function () {
        "@photonui-update";
        return this._noPreventDefault;
    },

    setNoPreventDefault: function (noPreventDefault) {
        this._noPreventDefault = noPreventDefault;
    },

    /**
     * The HTML Element on which the events are binded.
     *
     * NOTE: If a photonui.Widget object is assigned to this property,
     *       its HTML Element will be automatically assigned to the property instead.
     *
     * @property element
     * @type HTMLElement
     * @default null
     */
    _element: null,

    getElement: function () {
        return this._element || document;
    },

    setElement: function (element) {
        if (element instanceof Widget) {
            this._element = element.interactiveNode || element.html;
        } else if (element instanceof HTMLElement || element === document) {
            this._element = element;
        } else {
            this._element = null;
        }
        this._updateEvents();
    },

    /**
     * The action:
     *
     *   * "key-down"
     *   * "key-up"
     *   * "key-hold"
     *
     * @property action
     * @readOnly
     * @type String
     */
    _action: "",

    getAction: function () {
        return this._action;
    },

    // ====== Private properties ======

    /**
     * Last event object.
     *
     * @property __event
     * @private
     * @type Object
     * @default null
     */
    __event: null,

    /**
     * The currently active keys.
     *
     * @property keys
     * @private
     * @type Object
     * @default {}
     */
    __keys: null,

    /**
     * Last key concerned.
     *
     * @property __key
     * @private
     * @type String
     * @default null
     */
    __key: null,

    /**
     * KeyCode correspondance to key name.
     *
     * @property __keyCache
     * @private
     * @type Array
     */
    __keyCache: [],

    /**
     * Key name correspondance to key code.
     *
     * @property __keyCodeCache
     * @private
     * @type Array
     */
    __keyCodeCache: [],

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Bind events on the HTML Element.
     *
     * @method _updateEvents
     * @private
     */
    _updateEvents: function () {
        // Unbind all existing events
        for (var id in this.__events) {
            this._unbindEvent(id);
        }
        // Check if we have an html element
        if (!this.element) {
            return;
        }
        // Bind new events
        // We will simulate the standard "keypress" event because some browsers
        // do not emit one for special keys (alt, ctrl, shift, escape).
        this._bindEvent("key-down", this.getElement(), "keydown", this.__onDocumentKeyDown.bind(this));
        this._bindEvent("key-up", this.getElement(), "keyup", this.__onDocumentKeyUp.bind(this));

        this._bindEvent("lost-focus", window, "blur", this.__onWindowBlur.bind(this));
    },

    /**
     * Check if a specific key is currently pressed.
     *
     * @method isKeyPressed
     * @param {String} key The key name
     * @return {Boolean}
     */
    isKeyPressed: function (key) {
        var keyState = this.__keys[this.__keyCodeCache[key]];
        return (keyState) ? true : false;
    },

    /**
     * Check if a specific key is currently released.
     *
     * @method isKeyReleased
     * @param {String} key The key name
     * @return {Boolean}
     */
    isKeyReleased: function (key) {
        var keyState = this.__keys[this.__keyCodeCache[key]];
        return (keyState) ? false : true;
    },

    // ====== Private methods ======

    /**
     * Take a snapshot of the KeyboardManager
     *
     * @method _dump
     * @private
     * @return {Object}
     */
    _dump: function () {
        return {
            event: this.__event,
            action: this._action,
            key: this.__key
        };
    },

    /**
     * Check if the user has not focused an input element
     *
     * @method _checkFocus
     * @private
     * @return {Boolean}
     */
    _checkFocus: function () {
        return !(this._safe && (document.activeElement instanceof HTMLInputElement ||
               document.activeElement instanceof HTMLSelectElement ||
               document.activeElement instanceof HTMLTextAreaElement));
    },

    /**
     * Check the validity of the keyboard event
     *
     * @method _checkEvent
     * @private
     * @param {KeyboardEvent} event The keyboard event
     * @return {Boolean}
     */
    _checkEvent: function (event) {
        this.__event = event;
        this.__key = this._keyFromEvent(event);

        if (!this.__key || this.__key === "Dead") {
            return false;
        }

        this.__keyCodeCache[this.__key] = event.keyCode;

        return this._checkFocus();
    },

    /**
     * Create the key correspondance cache for basic touches
     *
     * @method _initKeyCache
     * @private
     */
    _initKeyCache: function () {
        // General
        this.__keyCache[3] = "cancel";
        this.__keyCache[8] = "backspace";
        this.__keyCache[9] = "tab";
        this.__keyCache[12] = "clear";
        this.__keyCache[13] = "enter";
        this.__keyCache[16] = "shift";
        this.__keyCache[17] = "ctrl";
        this.__keyCache[18] = "alt";
        this.__keyCache[19] = "pause";
        this.__keyCache[20] = "capslock";
        this.__keyCache[27] = "escape";
        this.__keyCache[32] = "space";
        this.__keyCache[33] = "pageup";
        this.__keyCache[34] = "pagedown";
        this.__keyCache[35] = "end";
        this.__keyCache[36] = "home";
        this.__keyCache[37] = "left";
        this.__keyCache[38] = "up";
        this.__keyCache[39] = "right";
        this.__keyCache[40] = "down";
        this.__keyCache[41] = "select";
        this.__keyCache[42] = "printscreen";
        this.__keyCache[43] = "execute";
        this.__keyCache[44] = "snapshot";
        this.__keyCache[45] = "insert";
        this.__keyCache[46] = "delete";
        this.__keyCache[47] = "help";

        // 0-9
        this.__keyCache[48] = "0";
        this.__keyCache[49] = "1";
        this.__keyCache[50] = "2";
        this.__keyCache[51] = "3";
        this.__keyCache[52] = "4";
        this.__keyCache[53] = "5";
        this.__keyCache[54] = "6";
        this.__keyCache[55] = "7";
        this.__keyCache[56] = "8";
        this.__keyCache[57] = "9";

        // A-Z
        for (var keyCode = 65; keyCode <= 90; ++keyCode) {
            this.__keyCache[keyCode] = String.fromCharCode(keyCode);
        }

        // numpad
        this.__keyCache[96] = "num0";
        this.__keyCache[97] = "num1";
        this.__keyCache[98] = "num2";
        this.__keyCache[99] = "num3";
        this.__keyCache[100] = "num4";
        this.__keyCache[101] = "num5";
        this.__keyCache[102] = "num6";
        this.__keyCache[103] = "num7";
        this.__keyCache[104] = "num8";
        this.__keyCache[105] = "num9";
        this.__keyCache[106] = "num*";
        this.__keyCache[107] = "num+";
        this.__keyCache[108] = "numenter";
        this.__keyCache[109] = "num-";
        this.__keyCache[110] = "num.";
        this.__keyCache[111] = "num/";
        this.__keyCache[144] = "numlock";
        this.__keyCache[145] = "scrolllock";

        // function keys
        this.__keyCache[112] = "f1";
        this.__keyCache[113] = "f2";
        this.__keyCache[114] = "f3";
        this.__keyCache[115] = "f4";
        this.__keyCache[116] = "f5";
        this.__keyCache[117] = "f6";
        this.__keyCache[118] = "f7";
        this.__keyCache[119] = "f8";
        this.__keyCache[120] = "f9";
        this.__keyCache[121] = "f10";
        this.__keyCache[122] = "f11";
        this.__keyCache[123] = "f12";
    },

    /**
     * Get the key name from a native keyboard event
     *
     * @method _keyFromEvent
     * @private
     * @param {KeyboardEvent} event The keyboard event
     * @return {String}
     */
    _keyFromEvent: function (keyboardEvent) {
        var key = this.__keyCache[keyboardEvent.keyCode];
        if (!key) {
            key = keyboardEvent.key;
            this.__keyCache[keyboardEvent.keyCode] = key;
        }
        return key;
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Used to grab all keyboard events
     *
     * @method __onDocumentKeyDown
     * @private
     * @param event
     */
    __onDocumentKeyDown: function (event) {
        if (!this._checkEvent(event)) {
            return;
        }

        this._action = (this.__keys[event.keyCode]) ? "key-hold" : "key-down";
        this.__keys[event.keyCode] = true;
        this._callCallbacks(this._action, [this._dump()]);

        if (!this._noPreventDefault) {
            event.stopPropagation();
            event.preventDefault();
        }
    },

    /**
     * Used to grab all keyboard events
     *
     * @method __onDocumentKeyUp
     * @private
     * @param event
     */
    __onDocumentKeyUp: function (event) {
        if (!this._checkEvent(event) || !this.__keys[event.keyCode]) {
            return;
        }

        this._action = "key-up";
        delete this.__keys[event.keyCode];
        this._callCallbacks(this._action, [this._dump()]);

        if (!this._noPreventDefault) {
            event.stopPropagation();
            event.preventDefault();
        }
    },

    /**
     * Called when the window loose focus
     *
     * @method __onWindowBlur
     * @private
     */
    __onWindowBlur: function () {
        this._action = "key-up";
        this._event = undefined;

        for (var keyCode in this.__keys) {
            delete this.__keys[keyCode];
            this.__key = this.__keyCache[keyCode];
            this._callCallbacks(this._action, [this._dump()]);
        }
    }
});

module.exports = KeyboardManager;
