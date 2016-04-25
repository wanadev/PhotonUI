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

var Helpers = require("../helpers.js");
var Base = require("../base.js");
var Widget = require("../widget.js");

/**
 * Manage advanced mouse events on Widgets or HTMLElements.
 *
 * wEvents:
 *
 *   * mouse-event:
 *      - description: Called for *ALL* mouse events.
 *      - callback:    function(manager, mstate)
 *
 *   * mouse-down:
 *      - description: Mouse button pressed.
 *      - callback:    function(manager, mstate)
 *
 *   * mouse-up:
 *      - description: Mouse button released.
 *      - callback:    function(manager, mstate)
 *
 *   * click:
 *      - description: Click...
 *      - callback:    function(manager, mstate)
 *
 *   * double-click:
 *      - description: Double click...
 *      - callback:    function(manager, mstate)
 *
 *   * drag-start:
 *      - description: Start dragging.
 *      - callback:    function(manager, mstate)
 *
 *   * dragging:
 *      - description: dragging.
 *      - callback:    function(manager, mstate)
 *
 *   * drag-end:
 *      - description: Stop dragging.
 *      - callback:    function(manager, mstate)
 *
 *   * mouse-move:
 *      - description: Mouse move on the element.
 *      - callback:    function(manager, mstate)
 *
 *   * scroll-up:
 *      - description: Scroll up.
 *      - callback:    function(manager, mstate)
 *
 *   * scroll-down:
 *      - description: Scroll down.
 *      - callback:    function(manager, mstate)
 *
 *
 * mstate:
 *
 *   A snapshot of the mouse state ath the moment when the event occured.
 *
 *     {
 *         event: <Object>,       // The original js event
 *         action: <String>,      // The event name (mouse-down/up/move, click, double-click,
 *                                //    drag-start/end, dragging, scroll-up/down)
 *         pageX: <Number>,       // X position, relative to page top-left corner.
 *         pageY: <Number>,       // Y position, relative to page top-left corner.
 *         x: <Number>,           // X position, relative to the HTML element.
 *         y: <Number>,           // Y position, relative to the HTML element.
 *         deltaX: <Number>,      // Delta X (current_x - previous_x)
 *         deltaY: <Number>,      // Delta Y (current_y - previous_y)
 *         btnLeft: <Boolean>,    // Current state of the mouse left button.
 *         btnMiddle: <Boolean>,  // Current state of the mouse middle button.
 *         btnRight: <Boolean>,   // Current state of the mouse right button.
 *         button: <String>       // The button that triggered the last event (none, "left", "middle", "right").
 *     }
 *
 * @class MouseManager
 * @constructor
 * @extends photonui.Base
 * @param {photonui.Widget} element Any PhotonUI Widget (optional).
 * @param {HTMLElement} element Any HTML element (optional).
 * @param {Object} params additional params (optional).
 */
