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
 * @namespace photonui
 */


var photonui = photonui || {};
var _widgets = {};


/*
 * Get a widget.
 *
 * @method getWidget
 * @param {String} name The widget name.
 *
 * @return {photonui.Widget} The widget or null.
 */
photonui.getWidget = function(name) {
    if (_widgets[name] !== undefined) {
        return _widgets[name];
    }
    return null
}


/**
 * Base class for all PhotonUI widgets.
 *
 * wEvents:
 *
 *   * destroy:
 *      - description: called before the widget was destroyed.
 *      - callback:    function(widget)
 *
 *   * show:
 *      - description: called when the widget is displayed.
 *      - callback:    function(widget)
 *
 *   * hidden:
 *      - description: called when the widget is hidden.
 *      - callback:    function(widget)
 *
 * @class Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 * @constructor
 */
photonui.Widget = Class.$extend({

    // Constructor
    __init__: function(params) {
        // New instances for object properties
        this.__html = {};
        this.__events = {};
        this.__callbacks = {};
        this._layoutOptions = {};

        // Build the html
        this._buildHtml();

        // wEvents
        this._registerWEvents(["destroy", "show", "hide"]);

        // Bind properties with accessorts
        for (var prop in this) {
            if (prop.indexOf("get") == 0) {
                var propName = prop.slice(3, 4).toLowerCase() + prop.slice(4, prop.length);
                Object.defineProperty(this, propName, {
                    get: this[prop],
                    enumerable: true,
                    configurable: true
                });
            }
            else if (prop.indexOf("set") == 0) {
                var propName = prop.slice(3, 4).toLowerCase() + prop.slice(4, prop.length);
                Object.defineProperty(this, propName, {
                    set: this[prop],
                    enumerable: true,
                    configurable: true
                });
            }
            else if (prop.indexOf("is") == 0) {
                var propName = prop.slice(2, 3).toLowerCase() + prop.slice(3, prop.length);
                Object.defineProperty(this, propName, {
                    get: this[prop],
                    enumerable: true,
                    configurable: true
                });
            }
        }

        // Apply params
        var params = params || {};
        for (param in params) {
            if (this[param] !== undefined) {
                this[param] = params[param];
            }
        }

        // Default name
        if (!this.name) {
            this.name = "widget-" + photonui.Helpers.uuid4();
        }

        // Additional className
        if (params.className) {
            this.addClass(params.className);
        }

        // Bind some events
        if (this.html) {
            this._bindEvent("pop-contextmenu", this.html, "contextmenu", this.__onContextMenu.bind(this));
        }

        // Register the widget
        _widgets[this.name] = this;
    },


    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////


    // ====== Public properties ======


    /**
     * The unique name of the widget.
     *
     * @property name
     * @type String
     * @default "widget-" + photonui.Helpers.uuid4()
     */
    _name: null,

    getName: function() {
        return this._name;
    },

    setName: function(name) {
        delete _widgets[this.name];
        this._name = name;
        _widgets[name] = this;
        if (this.html) {
            this.html.id = this.name;
        }
    },

    /**
     * Is the widget visible or hidden.
     *
     * @property visible
     * @type Boolean
     * @default true
     */
    _visible: true,

    isVisible: function() {
        return this._visible;
    },

    setVisible: function(visible) {
        this._visible = visible;
        if (!this.html) {
            return;
        }
        if (this.visible) {
            this.html.style.display = "block";  // FIXME
            this._callCallbacks("show");
        }
        else {
            this.html.style.display = "none";
            this._callCallbacks("hide");
        }
    },

    /**
     * The name of the managed contextual menu (`photonui.PopupWindow().name`).
     *
     * @property contextMenuName
     * @type String
     * @default null (= no context menu)
     */
    _contextMenuName: null,

    getContextMenuName: function() {
        return this._contextMenuName;
    },

    setContextMenuName: function(contextMenuName) {
        this._contextMenuName = contextMenuName;
    },

    /**
     * The managed contextual menu.
     *
     * @property contextMenuName
     * @type photonui.PopupWindow
     * @default null (= no context menu)
     */
    getContextMenu: function() {
        return photonui.getWidget(this.contextMenuName);
    },

    setContextMenu: function(contextMenu) {
        if (contextMenu instanceof photonui.PopupWindow) {
            this.contextMenuName = contextMenu.name
        }
        else {
            this.contextMenuName = null;
        }
    },

    /**
     * Layout options.
     *
     * @property layoutOptions
     * @type Object
     * @default {}
     */
    _layoutOptions: {},

    getLayoutOptions: function() {
        return this.getLayoutOptions;
    },

    setLayoutOptions: function(layoutOptions) {
        for (option in layoutOptions) {
            this._layoutOptions[option] = layoutOptions[option];
        }
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function() {
        console.warn("getHtml() method not implemented for this widget.");
        return null;
    },

    /**
     * Absolute position of the widget on the page.
     *
     * `{x: Number, y: Number}`
     *
     * @property absolutePosition
     * @type Object
     * @readOnly
     */
    getAbsolutePosition: function() {
        if (!this.html) {
            return {x: 0, y: 0};
        }
        return photonui.Helpers.getAbsolutePosition(this.html);
    },

    /**
     * Widget width (outer HTML element).
     *
     * @property offsetWidth
     * @type Number
     * @readOnly
     */
    getOffsetWidth: function() {
        if (!this.html) {
            return 0;
        }
        return this.html.offsetWidth;
    },

    /**
     * Widget height (outer HTML element).
     *
     * @property offsetHeight
     * @type Number
     * @readOnly
     */
    getOffsetHeight: function() {
        if (!this.html) {
            return 0;
        }
        return this.html.offsetHeight;
    },


    // ====== Private properties ======


    /**
     * Object containing references to the widget HTML elements
     *
     * @property __html
     * @type Object
     * @private
     */
    __html: {},      // HTML Elements

    /**
     * Object containing references javascript events binding (for widget
     * internal use).
     *
     * @property __events
     * @type Object
     * @private
     */
    __events: {},    // Javascript internal event

    /**
     * Object containing references to registered callbacks.
     *
     * @property __callbacks
     * @type Object
     * @private
     */
    __callbacks: {},  // Registered callback


    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////


    // ====== Public methods ======


    /**
     * Display the widget (equivalent to widget.visible = true).
     *
     * @method show
     */
    show: function() {
        this.visible = true;
    },

    /**
     * DHide the widget (equivalent to widget.visible = false).
     *
     * @method hide
     */
    hide: function() {
        this.visible = false;
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function() {
        this._callCallbacks("destroy");
        delete _widgets[this.name];
        if (this.html) {
            this.html.parentNode.removeChild(this.html);
        }
        for (var id in this.__events) {
            this._unbindEvent(id);
        }
    },

    /**
     * Add a class to the outer HTML element of the widget.
     *
     * @method addClass
     * @param {String} className The class to add.
     */
    addClass: function(className) {
        if (!this.html) {
            return;
        }
        var classes = this.html.className.split(" ");
        if (classes.indexOf(className) < 0) {
            classes.push(className);
        }
        this.html.className = classes.join(" ");
    },

    /**
     * Remove a class from the outer HTML element of the widget.
     *
     * @method removeClass
     * @param {String} className The class to remove.
     */
    removeClass: function(className) {
        if (!this.html) {
            return;
        }
        var classes = this.html.className.split(" ");
        var index = classes.indexOf(className);
        if (index >= 0) {
            classes.splice(index, 1);
        }
        this.html.className = classes.join(" ");
    },

    /**
     * Register a callback for any widget event (called wEvent).
     *
     * Callback signature:
     *
     *     function(widget [, arg1 [, arg2 [, ...]]])
     *
     * @method registerCallback
     * @param {String} id An unique id for the callback.
     * @param {String} wEvent the widget event name.
     * @param {Function} callback The callback function.
     * @param {Object} thisArg The value of this (optionnal, default = current widget).
     */
    registerCallback: function(id, wEvent, callback, thisArg) {
        if (!this.__callbacks[wEvent]) {
            console.error("This widget have no '" + wEvent + "' event.");
            return;
        }
        this.__callbacks[wEvent][id] = {
            callback: callback,
            thisArg: thisArg || null
        }
    },

    /**
     * Remove a registered callback.
     *
     * @method removeCallback
     * @param {String} id The id of the callback.
     */
    removeCallback: function(id) {
        for (var wEvent in this.__callbacks) {
            if (this.__callbacks[wEvent][id]) {
                delete this.__callbacks[wEvent][id];
            }
        }
    },


    // ====== Private methods ======


    /**
     * Javascript event binding (for widget internal use).
     *
     * @method _bindEvent
     * @private
     * @param {String} id An unique id for the event.
     * @param {DOMElement} element The element on which the event will be bind.
     * @param {String} evName The event name (e.g. "mousemove", "click",...).
     * @param {Function} callback The function that will be called when the event occured.
     */
    _bindEvent: function(id, element, evName, callback) {
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
    _unbindEvent: function(id) {
        this.__events[id].element.removeEventListener(
                this.__events[id].evName,
                this.__events[id].callback,
                false
        );
        delete this.__events[id];
    },

    /**
     * Register widgets available events (wEvent).
     *
     * @method _registerWidgetEvents
     * @private
     * @param {Array} wEvents
     */
    _registerWEvents: function(wEvents) {
        for (var i in wEvents) {
            this.__callbacks[wEvents[i]] = {};
        }
    },

    /**
     * Call all callbacks for the given widget event (wEvent).
     *
     * NOTE: the first argument passed to the callback is the current widget.
     * NOTE²: if the thisArg of the callback is null, this will be binded to the current widget.
     *
     * @method _callCallbacks
     * @private
     * @param {String} wEvent The widget event.
     * @param {Array} params Parametters that will be sent to the callbacks.
     */
    _callCallbacks: function(wEvent, params) {
        var params = params || [];
        for (var id in this.__callbacks[wEvent]) {
            this.__callbacks[wEvent][id].callback.apply(
                    this.__callbacks[wEvent][id].thisArg || this,
                    [this].concat(params)
            );
        }
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function() {
        console.warn("_buildHtml() method not implemented for this widget.");
    },


    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////


    /**
     * Called when the context menu should be displayed.
     *
     * @method __onContextMenu
     * @private
     * @param event
     */
    __onContextMenu: function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.contextMenuName) {
            this.contextMenu.popupXY(event.pageX, event.pageY);
        }
    }
});