var MouseManager = Base.$extend({

    // Constructor
    __init__: function (element, params) {
        this._registerWEvents([
            "mouse-event", "mouse-down", "mouse-up", "click", "double-click",
            "drag-start", "dragging", "drag-end", "mouse-move", "scroll-up",
            "scroll-down"
        ]);
        if (element && (element instanceof Widget || element instanceof HTMLElement)) {
            this.$super(params);
            this.element = element;
        } else {
            this.$super(element);
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

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
        } else if (element instanceof HTMLElement) {
            this._element = element;
        } else {
            this._element = null;
        }
        this._updateEvents();
    },

    /**
     * Minimum distance for triggering a drag-start, and maximum distance
     * to consider a mouse down/up as a click.
     *
     * @property threshold
     * @type Number
     * @default 5
     */
    _threshold: 5,

    getThreshold: function () {
        return this._threshold;
    },

    setThreshold: function (threshold) {
        this._threshold = threshold;
    },

    /**
     * Scale all position events by a factor. Use it when the canvas is scaled.
     *
     * @property scaleX
     * @type Number
     * @default 1
     */
    _scaleX: 1,

    getScaleX: function () {
        return this._scaleX;
    },

    setScaleX: function (scaleX) {
        this._scaleX = scaleX;
    },

    /**
     * Scale all position events by a factor. Use it when the canvas is scaled.
     *
     * @property scaleY
     * @type Number
     * @default 1
     */
    _scaleY: 1,

    getScaleY: function () {
        return this._scaleY;
    },

    setScaleY: function (scaleY) {
        this._scaleY = scaleY;
    },

    /**
     * Translate all position events by a scalar. Use it when the canvas is translated.
     *
     * @property translateX
     * @type Number
     * @default 0
     */
    _translateX: 0,

    getTranslateX: function () {
        return this._translateX;
    },

    setTranslateX: function (translateX) {
        this._translateX = translateX;
    },

    /**
     * translate all position events by a scalar. Use it when the canvas is translated.
     *
     * @property translateY
     * @type Number
     * @default 0
     */
    _translateY: 0,

    getTranslateY: function () {
        return this._translateY;
    },

    setTranslateY: function (translateY) {
        this._translateY = translateY;
    },

    /**
     * X position, relative to page top-left corner.
     *
     * @property pageX
     * @readOnly
     * @type Number
     * @default 0
     */
    getPageX: function () {
        return this.__event.pageX || 0;
    },

    /**
     * Y position, relative to page top-left corner.
     *
     * @property pageY
     * @readOnly
     * @type Number
     * @default 0
     */
    getPageY: function () {
        return this.__event.pageY || 0;
    },

    /**
     * X position, relative to the HTML element.
     *
     * @property x
     * @readOnly
     * @type Number
     */
    getX: function () {
        var ex = Helpers.getAbsolutePosition(this.element).x;
        return (this.pageX - ex) * this.scaleX + this.translateX;
    },

    /**
     * Y position, relative to the HTML element.
     *
     * @property y
     * @readOnly
     * @type Number
     */
    getY: function () {
        var ey = Helpers.getAbsolutePosition(this.element).y;
        return (this.pageY - ey) * this.scaleY + this.translateY;
    },

    /**
     * Delta X (current_x - previous_x).
     *
     * @property deltaX
     * @readOnly
     * @type Number
     */
    getDeltaX: function () {
        return (this.pageX - ((this.__prevState.pageX !== undefined) ?
            this.__prevState.pageX : this.pageX)) * this.scaleX;
    },

    /**
     * Delta Y (current_y - previous_y).
     *
     * @property deltaY
     * @readOnly
     * @type Number
     */
    getDeltaY: function () {
        return (this.pageY - ((this.__prevState.pageY !== undefined) ?
            this.__prevState.pageY : this.pageY)) * this.scaleY;
    },

    /**
     * The action:
     *
     *   * "mouse-down"
     *   * "moues-up"
     *   * "click"
     *   * "double-click"
     *   * "drag-start"
     *   * "dragging"
     *   * "drag-end"
     *   * "scroll-down"
     *   * "scroll-up"
     *   * "mouse-move"
     *
     * @property action
     * @readOnly
     * @type String
     */
    _action: "",

    getAction: function () {
        return this._action;
    },

    /**
     * Current state of the mouse left button.
     *
     * @property btnLeft
     * @type Boolean
     * @readOnly
     */
    _btnLeft: false,

    getBtnLeft: function () {
        return this._btnLeft;
    },

    /**
     * Current state of the mouse middle button.
     *
     * @property btnMiddle
     * @type Boolean
     * @readOnly
     */
    _btnMiddle: false,

    getBtnMiddle: function () {
        return this._btnMiddle;
    },

    /**
     * Current state of the mouse right button.
     *
     * @property btnRight
     * @type Boolean
     * @readOnly
     */
    _btnRight: false,

    getBtnRight: function () {
        return this._btnRight;
    },

    /**
     * The button that triggered the last event.
     *
     *   * none
     *   * "left"
     *   * "middle"
     *   * "right"
     *
     * @property button
     * @readOnly
     * @type String
     */
    _button: null,

    getButton: function () {
        return this._button;
    },

    // ====== Private properties ======

    /**
     * Previous state.
     *
     * @property __prevState
     * @private
     * @type Object
     */
    __prevState: {},

    /**
     * Js event on mouse down.
     *
     * @property __mouseDownEvent
     * @private
     * @type Object
     */
    __mouseDownEvent: {},

    /**
     * Last event object.
     *
     * @property __event
     * @private
     * @type Object
     * @default {}
     */
    __event: {},

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

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
        this._bindEvent("mouse-down", this.element, "mousedown", this.__onMouseDown.bind(this));
        this._bindEvent("mouse-up", this.element, "mouseup", this.__onMouseUp.bind(this));
        this._bindEvent("double-click", this.element, "dblclick", this.__onDoubleClick.bind(this));
        this._bindEvent("mouse-move", this.element, "mousemove", this.__onMouseMove.bind(this));
        this._bindEvent("mousewheel", this.element, "mousewheel", this.__onMouseWheel.bind(this));
        this._bindEvent("mousewheel-firefox", this.element, "DOMMouseScroll", this.__onMouseWheel.bind(this));

        this._bindEvent("document-mouse-up", document, "mouseup", this.__onDocumentMouseUp.bind(this));
        this._bindEvent("document-mouse-move", document, "mousemove", this.__onDocumentMouseMove.bind(this));
    },

    /**
     * Take a snapshot of the MouseManager
     *
     * @method _dump
     * @private
     * @return {Object}
     */
    _dump: function () {
        return {
            event: this.__event,
            action: this.action,
            pageX: this.pageX,
            pageY: this.pageY,
            x: this.x,
            y: this.y,
            deltaX: this.deltaX,
            deltaY: this.deltaY,
            btnLeft: this.btnLeft,
            btnMiddle: this.btnMiddle,
            btnRight: this.btnRight,
            button: this.button
        };
    },

    /**
     * Analyze and dispatche wEvents.
     *
     * @method _stateMachine
     * @private
     * @param {String} action The action name (e.g. "mouse-up").
     * @param {Object} event The js event.
     */
    _stateMachine: function (action, event) {
        // Save the previous state
        this.__prevState = this._dump();

        // Load the current state
        this._action = action;
        this.__event = event;
        this._button = null;
        if (event.button === 0) {
            this._button = "left";
        }
        if (event.button === 1) {
            this._button = "middle";
        }
        if (event.button === 2) {
            this._button = "right";
        }

        // Analyze the event

        // Mouse Down / Mouse Up
        if (action == "mouse-down") {
            this.__mouseDownEvent = event;

            if (event.button === 0) {
                this._btnLeft = true;
            }
            if (event.button === 1) {
                this._btnMiddle = true;
            }
            if (event.button === 2) {
                this._btnRight = true;
            }

            this._callCallbacks("mouse-event", [this._dump()]);
            this._callCallbacks(this.action, [this._dump()]);
        } else if (action == "mouse-up") {
            if (event.button === 0) {
                this._btnLeft = false;
            }
            if (event.button === 1) {
                this._btnMiddle = false;
            }
            if (event.button === 2) {
                this._btnRight = false;
            }

            this._callCallbacks("mouse-event", [this._dump()]);
            this._callCallbacks(this.action, [this._dump()]);
        } else if (action == "drag-end") {
            if (event.button === 0) {
                this._btnLeft = false;
            }
            if (event.button === 1) {
                this._btnMiddle = false;
            }
            if (event.button === 2) {
                this._btnRight = false;
            }
        }

        // Click
        if (action == "mouse-up" && (Math.abs(this.pageX - this.__mouseDownEvent.pageX) <= this._threshold &&
            Math.abs(this.pageY - this.__mouseDownEvent.pageY) <= this._threshold)) {
            this._action = "click";
            this._callCallbacks("mouse-event", [this._dump()]);
            this._callCallbacks("click", [this._dump()]);
        }

        // Double Click
        if (action == "double-click" && this.__prevState.action == "click") {
            this._action = "double-click";
            this._callCallbacks("mouse-event", [this._dump()]);
            this._callCallbacks(this.action, [this._dump()]);
        }

        // Mouse move
        if (action == "mouse-move") {
            this._callCallbacks("mouse-event", [this._dump()]);
            this._callCallbacks(this.action, [this._dump()]);
        }

        // Drag Start
        if (action == "mouse-move" && this.__prevState.action != "drag-start" &&
            this.__prevState.action != "dragging" && (this.btnLeft || this.btnMiddle || this.btnRight)) {
            if (Math.abs(this.pageX - this.__mouseDownEvent.pageX) > this._threshold ||
                Math.abs(this.pageY - this.__mouseDownEvent.pageY) > this._threshold) {
                // Drag Start
                this._action = "drag-start";
                this.__event = this.__mouseDownEvent;
                this._callCallbacks("mouse-event", [this._dump()]);
                this._callCallbacks(this.action, [this._dump()]);
                // Dragging
                this._action = "dragging";
                this.__prevState.event = this.__mouseDownEvent;
                this.__event = event;
                this._callCallbacks("mouse-event", [this._dump()]);
                this._callCallbacks(this.action, [this._dump()]);
            }

        // Dragging
        } else if (action == "dragging" || (action == "mouse-move" && (this.__prevState.action == "drag-start" ||
                 this.__prevState.action == "dragging") && (this.btnLeft || this.btnMiddle || this.btnRight))) {
            this._action = "dragging";
            this._callCallbacks("mouse-event", [this._dump()]);
            this._callCallbacks(this.action, [this._dump()]);

        // Drag End
        } else if (action == "drag-end" || (action == "mouse-up" && (this.__prevState.action == "dragging" ||
                 this.__prevState.action == "drag-start") && !(this.btnLeft || this.btnMiddle || this.btnRight))) {
            this._action = "drag-end";
            this._callCallbacks("mouse-event", [this._dump()]);
            this._callCallbacks(this.action, [this._dump()]);
        }

        // Scroll Up / Scroll Down
        if (action == "scroll-up" || action == "scroll-down") {
            this._callCallbacks("mouse-event", [this._dump()]);
            this._callCallbacks(this.action, [this._dump()]);
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onMouseDown
     * @private
     * @param event
     */
    __onMouseDown: function (event) {
        event.stopPropagation();
        this._stateMachine("mouse-down", event);
    },

    /**
     * @method __onMouseUp
     * @private
     * @param event
     */
    __onMouseUp: function (event) {
        event.stopPropagation();
        this._stateMachine("mouse-up", event);
    },

    /**
     * @method __onDoubleClick
     * @private
     * @param event
     */
    __onDoubleClick: function (event) {
        this._stateMachine("double-click", event);
    },

    /**
     * @method __onMouseMove
     * @private
     * @param event
     */
    __onMouseMove: function (event) {
        event.stopPropagation();
        this._stateMachine("mouse-move", event);
    },

    /**
     * Used to detect drag-end outside the element.
     *
     * @method __onDocumentMouseUp
     * @private
     * @param event
     */
    __onDocumentMouseUp: function (event) {
        if (this.action == "dragging" || this.action == "drag-start") {
            this._stateMachine("drag-end", event);
        }
    },

    /**
     * Used to detect dragging outside the element.
     *
     * @method __onDocumentMouseMove
     * @private
     * @param event
     */
    __onDocumentMouseMove: function (event) {
        if (this.action == "dragging" || this.action == "drag-start") {
            this._stateMachine("dragging", event);
        }
    },

    /**
     * @method __onMouseWheel
     * @private
     * @param event
     */
    __onMouseWheel: function (event) {
        var wheelDelta = null;

        // Webkit
        if (event.wheelDeltaY !== undefined) {
            wheelDelta = event.wheelDeltaY;
        }
        // MSIE
        if (event.wheelDelta !== undefined) {
            wheelDelta = event.wheelDelta;
        }
        // Firefox
        if (event.axis !== undefined && event.detail !== undefined) {
            if (event.axis == 2) { // Y
                wheelDelta = -event.detail;
            }
        }

        if (wheelDelta !== null) {
            if (wheelDelta >= 0) {
                this._stateMachine("scroll-up", event);
            } else {
                this._stateMachine("scroll-down", event);
            }
        }
    }
});

module.exports = MouseManager;
