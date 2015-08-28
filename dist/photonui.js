(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.photonui = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var extractAnnotations = require("./annotation.js");

var _disableConstructor = false;

// Inherit from a class without calling its constructor.
function inherit(SuperClass) {
    _disableConstructor = true;
    var __class__ = new SuperClass();
    _disableConstructor = false;
    return __class__;
}

// Checks if the given function uses abitbol special properties ($super, $name,...)
function usesSpecialProperty(fn) {
    return Boolean(fn.toString().match(/.*(\$super|\$name|\$computedPropertyName).*/));
}

var Class = function () {};

Object.defineProperty(Class, "$class", {
    enumerable: false,
    value: Class
});

Object.defineProperty(Class, "$map", {
    enumerable: false,
    value: {
        attributes: {},
        methods: {},
        computedProperties: {}
    }
});

Object.defineProperty(Class, "$extend", {
    enumerable: false,
    value: function (properties) {
        var _superClass = this;
        var _classMap = JSON.parse(JSON.stringify(_superClass.$map));  // not pretty :s

        // New class
        var __class__ = function () {
            if (_disableConstructor) {
                return;
            }
            // Abitbol special properties
            Object.defineProperty(this, "$class", {
                enumerable: false,
                value: __class__
            });
            Object.defineProperty(this, "$map", {
                enumerable: false,
                value: _classMap
            });
            Object.defineProperty(this, "$data", {
                enumerable: false,
                value: {}
            });
            // Computed properties
            for (var property in _classMap.computedProperties) {
                Object.defineProperty(this, property, {
                    enumerable: true,
                    configurable: false,
                    get: (_classMap.computedProperties[property].get !== undefined) ? (function (accessorName) {
                        return function () {
                            return this[accessorName].apply(this, arguments);
                        };
                    })(_classMap.computedProperties[property].get) : undefined,  // jshint ignore:line
                    set: (_classMap.computedProperties[property].set !== undefined) ? (function (mutatorName) {
                        return function () {
                            return this[mutatorName].apply(this, arguments);
                        };
                    })(_classMap.computedProperties[property].set) : undefined   // jshint ignore:line
                });
            }
            // Bind this
            for (var method in _classMap.methods) {
                this[method] = this[method].bind(this);
            }
            // Call the constructor if any
            if (this.__init__) {
                this.__init__.apply(this, arguments);
            }
            return this;
        };

        // Inheritance
        __class__.prototype = inherit(this.$class);

        properties = properties || {};
        var property;
        var computedPropertyName;
        var annotations;
        var i;

        // Copy properties from mixins
        if (properties.__include__) {
            for (i = properties.__include__.length - 1 ; i >= 0 ; i--) {
                for (property in properties.__include__[i]) {
                    if (properties[property] === undefined) {
                        properties[property] = properties.__include__[i][property];
                    }
                }
            }
        }

        // Add properties
        for (property in properties || {}) {
            if (property == "__include__" || property == "__classvars__") {
                continue;
            }
            if (typeof properties[property] == "function") {
                computedPropertyName = undefined;
                _classMap.methods[property] = {annotations: {}};
                // Accessors / Mutators
                if (property.indexOf("get") === 0) {
                    computedPropertyName = property.slice(3, 4).toLowerCase() + property.slice(4, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].get = property;
                } else if (property.indexOf("set") === 0) {
                    computedPropertyName = property.slice(3, 4).toLowerCase() + property.slice(4, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].set = property;
                } else if (property.indexOf("has") === 0) {
                    computedPropertyName = property.slice(3, 4).toLowerCase() + property.slice(4, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].get = property;
                } else if (property.indexOf("is") === 0) {
                    computedPropertyName = property.slice(2, 3).toLowerCase() + property.slice(3, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].get = property;
                }
                // Annotations
                annotations = extractAnnotations(properties[property]);
                for (var annotation in annotations) {
                    _classMap.methods[property].annotations[annotation] = annotations[annotation];
                    if (computedPropertyName) {
                        _classMap.computedProperties[computedPropertyName]
                                 .annotations[annotation] = annotations[annotation];
                    }
                }
                // Wrapped method
                if (usesSpecialProperty(properties[property])) {
                    __class__.prototype[property] = (function (method, propertyName, computedPropertyName) {
                        return function () {
                            var _oldSuper = this.$super;
                            var _oldName = this.$name;
                            var _oldComputedPropertyName = this.$computedPropertyName;

                            this.$super = _superClass.prototype[propertyName];
                            this.$name = propertyName;
                            this.$computedPropertyName = computedPropertyName;

                            try {
                                return method.apply(this, arguments);
                            } finally {
                                if (_oldSuper) {
                                    this.$super = _oldSuper;
                                } else {
                                    delete this.$super;
                                }
                                if (_oldName) {
                                    this.$name = _oldName;
                                } else {
                                    delete this.$name;
                                }
                                if (_oldComputedPropertyName) {
                                    this.$computedPropertyName = _oldComputedPropertyName;
                                } else {
                                    delete this.$computedPropertyName;
                                }
                            }
                        };
                    })(properties[property], property, computedPropertyName);  // jshint ignore:line

                // Simple methods
                } else {
                    __class__.prototype[property] = properties[property];
                }
            } else {
                _classMap.attributes[property] = true;
                __class__.prototype[property] = properties[property];
            }
        }

        // Copy super class static properties
        var scStaticProps = Object.getOwnPropertyNames(_superClass);
        // Removes caller, callee and arguments from the list (strict mode)
        // Removes non enumerable Abitbol properties too
        scStaticProps = scStaticProps.filter(function (value) {
            return (["caller", "callee", "arguments", "$class", "$extend", "$map"].indexOf(value) == -1);
        });
        for (i = 0 ; i < scStaticProps.length ; i++) {
            if (__class__[scStaticProps[i]] === undefined) {
                __class__[scStaticProps[i]] = _superClass[scStaticProps[i]];
            }
        }

        // Add static properties
        if (properties.__classvars__) {
            for (property in properties.__classvars__) {
                __class__[property] = properties.__classvars__[property];
            }
        }

        // Add abitbol static properties
        Object.defineProperty(__class__, "$class", {
            enumerable: false,
            value: __class__
        });
        Object.defineProperty(__class__, "$extend", {
            enumerable: false,
            value: Class.$extend
        });
        Object.defineProperty(__class__, "$map", {
            enumerable: false,
            value: _classMap
        });

        return __class__;
    }
});

module.exports = Class;

},{"./annotation.js":2}],2:[function(require,module,exports){
"use strict";

function cleanJs(js) {
    // remove function fn(param) {
    js = js.replace(/^function\s*[^(]*\s*\([^)]*\)\s*\{/, "");

    // remove comments (not super safe but should work in most cases)
    js = js.replace(/\/\*(.|\r|\n)*?\*\//g, "");
    js = js.replace(/\/\/.*?\r?\n/g, "\n");

    // remove indentation and CR/LF
    js = js.replace(/\s*\r?\n\s*/g, "");

    return js;
}

function extractStrings(js) {
    var strings = [];

    var instr = false;
    var inesc = false;
    var quote;
    var buff;
    var c;

    for (var i = 0 ; i < js.length ; i++) {
        c = js[i];

        if (!instr) {
            // New string
            if (c == "\"" || c == "'") {
                instr = true;
                inesc = false;
                quote = c;
                buff = "";
            // Char we don't care about
            } else if ([" ", " ", "\n", "\r", ";"].indexOf(c) > -1) {  // jshint ignore:line
                continue;
            // Other expression -> job finished!
            } else {
                break;
            }
        } else {
            if (!inesc) {
                // Escaped char
                if (c == "\\") {
                    inesc = true;
                // End of string
                } else if (c == quote) {
                    strings.push(buff);
                    instr = false;
                // Any char
                } else {
                    buff += c;
                }
            } else {
                if (c == "\\") {
                    buff += "\\";
                } else if (c == "n") {
                    buff += "\n";
                } else if (c == "r") {
                    buff += "\r";
                } else if (c == "t") {
                    buff += "\t";
                } else if (c == quote) {
                    buff += quote;
                // We don't care...
                } else {
                    buff += "\\" + c;
                }
                inesc = false;
            }
        }
    }

    return strings;
}

function autoCast(value) {
    if (value == "true") {
        return true;
    } else if (value == "false") {
        return false;
    } else if (value == "null") {
        return null;
    } else if (value == "undefined") {
        return undefined;
    } else if (value.match(/^([0-9]+\.?|[0-9]*\.[0-9]+)$/)) {
        return parseFloat(value);
    } else {
        return value;
    }
}

function extractAnnotations(func) {
    var js = cleanJs(func.toString());
    var strings = extractStrings(js);

    var annotations = {};
    var string;
    var key;
    var value;

    for (var i = 0 ; i < strings.length ; i++) {
        string = strings[i].trim();

        if (string.indexOf("@") !== 0) {
            continue;
        }

        key = string.slice(1, (string.indexOf(" ") > -1) ? string.indexOf(" ") : string.length);
        value = true;
        if (string.indexOf(" ") > -1) {
            value = string.slice(string.indexOf(" ") + 1, string.length);
            value = value.trim();
            value = autoCast(value);
        }

        annotations[key] = value;
    }

    return annotations;
}

module.exports = extractAnnotations;

},{}],3:[function(require,module,exports){
/**
 * Title: KeyboardJS
 * Version: v0.4.1
 * Description: KeyboardJS is a flexible and easy to use keyboard binding
 * library.
 * Author: Robert Hurst.
 *
 * Copyright 2011, Robert William Hurst
 * Licenced under the BSD License.
 * See https://raw.github.com/RobertWHurst/KeyboardJS/master/license.txt
 */
(function(context, factory) {

	//INDEXOF POLLYFILL
	[].indexOf||(Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;});

	//AMD
	if(typeof define === 'function' && define.amd) { define(constructAMD); }

	//CommonJS
	else if(typeof module !== 'undefined') {constructCommonJS()}

	//GLOBAL
	else { constructGlobal(); }

	/**
	 * Construct AMD version of the library
	 */
	function constructAMD() {

		//create a library instance
		return init(context);

		//spawns a library instance
		function init(context) {
			var library;
			library = factory(context, 'amd');
			library.fork = init;
			return library;
		}
	}

	/**
	 * Construct CommonJS version of the library
	 */
	function constructCommonJS() {

		//create a library instance
		module.exports = init(context);

		return;

		//spawns a library instance
		function init(context) {
			var library;
			library = factory(context, 'CommonJS');
			library.fork = init;
			return library;

		}

	}

	/**
	 * Construct a Global version of the library
	 */
	function constructGlobal() {
		var library;

		//create a library instance
		library = init(context);

		//spawns a library instance
		function init(context) {
			var library, namespaces = [], previousValues = {};

			library = factory(context, 'global');
			library.fork = init;
			library.noConflict = noConflict;
			library.noConflict('KeyboardJS', 'k');
			return library;

			//sets library namespaces
			function noConflict(    ) {
				var args, nI, newNamespaces;

				newNamespaces = Array.prototype.slice.apply(arguments);

				for(nI = 0; nI < namespaces.length; nI += 1) {
					if(typeof previousValues[namespaces[nI]] === 'undefined') {
						delete context[namespaces[nI]];
					} else {
						context[namespaces[nI]] = previousValues[namespaces[nI]];
					}
				}

				previousValues = {};

				for(nI = 0; nI < newNamespaces.length; nI += 1) {
					if(typeof newNamespaces[nI] !== 'string') {
						throw new Error('Cannot replace namespaces. All new namespaces must be strings.');
					}
					previousValues[newNamespaces[nI]] = context[newNamespaces[nI]];
					context[newNamespaces[nI]] = library;
				}

				namespaces = newNamespaces;

				return namespaces;
			}
		}
	}

})(this, function(targetWindow, env) {
	var KeyboardJS = {}, locales = {}, locale, map, macros, activeKeys = [], bindings = [], activeBindings = [],
	activeMacros = [], aI, usLocale;
	targetWindow = (targetWindow && Object.getOwnPropertyNames(targetWindow).length > 0 ) ? targetWindow : window;

	///////////////////////
	// DEFAULT US LOCALE //
	///////////////////////

	//define US locale
	//If you create a new locale please submit it as a pull request or post
	// it in the issue tracker at
	// http://github.com/RobertWhurst/KeyboardJS/issues/
	usLocale = {
		"map": {

			//general
			"3": ["cancel"],
			"8": ["backspace"],
			"9": ["tab"],
			"12": ["clear"],
			"13": ["enter"],
			"16": ["shift"],
			"17": ["ctrl"],
			"18": ["alt", "menu"],
			"19": ["pause", "break"],
			"20": ["capslock"],
			"27": ["escape", "esc"],
			"32": ["space", "spacebar"],
			"33": ["pageup"],
			"34": ["pagedown"],
			"35": ["end"],
			"36": ["home"],
			"37": ["left"],
			"38": ["up"],
			"39": ["right"],
			"40": ["down"],
			"41": ["select"],
			"42": ["printscreen"],
			"43": ["execute"],
			"44": ["snapshot"],
			"45": ["insert", "ins"],
			"46": ["delete", "del"],
			"47": ["help"],
			"91": ["command", "windows", "win", "super", "leftcommand", "leftwindows", "leftwin", "leftsuper"],
			"92": ["command", "windows", "win", "super", "rightcommand", "rightwindows", "rightwin", "rightsuper"],
			"145": ["scrolllock", "scroll"],
			"186": ["semicolon", ";"],
			"187": ["equal", "equalsign", "="],
			"188": ["comma", ","],
			"189": ["dash", "-"],
			"190": ["period", "."],
			"191": ["slash", "forwardslash", "/"],
			"192": ["graveaccent", "`"],
			"219": ["openbracket", "["],
			"220": ["backslash", "\\"],
			"221": ["closebracket", "]"],
			"222": ["apostrophe", "'"],

			//0-9
			"48": ["zero", "0"],
			"49": ["one", "1"],
			"50": ["two", "2"],
			"51": ["three", "3"],
			"52": ["four", "4"],
			"53": ["five", "5"],
			"54": ["six", "6"],
			"55": ["seven", "7"],
			"56": ["eight", "8"],
			"57": ["nine", "9"],

			//numpad
			"96": ["numzero", "num0"],
			"97": ["numone", "num1"],
			"98": ["numtwo", "num2"],
			"99": ["numthree", "num3"],
			"100": ["numfour", "num4"],
			"101": ["numfive", "num5"],
			"102": ["numsix", "num6"],
			"103": ["numseven", "num7"],
			"104": ["numeight", "num8"],
			"105": ["numnine", "num9"],
			"106": ["nummultiply", "num*"],
			"107": ["numadd", "num+"],
			"108": ["numenter"],
			"109": ["numsubtract", "num-"],
			"110": ["numdecimal", "num."],
			"111": ["numdivide", "num/"],
			"144": ["numlock", "num"],

			//function keys
			"112": ["f1"],
			"113": ["f2"],
			"114": ["f3"],
			"115": ["f4"],
			"116": ["f5"],
			"117": ["f6"],
			"118": ["f7"],
			"119": ["f8"],
			"120": ["f9"],
			"121": ["f10"],
			"122": ["f11"],
			"123": ["f12"]
		},
		"macros": [

			//secondary key symbols
			['shift + `', ["tilde", "~"]],
			['shift + 1', ["exclamation", "exclamationpoint", "!"]],
			['shift + 2', ["at", "@"]],
			['shift + 3', ["number", "#"]],
			['shift + 4', ["dollar", "dollars", "dollarsign", "$"]],
			['shift + 5', ["percent", "%"]],
			['shift + 6', ["caret", "^"]],
			['shift + 7', ["ampersand", "and", "&"]],
			['shift + 8', ["asterisk", "*"]],
			['shift + 9', ["openparen", "("]],
			['shift + 0', ["closeparen", ")"]],
			['shift + -', ["underscore", "_"]],
			['shift + =', ["plus", "+"]],
			['shift + (', ["opencurlybrace", "opencurlybracket", "{"]],
			['shift + )', ["closecurlybrace", "closecurlybracket", "}"]],
			['shift + \\', ["verticalbar", "|"]],
			['shift + ;', ["colon", ":"]],
			['shift + \'', ["quotationmark", "\""]],
			['shift + !,', ["openanglebracket", "<"]],
			['shift + .', ["closeanglebracket", ">"]],
			['shift + /', ["questionmark", "?"]]
		]
	};
	//a-z and A-Z
	for (aI = 65; aI <= 90; aI += 1) {
		usLocale.map[aI] = String.fromCharCode(aI + 32);
		usLocale.macros.push(['shift + ' + String.fromCharCode(aI + 32) + ', capslock + ' + String.fromCharCode(aI + 32), [String.fromCharCode(aI)]]);
	}

  // Support command key on Mac.
	// This is unfortunately browser specific
	if(/^Mac/.test(navigator.platform)){
		// Chrome,Safari
		if(/Chrome/.test(navigator.userAgent) ||
			 /Safari/.test(navigator.userAgent)){
				 usLocale.map["93"] = usLocale.map["92"];
		}
		// Opera
		if(/Opera/.test(navigator.userAgent)){
			usLocale.map["17"] = usLocale.map["91"];
			delete usLocale.map["91"];
		}
		// Firefox
		if(/Firefox/.test(navigator.userAgent)){
			usLocale.map["224"] = usLocale.map["91"];
			delete usLocale.map["91"];
		}
		delete usLocale.map["92"];
	}

	registerLocale('us', usLocale);
	getSetLocale('us');


	//////////
	// INIT //
	//////////

	//enable the library
	enable();


	/////////
	// API //
	/////////

	//assemble the library and return it
	KeyboardJS.enable = enable;
	KeyboardJS.disable = disable;
	KeyboardJS.activeKeys = getActiveKeys;
	KeyboardJS.releaseKey = removeActiveKey;
	KeyboardJS.pressKey = addActiveKey;
	KeyboardJS.on = createBinding;
	KeyboardJS.clear = removeBindingByKeyCombo;
	KeyboardJS.clear.key = removeBindingByKeyName;
	KeyboardJS.locale = getSetLocale;
	KeyboardJS.locale.register = registerLocale;
	KeyboardJS.macro = createMacro;
	KeyboardJS.macro.remove = removeMacro;
	KeyboardJS.key = {};
	KeyboardJS.key.name = getKeyName;
	KeyboardJS.key.code = getKeyCode;
	KeyboardJS.combo = {};
	KeyboardJS.combo.active = isSatisfiedCombo;
	KeyboardJS.combo.parse = parseKeyCombo;
	KeyboardJS.combo.stringify = stringifyKeyCombo;
	return KeyboardJS;


	//////////////////////
	// INSTANCE METHODS //
	//////////////////////

	/**
	 * Enables KeyboardJS
	 */
	function enable() {
		if(targetWindow.addEventListener) {
			targetWindow.document.addEventListener('keydown', keydown, false);
			targetWindow.document.addEventListener('keyup', keyup, false);
			targetWindow.addEventListener('blur', reset, false);
			targetWindow.addEventListener('webkitfullscreenchange', reset, false);
			targetWindow.addEventListener('mozfullscreenchange', reset, false);
		} else if(targetWindow.attachEvent) {
			targetWindow.document.attachEvent('onkeydown', keydown);
			targetWindow.document.attachEvent('onkeyup', keyup);
			targetWindow.attachEvent('onblur', reset);
		}
	}

	/**
	 * Exits all active bindings and disables KeyboardJS
	 */
	function disable() {
		reset();
		if(targetWindow.removeEventListener) {
			targetWindow.document.removeEventListener('keydown', keydown, false);
			targetWindow.document.removeEventListener('keyup', keyup, false);
			targetWindow.removeEventListener('blur', reset, false);
			targetWindow.removeEventListener('webkitfullscreenchange', reset, false);
			targetWindow.removeEventListener('mozfullscreenchange', reset, false);
		} else if(targetWindow.detachEvent) {
			targetWindow.document.detachEvent('onkeydown', keydown);
			targetWindow.document.detachEvent('onkeyup', keyup);
			targetWindow.detachEvent('onblur', reset);
		}
	}


	////////////////////
	// EVENT HANDLERS //
	////////////////////

	/**
	 * Exits all active bindings. Optionally passes an event to all binding
	 *  handlers.
	 * @param  {KeyboardEvent}	event	[Optional]
	 */
	function reset(event) {
		activeKeys = [];
		pruneMacros();
		pruneBindings(event);
	}

	/**
	 * Key down event handler.
	 * @param  {KeyboardEvent}	event
	 */
	function keydown(event) {
		var keyNames, keyName, kI;
		keyNames = getKeyName(event.keyCode);
		if(keyNames.length < 1) { return; }
		event.isRepeat = false;
		for(kI = 0; kI < keyNames.length; kI += 1) {
		    keyName = keyNames[kI];
		    if (getActiveKeys().indexOf(keyName) != -1)
		        event.isRepeat = true;
			addActiveKey(keyName);
		}
		executeMacros();
		executeBindings(event);
	}

	/**
	 * Key up event handler.
	 * @param  {KeyboardEvent} event
	 */
	function keyup(event) {
		var keyNames, kI;
		keyNames = getKeyName(event.keyCode);
		if(keyNames.length < 1) { return; }
		for(kI = 0; kI < keyNames.length; kI += 1) {
			removeActiveKey(keyNames[kI]);
		}
		pruneMacros();
		pruneBindings(event);
	}

	/**
	 * Accepts a key code and returns the key names defined by the current
	 *  locale.
	 * @param  {Number}	keyCode
	 * @return {Array}	keyNames	An array of key names defined for the key
	 *  code as defined by the current locale.
	 */
	function getKeyName(keyCode) {
		return map[keyCode] || [];
	}

	/**
	 * Accepts a key name and returns the key code defined by the current
	 *  locale.
	 * @param  {Number}	keyName
	 * @return {Number|false}
	 */
	function getKeyCode(keyName) {
		var keyCode;
		for(keyCode in map) {
			if(!map.hasOwnProperty(keyCode)) { continue; }
			if(map[keyCode].indexOf(keyName) > -1) { return keyCode; }
		}
		return false;
	}


	////////////
	// MACROS //
	////////////

	/**
	 * Accepts a key combo and an array of key names to inject once the key
	 *  combo is satisfied.
	 * @param  {String}	combo
	 * @param  {Array}	injectedKeys
	 */
	function createMacro(combo, injectedKeys) {
		if(typeof combo !== 'string' && (typeof combo !== 'object' || typeof combo.push !== 'function')) {
			throw new Error("Cannot create macro. The combo must be a string or array.");
		}
		if(typeof injectedKeys !== 'object' || typeof injectedKeys.push !== 'function') {
			throw new Error("Cannot create macro. The injectedKeys must be an array.");
		}
		macros.push([combo, injectedKeys]);
	}

	/**
	 * Accepts a key combo and clears any and all macros bound to that key
	 * combo.
	 * @param  {String} combo
	 */
	function removeMacro(combo) {
		var macro;
		if(typeof combo !== 'string' && (typeof combo !== 'object' || typeof combo.push !== 'function')) { throw new Error("Cannot remove macro. The combo must be a string or array."); }
		for(mI = 0; mI < macros.length; mI += 1) {
			macro = macros[mI];
			if(compareCombos(combo, macro[0])) {
				removeActiveKey(macro[1]);
				macros.splice(mI, 1);
				break;
			}
		}
	}

	/**
	 * Executes macros against the active keys. Each macro's key combo is
	 *  checked and if found to be satisfied, the macro's key names are injected
	 *  into active keys.
	 */
	function executeMacros() {
		var mI, combo, kI;
		for(mI = 0; mI < macros.length; mI += 1) {
			combo = parseKeyCombo(macros[mI][0]);
			if(activeMacros.indexOf(macros[mI]) === -1 && isSatisfiedCombo(combo)) {
				activeMacros.push(macros[mI]);
				for(kI = 0; kI < macros[mI][1].length; kI += 1) {
					addActiveKey(macros[mI][1][kI]);
				}
			}
		}
	}

	/**
	 * Prunes active macros. Checks each active macro's key combo and if found
	 *  to no longer to be satisfied, each of the macro's key names are removed
	 *  from active keys.
	 */
	function pruneMacros() {
		var mI, combo, kI;
		for(mI = 0; mI < activeMacros.length; mI += 1) {
			combo = parseKeyCombo(activeMacros[mI][0]);
			if(isSatisfiedCombo(combo) === false) {
				for(kI = 0; kI < activeMacros[mI][1].length; kI += 1) {
					removeActiveKey(activeMacros[mI][1][kI]);
				}
				activeMacros.splice(mI, 1);
				mI -= 1;
			}
		}
	}


	//////////////
	// BINDINGS //
	//////////////

	/**
	 * Creates a binding object, and, if provided, binds a key down hander and
	 *  a key up handler. Returns a binding object that emits keyup and
	 *  keydown events.
	 * @param  {String}		keyCombo
	 * @param  {Function}	keyDownCallback	[Optional]
	 * @param  {Function}	keyUpCallback	[Optional]
	 * @return {Object}		binding
	 */
	function createBinding(keyCombo, keyDownCallback, keyUpCallback) {
		var api = {}, binding, subBindings = [], bindingApi = {}, kI,
		subCombo;

		//break the combo down into a combo array
		if(typeof keyCombo === 'string') {
			keyCombo = parseKeyCombo(keyCombo);
		}

		//bind each sub combo contained within the combo string
		for(kI = 0; kI < keyCombo.length; kI += 1) {
			binding = {};

			//stringify the combo again
			subCombo = stringifyKeyCombo([keyCombo[kI]]);

			//validate the sub combo
			if(typeof subCombo !== 'string') { throw new Error('Failed to bind key combo. The key combo must be string.'); }

			//create the binding
			binding.keyCombo = subCombo;
			binding.keyDownCallback = [];
			binding.keyUpCallback = [];

			//inject the key down and key up callbacks if given
			if(keyDownCallback) { binding.keyDownCallback.push(keyDownCallback); }
			if(keyUpCallback) { binding.keyUpCallback.push(keyUpCallback); }

			//stash the new binding
			bindings.push(binding);
			subBindings.push(binding);
		}

		//build the binding api
		api.clear = clear;
		api.on = on;
		return api;

		/**
		 * Clears the binding
		 */
		function clear() {
			var bI;
			for(bI = 0; bI < subBindings.length; bI += 1) {
				bindings.splice(bindings.indexOf(subBindings[bI]), 1);
			}
		}

		/**
		 * Accepts an event name. and any number of callbacks. When the event is
		 *  emitted, all callbacks are executed. Available events are key up and
		 *  key down.
		 * @param  {String}	eventName
		 * @return {Object}	subBinding
		 */
		function on(eventName    ) {
			var api = {}, callbacks, cI, bI;

			//validate event name
			if(typeof eventName !== 'string') { throw new Error('Cannot bind callback. The event name must be a string.'); }
			if(eventName !== 'keyup' && eventName !== 'keydown') { throw new Error('Cannot bind callback. The event name must be a "keyup" or "keydown".'); }

			//gather the callbacks
			callbacks = Array.prototype.slice.apply(arguments, [1]);

			//stash each the new binding
			for(cI = 0; cI < callbacks.length; cI += 1) {
				if(typeof callbacks[cI] === 'function') {
					if(eventName === 'keyup') {
						for(bI = 0; bI < subBindings.length; bI += 1) {
							subBindings[bI].keyUpCallback.push(callbacks[cI]);
						}
					} else if(eventName === 'keydown') {
						for(bI = 0; bI < subBindings.length; bI += 1) {
							subBindings[bI].keyDownCallback.push(callbacks[cI]);
						}
					}
				}
			}

			//construct and return the sub binding api
			api.clear = clear;
			return api;

			/**
			 * Clears the binding
			 */
			function clear() {
				var cI, bI;
				for(cI = 0; cI < callbacks.length; cI += 1) {
					if(typeof callbacks[cI] === 'function') {
						if(eventName === 'keyup') {
							for(bI = 0; bI < subBindings.length; bI += 1) {
								subBindings[bI].keyUpCallback.splice(subBindings[bI].keyUpCallback.indexOf(callbacks[cI]), 1);
							}
						} else {
							for(bI = 0; bI < subBindings.length; bI += 1) {
								subBindings[bI].keyDownCallback.splice(subBindings[bI].keyDownCallback.indexOf(callbacks[cI]), 1);
							}
						}
					}
				}
			}
		}
	}

	/**
	 * Clears all binding attached to a given key combo. Key name order does not
	 * matter as long as the key combos equate.
	 * @param  {String}	keyCombo
	 */
	function removeBindingByKeyCombo(keyCombo) {
		var bI, binding, keyName;
		for(bI = 0; bI < bindings.length; bI += 1) {
			binding = bindings[bI];
			if(compareCombos(keyCombo, binding.keyCombo)) {
				bindings.splice(bI, 1); bI -= 1;
			}
		}
	}

	/**
	 * Clears all binding attached to key combos containing a given key name.
	 * @param  {String}	keyName
	 */
	function removeBindingByKeyName(keyName) {
		var bI, kI, binding;
		if(keyName) {
			for(bI = 0; bI < bindings.length; bI += 1) {
				binding = bindings[bI];
				for(kI = 0; kI < binding.keyCombo.length; kI += 1) {
					if(binding.keyCombo[kI].indexOf(keyName) > -1) {
						bindings.splice(bI, 1); bI -= 1;
						break;
					}
				}
			}
		} else {
			bindings = [];
		}
	}

	/**
	 * Executes bindings that are active. Only allows the keys to be used once
	 *  as to prevent binding overlap.
	 * @param  {KeyboardEvent}	event	The keyboard event.
	 */
	function executeBindings(event) {
		var bI, sBI, binding, bindingKeys, remainingKeys, cI, killEventBubble, kI, bindingKeysSatisfied,
		index, sortedBindings = [], bindingWeight;

		remainingKeys = [].concat(activeKeys);
		for(bI = 0; bI < bindings.length; bI += 1) {
			bindingWeight = extractComboKeys(bindings[bI].keyCombo).length;
			if(!sortedBindings[bindingWeight]) { sortedBindings[bindingWeight] = []; }
			sortedBindings[bindingWeight].push(bindings[bI]);
		}
		for(sBI = sortedBindings.length - 1; sBI >= 0; sBI -= 1) {
			if(!sortedBindings[sBI]) { continue; }
			for(bI = 0; bI < sortedBindings[sBI].length; bI += 1) {
				binding = sortedBindings[sBI][bI];
				bindingKeys = extractComboKeys(binding.keyCombo);
				bindingKeysSatisfied = true;
				for(kI = 0; kI < bindingKeys.length; kI += 1) {
					if(remainingKeys.indexOf(bindingKeys[kI]) === -1) {
						bindingKeysSatisfied = false;
						break;
					}
				}
				if(bindingKeysSatisfied && isSatisfiedCombo(binding.keyCombo)) {
					activeBindings.push(binding);
					for(kI = 0; kI < bindingKeys.length; kI += 1) {
						index = remainingKeys.indexOf(bindingKeys[kI]);
						if(index > -1) {
							remainingKeys.splice(index, 1);
							kI -= 1;
						}
					}
					for(cI = 0; cI < binding.keyDownCallback.length; cI += 1) {
						if (binding.keyDownCallback[cI](event, getActiveKeys(), binding.keyCombo) === false) {
							killEventBubble = true;
						}
					}
					if(killEventBubble === true) {
						event.preventDefault();
						event.stopPropagation();
					}
				}
			}
		}
	}

	/**
	 * Removes bindings that are no longer satisfied by the active keys. Also
	 *  fires the key up callbacks.
	 * @param  {KeyboardEvent}	event
	 */
	function pruneBindings(event) {
		var bI, cI, binding, killEventBubble;
		for(bI = 0; bI < activeBindings.length; bI += 1) {
			binding = activeBindings[bI];
			if(isSatisfiedCombo(binding.keyCombo) === false) {
				for(cI = 0; cI < binding.keyUpCallback.length; cI += 1) {
					if (binding.keyUpCallback[cI](event, getActiveKeys(), binding.keyCombo) === false) {
						killEventBubble = true;
					}
				}
				if(killEventBubble === true) {
					event.preventDefault();
					event.stopPropagation();
				}
				activeBindings.splice(bI, 1);
				bI -= 1;
			}
		}
	}


	///////////////////
	// COMBO STRINGS //
	///////////////////

	/**
	 * Compares two key combos returning true when they are functionally
	 *  equivalent.
	 * @param  {String}	keyComboArrayA keyCombo A key combo string or array.
	 * @param  {String}	keyComboArrayB keyCombo A key combo string or array.
	 * @return {Boolean}
	 */
	function compareCombos(keyComboArrayA, keyComboArrayB) {
		var cI, sI, kI;
		keyComboArrayA = parseKeyCombo(keyComboArrayA);
		keyComboArrayB = parseKeyCombo(keyComboArrayB);
		if(keyComboArrayA.length !== keyComboArrayB.length) { return false; }
		for(cI = 0; cI < keyComboArrayA.length; cI += 1) {
			if(keyComboArrayA[cI].length !== keyComboArrayB[cI].length) { return false; }
			for(sI = 0; sI < keyComboArrayA[cI].length; sI += 1) {
				if(keyComboArrayA[cI][sI].length !== keyComboArrayB[cI][sI].length) { return false; }
				for(kI = 0; kI < keyComboArrayA[cI][sI].length; kI += 1) {
					if(keyComboArrayB[cI][sI].indexOf(keyComboArrayA[cI][sI][kI]) === -1) { return false; }
				}
			}
		}
		return true;
	}

	/**
	 * Checks to see if a key combo string or key array is satisfied by the
	 *  currently active keys. It does not take into account spent keys.
	 * @param  {String}	keyCombo	A key combo string or array.
	 * @return {Boolean}
	 */
	function isSatisfiedCombo(keyCombo) {
		var cI, sI, stage, kI, stageOffset = 0, index, comboMatches;
		keyCombo = parseKeyCombo(keyCombo);
		for(cI = 0; cI < keyCombo.length; cI += 1) {
			comboMatches = true;
			stageOffset = 0;
			for(sI = 0; sI < keyCombo[cI].length; sI += 1) {
				stage = [].concat(keyCombo[cI][sI]);
				for(kI = stageOffset; kI < activeKeys.length; kI += 1) {
					index = stage.indexOf(activeKeys[kI]);
					if(index > -1) {
						stage.splice(index, 1);
						stageOffset = kI;
					}
				}
				if(stage.length !== 0) { comboMatches = false; break; }
			}
			if(comboMatches) { return true; }
		}
		return false;
	}

	/**
	 * Accepts a key combo array or string and returns a flat array containing all keys referenced by
	 * the key combo.
	 * @param  {String}	keyCombo	A key combo string or array.
	 * @return {Array}
	 */
	function extractComboKeys(keyCombo) {
		var cI, sI, kI, keys = [];
		keyCombo = parseKeyCombo(keyCombo);
		for(cI = 0; cI < keyCombo.length; cI += 1) {
			for(sI = 0; sI < keyCombo[cI].length; sI += 1) {
				keys = keys.concat(keyCombo[cI][sI]);
			}
		}
		return keys;
	}

	/**
	 * Parses a key combo string into a 3 dimensional array.
	 * - Level 1 - sub combos.
	 * - Level 2 - combo stages. A stage is a set of key name pairs that must
	 *  be satisfied in the order they are defined.
	 * - Level 3 - each key name to the stage.
	 * @param  {String|Array}	keyCombo	A key combo string.
	 * @return {Array}
	 */
	function parseKeyCombo(keyCombo) {
		var s = keyCombo, i = 0, op = 0, ws = false, nc = false, combos = [], combo = [], stage = [], key = '';

		if(typeof keyCombo === 'object' && typeof keyCombo.push === 'function') { return keyCombo; }
		if(typeof keyCombo !== 'string') { throw new Error('Cannot parse "keyCombo" because its type is "' + (typeof keyCombo) + '". It must be a "string".'); }

		//remove leading whitespace
		while(s.charAt(i) === ' ') { i += 1; }
		while(true) {
			if(s.charAt(i) === ' ') {
				//white space & next combo op
				while(s.charAt(i) === ' ') { i += 1; }
				ws = true;
			} else if(s.charAt(i) === ',') {
				if(op || nc) { throw new Error('Failed to parse key combo. Unexpected , at character index ' + i + '.'); }
				nc = true;
				i += 1;
			} else if(s.charAt(i) === '+') {
				//next key
				if(key.length) { stage.push(key); key = ''; }
				if(op || nc) { throw new Error('Failed to parse key combo. Unexpected + at character index ' + i + '.'); }
				op = true;
				i += 1;
			} else if(s.charAt(i) === '>') {
				//next stage op
				if(key.length) { stage.push(key); key = ''; }
				if(stage.length) { combo.push(stage); stage = []; }
				if(op || nc) { throw new Error('Failed to parse key combo. Unexpected > at character index ' + i + '.'); }
				op = true;
				i += 1;
			} else if(i < s.length - 1 && s.charAt(i) === '!' && (s.charAt(i + 1) === '>' || s.charAt(i + 1) === ',' || s.charAt(i + 1) === '+')) {
				key += s.charAt(i + 1);
				op = false;
				ws = false;
				nc = false;
				i += 2;
			} else if(i < s.length && s.charAt(i) !== '+' && s.charAt(i) !== '>' && s.charAt(i) !== ',' && s.charAt(i) !== ' ') {
				//end combo
				if(op === false && ws === true || nc === true) {
					if(key.length) { stage.push(key); key = ''; }
					if(stage.length) { combo.push(stage); stage = []; }
					if(combo.length) { combos.push(combo); combo = []; }
				}
				op = false;
				ws = false;
				nc = false;
				//key
				while(i < s.length && s.charAt(i) !== '+' && s.charAt(i) !== '>' && s.charAt(i) !== ',' && s.charAt(i) !== ' ') {
					key += s.charAt(i);
					i += 1;
				}
			} else {
				//unknown char
				i += 1;
				continue;
			}
			//end of combos string
			if(i >= s.length) {
				if(key.length) { stage.push(key); key = ''; }
				if(stage.length) { combo.push(stage); stage = []; }
				if(combo.length) { combos.push(combo); combo = []; }
				break;
			}
		}
		return combos;
	}

	/**
	 * Stringifys a key combo.
	 * @param  {Array|String}	keyComboArray	A key combo array. If a key
	 *  combo string is given it will be returned.
	 * @return {String}
	 */
	function stringifyKeyCombo(keyComboArray) {
		var cI, ccI, output = [];
		if(typeof keyComboArray === 'string') { return keyComboArray; }
		if(typeof keyComboArray !== 'object' || typeof keyComboArray.push !== 'function') { throw new Error('Cannot stringify key combo.'); }
		for(cI = 0; cI < keyComboArray.length; cI += 1) {
			output[cI] = [];
			for(ccI = 0; ccI < keyComboArray[cI].length; ccI += 1) {
				output[cI][ccI] = keyComboArray[cI][ccI].join(' + ');
			}
			output[cI] = output[cI].join(' > ');
		}
		return output.join(' ');
	}


	/////////////////
	// ACTIVE KEYS //
	/////////////////

	/**
	 * Returns the a copy of the active keys array.
	 * @return {Array}
	 */
	function getActiveKeys() {
		return [].concat(activeKeys);
	}

	/**
	 * Adds a key to the active keys array, but only if it has not already been
	 *  added.
	 * @param {String}	keyName	The key name string.
	 */
	function addActiveKey(keyName) {
		if(keyName.match(/\s/)) { throw new Error('Cannot add key name ' + keyName + ' to active keys because it contains whitespace.'); }
		if(activeKeys.indexOf(keyName) > -1) { return; }
		activeKeys.push(keyName);
	}

	/**
	 * Removes a key from the active keys array.
	 * @param  {String}	keyNames	The key name string.
	 */
	function removeActiveKey(keyName) {
		var keyCode = getKeyCode(keyName);
		if(keyCode === '91' || keyCode === '92') { activeKeys = []; } //remove all key on release of super.
		else { activeKeys.splice(activeKeys.indexOf(keyName), 1); }
		// Mac Specific remove all keys on release of super
		if(/^Mac/.test(navigator.platform)){
			// Chrome,Safari
			if(/Chrome/.test(navigator.userAgent) ||
				 /Safari/.test(navigator.userAgent)){
				if(keyCode === '91' || keyCode === '93') { activeKeys = []; }
			}
			// Opera
			if(/Opera/.test(navigator.userAgent) && keyCode == "17"){
				activeKeys = [];
			}
			// Firefox
			if(/Firefox/.test(navigator.userAgent) && keyCode == "224"){
				activeKeys = [];
			}
		}
	}


	/////////////
	// LOCALES //
	/////////////

	/**
	 * Registers a new locale. This is useful if you would like to add support for a new keyboard layout. It could also be useful for
	 * alternative key names. For example if you program games you could create a locale for your key mappings. Instead of key 65 mapped
	 * to 'a' you could map it to 'jump'.
	 * @param  {String}	localeName	The name of the new locale.
	 * @param  {Object}	localeMap	The locale map.
	 */
	function registerLocale(localeName, localeMap) {

		//validate arguments
		if(typeof localeName !== 'string') { throw new Error('Cannot register new locale. The locale name must be a string.'); }
		if(typeof localeMap !== 'object') { throw new Error('Cannot register ' + localeName + ' locale. The locale map must be an object.'); }
		if(typeof localeMap.map !== 'object') { throw new Error('Cannot register ' + localeName + ' locale. The locale map is invalid.'); }

		//stash the locale
		if(!localeMap.macros) { localeMap.macros = []; }
		locales[localeName] = localeMap;
	}

	/**
	 * Swaps the current locale.
	 * @param  {String}	localeName	The locale to activate.
	 * @return {Object}
	 */
	function getSetLocale(localeName) {

		//if a new locale is given then set it
		if(localeName) {
			if(typeof localeName !== 'string') { throw new Error('Cannot set locale. The locale name must be a string.'); }
			if(!locales[localeName]) { throw new Error('Cannot set locale to ' + localeName + ' because it does not exist. If you would like to submit a ' + localeName + ' locale map for KeyboardJS please submit it at https://github.com/RobertWHurst/KeyboardJS/issues.'); }

			//set the current map and macros
			map = locales[localeName].map;
			macros = locales[localeName].macros;

			//set the current locale
			locale = localeName;
		}

		//return the current locale
		return locale;
	}
});



},{}],4:[function(require,module,exports){
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

    if (locale && catalogs[locale] && catalogs[locale].messages[string] &&
        catalogs[locale].messages[string].length > 0 && catalogs[locale].messages[string][0] !== "") {
        result = catalogs[locale].messages[string][0];
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

module.exports = {
    LazyString: LazyString,
    gettext: gettext,
    lazyGettext: lazyGettext,
    addCatalogs: addCatalogs,
    getLocale: getLocale,
    setLocale: setLocale,
    guessUserLanguage: guessUserLanguage,
    enableDomScan: enableDomScan,
    updateDomTranslation: updateDomTranslation
};

},{}],5:[function(require,module,exports){
(function (global){

var rng;

if (global.crypto && crypto.getRandomValues) {
  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // Moderately fast, high quality
  var _rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(_rnds8);
    return _rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  _rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return _rnds;
  };
}

module.exports = rng;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var _rng = require('./rng');

// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = _rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; n++) {
    b[i + n] = node[n];
  }

  return buf ? buf : unparse(b);
}

// **`v4()` - Generate random UUID**

// See https://github.com/broofa/node-uuid for API details
function v4(options, buf, offset) {
  // Deprecated - 'format' argument, as supported in v1.2
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || _rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
}

// Export public API
var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;
uuid.parse = parse;
uuid.unparse = unparse;

module.exports = uuid;

},{"./rng":5}],7:[function(require,module,exports){
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
 *      - callback:    function(widget)
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

        // wEvents
        this._registerWEvents(["destroy"]);

        // Apply params
        params = params || {};
        for (var param in params) {
            if (this[param] !== undefined) {
                this[param] = params[param];
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
     *     function(Object(Base/Widget) [, arg1 [, arg2 [, ...]]])
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
     * @method _updateProperties
     * @private
     * @param {Array} properties The properties to update.
     */
    _updateProperties: function (properties) {
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

},{"./helpers.js":22,"abitbol":1,"uuid":6}],8:[function(require,module,exports){
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
 * @submodule Composite
 * @namespace photonui
 */

var _ = require("stonejs").gettext;
var Button = require("../interactive/button.js");
var Color = require("../nonvisual/color.js");
var ColorPalette = require("../interactive/colorpalette.js");
var PopupWindow = require("../container/popupwindow.js");
var BoxLayout = require("../layout/boxlayout.js");
var ColorPickerDialog = require("./colorpickerdialog.js");

/**
 * Color Button.
 *
 * wEvents:
 *
 *   * value-changed:
 *      - description: the selected color changed.
 *      - callback:    function(widget, color)
 *
 * @class ColorButton
 * @constructor
 * @extends photonui.Widget
 */
var ColorButton = Button.$extend({

    // Constructor
    __init__: function (params) {
        this.__widgets = {};
        this._color = new Color();
        this._registerWEvents(["value-changed"]);
        this.$super(params);
        this._buildUi();
        this._updateProperties(["color"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The value (color in rgb hexadecimal format (e.g. "#ff0000")).
     *
     * @property value
     * @type String
     */
    getValue: function () {
        return this.color.hexString;
    },

    setValue: function (value) {
        this.color.hexString = value;
    },

    /**
     * The color.
     *
     * @property color
     * @type kzd.Color
     */
    _color: null,

    getColor: function () {
        return this._color;
    },

    setColor: function (color) {
        if (color instanceof Color) {
            if (this._color) {
                this._color.removeCallback("photonui.colorbutton.value-changed::" + this.name);
            }
            this._color = color;
            this._color.registerCallback("photonui.colorbutton.value-changed::" +
                                         this.name, "value-changed", this.__onColorChanged, this);
        }
        this.__onColorChanged();
        if (color instanceof Color) {
            this._color = color;
        }
    },

    /**
     * Display only the color picker dialog instead of showing the palette first.
     *
     * @property dialogOnly
     * @type Boolean
     * @default false
     */
    _dialogOnly: false,

    isDialogOnly: function () {
        return this._dialogOnly;
    },

    setDialogOnly: function (dialogOnly) {
        this._dialogOnly = Boolean(dialogOnly);
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    destroy: function () {
        this._color.removeCallback("photonui.colorbutton.value-changed::" + this.name);
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Update the button content
     *
     * @method _update
     * @private
     */
    _update: function () {
        // Do nothing
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.$super();
        this.__html.button = document.createElement("button");
        this.__html.button.className = "photonui-widget photonui-button";

        this.__html.button.className += " photonui-colorbutton";

        this.__html.color = document.createElement("span");
        this.__html.button.appendChild(this.__html.color);
    },

    /**
     * Make the UI.
     *
     * @method _buildUi
     * @private
     */
    //TODO: Build UI
    _buildUi: function () {
        this.__widgets.popup = new PopupWindow();
        this.__widgets.vbox = new BoxLayout({verticalSpacing: 0, horizontalSpacing: 0});
        this.__widgets.popup.child = this.__widgets.vbox;

        this.__widgets.palette = new ColorPalette();
        this.__widgets.vbox.addChild(this.__widgets.palette);

        this.__widgets.custom = new Button({text: _("Custom color..."), appearance: "flat"});
        this.__widgets.custom.addClass("photonui-colorbutton-custombutton");
        this.__widgets.vbox.addChild(this.__widgets.custom);

        this.__widgets.colorPickerDialog = new ColorPickerDialog();

        // Callbacks
        this.__widgets.palette.registerCallback("value-changed", "value-changed", this.__onValueChanged, this);
        this.__widgets.colorPickerDialog.registerCallback("value-changed", "value-changed",
                                                          this.__onValueChanged, this);
        this.__widgets.custom.registerCallback("click", "click", this.__onCustomButtonClicked, this);

        // Color
        this.__widgets.palette.color = this.color;
        this.__widgets.colorPickerDialog.color = this.color;
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the button is clicked.
     *
     * @method __onButtonClicked
     * @private
     * @param event
     */
    __onButtonClicked: function (event) {
        this._callCallbacks("click", [event]);
        if (this.dialogOnly) {
            this.__widgets.colorPickerDialog.show();
            this.__widgets.colorPickerDialog.center();
        } else {
            this.__widgets.popup.popupWidget(this);
        }
    },

    /**
     * Called when the palette color change.
     *
     * @method __onPaletteValueChanged
     * @private
     * @param {photonui.Widget} widget
     * @param {String} color
     */
    __onValueChanged: function (widget, color) {
        this._callCallbacks("value-changed", [this.color]);
    },

    /**
     *
     * @method __onColorChanged
     * @private
     */
    __onColorChanged: function () {
        this.__html.color.style.backgroundColor = this.color.hexString;
    },

    /**
     * @method __onCustomButtonClicked
     * @private
     */
    __onCustomButtonClicked: function () {
        this.__widgets.colorPickerDialog.show();
        this.__widgets.colorPickerDialog.center();
    }
});

module.exports = ColorButton;

},{"../container/popupwindow.js":17,"../interactive/button.js":23,"../interactive/colorpalette.js":25,"../layout/boxlayout.js":34,"../nonvisual/color.js":41,"./colorpickerdialog.js":9,"stonejs":4}],9:[function(require,module,exports){
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
 * @submodule Composite
 * @namespace photonui
 */

var _ = require("stonejs").gettext;
var Dialog = require("../container/dialog.js");
var BoxLayout = require("../layout/boxlayout.js");
var GridLayout = require("../layout/gridlayout.js");
var Color = require("../nonvisual/color.js");
var ColorPalette = require("../interactive/colorpalette.js");
var ColorPicker = require("../interactive/colorpicker.js");
var Button = require("../interactive/button.js");
var Slider = require("../interactive/slider.js");
var Separator = require("../visual/separator.js");
var Label = require("../visual/label.js");
var FAIcon = require("../visual/faicon.js");

/**
 * Color Picker Dialog.
 *
 * wEvents:
 *
 *   * value-changed:
 *      - description: the selected color changed.
 *      - callback:    function(widget, color)
 *
 * @class ColorPickerDialog
 * @constructor
 * @extends photonui.Dialog
 */
var ColorPickerDialog = Dialog.$extend({

    // Constructor
    __init__: function (params) {
        this.__widgets = {};
        this._color = new Color();

        params = params || {};
        if (params.title === undefined) {
            params.title = _("Select a color...");
        }

        this._registerWEvents(["value-changed"]);

        this.$super(params);

        this._buildUi();
        this._updateProperties(["color"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    _padding: 10,

    /**
     * The color.
     *
     * @property color
     * @type kzd.Color
     */
    _color: null,

    getColor: function () {
        return this._color;
    },

    setColor: function (color) {
        if (color instanceof Color) {
            if (this._color) {
                this._color.removeCallback("photonui.colorpickerdialog.value-changed::" + this.name);
            }
            this._color = color;
            this._color.registerCallback("photonui.colorpickerdialog.value-changed::" + this.name, "value-changed",
                                         this.__onColorChanged, this);
        }
        this.__onColorChanged();
    },

    //

    setVisible: function (visible) {
        this.$super(visible);
        if (this._color && visible && this.__widgets.labelRed) {
            this._updateUi();
        }
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    destroy: function () {
        this._color.removeCallback("photonui.colorpickerdialog.value-changed::" + this.name);
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Make the UI.
     *
     * @method _buildUi
     * @private
     */
    _buildUi: function () {
        this.html.className += " photonui-colorpickerdialog";

        // == Main UI ==
        this.__widgets.hbox = new BoxLayout({
            orientation: "horizontal"
        });
        this.child = this.__widgets.hbox;

        // Color Picker
        this.__widgets.colorPicker = new ColorPicker();
        this.__widgets.hbox.addChild(this.__widgets.colorPicker);

        // Color Palette
        this.__widgets.colorPalette = new ColorPalette();
        this.__widgets.hbox.addChild(this.__widgets.colorPalette);

        // Separator
        this.__widgets.separator = new Separator({orientation: "vertical"});
        this.__widgets.hbox.addChild(this.__widgets.separator);

        this.__widgets.grid = new GridLayout();
        this.__widgets.hbox.addChild(this.__widgets.grid);

        // Red field + label
        this.__widgets.fieldRed = new Slider({
            min: 0,
            max: 255,
            decimalDigits: 0
        });

        this.__widgets.labelRed = new Label({
            text: _("Red:"),
            forInput: this.__widgets.fieldRed
        });

        this.__widgets.grid.addChild(this.__widgets.labelRed, {gridX: 0, gridY: 0, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldRed, {gridX: 1, gridY: 0, verticalExpansion: false});

        // Green field + label
        this.__widgets.fieldGreen = new Slider({
            min: 0,
            max: 255,
            decimalDigits: 0
        });

        this.__widgets.labelGreen = new Label({
            text: _("Green:"),
            forInput: this.__widgets.fieldGreen
        });

        this.__widgets.grid.addChild(this.__widgets.labelGreen, {gridX: 0, gridY: 1, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldGreen, {gridX: 1, gridY: 1, verticalExpansion: false});

        // Blue field + label
        this.__widgets.fieldBlue = new Slider({
            min: 0,
            max: 255,
            decimalDigits: 0
        });

        this.__widgets.labelBlue = new Label({
            text: _("Blue:"),
            forInput: this.__widgets.fieldBlue
        });

        this.__widgets.grid.addChild(this.__widgets.labelBlue, {gridX: 0, gridY: 2, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldBlue, {gridX: 1, gridY: 2, verticalExpansion: false});

        // Separator
        this.__widgets.separator2 = new Separator();
        this.__widgets.grid.addChild(this.__widgets.separator2, {
            gridX: 0,
            gridY: 3,
            verticalExpansion: false,
            gridWidth: 2
        });

        // Hue field + label
        this.__widgets.fieldHue = new Slider({
            min: 0,
            max: 360,
            decimalDigits: 0
        });

        this.__widgets.labelHue = new Label({
            text: _("Hue:"),
            forInput: this.__widgets.fieldHue
        });

        this.__widgets.grid.addChild(this.__widgets.labelHue, {gridX: 0, gridY: 4, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldHue, {gridX: 1, gridY: 4, verticalExpansion: false});

        // Saturation field + label
        this.__widgets.fieldSaturation = new Slider({
            min: 0,
            max: 100,
            decimalDigits: 0
        });

        this.__widgets.labelSaturation = new Label({
            text: _("Saturation:"),
            forInput: this.__widgets.fieldSaturation
        });

        this.__widgets.grid.addChild(this.__widgets.labelSaturation, {gridX: 0, gridY: 5, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldSaturation, {gridX: 1, gridY: 5, verticalExpansion: false});

        // Brightness field + label
        this.__widgets.fieldBrightness = new Slider({
            min: 0,
            max: 100,
            decimalDigits: 0
        });

        this.__widgets.labelBrightness = new Label({
            text: _("Brightness:"),
            forInput: this.__widgets.fieldBrightness
        });

        this.__widgets.grid.addChild(this.__widgets.labelBrightness, {gridX: 0, gridY: 6, verticalExpansion: false});
        this.__widgets.grid.addChild(this.__widgets.fieldBrightness, {gridX: 1, gridY: 6, verticalExpansion: false});

        // == Dialog Buttons ==
        this.__widgets.buttonOk = new Button({text: _("Ok")});
        if (FAIcon) {
            this.__widgets.buttonOk.leftIcon = new FAIcon("fa-check");
        }

        this.__widgets.buttonCancel = new Button({text: _("Cancel")});
        this.buttons = [this.__widgets.buttonOk, this.__widgets.buttonCancel];

        if (FAIcon) {
            this.__widgets.buttonCancel.leftIcon = new FAIcon("fa-times");
        }

        // == Bindings ==
        this.__widgets.colorPalette.color = this.__widgets.colorPicker.color;

        this.__widgets.colorPicker.color.registerCallback(
            "colorpickerdialog.colorPicker.value-changed", "value-changed", this._updateUi, this);

        this.__widgets.fieldRed.registerCallback(
            "colorpickerdialog.fieldRed.value-changed", "value-changed", function (widget, value) {
            this.__widgets.colorPicker.color.red = value;
        }, this);

        this.__widgets.fieldGreen.registerCallback(
            "colorpickerdialog.fieldGreen.value-changed", "value-changed", function (widget, value) {
            this.__widgets.colorPicker.color.green = value;
        }, this);

        this.__widgets.fieldBlue.registerCallback(
            "colorpickerdialog.fieldBlue.value-changed", "value-changed", function (widget, value) {
            this.__widgets.colorPicker.color.blue = value;
        }, this);

        this.__widgets.fieldHue.registerCallback(
            "colorpickerdialog.fieldHue.value-changed", "value-changed", function (widget, value) {
            this.__widgets.colorPicker.color.hue = value;
        }, this);

        this.__widgets.fieldSaturation.registerCallback(
            "colorpickerdialog.fieldSaturation.value-changed", "value-changed", function (widget, value) {
            this.__widgets.colorPicker.color.saturation = value;
        }, this);

        this.__widgets.fieldBrightness.registerCallback(
            "colorpickerdialog.fieldBrightness.value-changed", "value-changed", function (widget, value) {
            this.__widgets.colorPicker.color.brightness = value;
        }, this);

        this.__widgets.buttonOk.registerCallback(
            "colorpickerdialog.buttonOk.click", "click", this.__onValidate, this);
        this.__widgets.buttonCancel.registerCallback(
            "colorpickerdialog.buttonCancel.click", "click", this.__onCancel, this);
        this.registerCallback("colorpickerdialog.close", "close-button-clicked", this.__onCancel, this);
    },

    /**
     * Update the fields of the UI.
     *
     * @method _updateUi
     * @private
     */
    _updateUi: function (color) {
        color = color || this.color;
        this.__widgets.fieldRed.value = color.red;
        this.__widgets.fieldGreen.value = color.green;
        this.__widgets.fieldBlue.value = color.blue;
        this.__widgets.fieldHue.value = color.hue;
        this.__widgets.fieldSaturation.value = color.saturation;
        this.__widgets.fieldBrightness.value = color.brightness;
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onCancel
     * @private
     */
    __onCancel: function () {
        this.__widgets.colorPicker.color.setHSB(
                this._color.hue,
                this._color.saturation,
                this._color.brightness
        );
        this.hide();
    },

    /**
     * @method __onValidate
     * @private
     */
    __onValidate: function () {
        this._color.setHSB(
                this.__widgets.colorPicker.color.hue,
                this.__widgets.colorPicker.color.saturation,
                this.__widgets.colorPicker.color.brightness
        );
        this.hide();
        this._callCallbacks("value-changed", [this.color]);
    },

    /**
     * @method __onColorChanged
     * @private
     */
    __onColorChanged: function () {
        this.__widgets.colorPicker.color.setHSB(
                this._color.hue,
                this._color.saturation,
                this._color.brightness
        );
    }
});

module.exports = ColorPickerDialog;

},{"../container/dialog.js":15,"../interactive/button.js":23,"../interactive/colorpalette.js":25,"../interactive/colorpicker.js":26,"../interactive/slider.js":29,"../layout/boxlayout.js":34,"../layout/gridlayout.js":36,"../nonvisual/color.js":41,"../visual/faicon.js":49,"../visual/label.js":51,"../visual/separator.js":53,"stonejs":4}],10:[function(require,module,exports){
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
 * @submodule Composite
 * @namespace photonui
 */

var Stone = require("stonejs");
var Select = require("./select.js");
var MenuItem = require("../container/menuitem.js");

/**
 * Font Selector.
 *
 * wEvents:
 *
 * @class FontSelect
 * @constructor
 * @extends photonui.Select
 */
var FontSelect = Select.$extend({

    // Constructor
    __init__: function (params) {
        params = params || {};
        this._fonts = [];
        this.$super(params);
        if (this.fonts.length === 0) {
            this.fonts = ["sans-serif", "serif", "monospace"];
        }
        this.value = (params.value !== undefined) ? params.value : "sans-serif";
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The font list
     *
     * @property fonts
     * @type Array
     * @default ["sans-serif", "serif", "monospace"]
     */
    _fonts: null,

    getFonts: function () {
        return this._fonts;
    },

    setFonts: function (fonts) {
        this._fonts = [];
        for (var i = 0 ; i < fonts.length ; i++) {
            this.addFont(fonts[i]);
        }
    },

    /**
     * The placeholder displayed if nothing is selected.
     *
     * @property Placeholder
     * @type String
     * @default "Select a font..."
     */
    _placeholder: Stone.lazyGettext("Select a font..."),

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Add a widget to the layout.
     *
     * @method addChild
     * @param {String} fontName
     */
    addFont: function (fontName) {
        var item = new MenuItem({value: fontName, text: fontName});
        item.html.style.fontFamily = fontName;
        this.addChild(item);
        this._fonts.push(fontName);
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.$super();
        this.__html.select.className += " photonui-fontselect";
    }
});

module.exports = FontSelect;

},{"../container/menuitem.js":16,"./select.js":12,"stonejs":4}],11:[function(require,module,exports){
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
 * @submodule Composite
 * @namespace photonui
 */

var PopupWindow = require("../container/popupwindow.js");
var Menu = require("../layout/menu.js");

/**
 * Popup Menu.
 *
 * @class PopupMenu
 * @constructor
 * @extends photonui.PopupWindow
 * @uses photonui.Layout
 * @uses photonui.Menu
 */
var PopupMenu = PopupWindow.$extend({

    // Constructor
    __init__: function (params) {
        this._childrenNames = [];  // new instance
        this.$super(params);
    },

    // Mixin
    __include__: [{
        getChildrenNames: Menu.prototype.getChildrenNames,
        setChildrenNames: Menu.prototype.setChildrenNames,
        getChildren:      Menu.prototype.getChildren,
        setChildren:      Menu.prototype.setChildren,
        getChildName:     Menu.prototype.getChildName,
        setChildName:     Menu.prototype.setChildName,
        getChild:         Menu.prototype.getChild,
        setChild:         Menu.prototype.setChild,
        _iconVisible:     Menu.prototype._iconVisible,
        isIconVisible:    Menu.prototype.isIconVisible,
        setIconVisible:   Menu.prototype.setIconVisible,
        addChild:         Menu.prototype.addChild,
        removeChild:      Menu.prototype.removeChild,
        empty:            Menu.prototype.empty,
        destroy:          Menu.prototype.destroy,
        _updateLayout:    Menu.prototype._updateLayout,
        _lockUpdate:      Menu.prototype._lockUpdate
    }],

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.$super();
        Menu.prototype._buildHtml.call(this);

        this.__html.inner.appendChild(this.__html.outer);
        this.__html.window.className += " photonui-popupmenu";
        this.__html.outer.className = "photonui-widget photonui-menu photonui-menu-style-popupmenu";
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // pass
    }
});

module.exports = PopupMenu;

},{"../container/popupwindow.js":17,"../layout/menu.js":38}],12:[function(require,module,exports){
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
 * @submodule Composite
 * @namespace photonui
 */

var Stone  = require("stonejs");
var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var PopupMenu = require("./popupmenu.js");
var MenuItem = require("../container/menuitem.js");

/**
 * Select input.
 *
 * wEvents:
 *
 *   * value-changed:
 *     - description: called when the value was modified.
 *     - callback:    function(widget, value)
 *
 * @class Select
 * @constructor
 * @extends photonui.Widget
 */
var Select = Widget.$extend({

    // Constructor
    __init__: function (params) {
        params = params || {};

        // Attach popup & special mixin
        this.__popupMenu = new PopupMenu({
            maxHeight: 300,
            className: "photonui-select-popup",
            iconVisible: false
        });

        this._registerWEvents(["value-changed"]);
        this.$super(params);

        this._updateProperties(["value", "iconVisible"]);
        this._bindEvent("popup", this.html, "click", this.__onClick.bind(this));

        this.setValue(params.value || this.value, true);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The field value.
     *
     * @property value
     * @type String (maybe)
     * @default ""
     */
    _value: "",

    getValue: function () {
        return this._value;
    },

    setValue: function (value, force) {
        if (this.value == value && !force) {
            return;
        }

        var items = this.__popupMenu.children;

        for (var i = 0 ; i < items.length ; i++) {
            if (items[i] instanceof MenuItem && items[i].value == value) {
                this._value = value;
                Helpers.cleanNode(this.__html.select);
                this.__html.select.appendChild(items[i].html.cloneNode(true));
                return;
            }
        }

        this._value = "";
        var item = new MenuItem({text: this.placeholder, className: "photonui-select-placeholder"});
        Helpers.cleanNode(this.__html.select);
        this.__html.select.appendChild(item.html);
    },

    /**
     * The placeholder displayed if nothing is selected.
     *
     * @property Placeholder
     * @type String
     * @default "Select..."
     */
    _placeholder: Stone.lazyGettext("Select..."),

    getPlaceholder: function () {
        return this._placeholder;
    },

    setPlaceholder: function (placeholder) {
        this._placeholder = placeholder;
    },

    /**
     * Layout children widgets.
     *
     * @property children
     * @type Array
     * @default []
     */
    getChildren: function () { return this.__popupMenu.getChildren(); },
    setChildren: function (p) {
        this.__popupMenu.setChildren(p);
        this._updateItemsBinding();
    },

    /**
     * Layout children widgets name.
     *
     * @property childrenNames
     * @type Array
     * @default []
     */
    getChildrenNames: function () { return this.__popupMenu.getChildrenNames(); },
    setChildrenNames: function (p) {
        this.__popupMenu.setChildrenNames(p);
        this._updateItemsBinding();
    },

    /**
     * Width of the container node.
     *
     * @property popupWidth
     * @type Number
     * @default: null (auto)
     */
    getPopupWidth: function () { return this.__popupMenu.getWidth(); },
    setPopupWidth: function (p) { this.__popupMenu.setWidth(p); },

    /**
     * Height of the popup container node.
     *
     * @property popupHeight
     * @type Number
     * @default: null (auto)
     */
    getPopupHeight: function () { return this.__popupMenu.getHeight(); },
    setPopupHeight: function (p) { this.__popupMenu.setHeight(p); },

    /**
     * Maximum width of the popup container node.
     *
     * @property popupMaxWidth
     * @type Number
     * @default: null (no maximum)
     */
    getPopupMaxWidth: function () { return this.__popupMenu.getMaxWidth(); },
    setPopupMaxWidth: function (p) { this.__popupMenu.setMaxWidth(p); },

    /**
     * Minimum width of the popup container node.
     *
     * @property popupMinWidth
     * @type Number
     * @default: null (no minimum)
     */
    _minWidthDefined: false,
    getPopupMinWidth: function () { return this.__popupMenu.getMinWidth(); },
    setPopupMinWidth: function (p) { this._minWidthDefined = true ; this.__popupMenu.setMinWidth(p); },

    /**
     * Maximum height of the popup container node.
     *
     * @property popupMaxHeight
     * @type Number
     * @default: 300
     */
    getPopupMaxHeight: function () { return this.__popupMenu.getMaxHeight(); },
    setPopupMaxHeight: function (p) { this.__popupMenu.setMaxHeight(p); },

    /**
     * Minimum height of the popup container node.
     *
     * @property popupMinHeight
     * @type Number
     * @default: null (no minimum)
     */
    getPopupMinHeight: function () { return this.__popupMenu.getMinHeight(); },
    setPopupMinHeight: function (p) { this.__popupMenu.setMinHeight(p); },

    /**
     * Popup width (outer HTML element).
     *
     * @property popupOffsetWidth
     * @type Number
     * @readOnly
     */
    getPopupOffsetWidth: function () { return this.__popupMenu.getOffsetWidth(); },

    /**
     * Popup height (outer HTML element).
     *
     * @property popupOffsetHeight
     * @type Number
     * @readOnly
     */
    getPopupOffsetHeight: function () { return this.__popupMenu.getOffsetHeight(); },

    /**
     * Window container node padding.
     *
     * @property popupPadding
     * @type Number
     * @default 0
     */
    getPopupPadding: function () { return this.__popupMenu.getPadding(); },
    setPopupPadding: function (p) { this.__popupMenu.setPadding(p); },

    /**
     * Define if icon on menu items are visible.
     *
     * @property iconVisible
     * @type Boolean
     * @default: false
     */
    isIconVisible: function () { return this.__popupMenu.isIconVisible(); },
    setIconVisible: function (p) {
        if (!p) {
            this.addClass("photonui-select-noicon");
        } else {
            this.removeClass("photonui-select-noicon");
        }
        this.__popupMenu.setIconVisible(p);
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.select;
    },

    /**
     * The popupMenu.
     *
     * @property __popupMenu
     * @private
     * @type photonui.PopupMenu
     */
    __popupMenu: null,

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Add a widget to the layout.
     *
     * @method addChild
     * @param {photonui.Widget} widget The widget to add.
     * @param {Object} layoutOption Specific option for the layout (optional).
     */
    addChild: function (w, l) {
        this.__popupMenu.addChild(w, l);
        this._updateItemsBinding();
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        this.__popupMenu.destroy();
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.select = document.createElement("div");
        this.__html.select.className = "photonui-widget photonui-select";
        this.__html.select.tabIndex = "0";
    },

    /**
     * Update the popup items binding.
     *
     * @method _updateItemsBinding
     * @private
     */
    _updateItemsBinding: function () {
        var items = this.__popupMenu.children;

        for (var i = 0 ; i < items.length ; i++) {
            if (items[i] instanceof MenuItem) {
                items[i].registerCallback(this.name + "-click",
                        "click", this.__onItemClicked, this);
            }
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onClick
     * @private
     * @param event
     */
    __onClick: function (event) {
        if (!this._minWidthDefined) {
            this.popupMinWidth = this.offsetWidth;
        }
        this.__popupMenu.popupWidget(this);
    },

    /**
     * @method __onItemClicked
     * @private
     * @param {photonui.MenuItem} widget
     */
    __onItemClicked: function (widget) {
        this.value = widget.value;
        this._callCallbacks("value-changed", [this.value]);
    }
});

module.exports = Select;

},{"../container/menuitem.js":16,"../helpers.js":22,"../widget.js":56,"./popupmenu.js":11,"stonejs":4}],13:[function(require,module,exports){
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
 * @submodule Container
 * @namespace photonui
 */

var Container = require("./container.js");
var Widget = require("../widget.js");

/**
 * Windows base class.
 *
 * wEvents:
 *
 *   * position-changed:
 *      - description: called when the widows is moved.
 *      - callback:    function(widget, x, y)
 *
 * @class BaseWindow
 * @constructor
 * @extends photonui.Container
 */
var BaseWindow = Container.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["position-changed"]);
        this.$super(params);

        // Windows are hidden by default
        params = params || {};
        if (params.visible === undefined) {
            this.visible = false;
        }

        // Insert the window in the DOM tree
        Widget.domInsert(this);

        // Update properties
        this._updateProperties([
            "position", "width", "height", "minWidth", "minHeight",
            "maxWidth", "maxHeight", "padding"
        ]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Window position.
     *
     *     {x: Number, y: Number}
     *
     * @property position
     * @type Object
     * @default {x: 0, y: 0}
     */
    getPosition: function () {
        if (this.visible && this.html.parentNode) {
            return this.absolutePosition;
        }
        return {x: this._x, y: this._y};
    },

    setPosition: function (x, y) {
        if (typeof(x) == "object" && y === undefined) {
            this.html.style.left = x.x + "px";
            this.html.style.top = x.y + "px";
            this._x = x.x;
            this._y = x.y;
        } else {
            if (typeof(x) == "number") {
                this.html.style.left = x + "px";
                this._x = x;
            }
            if (typeof(y) == "number") {
                this.html.style.top = y + "px";
                this._y = y;
            }
        }
        this._callCallbacks("position-changed", [this.x, this.y]);
    },

    /**
     * The X position of the Window.
     *
     * @property x
     * @type Number
     * @default 0
     */
    _x: 0,

    getX: function () {
        return this.position.x;
    },

    setX: function (x) {
        this.setPosition(x, null);
    },

    /**
     * The Y position of the Window.
     *
     * @property y
     * @type Number
     * @default 0
     */
    _y: 0,

    getY: function () {
        return this.position.y;
    },

    setY: function (y) {
        this.setPosition(null, y);
    },

    /**
     * Width of the container node.
     *
     * @property width
     * @type Number
     * @default: null (auto)
     */
    _width: null,

    getWidth: function () {
        if (this.visible && this.html.parenNode) {
            return this.containerNode.offsetWidth;
        }
        return this._width || 0;
    },

    setWidth: function (width) {
        this._width = width || null;
        if (this._width) {
            this.containerNode.style.width = width + "px";
        } else {
            this.containerNode.style.width = "auto";
        }
    },

    /**
     * Height of the container node.
     *
     * @property height
     * @type Number
     * @default: null (auto)
     */
    _height: null,

    getHeight: function () {
        if (this.visible && this.html.parenNode) {
            return this.containerNode.offsetHeight;
        }
        return this._height || 0;
    },

    setHeight: function (height) {
        this._height = height || null;
        if (this._height) {
            this.containerNode.style.height = height + "px";
        } else {
            this.containerNode.style.height = "auto";
        }
    },

    /**
     * Minimum width of the container node.
     *
     * @property minWidth
     * @type Number
     * @default: null (no minimum)
     */
    _minWidth: null,

    getMinWidth: function () {
        return this._minWidth;
    },

    setMinWidth: function (minWidth) {
        this._minWidth = minWidth || null;
        if (this._minWidth) {
            this.containerNode.style.minWidth = minWidth + "px";
        } else {
            this.containerNode.style.minWidth = "0";
        }
    },

    /**
     * Minimum height of the container node.
     *
     * @property minHeight
     * @type Number
     * @default: null (no minimum)
     */
    _minHeight: null,

    getMinHeight: function () {
        return this._minHeight;
    },

    setMinHeight: function (minHeight) {
        this._minHeight = minHeight || null;
        if (this._minHeight) {
            this.containerNode.style.minHeight = minHeight + "px";
        } else {
            this.containerNode.style.minHeight = "0";
        }
    },

    /**
     * Maximum width of the container node.
     *
     * @property maxWidth
     * @type Number
     * @default: null (no maximum)
     */
    _maxWidth: null,

    getMaxWidth: function () {
        return this._maxWidth;
    },

    setMaxWidth: function (maxWidth) {
        this._maxWidth = maxWidth || null;
        if (this._maxWidth) {
            this.containerNode.style.maxWidth = maxWidth + "px";
        } else {
            this.containerNode.style.maxWidth = "auto";
        }
    },

    /**
     * Maximum height of the container node.
     *
     * @property maxHeight
     * @type Number
     * @default: null (no maximum)
     */
    _maxHeight: null,

    getMaxHeight: function () {
        return this._maxHeight;
    },

    setMaxHeight: function (maxHeight) {
        this._maxHeight = maxHeight || null;
        if (this._maxHeight) {
            this.containerNode.style.maxHeight = maxHeight + "px";
        } else {
            this.containerNode.style.maxHeight = "auto";
        }
    },

    /**
     * Window container node padding.
     *
     * @property padding
     * @type Number
     * @default 0
     */
    _padding: 0,

    getPadding: function () {
        return this._padding;
    },

    setPadding: function (padding) {
        this._padding = padding;
        this.containerNode.style.padding = padding + "px";
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.window;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.html;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Center the window.
     *
     * @method center
     */
    center: function () {
        var node = Widget.e_parent || document.getElementsByTagName("body")[0];
        if (!node) {
            return;
        }
        this.setPosition(
                Math.max((node.offsetWidth - this.offsetWidth) / 2, 0) | 0,
                Math.max((node.offsetHeight - this.offsetHeight) / 2, 0) | 0
        );
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.window = document.createElement("div");
        this.__html.window.className = "photonui-widget photonui-basewindow";
    }
});

module.exports = BaseWindow;

},{"../widget.js":56,"./container.js":14}],14:[function(require,module,exports){
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
 * @submodule Container
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Base class for container widgets.
 *
 * @class Container
 * @constructor
 * @extends photonui.Widget
 */
var Container = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);

        this._updateProperties(["horizontalChildExpansion", "verticalChildExpansion"]);

        // Force to update the parent of the child
        if (this._childName) {
            this.child._parentName = this.name;
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Horizontaly expand the container's child widget.
     *
     * @property horizontalChildExpansion
     * @type Boolean
     * @default true
     */
    _horizontalChildExpansion: true,

    getHorizontalChildExpansion: function () {
        return this._horizontalChildExpansion;
    },

    setHorizontalChildExpansion: function (expansion) {
        this._horizontalChildExpansion = Boolean(expansion);
        if (!this.containerNode) {
            return;
        }
        if (expansion) {
            this.containerNode.classList.add("photonui-container-expand-child-horizontal");
        } else {
            this.containerNode.classList.remove("photonui-container-expand-child-horizontal");
        }
    },

    /**
     * Verticaly expand the container's child widget.
     *
     * @property verticalChildExpansion
     * @type Boolean
     * @default false
     */
    _verticalChildExpansion: false,

    getVerticalChildExpansion: function () {
        return this._verticalChildExpansion;
    },

    setVerticalChildExpansion: function (expansion) {
        this._verticalChildExpansion = Boolean(expansion);
        if (!this.containerNode) {
            return;
        }
        if (expansion) {
            this.containerNode.classList.add("photonui-container-expand-child-vertical");
        } else {
            this.containerNode.classList.remove("photonui-container-expand-child-vertical");
        }
    },

    /**
     * The child widget name.
     *
     * @property childName
     * @type String
     * @default null (no child)
     */
    _childName: null,

    getChildName: function () {
        return this._childName;
    },

    setChildName: function (childName) {
        if (this.childName && this.containerNode && this.child && this.child.html) {
            this.containerNode.removeChild(this.child.html);
            this.child._parentName = null;
        }
        this._childName = childName;
        if (this.child && this.child._parentName) {
            this.child.parent.child = null;
        }
        if (this.childName && this.containerNode && this.child && this.child.html) {
            this.containerNode.appendChild(this.child.html);
            this.child._parentName = this.name;
        }
    },

    /**
     * The child widget.
     *
     * @property child
     * @type photonui.Widget
     * @default null (no child)
     */
    getChild: function () {
        return Widget.getWidget(this.childName);
    },

    setChild: function (child) {
        if ((!child) || (!(child instanceof Widget))) {
            this.childName = null;
            return;
        }
        this.childName = child.name;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return null;
    },

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        if (this.child instanceof Widget) {
            this.child._visibilityChanged(visibility);
        }
        this.$super(visibility);
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Remove the given child.
     *
     * @method removeChild
     * @param {photonui.Widget} widget The widget to remove/
     */
    removeChild: function (widget) {
        if (this.child == widget) {
            this.child = null;
        }
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        if (this.childName && this.child) {
            this.child.destroy();
        }
        this.$super();
    }
});

module.exports = Container;

},{"../widget.js":56}],15:[function(require,module,exports){
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
 * @submodule Container
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var Window = require("./window.js");

var _windowList = [];

/**
 * Dialog Window.
 *
 * @class Dialog
 * @constructor
 * @extends photonui.Window
 */
var Dialog = Window.$extend({

    // Constructor
    __init__: function (params) {
        this._buttonsNames = [];
        this.$super(params);

        // Force to update the parent of the buttons
        var buttons = this.buttons;
        for (var i = 0 ; i < buttons.length ; i++) {
            buttons[i]._parentName = this.name;
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Dialog button widgets name.
     *
     * @property buttonsNames
     * @type Array
     * @default []
     */
    _buttonsNames: [],

    getButtonsNames: function () {
        return this._buttonsNames;
    },

    setButtonsNames: function (buttonsNames) {
        var i;
        var widget;
        for (i = 0 ; i < this._buttonsNames.length ; i++) {
            widget = Widget.getWidget(this._buttonsNames[i]);
            var index = this._buttonsNames.indexOf(widget.name);
            if (index >= 0) {
                widget._parentName = null;
            }
        }
        this._buttonsNames = [];
        for (i = 0 ; i < buttonsNames.length ; i++) {
            widget = Widget.getWidget(buttonsNames[i]);
            if (widget) {
                if (widget.parent) {
                    widget.unparent();
                }
                this._buttonsNames.push(widget.name);
                widget._parentName = this.name;
            }
        }
        this._updateButtons();
    },

    /**
     * Dialog buttons widgets.
     *
     * @property buttons
     * @type Array
     * @default []
     */
    getButtons: function () {
        var buttons = [];
        var widget;
        for (var i = 0 ; i < this._buttonsNames.length ; i++) {
            widget = Widget.getWidget(this._buttonsNames[i]);
            if (widget instanceof Widget) {
                buttons.push(widget);
            }
        }
        return buttons;
    },

    setButtons: function (buttons) {
        var buttonsNames = [];
        for (var i = 0 ; i < buttons.length ; i++) {
            if (buttons[i] instanceof Widget) {
                buttonsNames.push(buttons[i].name);
            }
        }
        this.buttonsNames = buttonsNames;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Add a button to the dialog.
     *
     * @method addButton
     * @param {photonui.Widget} widget The button to add.
     */
    addButton: function (widget, layoutOptions) {
        if (widget.parent) {
            widget.unparent();
        }
        if (layoutOptions) {
            widget.layoutOptions = layoutOptions;
        }
        this._buttonsNames.push(widget.name);
        widget._parentName = this.name;
        this._updateButtons();
    },

    /**
     * Remove a button from the dialog.
     *
     * @method removeButton
     * @param {photonui.Widget} widget The button to remove.
     */
    removeButton: function (widget) {
        var index = this._buttonsNames.indexOf(widget.name);
        if (index >= 0) {
            this._buttonsNames.splice(index, 1);
            widget._parentName = null;
        }
        this._updateButtons();
    },

    // Alias needed for photonui.Widget.unparent()
    removeChild: function () {
        this.$super.apply(this, arguments);
        this.removeButton.apply(this, arguments);
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        var buttons = this.buttons;
        for (var i = 0 ; i < buttons.length ; i++) {
            if (buttons[i]) {
                buttons[i].destroy();
            }
        }
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Update dialog buttons.
     *
     * @method _updateButtons
     * @private
     */
    _updateButtons: function () {
        Helpers.cleanNode(this.__html.buttons);
        var buttons = this.buttons;
        for (var i = buttons.length - 1 ; i >= 0 ; i--) {
            this.__html.buttons.appendChild(buttons[i].html);
        }
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.$super();
        this.__html.window.className += " photonui-dialog";

        this.__html.buttons = document.createElement("div");
        this.__html.buttons.className = "photonui-dialog-buttons";
        this.__html.window.appendChild(this.__html.buttons);
    },

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        var buttons = this.buttons;
        for (var i = 0 ; i < buttons.length ; i++) {
            if (!(this.child instanceof Widget)) {
                continue;
            }
            buttons[i]._visibilityChanged(visibility);
        }
        this.$super(visibility);
    },
});

module.exports = Dialog;

},{"../helpers.js":22,"../widget.js":56,"./window.js":21}],16:[function(require,module,exports){
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
 * @submodule Container
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var Container = require("./container.js");
var BaseIcon = require("../visual/baseicon.js");

/**
 * Menu item.
 *
 * @class MenuItem
 * @constructor
 * @extends photonui.Container
 */
var MenuItem = Container.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["click"]);
        this.$super(params);
        this._updateProperties(["text", "icon", "active"]);

        this._bindEvent("click", this.__html.outer, "click", function (event) {
            this._callCallbacks("click", [event]);
        }.bind(this));
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * An optional value for the item (can be used in select).
     *
     * @property value
     * @type String (maybe)
     * @default ""
     */
    _value: "",

    getValue: function () {
        return this._value;
    },

    setValue: function (value) {
        this._value = value;
    },

    /**
     * The item text.
     *
     * @property text
     * @type String
     * @default "Menu Item"
     */
    _text: "Menu Item",

    getText: function () {
        return this._text;
    },

    setText: function (text) {
        this._text = text;
        Helpers.cleanNode(this.__html.text);
        this.__html.text.appendChild(document.createTextNode(text));
    },

    /**
     * Right icon widget name.
     *
     * @property iconName
     * @type String
     * @default: null
     */
    _iconName: null,

    getIconName: function () {
        return this._iconName;
    },

    setIconName: function (iconName) {
        this._iconName = iconName;
        Helpers.cleanNode(this.__html.icon);
        if (this._iconName) {
            this.__html.icon.appendChild(this.icon.html);
        }
    },

    /**
     * Right icon widget.
     *
     * @property icon
     * @type photonui.BaseIcon
     * @default: null
     */
    getIcon: function () {
        return Widget.getWidget(this._iconName);
    },

    setIcon: function (icon) {
        if (icon instanceof BaseIcon) {
            this.iconName = icon.name;
            return;
        }
        this.iconName = null;
    },

    /**
     * Determine if the item is active (highlighted).
     *
     * @property active
     * @type Boolean
     * @default false
     */
    _active: false,

    getActive: function () {
        return this._active;
    },

    setActive: function (active) {
        this._active = active;

        if (active) {
            this.addClass("photonui-menuitem-active");
        } else {
            this.removeClass("photonui-menuitem-active");
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
    getHtml: function () {
        return this.__html.outer;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.__html.widget;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-menuitem";

        this.__html.icon = document.createElement("span");
        this.__html.icon.className = "photonui-menuitem-icon";
        this.__html.outer.appendChild(this.__html.icon);

        this.__html.text = document.createElement("span");
        this.__html.text.className = "photonui-menuitem-text";
        this.__html.outer.appendChild(this.__html.text);

        this.__html.widget = document.createElement("span");
        this.__html.widget.className = "photonui-menuitem-widget";
        this.__html.outer.appendChild(this.__html.widget);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    // TODO Internal events callback here
});

module.exports = MenuItem;

},{"../helpers.js":22,"../visual/baseicon.js":47,"../widget.js":56,"./container.js":14}],17:[function(require,module,exports){
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
 * @submodule Container
 * @namespace photonui
 */

var BaseWindow = require("./basewindow.js");

/**
 * Popup Window.
 *
 * @class PopupWindow
 * @constructor
 * @extends photonui.BaseWindow
 */
var PopupWindow = BaseWindow.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._bindEvent("document-mousedown-close", document, "mousedown", this.hide.bind(this));
        this._bindEvent("popup-click-close", this.html, "click", this.hide.bind(this));
        this._bindEvent("mousedown-preventclose", this.html, "mousedown", function (event) {
            event.stopPropagation();
        }.bind(this));
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.__html.inner;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Pop the window at the given position.
     *
     * @method popupXY
     * @param {Number} x
     * @param {Number} y
     */
    popupXY: function (x, y) {
        this.setPosition(-1337, -1337);
        this.show();

        var bw = document.getElementsByTagName("body")[0].offsetWidth;
        var bh = document.getElementsByTagName("body")[0].offsetHeight;
        var pw = this.offsetWidth;
        var ph = this.offsetHeight;

        if (x + pw > bw) {
            x = bw - pw;
        }

        if (y + ph > bh) {
            y -= ph;
        }

        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }

        this.setPosition(x, y);
    },

    /**
     * Pop the window at the best position for the given widget.
     *
     * @method popupWidget
     * @param {photonui.Widget} widget
     */
    popupWidget: function (widget) {
        this.setPosition(-1337, -1337);
        this.show();

        var e_body = document.getElementsByTagName("body")[0];
        var x = 0;
        var y = 0;
        var wpos = widget.absolutePosition;
        var wh = widget.offsetHeight;
        var ww = widget.offsetWidth;
        var pw = this.offsetWidth;
        var ph = this.offsetHeight;

        if (wpos.x + pw < e_body.offsetWidth) {
            x = wpos.x;
        } else if (wpos.x + ww < e_body.offsetWidth) {
            x = wpos.x + ww - pw;
        } else {
            x = e_body.offsetWidth - pw;
        }

        if (wpos.y + wh + ph < e_body.offsetHeight) {
            y = wpos.y + wh + 1;
        } else if (wpos.y - ph >= 0) {
            y = wpos.y - ph - 1;
        }

        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }

        this.setPosition(x, y);
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.$super();
        this.__html.window.className += " photonui-popupwindow";

        this.__html.inner = document.createElement("div");
        this.__html.window.appendChild(this.__html.inner);
    }
});

module.exports = PopupWindow;

},{"./basewindow.js":13}],18:[function(require,module,exports){
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
 * @submodule Container
 * @namespace photonui
 */

var Widget = require("../widget.js");
var MenuItem = require("./menuitem.js");
var Menu = require("../layout/menu.js");

/**
 * Submenu Menu item (fold/unfold a submenu).
 *
 * @class SubMenuItem
 * @constructor
 * @extends photonui.MenuItem
 */
var SubMenuItem = MenuItem.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this.addClass("photonui-submenuitem");
        this.registerCallback("toggle-folding", "click", this.__onItemClicked, this);
        this._updateProperties(["menuName"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The submenu widget name.
     *
     * @property menuName
     * @type String
     * @default null
     */
    _menuName: null,

    getMenuName: function () {
        return this._menuName;
    },

    setMenuName: function (menuName) {
        var that = this;

        function _init() {
            if (!that.menu) {
                return;
            }
            that.menu.registerCallback("fold", "hide", that.__onToggleFold, that);
            that.menu.registerCallback("unfold", "show", that.__onToggleFold, that);
            that.active = that.menu.visible;
        }

        if (this.menuName && this.menu) {
            this.menu.removeCallback("fold");
            this.menu.removeCallback("unfold");
        }

        this._menuName = menuName;

        if (this.menuName) {
            if (this.menu) {
                _init();
            } else {
                setTimeout(_init, 10);
            }
        }
    },

    /**
     * The submenu widget.
     *
     * @property menu
     * @type photonui.Menu
     * @default null
     */
    getMenu: function () {
        return Widget.getWidget(this.menuName);
    },

    setMenu: function (menu) {
        if (menu instanceof Menu) {
            this.menuName = menu.name;
        } else {
            this.menuName = null;
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onToggleFold
     * @private
     */
    __onToggleFold: function (widget) {
        this.active = widget.visible;
    },

    /**
     * @method __onItemClicked
     * @private
     */
    __onItemClicked: function (widget) {
        this.menu.visible = !this.menu.visible;
    }
});

module.exports = SubMenuItem;

},{"../layout/menu.js":38,"../widget.js":56,"./menuitem.js":16}],19:[function(require,module,exports){
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
 * Authored by: Fabien LOISON <https://github.com/flozz>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Container
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Container = require("./container.js");

/**
 * Tab Item.
 *
 *  wEvents:
 *
 *   * click:
 *     - description: called when the tab was clicked.
 *     - callback:    function(widget, event)
 *
 * @class TabItem
 * @constructor
 * @extends photonui.Container
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var TabItem = Container.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["click"]);
        this.$super(params);
        this._updateProperties(["title"]);

        this._bindEvent("tab-click", this.__html.tab, "click", this.__onClick.bind(this));
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Tab title.
     *
     * @property title
     * @type String
     * @default "Tab"
     */
    _title: "Tab",

    getTitle: function () {
        return this._title;
    },

    setTitle: function (title) {
        this._title = title;
        Helpers.cleanNode(this.__html.tab);
        this.__html.tab.appendChild(document.createTextNode(title));
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.div;
    },

    /**
     * Tab Html element.
     *
     * @property tabHtml
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getTabHtml: function () {
        return this.__html.tab;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.__html.div;
    },

    /**
     * Is the widget visible or hidden.
     *
     * @property visible
     * @type Boolean
     * @default false
     */
    _visible: false,

    setVisible: function (visible, noParent) {
        this.$super(visible);

        if (visible) {
            if (this.parent) {
                var children = this.parent.children;
                for (var i = 0 ; i < children.length ; i++) {
                    if (!(children[i] instanceof TabItem)) {
                        continue;
                    }
                    if (children[i] === this) {
                        continue;
                    }
                    if (children[i].visible) {
                        children[i].setVisible(false, true);
                    }
                }
                this.parent._activeTabName = this.name;
            }

            this.addClass("photonui-tabitem-active");
            this.__html.tab.className = "photonui-tabitem-tab photonui-tabitem-active";
        } else {
            if (this.parent && !noParent) {
                this.parent.activeTab = null;
            }
            this.removeClass("photonui-tabitem-active");
            this.__html.tab.className = "photonui-tabitem-tab";
        }
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.div = document.createElement("div");
        this.__html.div.className = "photonui-widget photonui-tabitem photonui-container";
        this.__html.tab = document.createElement("div");
        this.__html.tab.className = "photonui-tabitem-tab";
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the tab is clicked.
     *
     * @method __onClick
     * @private
     * @param event
     */
    __onClick: function (event) {
        this.show();
        this._callCallbacks("click", [event]);
    }

});

module.exports = TabItem;


},{"../helpers.js":22,"./container.js":14}],20:[function(require,module,exports){
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
 * @submodule Container
 * @namespace photonui
 */

var Container = require("./container.js");
var numberToCssSize = require("../helpers.js").numberToCssSize;

/**
 * Viewport.
 *
 * @class Viewport
 * @constructor
 * @extends photonui.Container
 */
var Viewport = Container.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties([
            "padding", "verticalScrollbar", "horizontalScrollbar",
            "minWidth", "maxWidth", "width",
            "minHeight", "maxHeight", "height"
        ]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Window container node padding.
     *
     * @property padding
     * @type Number
     * @default 0
     */
    _padding: 0,

    getPadding: function () {
        return this._padding;
    },

    setPadding: function (padding) {
        this._padding = padding;
        this.containerNode.style.padding = padding + "px";
    },

    /**
     * Visibility of the vertical scrollbar.
     *
     *   * `true`: displayed,
     *   * `false`: hidden,
     *   * `null`: auto.
     *
     * @property verticalScrollbar
     * @type Boolean
     * @default null
     */
    _verticalScrollbar: null,

    getVerticalScrollbar: function () {
        return this._verticalScrollbar;
    },

    setVerticalScrollbar: function (visibility) {
        this._verticalScrollbar = visibility;
        if (visibility === true) {
            this.__html.viewport.style.overflowY = "scroll";
        } else if (visibility === false) {
            this.__html.viewport.style.overflowY = "hidden";
        } else {
            this.__html.viewport.style.overflowY = "auto";
        }
    },

    /**
     * Visibility of the horizontal scrollbar.
     *
     *   * `true`: displayed,
     *   * `false`: hidden,
     *   * `null`: auto.
     *
     * @property horizontalScrollbar
     * @type Boolean
     * @default null
     */
    _horizontalScrollbar: null,

    getHorizontalScrollbar: function () {
        return this._horizontalScrollbar;
    },

    setHorizontalScrollbar: function (visibility) {
        this._horizontalScrollbar = visibility;
        if (visibility === true) {
            this.__html.viewport.style.overflowX = "scroll";
        } else if (visibility === false) {
            this.__html.viewport.style.overflowX = "hidden";
        } else {
            this.__html.viewport.style.overflowX = "auto";
        }
    },

    /**
     * Minimum width.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent width
     *     * null: no minimum width
     *
     * @property minWidth
     * @type Number
     * @default null
     */
    _minWidth: null,

    getMinWidth: function () {
        return this._minWidth;
    },

    setMinWidth: function (minWidth) {
        this._minWidth = minWidth;
        this.__html.viewport.style.minWidth = numberToCssSize(minWidth, null, 0);
    },

    /**
     * Maximum width.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent width
     *     * null: no maximum width
     *
     * @property maxWidth
     * @type Number
     * @default null
     */
    _maxWidth: null,

    getMaxWidth: function () {
        return this._maxWidth;
    },

    setMaxWidth: function (maxWidth) {
        this._maxWidth = maxWidth;
        this.__html.viewport.style.maxWidth = numberToCssSize(maxWidth, null, Infinity);
    },

    /**
     * Width.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent width
     *     * null: auto
     *
     * @property width
     * @type Number
     * @default Infinity
     */
    _width: Infinity,

    getWidth: function () {
        return this._width;
    },

    setWidth: function (width) {
        this._width = width;
        this.__html.viewport.style.width = numberToCssSize(width, null);
    },

    /**
     * Minimum height.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent height
     *     * null: no minimum height
     *
     * @property minHeight
     * @type Number
     * @default null
     */
    _minHeight: null,

    getMinHeight: function () {
        return this._minHeight;
    },

    setMinHeight: function (minHeight) {
        this._minHeight = minHeight;
        this.__html.viewport.style.minHeight = numberToCssSize(minHeight, null, 0);
    },

    /**
     * Maximum height.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent height
     *     * null: no maximum height
     *
     * @property maxHeight
     * @type Number
     * @default null
     */
    _maxHeight: null,

    getMaxHeight: function () {
        return this._maxHeight;
    },

    setMaxHeight: function (maxHeight) {
        this._maxHeight = maxHeight;
        this.__html.viewport.style.maxHeight = numberToCssSize(maxHeight, null, Infinity);
    },

    /**
     * Height.
     *
     *     * Number: the size in px
     *     * Infinity: 100% of the parent height
     *     * null: auto
     *
     * @property height
     * @type Number
     * @default Infinity
     */
    _height: Infinity,

    getHeight: function () {
        return this._height;
    },

    setHeight: function (height) {
        this._height = height;
        this.__html.viewport.style.height = numberToCssSize(height, null);
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        setTimeout(this._sizingHack.bind(this), 10);
        return this.__html.viewport;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.__html.viewport;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.viewport = document.createElement("div");
        this.__html.viewport.className = "photonui-widget photonui-viewport photonui-container";
    },

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        if (visibility) {
            this._sizingHack();
        }
        this.$super(visibility);
    },

    /**
     * HACK: set the right height.
     *
     * @method _sizingHack
     * @private
     */
    _sizingHack: function () {
        if (this.height !== Infinity) {
            return;
        }
        if (this.visible && this.__html.viewport.parentNode) {
            var node = this.__html.viewport;
            var height = 0;

            this.__html.viewport.style.display = "none";

            while (node = node.parentNode) {  // jshint ignore:line
                if (!node) {
                    break;
                }
                if (node.offsetHeight > 0) {
                    height = node.offsetHeight;
                    var style = getComputedStyle(node);
                    height -= parseFloat(style.paddingTop);
                    height -= parseFloat(style.paddingBottom);
                    height -= parseFloat(style.borderTopWidth);
                    height -= parseFloat(style.borderBottomWidth);
                    break;
                }
            }

            if (this.maxHeight !== null) {
                height = Math.min(this.maxHeight, height);
            }
            if (this.minHeight !== null) {
                height = Math.max(this.minHeight, height);
            }
            this.__html.viewport.style.height = height + "px";
            this.__html.viewport.style.display = "";
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // pass
    }
});

module.exports = Viewport;

},{"../helpers.js":22,"./container.js":14}],21:[function(require,module,exports){
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
 * @submodule Container
 * @namespace photonui
 */

var Stone = require("stonejs");
var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var BaseWindow = require("./basewindow.js");

var _windowList = [];

/**
 * Window.
 *
 * wEvents:
 *
 *   * close-button-clicked:
 *      - description: called when the close button was clicked.
 *      - callback:    function(widget)
 *
 * @class Window
 * @constructor
 * @extends photonui.BaseWindow
 */
var Window = BaseWindow.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["close-button-clicked"]);
        this.$super(params);

        // Bind js events
        this._bindEvent("move.dragstart", this.__html.windowTitle, "mousedown", this.__moveDragStart.bind(this));
        this._bindEvent("closeButton.click", this.__html.windowTitleCloseButton, "click",
                        this.__closeButtonClicked.bind(this));
        this._bindEvent("totop", this.__html.window, "mousedown", this.moveToFront.bind(this));
        this._bindEvent("closeButton.mousedown", this.__html.windowTitleCloseButton, "mousedown",
                        function (event) { event.stopPropagation(); });

        // Update Properties
        this._updateProperties(["title", "closeButtonVisible"]);
        this.moveToFront();
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The window title.
     *
     * @property title
     * @type String
     * @default "Window"
     */
    _title: "Window",

    getTitle: function () {
        return this._title;
    },

    setTitle: function (title) {
        this._title = title;
        Helpers.cleanNode(this.__html.windowTitleText);
        this.__html.windowTitleText.appendChild(document.createTextNode(title));
    },

    /**
     * Determine if the window can be moved (drag & drop) by the user.
     *
     * @property movable
     * @type Boolean
     * @default true
     */
    _movable: true,

    isMovable: function () {
        return this._movable;
    },

    setMovable: function (movable) {
        this._movable = movable;
    },

    /**
     * Determine if the close button in the title bar is displayed or not.
     *
     * @property closeButtonVisible
     * @type Boolean
     * default: true
     */
    _closeButtonVisible: true,

    getCloseButtonVisible: function () {
        return this._closeButtonVisible;
    },

    setCloseButtonVisible: function (closeButtonVisible) {
        this._closeButtonVisible = closeButtonVisible;

        if (closeButtonVisible) {
            this.addClass("photonui-window-have-button");
            this.__html.windowTitleCloseButton.style.display = "block";
        } else {
            this.removeClass("photonui-window-have-button");
            this.__html.windowTitleCloseButton.style.display = "none";
        }
    },

    /**
     * Modal window?
     *
     * @property modal
     * @type Boolean
     * @default false
     */
    _modal: false,

    isModal: function () {
        return this._modal;
    },

    setModal: function (modal) {
        this._modal = modal;
        if (modal) {
            this.__html.modalBox = document.createElement("div");
            this.__html.modalBox.className = "photonui-window-modalbox";
            var parentNode = Widget.e_parent || document.getElementsByTagName("body")[0];
            parentNode.appendChild(this.__html.modalBox);
            this.visible = this.visible; // Force update
        } else if (this.__html.modalBox) {
            this.__html.modalBox.parentNode.removeChild(this.__html.modalBox);
            delete this.__html.modalBox;
        }
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.__html.windowContent;
    },

    setVisible: function (visible) {
        this.$super(visible);
        if (this.visible) {
            this.moveToFront();
            if (this.modal) {
                this.__html.modalBox.style.display = "block";
            }
        } else {
            this.moveToBack();
            if (this.modal) {
                this.__html.modalBox.style.display = "none";
            }
        }
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Bring the window to front.
     *
     * @method moveToFront
     */
    moveToFront: function () {
        var index = _windowList.indexOf(this);
        if (index >= 0) {
            _windowList.splice(index, 1);
        }
        _windowList.unshift(this);
        this._updateWindowList();
    },

    /**
     * Bring the window to the back.
     *
     * @method moveToBack
     */
    moveToBack: function () {
        var index = _windowList.indexOf(this);
        if (index >= 0) {
            _windowList.splice(index, 1);
        }
        _windowList.push(this);
        this._updateWindowList();
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        this.modal = false;
        var index = _windowList.indexOf(this);
        if (index >= 0) {
            _windowList.splice(index, 1);
        }
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        var _ = Stone.lazyGettext;

        this.$super();
        this.__html.window.className += " photonui-window";

        this.__html.windowTitle = document.createElement("div");
        this.__html.windowTitle.className = "photonui-window-title";
        this.__html.window.appendChild(this.__html.windowTitle);

        this.__html.windowTitleCloseButton = document.createElement("button");
        this.__html.windowTitleCloseButton.className = "photonui-window-title-close-button fa fa-times";
        this.__html.windowTitleCloseButton.title = Stone.lazyGettext("Close");
        this.__html.windowTitle.appendChild(this.__html.windowTitleCloseButton);

        this.__html.windowTitleText = document.createElement("span");
        this.__html.windowTitleText.className = "photonui-window-title-text";
        this.__html.windowTitle.appendChild(this.__html.windowTitleText);

        this.__html.windowContent = document.createElement("div");
        this.__html.windowContent.className = "photonui-container photonui-window-content";
        this.__html.window.appendChild(this.__html.windowContent);
    },

    /**
     * Update all the windows.
     *
     * @method _updateWindowList
     * @private
     */
    _updateWindowList: function () {
        for (var i = _windowList.length - 1, z = 0 ; i >= 0 ; i--, z++) {   // jshint ignore:line
            if (i === 0) {
                _windowList[i].html.style.zIndex = 2001;
                _windowList[i].addClass("photonui-active");
            } else {
                _windowList[i].html.style.zIndex = 1000 + z;
                _windowList[i].removeClass("photonui-active");
            }
            if (_windowList[i].modal) {
                _windowList[i].html.style.zIndex = 3001;
            }
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Start moving the window.
     *
     * @method _moveDragStart
     * @private
     * @param {Object} event
     */
    __moveDragStart: function (event) {
        if (!this.movable || event.button > 0) {
            return;
        }
        var offsetX = (event.offsetX !== undefined) ? event.offsetX : event.layerX;
        var offsetY = (event.offsetY !== undefined) ? event.offsetY : event.layerY;
        this.__html.windowTitle.style.cursor = "move";
        this._bindEvent("move.dragging", document, "mousemove", this.__moveDragging.bind(this, offsetX, offsetY));
        this._bindEvent("move.dragend", document, "mouseup", this.__moveDragEnd.bind(this));
    },

    /**
     * Move the window.
     *
     * @method _moveDragging
     * @private
     * @param {Number} offsetX
     * @param {Number} offsetY
     * @param {Object} event
     */
    __moveDragging: function (offsetX, offsetY, event) {
        var e_body = document.getElementsByTagName("body")[0];
        var x = Math.min(Math.max(event.pageX - offsetX, 40 - this.offsetWidth), e_body.offsetWidth - 40);
        var y = Math.max(event.pageY - offsetY, 0);
        if (e_body.offsetHeight > 0) {
            y = Math.min(y, e_body.offsetHeight - this.__html.windowTitle.offsetHeight);
        }
        this.setPosition(x, y);
    },

    /**
     * Stop moving the window.
     *
     * @method _moveDragEnd
     * @private
     * @param {Object} event
     */
    __moveDragEnd: function (event) {
        this.__html.windowTitle.style.cursor = "default";
        this._unbindEvent("move.dragging");
        this._unbindEvent("move.dragend");
    },

    /**
     * Close button clicked.
     *
     * @method _closeButtonClicked
     * @private
     * @param {Object} event
     */
    __closeButtonClicked: function (event) {
        this._callCallbacks("close-button-clicked");
    },

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        this.$super();
        this.__html.windowTitleCloseButton.title = Stone.lazyGettext("Close");
    }
});

module.exports = Window;

},{"../helpers.js":22,"../widget.js":56,"./basewindow.js":13,"stonejs":4}],22:[function(require,module,exports){
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
 * @submodule Helpers
 * @main helpers
 * @namespace photonui
 */

var uuid = require("uuid");

/**
 * Helpers.
 *
 * @class Helpers
 * @constructor
 */
var Helpers = function () {
};

/**
 * Escape HTML.
 *
 * @method escapeHtml
 * @static
 * @param {String} string
 * @return {String}
 */
Helpers.escapeHtml = function (string) {
    return string
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
};

/**
 * Generate an UUID version 4 (RFC 4122).
 *
 * This method is deprecated, please use `photonui.lib.uuid.v4()` instead.
 *
 * @method uuid4
 * @static
 * @deprecated
 * @return {String} The generated UUID
 */
Helpers.uuid4 = function () {
    Helpers.log("warn", "'photonui.Helpers.uuid4()' is deprecated. Use 'photonui.lib.uuid.v4()' instead.");
    return uuid.v4();
};

/**
 * Clean node (remove all children of the node).
 *
 * @method cleanNode
 * @static
 * @param {HTMLElement} node
 */
Helpers.cleanNode = function (node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
};

/**
 * Get the absolute position of an HTML Element.
 *
 * @method getAbsolutePosition
 * @static
 * @param {HTMLElement} element The HTML element (or its id)
 * @return {Object} `{x: <Number>, y: <Number>}
 */
Helpers.getAbsolutePosition = function (element) {
    if (typeof(element) == "string") {
        element = document.getElementById(element);
    }
    if (!(element instanceof Element)) {
        return {x: 0, y: 0};
    }
    var css;
    try {
        css = getComputedStyle(element);
    } catch (e) {
        return {x: 0, y: 0};
    }
    if (!css) {
        return {x: 0, y: 0};
    }

    var x = -parseInt(css.borderLeftWidth);
    var y = -parseInt(css.borderTopWidth);

    while (element.offsetParent) {
        css = getComputedStyle(element);

        x += element.offsetLeft || 0;
        x += parseInt(css.borderLeftWidth);

        y += element.offsetTop || 0;
        y += parseInt(css.borderTopWidth);

        element = element.offsetParent;
    }

    return {x: x, y: y};
};

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
 * @static
 * @param {Number} value
 * @param {Number} defaultValue (opt, default=nullValue)
 * @param {String} nullValue (opt, default="auto")
 * @return {String} sanitized version of the size.
 */
Helpers.numberToCssSize = function (value, defaultValue, nullValue) {
    nullValue = (nullValue === undefined) ? "auto" : nullValue;
    defaultValue = (nullValue === undefined) ? null : defaultValue;
    value = (value === undefined) ? defaultValue : value;

    if (value === Infinity) {
        return "100%";
    } else if (!isNaN(parseFloat(value))) {
        return Math.max(0, parseFloat(value) | 0) + "px";
    } else if (value !== defaultValue) {
        return Helpers.numberToCssSize(defaultValue, defaultValue, nullValue);
    } else {
        return nullValue;
    }
};

/**
 * Write log into the terminal.
 *
 * @method log
 * @static
 * @param {String} level The log level ("info", "warn", "error", ...)
 * @param {String} message The message to log
 */
Helpers.log = function (level, message) {
    try {
        if (!window.console) {
            return;
        }
        if (!window.console.log) {
            return;
        }
        if (!window.console[level]) {
            level = "log";
        }
        window.console[level]("PhotonUI: " + message);
    } catch (e) {
    }
};

module.exports = Helpers;

},{"uuid":6}],23:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var BaseIcon = require("../visual/baseicon.js");

/**
 * Button.
 *
 * wEvents:
 *
 *   * click:
 *     - description: called when the button was clicked.
 *     - callback:    function(widget, event)
 *
 * @class Button
 * @constructor
 * @extends photonui.Widget
 */
var Button = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["click"]);
        this.$super(params);

        // Bind js events
        this._bindEvent("click", this.__html.button, "click", this.__onButtonClicked.bind(this));

        // Update properties
        this._updateProperties(["text", "leftIconName", "rightIconName"]);
        this._update();
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The button text.
     *
     * @property text
     * @type String
     * @default "Button"
     */
    _text: "Button",

    getText: function () {
        return this._text;
    },

    setText: function (text) {
        this._text = text;
        Helpers.cleanNode(this.__html.text);
        this.__html.text.appendChild(document.createTextNode(text));
    },

    /**
     * Define if the button text is displayed or hidden.
     *
     * @property textVisible
     * @type Boolean
     * @default true
     */
    _textVisible: true,

    isTextVisible: function () {
        return this._textVisible;
    },

    setTextVisible: function (textVisible) {
        this._textVisible = textVisible;
        this._update();
    },

    /**
     * Left icon widget name.
     *
     * @property leftIconName
     * @type String
     * @default: null
     */
    _leftIconName: null,

    getLeftIconName: function () {
        return this._leftIconName;
    },

    setLeftIconName: function (leftIconName) {
        this._leftIconName = leftIconName;
        Helpers.cleanNode(this.__html.leftIcon);
        if (this._leftIconName) {
            this.__html.leftIcon.appendChild(this.leftIcon.html);
            this.leftIconVisible = true;
        }
    },

    /**
     * Left icon widget.
     *
     * @property leftIcon
     * @type BaseIcon
     * @default: null
     */
    getLeftIcon: function () {
        return Widget.getWidget(this._leftIconName);
    },

    setLeftIcon: function (leftIcon) {
        if (leftIcon instanceof BaseIcon) {
            this.leftIconName = leftIcon.name;
            return;
        }
        this.leftIconName = null;
    },

    /**
     * Define if the left icon is displayed or hidden.
     *
     * @property leftIconVisible
     * @type Boolean
     * @default true
     */
    _leftIconVisible: true,

    isLeftIconVisible: function () {
        return this._leftIconVisible;
    },

    setLeftIconVisible: function (leftIconVisible) {
        this._leftIconVisible = leftIconVisible;
        this._update();
    },

    /**
     * Right icon widget name.
     *
     * @property rightIconName
     * @type String
     * @default: null
     */
    _rightIconName: null,

    getRightIconName: function () {
        return this._rightIconName;
    },

    setRightIconName: function (rightIconName) {
        this._rightIconName = rightIconName;
        Helpers.cleanNode(this.__html.rightIcon);
        if (this._rightIconName) {
            this.__html.rightIcon.appendChild(this.rightIcon.html);
            this.rightIconVisible = true;
        }
    },

    /**
     * Right icon widget.
     *
     * @property rightIcon
     * @type BaseIcon
     * @default: null
     */
    getRightIcon: function () {
        return Widget.getWidget(this._rightIconName);
    },

    setRightIcon: function (rightIcon) {
        if (rightIcon instanceof BaseIcon) {
            this.rightIconName = rightIcon.name;
            return;
        }
        this.rightIconName = null;
    },

    /**
     * Define if the right icon is displayed or hidden.
     *
     * @property rightIconVisible
     * @type Boolean
     * @default true
     */
    _rightIconVisible: true,

    isRightIconVisible: function () {
        return this._rightIconVisible;
    },

    setRightIconVisible: function (rightIconVisible) {
        this._rightIconVisible = rightIconVisible;
        this._update();
    },

    /**
     * Define the button appearance.
     *
     *   * `normal`
     *   * `flat`
     *
     * @property appearance
     * @type String
     * @default "normal"
     */
    _appearance: "normal",

    getAppearance: function () {
        return this._appearance;
    },

    setAppearance: function (appearance) {
        this._appearance = appearance;

        if (appearance == "flat") {
            this.addClass("photonui-button-appearance-flat");
        } else {
            this.removeClass("photonui-button-appearance-flat");
        }
    },

    /**
     * Button's color.
     *
     * The available colors depends on the theme. Particle, the
     * default PhotonUI theme provides the following colors:
     *
     *   * `blue`
     *   * `red`
     *   * `yellow`
     *   * `green`
     *   * null (default)
     *
     * @property buttonColor
     * @type string
     * @default null
     */
    _buttonColor: null,

    getButtonColor: function () {
        return this._buttonColor;
    },

    setButtonColor: function (buttonColor) {
        if (this._buttonColor) {
            this.__html.button.classList.remove("photonui-button-color-" + this._buttonColor);
        }
        this._buttonColor = buttonColor;
        if (buttonColor) {
            this.__html.button.classList.add("photonui-button-color-" + this._buttonColor);
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
    getHtml: function () {
        return this.__html.button;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Update the button content
     *
     * @method _update
     * @private
     */
    _update: function () {
        if (this.__html.leftIcon.parentNode == this.__html.button) {
            this.__html.button.removeChild(this.__html.leftIcon);
        }
        if (this.__html.text.parentNode == this.__html.button) {
            this.__html.button.removeChild(this.__html.text);
        }
        if (this.__html.rightIcon.parentNode == this.__html.button) {
            this.__html.button.removeChild(this.__html.rightIcon);
        }

        if (this.leftIconName && this.leftIconVisible) {
            this.__html.button.appendChild(this.__html.leftIcon);
        }

        if (this.text && this.textVisible) {
            this.__html.button.appendChild(this.__html.text);
        }

        if (this.rightIconName && this.rightIconVisible) {
            this.__html.button.appendChild(this.__html.rightIcon);
        }
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.button = document.createElement("button");
        this.__html.button.className = "photonui-widget photonui-button";

        this.__html.leftIcon = document.createElement("span");
        this.__html.leftIcon.className = "photonui-button-icon";
        this.__html.button.appendChild(this.__html.leftIcon);

        this.__html.text = document.createElement("span");
        this.__html.text.className = "photonui-button-text";
        this.__html.button.appendChild(this.__html.text);

        this.__html.rightIcon = document.createElement("span");
        this.__html.rightIcon.className = "photonui-button-icon";
        this.__html.button.appendChild(this.__html.rightIcon);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the button is clicked.
     *
     * @method __onButtonClicked
     * @private
     * @param event
     */
    __onButtonClicked: function (event) {
        this._callCallbacks("click", [event]);
    }
});

// Button mixin for ToggleButton
Button._buttonMixin = {
    // Properties
    _text:               Button.prototype._text,
    getText:             Button.prototype.getText,
    setText:             Button.prototype.setText,
    _textVisible:        Button.prototype._textVisible,
    isTextVisible:       Button.prototype.isTextVisible,
    setTextVisible:      Button.prototype.setTextVisible,
    _leftIconName:       Button.prototype._leftIconName,
    getLeftIconName:     Button.prototype.getLeftIconName,
    setLeftIconName:     Button.prototype.setLeftIconName,
    getLeftIcon:         Button.prototype.getLeftIcon,
    setLeftIcon:         Button.prototype.setLeftIcon,
    _leftIconVisible:    Button.prototype._leftIconVisible,
    isLeftIconVisible:   Button.prototype.isLeftIconVisible,
    setLeftIconVisible:  Button.prototype.setLeftIconVisible,
    _rightIconName:      Button.prototype._rightIconName,
    getRightIconName:    Button.prototype.getRightIconName,
    setRightIconName:    Button.prototype.setRightIconName,
    getRightIcon:        Button.prototype.getRightIcon,
    setRightIcon:        Button.prototype.setRightIcon,
    _rightIconVisible:   Button.prototype._rightIconVisible,
    isRightIconVisible:  Button.prototype.isRightIconVisible,
    setRightIconVisible: Button.prototype.setRightIconVisible,
    _appearance:         Button.prototype._appearance,
    getAppearance:       Button.prototype.getAppearance,
    setAppearance:       Button.prototype.setAppearance,
    _buttonColor:        Button.prototype._buttonColor,
    getButtonColor:      Button.prototype.getButtonColor,
    setButtonColor:      Button.prototype.setButtonColor,
    // Private methods
    _update:             Button.prototype._update,
    _buildButtonHtml:    Button.prototype._buildHtml,
    // Internal Events Callbacks
    __onButtonClicked:   Button.prototype.__onButtonClicked
};

module.exports = Button;

},{"../helpers.js":22,"../visual/baseicon.js":47,"../widget.js":56}],24:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Checkbox.
 *
 * wEvents:
 *
 *   * value-changed:
 *     - description: called when the value was modified.
 *     - callback:    function(widget, value)
 *
 * @class CheckBox
 * @constructor
 * @extends photonui.Widget
 */
var CheckBox = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["value-changed", "click"]);
        this.$super(params);
        this.inputId = this.name + "-input";
        this._bindEvent("value-changed", this.__html.checkbox, "change", this.__onChange.bind(this));
        this._bindEvent("span-click", this.__html.span, "click", this.__onSpanClick.bind(this));
        this._bindEvent("checkbox-click", this.__html.checkbox, "click", this.__onCheckboxClick.bind(this));
        this._bindEvent("span-keypress", this.__html.span, "keypress", this.__onSpanKeypress.bind(this));
        this.__html.checkbox.name = this.name;
        this.__html.checkbox.id = this.inputId;
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The input value.
     *
     * @property value
     * @type Boolean
     * @default false
     */
    getValue: function () {
        return this.__html.checkbox.checked;
    },

    setValue: function (value) {
        this.__html.checkbox.checked = value;
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.outer;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget";
        this.__html.outer.className += " photonui-checkbox";
        this.__html.outer.className += " photonui-widget-fixed-width";
        this.__html.outer.className += " photonui-widget-fixed-height";

        this.__html.checkbox = document.createElement("input");
        this.__html.checkbox.type = "checkbox";
        this.__html.outer.appendChild(this.__html.checkbox);

        this.__html.span = document.createElement("span");
        this.__html.span.tabIndex = "0";
        this.__html.outer.appendChild(this.__html.span);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onChange
     * @private
     * @param event
     */
    __onChange: function (event) {
        this._callCallbacks("value-changed", [this.value]);
        // Focus the span if the real checkbox is hidden (happen when a label is clicked).
        if (window.getComputedStyle(this.__html.checkbox).display == "none") {
            this.__html.span.focus();
        }
    },

    /**
     * @method __onSpanClick
     * @private
     * @param event
     */
    __onSpanClick: function (event) {
        this.value = !this.value;
        this._callCallbacks("value-changed", [this.value]);
        this._callCallbacks("click", [event]);
    },

    /**
     * @method __onCheckboxClick
     * @private
     * @param event
     */
    __onCheckboxClick: function (event) {
        this._callCallbacks("click", [event]);
    },

    /**
     * @method __onSpanKeyPress
     * @private
     * @param event
     */
    __onSpanKeypress: function (event) {
        if (event.charCode == 32 || event.keyCode == 13) {
            this.value = !this.value;
            this._callCallbacks("value-changed", [this.value]);
        }
    }
});

module.exports = CheckBox;

},{"../widget.js":56}],25:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var Color = require("../nonvisual/color.js");

/**
 * A Color Palette.
 *
 * wEvents:
 *
 *   * value-changed:
 *      - description: the selected color changed.
 *      - callback:    function(widget, color)
 *
 * @class ColorPalette
 * @constructor
 * @extends photonui.Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var ColorPalette = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this._color = new Color(ColorPalette.palette[0][0]);
        this._registerWEvents(["value-changed"]);
        this.$super(params);
        this._updateProperties(["palette", "value"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The value (color in rgb hexadecimal format (e.g. "#ff0000")).
     *
     * @property value
     * @type String
     */
    getValue: function () {
        return this.color.hexString;
    },

    setValue: function (value) {
        this.color.hexString = value;
    },

    /**
     * The color.
     *
     * @property color
     * @type kzd.Color
     */
    _color: null,

    getColor: function () {
        return this._color;
    },

    setColor: function (color) {
        if (color instanceof Color) {
            this._color = color;
        }
    },

    /**
     * The color palette.
     *
     * @property palette
     * @type Array
     * @default null (= `Color.palette`)
     */
    _palette: null,

    getPalette: function () {
        return this._palette || ColorPalette.palette;
    },

    setPalette: function (palette) {
        this._palette = palette;

        if (!palette) {
            palette = ColorPalette.palette;
        }

        // Update
        this.__html.palette.removeChild(this.__html.tbody);
        Helpers.cleanNode(this.__html.tbody);

        var e_tr;
        var e_td;
        var x;
        var y;
        for (y = 0 ; y < palette.length ; y++) {
            e_tr = document.createElement("tr");
            for (x = 0 ; x < palette[y].length ; x++) {
                e_td = document.createElement("td");
                e_td.style.backgroundColor = palette[y][x];
                e_td.onclick = this.__onColorClicked.bind(this, palette[y][x]);
                e_tr.appendChild(e_td);
            }
            this.__html.tbody.appendChild(e_tr);
        }

        this.__html.palette.appendChild(this.__html.tbody);
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.palette;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.palette = document.createElement("table");
        this.__html.palette.className = "photonui-widget photonui-colorpalette";
        this.__html.tbody = document.createElement("tbody");
        this.__html.palette.appendChild(this.__html.tbody);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    __onColorClicked: function (color, event) {
        this.value = color;
        this._callCallbacks("value-changed", [this.color]);
    }
});

// The default palette

ColorPalette.palette = [
    ["#000000", "#424242", "#676767", "#989898", "#C5C5C5", "#FFFFFF"],
    ["#E52131", "#ED7130", "#F0902C", "#F0B922", "#EDE118", "#7DA638"],
    ["#EA4852", "#F08D52", "#F3A752", "#F9D246", "#F0EC51", "#A7CF41"],
    ["#F19096", "#F5BC93", "#F9CB94", "#F9E48A", "#F2F08E", "#C6DE84"],
    ["#F8D1D6", "#F9E2D2", "#F9E8D3", "#FDF8D2", "#F9F9CF", "#E7F1CD"],
    ["#1E9E85", "#2A7DB5", "#2751A1", "#6C3E98", "#A33E97", "#DF3795"],
    ["#2FB8A3", "#40A1D7", "#4072B5", "#8963AB", "#B462A7", "#E262A5"],
    ["#88CEC3", "#8CC9E9", "#87A8D3", "#D2A0C9", "#D2A0C9", "#EDA0C6"],
    ["#CEEAE7", "#CDE9F8", "#CFDEEF", "#EED9E9", "#EED9E9", "#F8D7E7"]
];

module.exports = ColorPalette;

},{"../helpers.js":22,"../nonvisual/color.js":41,"../widget.js":56}],26:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var Color = require("../nonvisual/color.js");
var MouseManager = require("../nonvisual/mousemanager.js");

/**
 * A Color Picker.
 *
 * wEvents:
 *
 *   * value-changed:
 *      - description: the selected color changed.
 *      - callback:    function(widget, color)
 *
 * @class ColorPicker
 * @constructor
 * @extends photonui.Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var ColorPicker = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["value-changed"]);
        this._color = new Color();
        this.__buffH = document.createElement("canvas");
        this.__buffH.width = 200;
        this.__buffH.height = 200;
        this.__buffSB = document.createElement("canvas");
        this.__buffSB.width = 100;
        this.__buffSB.height = 100;
        this.__buffSBmask = document.createElement("canvas");
        this.__buffSBmask.width = 100;
        this.__buffSBmask.height = 100;
        this.$super(params);
        this._updateH();
        this._updateSB();
        this._updateSBmask();
        this._updateCanvas();
        this._updateProperties(["color"]);

        this.__mouseManager = new MouseManager(this.__html.canvas);

        this.__mouseManager.registerCallback("click", "mouse-move", this.__onMouseMove.bind(this));
        this.__mouseManager.registerCallback("mouse-down", "mouse-down", this.__onMouseDown.bind(this));
        this.__mouseManager.registerCallback("drag-start", "drag-start", this.__onDragStart.bind(this));

        // Bind js events
        this._bindEvent("value-changed", this.__html.preview, "change", this.__onValueChanged.bind(this));
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The value (color in rgb hexadecimal format (e.g. "#ff0000")).
     *
     * @property value
     * @type String
     */
    getValue: function () {
        return this.color.hexString;
    },

    setValue: function (value) {
        this.color.hexString = value;
        this._updateSB();
        this._updateCanvas();
    },

    /**
     * The color.
     *
     * @property color
     * @type kzd.Color
     */
    _color: null,

    getColor: function () {
        return this._color;
    },

    setColor: function (color) {
        if (color instanceof Color) {
            if (this._color) {
                this._color.removeCallback("photonui.colorpicker.value-changed::" + this.name);
            }
            this._color = color;
            this._color.registerCallback("photonui.colorpicker.value-changed::" +
                                         this.name, "value-changed", function () {
                this._updateSB();
                this._updateCanvas();
            }.bind(this));
            this._updateSB();
            this._updateCanvas();
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
    getHtml: function () {
        return this.__html.outer;
    },

    // ====== Private properties ======

    /**
     * Buffer canvas for hue circle.
     *
     * @property __buffH
     * @private
     * @type HTMLCanvasElement
     */
    __buffH: null,

    /**
     * Buffer canvas for saturation/brightness square.
     *
     * @property __buffSB
     * @private
     * @type HTMLCanvasElement
     */
    __buffSB: null,

    /**
     * Mouse manager.
     *
     * @property __mouseManager
     * @private
     * @type photonui.MouseManager
     */
    __mouseManager: null,

    /**
     * FLAG: Disable SB square update.
     *
     * @property __disableSBUpdate
     * @private
     * @type Boolean
     * @default false
     */
    __disableSBUpdate: false,

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    destroy: function () {
        this.__mouseManager.destroy();
        this._color.removeCallback("photonui.colorpicker.value-changed::" + this.name);
        this.$super();
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-colorpicker";
        this.__html.canvas = document.createElement("canvas");
        this.__html.canvas.width = 200;
        this.__html.canvas.height = 200;
        this.__html.outer.appendChild(this.__html.canvas);

        this.__html.previewOuter = document.createElement("span");
        this.__html.previewOuter.className = "photonui-colorpicker-previewouter";
        this.__html.outer.appendChild(this.__html.previewOuter);

        this.__html.preview = document.createElement("input");
        this.__html.preview.type = "text";
        this.__html.preview.autocomplete = "off";
        this.__html.preview.spellcheck = false;
        this.__html.preview.className = "photonui-colorpicker-preview";
        this.__html.previewOuter.appendChild(this.__html.preview);
    },

    /**
     * Update hue circle
     *
     * @method _updateH
     * @private
     */
    _updateH: function () {
        var canvas = this.__buffH;
        var ctx = canvas.getContext("2d");
        var color = new Color();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0 ; i < 360 ; i++) {
            color.hue = 360 - i;
            ctx.beginPath();
            ctx.fillStyle = color.hexString;
            ctx.arc(100, 100, 90, Math.PI * i / 180, Math.PI * ((i + 2) % 360) / 180, false);
            ctx.lineTo(100, 100);
            ctx.fill();
        }

        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.arc(100, 100, 73, 2 * Math.PI, false);
        ctx.globalCompositeOperation = "destination-out";
        ctx.fill();
    },

    /**
     * Update saturation/brightness square mask
     *
     * @method _updateSBmask
     * @private
     */
    _updateSBmask: function () {
        var canvas = this.__buffSBmask;
        var ctx = canvas.getContext("2d");
        var pix = ctx.getImageData(0, 0, canvas.width, canvas.height);

        var i = 0;
        var saturation = 0;
        var b = 0;
        var s = 0;
        for (b = 0 ; b < 100 ; b++) {
            for (s = 0 ; s < 100 ; s++) {
                i = 400 * b + 4 * s;

                // some magic here
                saturation = ((0.5 * (1 - s / 100) + 0.5) * (1 - b / 100) * 255) << 0;

                pix.data[i + 0] = saturation;
                pix.data[i + 1] = saturation;
                pix.data[i + 2] = saturation;

                // more magic
                pix.data[i + 3] = ((1 - (((s / 100)) * (1 - (b / 100)))) * 255) << 0;
            }
        }

        ctx.putImageData(pix, 0, 0);
    },

    /**
     * Update saturation/brightness square
     *
     * @method _updateSB
     * @private
     */
    _updateSB: function () {
        if (this.__disableSBUpdate) {
            return;
        }

        var canvas = this.__buffSB;
        var ctx = canvas.getContext("2d");

        var color = new Color({
            hue: this.color.hue,
            saturation: 100,
            brightness: 100
        });

        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // fill the whole canvas with the current color
        ctx.fillStyle = color.hexString;
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();

        // draw a mask on it, it will do the trick
        ctx.drawImage(this.__buffSBmask, 0, 0);

        ctx.restore();
    },

    /**
     * Update the canvas
     *
     * @method _updateCanvas
     * @private
     */
    _updateCanvas: function () {
        var canvas = this.__html.canvas;
        var ctx = canvas.getContext("2d");

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(this.__buffH, 0, 0);
        ctx.drawImage(this.__buffSB, 50, 50);

        ctx.strokeStyle = "#fff";
        ctx.shadowColor = "rgba(0, 0, 0, .7)";
        ctx.shadowBlur = 3;
        ctx.lineWidth = 2;

        // Square cursor
        ctx.beginPath();
        ctx.arc(this.color.saturation + 50, 100 - this.color.brightness + 50, 6, 2 * Math.PI, false);
        ctx.stroke();

        // Square cursor
        ctx.translate(100, 100);
        ctx.rotate(-this.color.hue * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(81, 0, 6, 2 * Math.PI, false);
        ctx.stroke();

        ctx.restore();

        // Color preview
        this.__html.preview.style.backgroundColor = this.color.rgbaString;
        this.__html.preview.value = this.color.hexString;
    },

    /**
     * Is the pointer on the SB Square?
     *
     * @method _pointerOnSquare
     * @private
     * @param mstate
     * @return {Boolean}
     */
    _pointerOnSquare: function (mstate) {
        return (mstate.x >= 50 && mstate.x <= 150 && mstate.y >= 50 && mstate.y <= 150);
    },

    /**
     * Is the pointer on the hue circle?
     *
     * @method _pointerOnCircle
     * @private
     * @param mstate
     * @return {Boolean}
     */
    _pointerOnCircle: function (mstate) {
        var dx = Math.abs(100 - mstate.x);
        var dy = Math.abs(100 - mstate.y);
        var h = Math.sqrt(dx * dx + dy * dy);
        return (h >= 74 && h <= 90);
    },

    /**
     * the angle of the pointer with the horizontal line that pass by the center of the hue circle.
     *
     * @method _pointerAngle
     * @private
     * @param mstate
     * @return {Number} the angle in degree.
     */
    _pointerAngle: function (mstate) {
        var dx = Math.abs(100 - mstate.x);
        var dy = Math.abs(100 - mstate.y);
        var angle = Math.atan(dy / dx) * 180 / Math.PI;

        if (mstate.x < 100 && mstate.y < 100) {
            angle = 180 - angle;
        } else if (mstate.x < 100 && mstate.y >= 100) {
            angle += 180;
        } else if (mstate.x >= 100 && mstate.y > 100) {
            angle = 360 - angle;
        }

        return angle | 0;
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onMouseMove
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onMouseMove: function (manager, mstate) {
        if (this._pointerOnSquare(mstate) || this._pointerOnCircle(mstate)) {
            this.__html.canvas.style.cursor = "crosshair";
        } else {
            this.__html.canvas.style.cursor = "default";
        }
    },

    /**
     * @method __onMouseDown
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onMouseDown: function (manager, mstate) {
        if (this._pointerOnSquare(mstate)) {
            this.__disableSBUpdate = true;
            this.color.saturation = mstate.x - 50;
            this.color.brightness = 150 - mstate.y;
            this.__disableSBUpdate = false;
            this._callCallbacks("value-changed", this.color);
        } else if (this._pointerOnCircle(mstate)) {
            this.color.hue = this._pointerAngle(mstate);
            this._callCallbacks("value-changed", this.color);
        }
    },

    /**
     * @method __onDragStart
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onDragStart: function (manager, mstate) {
        if (this._pointerOnSquare(mstate)) {
            this.__disableSBUpdate = true;
            this.__mouseManager.registerCallback("dragging", "dragging", this.__onDraggingSquare.bind(this));
            this.__mouseManager.registerCallback("drag-end", "drag-end", this.__onDragEnd.bind(this));
        } else if (this._pointerOnCircle(mstate)) {
            this.__mouseManager.registerCallback("dragging", "dragging", this.__onDraggingCircle.bind(this));
            this.__mouseManager.registerCallback("drag-end", "drag-end", this.__onDragEnd.bind(this));
        }
    },

    /**
     * @method __onDraggingSquare
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onDraggingSquare: function (manager, mstate) {
        this.color.saturation = mstate.x - 50;
        this.color.brightness = 150 - mstate.y;
        this._callCallbacks("value-changed", this.color);
    },

    /**
     * @method __onDraggingCircle
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onDraggingCircle: function (manager, mstate) {
        this.color.hue = this._pointerAngle(mstate);
        this._callCallbacks("value-changed", this.color);
    },

    /**
     * @method __onDragEnd
     * @private
     * @param {photonui.MouseManager} manager
     * @param {Object} mstate
     */
    __onDragEnd: function (manager, mstate) {
        this.__mouseManager.removeCallback("dragging");
        this.__mouseManager.removeCallback("drag-end");
        this.__disableSBUpdate = false;
    },

    /**
     * @method __onValueChanged
     * @private
     */
    __onValueChanged: function () {
        this.color.hexString = this.__html.preview.value;
        this.__html.preview.value = this.color.hexString;
        this._callCallbacks("value-changed", this.color);
    },
});

module.exports = ColorPicker;

},{"../helpers.js":22,"../nonvisual/color.js":41,"../nonvisual/mousemanager.js":43,"../widget.js":56}],27:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Base class for fields.
 *
 * wEvents:
 *
 *   * value-changed:
 *     - description: called when the value was modified.
 *     - callback:    function(widget, value)
 *
 *   * keydown:
 *     - description: called when a key is pressed.
 *     - callback:    function(widget, event)
 *
 *   * keyup:
 *     - description: called when a key is released.
 *     - callback:    function(widget, event)
 *
 *   * keypress:
 *     - description: called just before the insertion of a char.
 *     - callback:    function(widget, event)
 *
 *   * selection-changed:
 *     - description: called when the selection was changed.
 *     - callback:    function(widget, selectionStart, selectionEnd, selectedText, event)
 *
 * @class Field
 * @constructor
 * @extends photonui.Widget
 */
var Field = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents([
            "value-changed", "keydown", "keyup", "keypress",
            "selection-changed"
        ]);
        this.$super(params);
        this._updateProperties(["value", "placeholder"]);
        this.__html.field.name = this.name;
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The field value.
     *
     * @property value
     * @type String (maybe)
     * @default ""
     */
    getValue: function () {
        return this.__html.field.value;
    },

    setValue: function (value) {
        this.__html.field.value = value;
    },

    /**
     * The placeholder displayed if the field is empty.
     *
     * @property Placeholder
     * @type String
     * @default ""
     */
    _placeholder: "",

    getPlaceholder: function () {
        return this._placeholder;
    },

    setPlaceholder: function (placeholder) {
        this._placeholder = placeholder;
        this.__html.field.placeholder = placeholder;
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.field;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Bind Field events.
     *
     * @method _bindFieldEvents
     * @private
     */
    _bindFieldEvents: function () {
        this._bindEvent("value-changed", this.__html.field, "change", function (event) {
            this._callCallbacks("value-changed", [this.getValue()]);
        }.bind(this));

        this._bindEvent("keydown", this.__html.field, "keydown", function (event) {
            this._callCallbacks("keydown", [event]);
        }.bind(this));

        this._bindEvent("keyup", this.__html.field, "keyup", function (event) {
            this._callCallbacks("keyup", [event]);
        }.bind(this));

        this._bindEvent("keypress", this.__html.field, "keypress", function (event) {
            this._callCallbacks("keypress", [event]);
        }.bind(this));

        this._bindEvent("selection-changed", this.__html.field, "select", function (event) {
            this._callCallbacks("selection-changed", [
                this.__html.field.selectionStart,
                this.__html.field.selectionEnd,
                String(this.getValue()).substring(this.__html.field.selectionStart, this.__html.field.selectionEnd),
                event]);
        }.bind(this));
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
    __onContextMenu: function (event) {
        event.stopPropagation();  // Enable context menu on fields
    }
});

module.exports = Field;

},{"../widget.js":56}],28:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var Field = require("./field.js");

/**
 * Numeric field.
 *
 * @class NumericField
 * @constructor
 * @extends photonui.Field
 */
var NumericField = Field.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties(["value"]);
        this._bindFieldEvents();
        this._unbindEvent("value-changed");
        this._bindEvent("keypress", this.__html.field, "keypress", this.__onKeypress.bind(this));
        this._bindEvent("keyup", this.__html.field, "keyup", this.__onKeyup.bind(this));
        this._bindEvent("keydown", this.__html.field, "keydown", this.__onKeydown.bind(this));
        this._bindEvent("change", this.__html.field, "change", this.__onChange.bind(this));
        this._bindEvent("mousewheel", this.__html.field, "mousewheel", this.__onMouseWheel.bind(this));
        this._bindEvent("mousewheel-firefox", this.__html.field, "DOMMouseScroll", this.__onMouseWheel.bind(this));
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The minimum value of the field.
     *
     * @property min
     * @type Number
     * default null (no minimum);
     */
    _min: null,

    getMin: function () {
        return this._min;
    },

    setMin: function (min) {
        this._min = min;
    },

    /**
     * The maximum value of the field.
     *
     * @property max
     * @type Number
     * default null (no maximum);
     */
    _max: null,

    getMax: function () {
        return this._max;
    },

    setMax: function (max) {
        this._max = max;
    },

    /**
     * The incrementation step of the field.
     *
     * @property step
     * @type Number
     * default 1
     */
    _step: 1,

    getStep: function () {
        return this._step;
    },

    setStep: function (step) {
        this._step = Math.abs(step);
    },

    /**
     * The number of digit after the decimal dot.
     *
     * @property decimalDigits
     * @type Number
     * @default null (no limite)
     */
    _decimalDigits: null,

    getDecimalDigits: function () {
        return this._decimalDigits;
    },

    setDecimalDigits: function (decimalDigits) {
        this._decimalDigits = decimalDigits;
    },

    /**
     * The decimal symbol ("." or ",").
     *
     * @property decimalSymbol
     * @type String
     * @default: "."
     */
    _decimalSymbol: ".",

    getDecimalSymbol: function () {
        return this._decimalSymbol;
    },

    setDecimalSymbol: function (decimalSymbol) {
        this._decimalSymbol = decimalSymbol;
    },

    /**
     * The field value.
     *
     * @property value
     * @type Number
     * @default 0
     */
    _value: 0,

    getValue: function () {
        return parseFloat(this._value);
    },

    setValue: function (value) {
        this._updateValue(value);
        this._updateFieldValue();
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Update the value (in the widget).
     *
     * @method _updateValue
     * @private
     * @param {String|Number} value The raw value.
     */
    _updateValue: function (value) {
        value = String(value).replace(",", "."); // ","
        value = value.replace(/ /g, "");  // remove spaces
        value = parseFloat(value);
        if (isNaN(value)) {
            value = 0;
        }

        if (this.min !== null) {
            value = Math.max(this.min, value);
        }

        if (this.max !== null) {
            value = Math.min(this.max, value);
        }

        if (this.decimalDigits !== null) {
            value = value.toFixed(this.decimalDigits);
        }

        this._value = value;
    },

    /**
     * Update the value in the html field.
     *
     * @method _updateFieldValue
     * @private
     */
    _updateFieldValue: function () {
        this.__html.field.value = String(this._value).replace(".", this.decimalSymbol);
    },

    /**
     * Validate the user inputs.
     *
     * @method _validateInput
     * @private
     * @param {String} value
     * @return {Boolean}
     */
    _validateInput: function (value) {
        value = String(value);
        value = value.replace(/ /g, "");  // remove spaces
        if (/^-?[0-9]*(\.|,)?[0-9]*$/.test(value)) {
            if (this.decimalDigits === 0 && !/^-?[0-9]*$/.test(value)) {
                return false;
            }
            if (this.min !== null && this.min >= 0 && value[0] == "-") {
                return false;
            }
            return true;
        }
        return false;
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.field = document.createElement("input");
        this.__html.field.className = "photonui-widget photonui-field photonui-numericfield";
        this.__html.field.type = "text";
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onKeypress
     * @private
     * @param event
     */
    __onKeypress: function (event) {
        if (event.ctrlKey ||
            event.key == "ArrowLeft" ||
            event.key == "ArrowRight" ||
            event.key == "Backspace" ||
            event.key == "Delete"
        ) {
            return;
        } else if (event.keyCode == 13) {  // Enter
            this._updateFieldValue();
            this._callCallbacks("value-changed", [this.value]);
        } else {
            var field = this.__html.field;
            var value = field.value.slice(0, field.selectionStart) +
                        String.fromCharCode(event.charCode) +
                        field.value.slice(field.selectionEnd);
            if (!this._validateInput(value)) {
                event.preventDefault();
            }
        }
    },

    /**
     * @method __onKeyup
     * @private
     * @param event
     */
    __onKeyup: function (event) {
        var value = this.__html.field.value.replace(/[^0-9.,-]*/g, "");
        if (value != this.__html.field.value) {
            this.__html.field.value = value;
        }
        this._updateValue(this.__html.field.value);
    },

    /**
     * @method __onChange
     * @private
     * @param event
     */
    __onChange: function (event) {
        this._updateFieldValue();
        this._callCallbacks("value-changed", [this.value]);
    },

    /**
     * @method __onMouseWheel
     * @private
     * @param event
     */
    __onMouseWheel: function (event) {
        if (document.activeElement != this.__html.field) {
            return;
        }

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
                this.value += this.step;
            } else {
                this.value -= this.step;
            }
            event.preventDefault();
        }
        this._callCallbacks("value-changed", [this.value]);
    },

    /**
     * @method __onKeydown
     * @private
     * @param event
     */
    __onKeydown: function (event) {
        if (event.keyCode == 38) {
            this.setValue(this.getValue() + this.step);
            event.preventDefault();
            this._callCallbacks("value-changed", [this.value]);
        } else if (event.keyCode == 40) {
            this.setValue(this.getValue() - this.step);
            event.preventDefault();
            this._callCallbacks("value-changed", [this.value]);
        }
    }
});

module.exports = NumericField;

},{"./field.js":27}],29:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var NumericField = require("./numericfield.js");

/**
 * Slider
 *
 * @class Slider
 * @constructor
 * @extends photonui.NumericField
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var Slider = NumericField.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);

        this.inputId = this.name + "-field";
        this.__html.field.id = this.inputId;

        this._updateProperties(["fieldVisible"]);

        this._bindEvent("slider-mousedown", this.__html.slider, "mousedown", this.__onSliderMouseDown.bind(this));
        this._bindEvent("slider-keydown", this.__html.slider, "keydown", this.__onSliderKeyDown.bind(this));
        this._bindEvent("slider-mousewheel", this.__html.slider, "mousewheel", this.__onSliderMouseWheel.bind(this));
        this._bindEvent("slider-mousewheel-firefox", this.__html.slider,
                        "DOMMouseScroll", this.__onSliderMouseWheel.bind(this));
        this._bindEvent("field-contextmenu", this.__html.field, "contextmenu", this.__onFieldContextMenu.bind(this));
    },

    // Default value (!= NumericField)
    _min: 0,
    _max: 100,
    _decimalDigits: 0,

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Define if the numeric field should be displayed.
     *
     * @property fieldVisible
     * @type Boolean
     * @default: true
     */
    _fieldVisible: true,

    isFieldVisible: function () {
        return this._fieldVisible;
    },

    setFieldVisible: function (fieldVisible) {
        this._fieldVisible = fieldVisible;

        if (fieldVisible) {
            this.__html.field.style.display = "";
            this.removeClass("photonui-slider-nofield");
        } else {
            this.__html.field.style.display = "none";
            this.addClass("photonui-slider-nofield");
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
    getHtml: function () {
        // Hack: force grip position after insertion into the DOM...
        setTimeout(function () {
            this.value = this.value;
        }.bind(this), 10);

        return this.__html.outer;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Update the value in the html field.
     *
     * @method _updateFieldValue
     * @private
     */
    _updateFieldValue: function () {
        this.$super();
        var v = this.value - this.min;
        var m = this.max - this.min;
        var p = Math.min(Math.max(v / m, 0), 1);
        this.__html.grip.style.left = "calc(" + Math.floor(p * 100) + "% - " +
                                      Math.floor(this.__html.grip.offsetWidth * p) + "px)";
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.$super();

        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-slider photonui-widget-fixed-height";

        this.__html.slider = document.createElement("div");
        this.__html.slider.className = "photonui-slider-slider";
        this.__html.slider.tabIndex = 0;
        this.__html.outer.appendChild(this.__html.slider);

        this.__html.grip = document.createElement("div");
        this.__html.grip.className = "photonui-slider-grip";
        this.__html.slider.appendChild(this.__html.grip);

        this.__html.outer.appendChild(this.__html.field);
    },

    /**
     * Update the value form a mouse event occured on the slider.
     *
     * @method _updateFromMouseEvent
     * @private
     * @param event
     */
    _updateFromMouseEvent: function (event) {
        var wx = Helpers.getAbsolutePosition(this.__html.slider).x;
        var gw = this.__html.grip.offsetWidth;
        var x = Math.round(event.pageX - wx - gw / 2);
        var w = this.__html.slider.offsetWidth - gw - 3;
        var v = (this.max - this.min) * x / w + this.min;
        this.value = Math.round(v / this.step) * this.step;
        this._callCallbacks("value-changed", [this.value]);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onSliderMouseDown
     * @private
     * @param event
     */
    __onSliderMouseDown: function (event) {
        this._updateFromMouseEvent(event);
        this._bindEvent("slider-mousemove", document, "mousemove", this.__onSliderMouseMove.bind(this));
        this._bindEvent("slider-mouseup", document, "mouseup", this.__onSliderMouseUp.bind(this));
    },

    /**
     * @method __onSliderMouseMove
     * @private
     * @param event
     */
    __onSliderMouseMove: function (event) {
        this._updateFromMouseEvent(event);
    },

    /**
     * @method __onSliderMouseUp
     * @private
     * @param event
     */
    __onSliderMouseUp: function (event) {
        this._unbindEvent("slider-mousemove");
        this._unbindEvent("slider-mouseup");
        this._updateFromMouseEvent(event);
    },

    /*
     * @method __onSliderKeyPress
     * @private
     * @param event
     */
    __onSliderKeyDown: function (event) {
        if (event.keyCode == 38 || event.keyCode == 39) {  // Up, Right
            this.value += this.step;
            this._callCallbacks("value-changed", [this.value]);
        } else if (event.keyCode == 40 || event.keyCode == 37) {  // Down, Left
            this.value -= this.step;
            this._callCallbacks("value-changed", [this.value]);
        }
    },

    /**
     * @method __onSliderMouseWheel
     * @private
     * @param event
     */
    __onSliderMouseWheel: function (event) {
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
                this.value += this.step;
            } else {
                this.value -= this.step;
            }
            event.preventDefault();
            event.stopPropagation();
        }
        this._callCallbacks("value-changed", [this.value]);
    },

    /**
     * Called when the context menu should be displayed.
     *
     * @method __onContextMenu
     * @private
     * @param event
     */
    __onContextMenu: function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.contextMenuName) {
            this.contextMenu.popupXY(event.pageX, event.pageY);
        }
    },

    /**
     * @method __onFieldContextMenu
     * @private
     * @param event
     */
    __onFieldContextMenu: function (event) {
        event.stopPropagation();
    }
});

module.exports = Slider;

},{"../helpers.js":22,"./numericfield.js":28}],30:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var CheckBox = require("./checkbox.js");

/**
 * Switch.
 *
 * @class Switch
 * @constructor
 * @extends photonui.CheckBox
 */
var Switch = CheckBox.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this.removeClass("photonui-checkbox");
        this.addClass("photonui-switch");
    }
});

module.exports = Switch;

},{"./checkbox.js":24}],31:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var Field = require("./field.js");

/**
 * Multiline text field.
 *
 * @class TextAreaField
 * @constructor
 * @extends photonui.Field
 */
var TextAreaField = Field.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._bindFieldEvents();
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Number of columns.
     *
     * @property cols
     * @type Number
     * @default 20
     */
    getCols: function () {
        return parseInt(this.__html.field.cols);
    },

    setCols: function (cols) {
        this.__html.field.cols = cols;
    },

    /**
     * Number of rows.
     *
     * @property rows
     * @type Number
     * @default 3
     */
    getRows: function () {
        return parseInt(this.__html.field.rows);
    },

    setRows: function (rows) {
        this.__html.field.rows = rows;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.field = document.createElement("textarea");
        this.__html.field.className = "photonui-widget photonui-field photonui-textareafield";
        this.__html.field.cols = 20;
        this.__html.field.rows = 3;
    }
});

module.exports = TextAreaField;

},{"./field.js":27}],32:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var Field = require("./field.js");

/**
 * Text, Password, Email, Search, Tel, URL Fields.
 *
 * @class TextField
 * @constructor
 * @extends photonui.Field
 */
var TextField = Field.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._bindFieldEvents();
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Type of the field.
     *
     *   * text
     *   * password
     *   * email
     *   * search
     *   * tel
     *   * url
     *
     * @property type
     * @type String
     * @default text
     */
    getType: function () {
        return this.__html.field.type;
    },

    setType: function (type) {
        if (type != "text" &&
            type != "password" &&
            type != "email" &&
            type != "search" &&
            type != "tel" &&
            type != "url"
        ) {
            throw new Error("The type should be \"text\", \"password\", \"email\", \"search\", \"tel\" or \"url\".");
        }
        this.__html.field.type = type;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.field = document.createElement("input");
        this.__html.field.className = "photonui-widget photonui-field photonui-textfield";
        this.__html.field.type = "text";
    }
});

module.exports = TextField;

},{"./field.js":27}],33:[function(require,module,exports){
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
 * @submodule Interactive
 * @namespace photonui
 */

var CheckBox = require("./checkbox.js");
var Button = require("./button.js");

/**
 * Toogle Button.
 *
 * @class ToggleButton
 * @constructor
 * @extends photonui.CheckBox
 * @uses photonui.Button
 */
var ToggleButton = CheckBox.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["click"]);
        this.$super(params);
        this.__buttonInit();
        this.removeClass("photonui-checkbox");
        this.addClass("photonui-togglebutton");
        this.removeClass("photonui-widget-fixed-height");
        this.removeClass("photonui-widget-fixed-width");
    },

    // photonui.Button constructor (without the call to $super)
    __buttonInit: function () {
        // Bind js events
        this._bindEvent("click", this.__html.button, "click", this.__onButtonClicked.bind(this));

        // Update properties
        this._updateProperties(["text", "leftIconName", "rightIconName"]);
        this._update();
    },

    // Mixin
    __include__: [Button._buttonMixin],

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.$super();
        this._buildButtonHtml();
        this.__html.outer.appendChild(this.__html.button);
        this.__html.outer.removeChild(this.__html.span);
        this.__html.span = this.__html.button;
    }
});

module.exports = ToggleButton;

},{"./button.js":23,"./checkbox.js":24}],34:[function(require,module,exports){
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
 * @submodule Layout
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Layout = require("./layout.js");

/**
 * Vertical and horizontal box layout.
 *
 * Layout Options:
 *
 *     {
 *         align: <String (stretch|expand, start|left|top, center|middle, end|right|bottom), default=stretch>,
 *
 *         order: <Number default=null (auto)>
 *
 *         minWidth: <Number (null=auto), default=null>,
 *         maxWidth: <Number (null=auto), default=null>,
 *         width: <Number (null=auto), default=null>,
 *
 *         minHeight: <Number (null=auto), default=null>,
 *         maxHeight: <Number (null=auto), default=null>,
 *         height: <Number (null=auto), default=null>
 *     }
 *
 * @class BoxLayout
 * @constructor
 * @extends photonui.Layout
 */
var BoxLayout = Layout.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties(["orientation"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The layout orientation ("vertical" or "horizontal").
     *
     * @property orientation
     * @type String
     * @default "vertical"
     */
    _orientation: "vertical",

    getOrientation: function () {
        return this._orientation;
    },

    setOrientation: function (orientation) {
        if (orientation != "vertical" && orientation != "horizontal") {
            throw new Error("The orientation should be \"vertical\" or \"horizontal\".");
        }
        this._orientation = orientation;
        this.removeClass("photonui-layout-orientation-vertical");
        this.removeClass("photonui-layout-orientation-horizontal");
        this.addClass("photonui-layout-orientation-" + this.orientation);
        this._updateProperties(["spacing"]);
    },

    /**
     * Vertical padding (px).
     *
     * @property verticalPadding
     * @type Number
     * @default 0
     */
    _verticalPadding: 0,

    getVerticalPadding: function () {
        return this._verticalPadding;
    },

    setVerticalPadding: function (padding) {
        this._verticalPadding = padding | 0;
        this.__html.outerbox.style.paddingLeft = this._verticalPadding + "px";
        this.__html.outerbox.style.paddingRight = this._verticalPadding + "px";
    },

    /**
     * Horizontal padding (px).
     *
     * @property horizontalPadding
     * @type Number
     * @default 0
     */
    _horizontalPadding: 0,

    getHorizontalPadding: function () {
        return this._horizontalPadding;
    },

    setHorizontalPadding: function (padding) {
        this._horizontalPadding = padding | 0;
        this.__html.outerbox.style.paddingTop = this._horizontalPadding + "px";
        this.__html.outerbox.style.paddingBottom = this._horizontalPadding + "px";
    },

    /**
     * Spacing between children widgets.
     *
     * @property spacing
     * @type Number
     * @default 5
     */
    _spacing: 5,

    getSpacing: function () {
        return this._spacing;
    },

    setSpacing: function (spacing) {
        this._spacing = spacing | 0;

        var children = this.children;
        var nodes = this.__html.outerbox.childNodes;
        var last = 0;
        var lastOrder;
        var currentOrder;
        for (var i = 0 ; i < nodes.length ; i++) {
            lastOrder = 0;
            currentOrder = 0;
            if (children[last] && children[last].layoutOptions && children[last].layoutOptions.order) {
                lastOrder = children[last].layoutOptions.order | 0;
            }
            if (children[i] && children[i].layoutOptions && children[i].layoutOptions.order) {
                currentOrder = children[i].layoutOptions.order | 0;
            }

            if (currentOrder >= lastOrder) {
                last = i;
            }

            if (this.orientation == "horizontal") {
                nodes[i].style.marginRight = this._spacing + "px";
                nodes[i].style.marginBottom = "";
            } else {
                nodes[i].style.marginRight = "";
                nodes[i].style.marginBottom = this._spacing + "px";
            }
        }

        if (nodes.length > 0) {
            nodes[last].style.marginRight = "";
            nodes[last].style.marginBottom = "";
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
    getHtml: function () {
        return this.__html.outerbox;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outerbox = document.createElement("div");
        this.__html.outerbox.className = "photonui-widget photonui-boxlayout";
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function () {
        Helpers.cleanNode(this.__html.outerbox);

        var fragment = document.createDocumentFragment();
        var children = this.children;

        var container = null;
        for (var i = 0 ; i < children.length ; i++) {
            var options = this._computeLayoutOptions(children[i]);

            container = document.createElement("div");
            container.className = "photonui-container photonui-boxlayout-item";

            // layout option: align
            container.className += " photonui-layout-align-" + options.align;

            // layout options: order
            if (options.order !== null) {
                container.style.order = options.order;
            }

            // layout options: *width
            if (options.minWidth !== null) {
                container.style.minWidth = options.minWidth + "px";
            }
            if (options.maxWidth !== null) {
                container.style.maxWidth = options.maxWidth + "px";
            }
            if (options.width !== null) {
                container.style.width = options.width + "px";
            }

            // layout options: *height
            if (options.minHeight !== null) {
                container.style.minHeight = options.minHeight + "px";
            }
            if (options.maxHeight !== null) {
                container.style.maxHeight = options.maxHeight + "px";
            }
            if (options.height !== null) {
                container.style.height = options.height + "px";
            }

            container.appendChild(children[i].html);
            fragment.appendChild(container);
        }

        this.__html.outerbox.appendChild(fragment);

        this._updateProperties(["spacing"]);
    },

    /**
     * Returns a normalized layoutOption for a given widget.
     *
     * @method _computeLayoutOptions
     * @private
     * @param {photonui.Widget} widget
     * @return {Object} the layout options
     */
    _computeLayoutOptions: function (widget) {
        var woptions = widget.layoutOptions || {};

        var options = {
            align: "stretch",
            minWidth: null,
            maxWidth: null,
            width: null,
            minHeight: null,
            maxHeight: null,
            height: null,
            order: null
        };

        // align
        if (["stretch", "expand"].indexOf(woptions.align) > -1) {
            options.align = "stretch";
        } else if (["center", "middle"].indexOf(woptions.align) > -1) {
            options.align = "center";
        } else if (["start", "begin", "top", "left"].indexOf(woptions.align) > -1) {
            options.align = "start";
        } else if (["end", "bottom", "right"].indexOf(woptions.align) > -1) {
            options.align = "end";
        }

        // order
        if (woptions.order !== undefined && woptions.order !== null) {
            options.order = woptions.order | 0;
        }

        // *width
        if (woptions.minWidth !== undefined && woptions.minWidth !== null) {
            options.minWidth = woptions.minWidth | 0;
        }
        if (woptions.maxWidth !== undefined && woptions.maxWidth !== null) {
            options.maxWidth = woptions.maxWidth | 0;
        }
        if (woptions.width !== undefined && woptions.width !== null) {
            options.width = woptions.width | 0;
            options.minWidth = woptions.width | 0;
            options.maxWidth = woptions.width | 0;
        }

        // *height
        if (woptions.minHeight !== undefined && woptions.minHeight !== null) {
            options.minHeight = woptions.minHeight | 0;
        }
        if (woptions.maxHeight !== undefined && woptions.maxHeight !== null) {
            options.maxHeight = woptions.maxHeight | 0;
        }
        if (woptions.height !== undefined && woptions.height !== null) {
            options.height = woptions.height | 0;
            options.minHeight = woptions.height | 0;
            options.maxHeight = woptions.height | 0;
        }

        return options;
    }
});

module.exports = BoxLayout;

},{"../helpers.js":22,"./layout.js":37}],35:[function(require,module,exports){
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
 * @submodule Layout
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Layout = require("./layout.js");

/**
 * Fluid Layout.
 *
 * @class FluidLayout
 * @constructor
 * @extends photonui.Layout
 */
var FluidLayout = Layout.$extend({

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The vertical spacing between children widgets.
     *
     * @property verticalSpacing
     * @type Number
     * @default 0
     */
    _verticalSpacing: 0,

    getVerticalSpacing: function () {
        return this._verticalSpacing;
    },

    setVerticalSpacing: function (verticalSpacing) {
        this._verticalSpacing = verticalSpacing;
        this._updateLayout();
    },

    /**
     * The horizontal spacing between children widgets.
     *
     * @property horizontalSpacing
     * @type Number
     * @default 2
     */
    _horizontalSpacing: 2,

    getHorizontalSpacing: function () {
        return this._horizontalSpacing;
    },

    setHorizontalSpacing: function (horizontalSpacing) {
        this._horizontalSpacing = horizontalSpacing;
        this._updateLayout();
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.outerbox;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outerbox = document.createElement("div");
        this.__html.outerbox.className = "photonui-widget photonui-fluidlayout";
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function () {
        var children = this.children;
        var fragment = document.createDocumentFragment();

        var div = null;
        for (var i = 0 ; i < children.length ; i++) {
            div = document.createElement("div");
            div.className = "photonui-container";
            div.style.padding = "0 " + this.horizontalSpacing + "px " + this.verticalSpacing + "px 0";
            div.appendChild(children[i].html);
            fragment.appendChild(div);
        }

        Helpers.cleanNode(this.__html.outerbox);
        this.__html.outerbox.appendChild(fragment);
    }
});

module.exports = FluidLayout;

},{"../helpers.js":22,"./layout.js":37}],36:[function(require,module,exports){
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
 * @submodule Layout
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Layout = require("./layout.js");

var _sizingHackEnabled = null;

/**
 * Grid layout.
 *
 * Layout Options:
 *
 *     {
 *          x: <Number, default: 0>,
 *          y: <Number, default: 0>,
 *          cols: <Number, default: 1>,
 *          rows: <Number, default: 1>,
 *
 *          horizontalAlign: <String (stretch|expand, start|left, center, end|right), default: stretch>,
 *          verticalAlign: <String (stretch|expand, start|top, center|middle, end|bottom), default: stretch>,
 *
 *          minWidth: <Number, default: null>,
 *          maxWidth: <Number, default: null>,
 *          width: <Number, default: null>,
 *
 *          minHeight: <Number, default: null>,
 *          maxHeight: <Number, default: null>,
 *          height: <Number, default: null>,
 *     }
 *
 * @class GridLayout
 * @constructor
 * @extends photonui.Layout
 */
var GridLayout = Layout.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties(["verticalSpacing"]);

        // XXX Sizing Hack
        if (window.MutationObserver) {
            this.__sizinghack_observer = new MutationObserver(this._sizingHack.bind(this));
            this.__sizinghack_observer_params = {attributes: true, childList: true, characterData: true, subtree: true};
            this.__sizinghack_observer.observe(this.__html.gridBody, this.__sizinghack_observer_params);
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Vertical padding (px).
     *
     * @property verticalPadding
     * @type Number
     * @default 0
     */
    _verticalPadding: 0,

    getVerticalPadding: function () {
        return this._verticalPadding;
    },

    setVerticalPadding: function (padding) {
        this._verticalPadding = padding | 0;
        this._updatingLayout = true;
        this.__html.outerbox.style.paddingLeft = this._verticalPadding + "px";
        this.__html.outerbox.style.paddingRight = this._verticalPadding + "px";
        this._updatingLayout = false;
        this._sizingHack();
    },

    /**
     * Horizontal padding (px).
     *
     * @property horizontalPadding
     * @type Number
     * @default 0
     */
    _horizontalPadding: 0,

    getHorizontalPadding: function () {
        return this._horizontalPadding;
    },

    setHorizontalPadding: function (padding) {
        this._horizontalPadding = padding | 0;
        this._updatingLayout = true;
        this.__html.outerbox.style.paddingTop = this._horizontalPadding + "px";
        this.__html.outerbox.style.paddingBottom = this._horizontalPadding + "px";
        this._updatingLayout = false;
        this._sizingHack();
    },

    /**
     * The vertical spacing between children widgets.
     *
     * @property verticalSpacing
     * @type Number
     * @default 5
     */
    _verticalSpacing: 5,

    getVerticalSpacing: function () {
        return this._verticalSpacing;
    },

    setVerticalSpacing: function (verticalSpacing) {
        this._verticalSpacing = verticalSpacing;
        //this._updatingLayout = true;
        //this._updateSpacing();
        //this._updatingLayout = false;
        //this._sizingHack();
        this._updateLayout();
    },

    /**
     * The horizontal spacing between children widgets.
     *
     * @property horizontalSpacing
     * @type Number
     * @default 5
     */
    _horizontalSpacing: 5,

    getHorizontalSpacing: function () {
        return this._horizontalSpacing;
    },

    setHorizontalSpacing: function (horizontalSpacing) {
        this._horizontalSpacing = horizontalSpacing;
        //this._updatingLayout = true;
        //this._updateSpacing();
        //this._updatingLayout = false;
        //this._sizingHack();
        this._updateLayout();
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.outerbox;
    },

    // ====== Public properties ======

    /**
     * Flag to indicate that the layout is actually been updated.
     *
     * @property _updatingLayout
     * @private
     * @type Boolean
     * @default false
     */
    _updatingLayout: false,

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        if (visibility) {
            this._sizingHack();
        }
        this.$super(visibility);
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outerbox = document.createElement("div");
        this.__html.outerbox.className = "photonui-widget photonui-gridlayout";

        this.__html.grid = document.createElement("table");
        this.__html.outerbox.appendChild(this.__html.grid);

        this.__html.gridBody = document.createElement("tbody");
        this.__html.grid.appendChild(this.__html.gridBody);
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function () {
        this._updatingLayout = true;
        if (this.__sizinghack_observer) {  // XXX
            this.__sizinghack_observer.disconnect();
        }

        var children = this.children;

        // Determine the grid geometry (min x, min y, max x, max y)
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;

        var options;
        for (var i = 0 ; i < children.length ; i++) {
            options = this._computeLayoutOptions(children[i]);
            minX = Math.min(options.x, minX);
            minY = Math.min(options.y, minY);
            maxX = Math.max(options.x, maxX);
            maxY = Math.max(options.y, maxY);
            maxX = Math.max(options.x + options.cols - 1, maxX);
            maxY = Math.max(options.y + options.rows - 1, maxY);
        }

        var gridWidth = maxX - minX + 1;
        var gridHeight = maxY - minY + 1;

        // Clean
        this.__html.grid.removeChild(this.__html.gridBody);
        Helpers.cleanNode(this.__html.gridBody);

        // Build the layout
        var that = this;
        function _findWidgetAt(x, y) {
            var options;
            for (var i = 0 ; i < children.length ; i++) {
                options = that._computeLayoutOptions(children[i]);
                if (options.x == x && options.y == y) {
                    return {w: children[i], o: options};
                }
            }
            return null;
        }

        var map = [];
        for (var y = 0 ; y < gridHeight ; y++) {
            map[y] = [];
            map[y].length = gridWidth;
        }

        var child;
        var tr;
        var td;
        var div;
        var cellX;
        var cellY;
        for (y = 0 ; y < gridHeight ; y++) {
            tr = document.createElement("tr");
            for (var x = 0 ; x < gridWidth ; x++) {
                if (map[y][x]) {
                    continue;
                }

                td = document.createElement("td");
                td.className = "photonui-gridlayout-cell";
                div = document.createElement("div");
                div.className = "photonui-container photonui-gridlayout-wrapper";
                td.appendChild(div);
                tr.appendChild(td);

                child = _findWidgetAt(x + minX, y + minY);
                if (child) {
                    div.appendChild(child.w.html);

                    // Spacing exceptions
                    var horizontalSpacing = this.horizontalSpacing;
                    var verticalSpacing = this.verticalSpacing;
                    if (x + child.o.cols >= gridWidth) {
                        td.className += " photonui-gridlayout-lastcol";
                        verticalSpacing = 0;
                    }
                    if (y + child.o.rows >= gridHeight) {
                        td.className += " photonui-gridlayout-lastrow";
                        horizontalSpacing = 0;
                    }

                    // layout options: vertical/horizontal Align
                    td.className += " photonui-layout-verticalalign-" + child.o.verticalAlign;
                    td.className += " photonui-layout-horizontalalign-" + child.o.horizontalAlign;

                    // layout options: *width
                    if (child.o.minWidth !== null) {
                        div.style.minWidth = child.o.minWidth + "px";
                        td.style.minWidth = (child.o.minWidth + verticalSpacing) + "px";
                    }
                    if (child.o.maxWidth !== null) {
                        div.style.maxWidth = child.o.maxWidth + "px";
                        td.style.maxWidth = (child.o.maxWidth + verticalSpacing) + "px";
                    }
                    if (child.o.width !== null) {
                        div.style.width = child.o.width + "px";
                        td.style.width = (child.o.width + verticalSpacing) + "px";
                    }

                    // layout options: *height
                    if (child.o.minHeight !== null) {
                        div.style.minHeight = child.o.minHeight + "px";
                        td.style.minHeight = (child.o.minHeight + horizontalSpacing) + "px";
                    }
                    if (child.o.maxHeight !== null) {
                        div.style.maxHeight = child.o.maxHeight + "px";
                        td.style.maxHeight = (child.o.maxHeight + horizontalSpacing) + "px";
                    }
                    if (child.o.height !== null) {
                        div.style.height = child.o.height + "px";
                        td.style.height = (child.o.height + horizontalSpacing) + "px";
                    }

                    // rowspan / colspan
                    if (child.o.cols > 1 || child.o.rows > 1) {
                        td.colSpan = child.o.cols;
                        td.rowSpan = child.o.rows;

                        for (cellY = y ; cellY < y + child.o.rows ; cellY++) {
                            for (cellX = x ; cellX < x + child.o.cols ; cellX++) {
                                map[cellY][cellX] = true;
                            }
                        }
                    }

                }
            }
            this.__html.gridBody.appendChild(tr);
        }

        // Attach nodes to the DOM
        this.__html.grid.appendChild(this.__html.gridBody);

        //
        this._updateSpacing();
        this._updatingLayout = false;
        if (this.__sizinghack_observer) {  // XXX
            this.__sizinghack_observer.observe(this.__html.gridBody, this.__sizinghack_observer_params);
        }
        this._sizingHack();
    },

    /**
     * Returns a normalized layoutOption for a given widget.
     *
     * @method _computeLayoutOptions
     * @private
     * @param {photonui.Widget} widget
     * @return {Object} the layout options
     */
    _computeLayoutOptions: function (widget) {
        var woptions = widget.layoutOptions || {};

        var options = {
            x: 0,
            y: 0,
            cols: 1,
            rows: 1,
            verticalAlign: "stretch",
            horizontalAlign: "stretch",
            minWidth: null,
            maxWidth: null,
            width: null,
            minHeight: null,
            maxHeight: null,
            height: null
        };

        if (widget.html) {
            if (widget.html.classList.contains("photonui-widget-fixed-height")) {
                options.verticalAlign = "center";
            }
            if (widget.html.classList.contains("photonui-widget-fixed-width")) {
                options.horizontalAlign = "center";
            }
        }

        // [Compatibility with old GridLayout] position / place
        if (woptions.gridX !== undefined && woptions.gridX !== null) {
            options.x = woptions.gridX | 0;
        }
        if (woptions.gridY !== undefined && woptions.gridY !== null) {
            options.y = woptions.gridY | 0;
        }
        if (woptions.gridWidth !== undefined && woptions.gridWidth !== null) {
            options.cols = woptions.gridWidth | 0;
        }
        if (woptions.gridHeight !== undefined && woptions.gridHeight !== null) {
            options.rows = woptions.gridHeight | 0;
        }

        // position / place
        if (woptions.x !== undefined && woptions.x !== null) {
            options.x = woptions.x | 0;
        }
        if (woptions.y !== undefined && woptions.y !== null) {
            options.y = woptions.y | 0;
        }
        if (woptions.cols !== undefined && woptions.cols !== null) {
            options.cols = woptions.cols | 0;
        }
        if (woptions.rows !== undefined && woptions.rows !== null) {
            options.rows = woptions.rows | 0;
        }

        // verticalAlign
        if (["stretch", "expand"].indexOf(woptions.verticalAlign) > -1) {
            options.verticalAlign = "stretch";
        } else if (["center", "middle"].indexOf(woptions.verticalAlign) > -1) {
            options.verticalAlign = "center";
        } else if (["start", "begin", "top"].indexOf(woptions.verticalAlign) > -1) {
            options.verticalAlign = "start";
        } else if (["end", "bottom"].indexOf(woptions.verticalAlign) > -1) {
            options.verticalAlign = "end";
        }

        // horizontalAlign
        if (["stretch", "expand"].indexOf(woptions.horizontalAlign) > -1) {
            options.horizontalAlign = "stretch";
        } else if (["center", "middle"].indexOf(woptions.horizontalAlign) > -1) {
            options.horizontalAlign = "center";
        } else if (["start", "begin", "left"].indexOf(woptions.horizontalAlign) > -1) {
            options.horizontalAlign = "start";
        } else if (["end", "right"].indexOf(woptions.horizontalAlign) > -1) {
            options.horizontalAlign = "end";
        }

        // [Compatibility with old GridLayout] horizontalAlign / verticalAlign
        if (woptions.verticalExpansion === true) {
            options.verticalAlign = "stretch";
        } else if (woptions.verticalExpansion === false) {
            if (woptions.verticalAlign === undefined) {
                options.verticalAlign = "center";
            }
        }
        if (woptions.horizontalExpansion === true) {
            options.horizontalAlign = "stretch";
        } else if (woptions.horizontalExpansion === false) {
            if (woptions.horizontalAlign === undefined) {
                options.horizontalAlign = "center";
            }
        }

        // *width
        if (woptions.minWidth !== undefined && woptions.minWidth !== null) {
            options.minWidth = woptions.minWidth | 0;
        }
        if (woptions.maxWidth !== undefined && woptions.maxWidth !== null) {
            options.maxWidth = woptions.maxWidth | 0;
        }
        if (woptions.width !== undefined && woptions.width !== null) {
            options.width = woptions.width | 0;
            options.minWidth = woptions.width | 0;
            options.maxWidth = woptions.width | 0;
        }

        // *height
        if (woptions.minHeight !== undefined && woptions.minHeight !== null) {
            options.minHeight = woptions.minHeight | 0;
        }
        if (woptions.maxHeight !== undefined && woptions.maxHeight !== null) {
            options.maxHeight = woptions.maxHeight | 0;
        }
        if (woptions.height !== undefined && woptions.height !== null) {
            options.height = woptions.height | 0;
            options.minHeight = woptions.height | 0;
            options.maxHeight = woptions.height | 0;
        }

        return options;
    },

    /**
     * Update the spacing between widgets
     *
     * @method _updateSpacing
     * @private
     */
    _updateSpacing: function () {
        var nodes = this.__html.outerbox.querySelectorAll("#" + this.name + " > table > tbody > tr > td");
        for (var i = 0 ; i < nodes.length ; i++) {
            nodes[i].style.paddingRight = this._verticalSpacing + "px";
            nodes[i].style.paddingBottom = this._horizontalSpacing + "px";
        }
    },

    /**
     * Hack to get thing working with Gecko and Trident.
     *
     * MSIE 11:
     *
     *   * The hack fixes all the issues,
     *
     * MSIE 10:
     *
     *   * There is issues with rowspan
     *   * The dynamic resizing does not works
     *
     * Firefox:
     *
     *   * There is some minor issues with rowspan
     *
     * @method _sizingHack
     * @private
     */
    _sizingHack: function () {
        if (this._updatingLayout) {
            return;
        }

        // Automatically disable the hack for webkit browsers
        if (_sizingHackEnabled === false) {
            return;
        } else if (_sizingHackEnabled === null) {
            var isWebkit = false;
            if ("WebkitAppearance" in document.documentElement.style) {
                isWebkit = true;
            }
            if ("WebKitCSSMatrix" in window) {
                isWebkit = true;
            }
            if (isWebkit) {
                _sizingHackEnabled = false;
                return;
            } else {
                _sizingHackEnabled = true;
            }
        }

        this._updatingLayout = true;
        if (this.__sizinghack_observer) {
            this.__sizinghack_observer.disconnect();
        }

        function _hack() {
            function _size(node) {
                var tdHeight;
                if (node.style.minHeight && node.style.minHeight == node.style.maxHeight) {
                    tdHeight = parseFloat(node.style.minHeight);
                } else if (node.classList.contains("photonui-gridlayout-lastrow")) {
                    tdHeight = node.offsetHeight;
                } else {
                    tdHeight = node.offsetHeight;
                }
                node.style.height = tdHeight + "px";
            }

            var nodes = this.__html.outerbox.querySelectorAll("#" + this.name + " > table > tbody > tr > td");

            // 1st pass -> height: auto
            for (var i = 0 ; i < nodes.length ; i++) {
                nodes[i].style.height = "auto";
            }

            // 2nd pass -> fixed height for all td where rowspan = 1
            for (i = 0 ; i < nodes.length ; i++) {
                if (nodes[i].rowSpan && nodes[i].rowSpan > 1) {
                    continue;
                }
                _size(nodes[i]);
            }

            // 3rd pass -> fixed height for all td where rowspan > 1
            for (i = 0 ; i < nodes.length ; i++) {
                if ((!nodes[i].rowSpan) || nodes[i].rowSpan <= 1) {
                    continue;
                }
                _size(nodes[i]);
            }

            this._updatingLayout = false;
            if (this.__sizinghack_observer) {
                this.__sizinghack_observer.observe(this.__html.gridBody, this.__sizinghack_observer_params);
            }
        }

        setTimeout(_hack.bind(this), 1);
    }
});

module.exports = GridLayout;

},{"../helpers.js":22,"./layout.js":37}],37:[function(require,module,exports){
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
 * @submodule Layout
 * @namespace photonui
 */

var Widget = require("../widget.js");
var Container = require("../container/container.js");

/**
 * Base class for layout.
 *
 * @class Layout
 * @constructor
 * @extends photonui.Container
 */
var Layout = Container.$extend({

    // Constructor
    __init__: function (params) {
        this._childrenNames = [];  // new instance
        this.$super(params);

        // Force to update the parent of the children
        var children = this.children;
        for (var i = 0 ; i < children.length ; i++) {
            children[i]._parentName = this.name;
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Layout children widgets name.
     *
     * @property childrenNames
     * @type Array
     * @default []
     */
    _childrenNames: [],

    getChildrenNames: function () {
        return this._childrenNames;
    },

    setChildrenNames: function (childrenNames) {
        var i;
        var widget;
        for (i = 0 ; i < this._childrenNames.length ; i++) {
            widget = Widget.getWidget(this._childrenNames[i]);
            var index = this._childrenNames.indexOf(widget.name);
            if (index >= 0) {
                widget._parentName = null;
            }
        }
        this._childrenNames = [];
        for (i = 0 ; i < childrenNames.length ; i++) {
            widget = Widget.getWidget(childrenNames[i]);
            if (widget) {
                if (widget.parent) {
                    widget.unparent();
                }
                this._childrenNames.push(widget.name);
                widget._parentName = this.name;
            }
        }
        this._updateLayout();
    },

    /**
     * Layout children widgets.
     *
     * @property children
     * @type Array
     * @default []
     */
    getChildren: function () {
        var children = [];
        var widget;
        for (var i = 0 ; i < this._childrenNames.length ; i++) {
            widget = Widget.getWidget(this._childrenNames[i]);
            if (widget instanceof Widget) {
                children.push(widget);
            }
        }
        return children;
    },

    setChildren: function (children) {
        var childrenNames = [];
        for (var i = 0 ; i < children.length ; i++) {
            if (children[i] instanceof Widget) {
                childrenNames.push(children[i].name);
            }
        }
        this.childrenNames = childrenNames;
    },

    // Override getChildName / setChildName / getChild / setChild

    getChildName: function () {
        return null;
    },

    setChildName: function (childName) {
        this.childrenNames = [childName];
    },

    getChild: function () {
        return null;
    },

    setChild: function (child) {
        this.children = [child];
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Add a widget to the layout.
     *
     * @method addChild
     * @param {photonui.Widget} widget The widget to add.
     * @param {Object} layoutOption Specific option for the layout (optional).
     */
    addChild: function (widget, layoutOptions) {
        if (widget.parent) {
            widget.unparent();
        }
        if (layoutOptions) {
            widget.layoutOptions = layoutOptions;
        }
        this._childrenNames.push(widget.name);
        widget._parentName = this.name;
        this._updateLayout();
    },

    /**
     * Remove a widget from the layout.
     *
     * @method removeChild
     * @param {photonui.Widget} widget The widget to remove.
     */
    removeChild: function (widget) {
        var index = this._childrenNames.indexOf(widget.name);
        if (index >= 0) {
            this._childrenNames.splice(index, 1);
            widget._parentName = null;
        }
        this._updateLayout();
    },

    /**
     * Destroy all children of the layout
     *
     * @method empty
     */
    empty: function () {
        this._lockUpdate(true);

        var children = this.children;
        for (var i = 0 ; i < children.length ; i++) {
            if (children[i]) {
                children[i].destroy();
            }
        }

        this._lockUpdate(false);
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        this.empty();
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Lock the update of the layout.
     *
     * @method _lockUpdate
     * @private
     */
    _lockUpdate: function (lock) {
        if (lock) {
            this.__lockedUpdateLayout = this._updateLayout;
            this._updateLayout = function () {};
        } else {
            this._updateLayout = this.__lockedUpdateLayout;
            delete this.__lockedUpdateLayout;
            this._updateLayout();
        }
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function () {
        throw new Error("you should define the _updateLayout() method when you extend a layout widget.");
    },

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        var children = this.children;
        for (var i = 0 ; i < children.length ; i++) {
            if (!(this.child instanceof Widget)) {
                continue;
            }
            children[i]._visibilityChanged(visibility);
        }
        this.$super(visibility);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // pass
    }
});

module.exports = Layout;

},{"../container/container.js":14,"../widget.js":56}],38:[function(require,module,exports){
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
 * @submodule Layout
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Layout = require("./layout.js");

/**
 * Menu.
 *
 * @class Menu
 * @constructor
 * @extends photonui.Layout
 */
var Menu = Layout.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties(["iconVisible"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Define if icon on menu items are visible.
     *
     * @property iconVisible
     * @type Boolean
     * @default: true
     */
    _iconVisible: true,

    isIconVisible: function () {
        return this._iconVisible;
    },

    setIconVisible: function (iconVisible) {
        this._iconVisible = iconVisible;
        if (iconVisible) {
            this.__html.outer.classList.remove("photonui-menu-noicon");
        } else {
            this.__html.outer.classList.add("photonui-menu-noicon");
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
    getHtml: function () {
        return this.__html.outer;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-menu photonui-menu-style-default";
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function () {
        // Detache the outer element from the document tree
        //TODO

        // Clean
        Helpers.cleanNode(this.__html.outer);

        // Append children
        var children = this.children;
        for (var i = 0 ; i < children.length ; i++) {
            this.__html.outer.appendChild(children[i].html);
        }

        // Attache the outer element into the document tree
        // TODO
    }
});

module.exports = Menu;

},{"../helpers.js":22,"./layout.js":37}],39:[function(require,module,exports){
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
 * Authored by: Fabien LOISON <https://github.com/flozz>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Layout
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Layout = require("./layout.js");
var TabItem = require("../container/tabitem.js");
var Widget = require("../widget.js");

/**
 * Tab Layout
 *
 * @class TabLayout
 * @constructor
 * @extends photonui.Layout
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var TabLayout = Layout.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents([]);
        this.$super(params);
        this._updateProperties(["activeTab", "tabsPosition", "padding"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Define the tabs position.
     *
     *   * top
     *   * bottom
     *   * left
     *   * right
     *
     * @property tabsPosition
     * @type String
     * @default "top"
     */
    _tabsPosition: "top",

    getTabsPosition: function () {
        return this._tabsPosition;
    },

    setTabsPosition: function (position) {
        if (["top", "bottom", "left", "right"].indexOf(position) < 0) {
            throw new Error("The tabs position should be \"top\", \"bottom\", \"left\" or \"right\".");
        }
        this._tabsPosition = position;
        this.removeClass("photonui-tablayout-tabposition-top");
        this.removeClass("photonui-tablayout-tabposition-bottom");
        this.removeClass("photonui-tablayout-tabposition-left");
        this.removeClass("photonui-tablayout-tabposition-right");
        this.addClass("photonui-tablayout-tabposition-" + position);
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.outer;
    },

    /**
     * Define the active tab name.
     *
     * @property activeTabName
     * @type String
     * @default null
     */
    _activeTabName: null,

    getActiveTabName: function () {
        return this._activeTabName;
    },

    setActiveTabName: function (tabName) {
        var activeTab = Widget.getWidget(tabName);
        if (activeTab instanceof TabItem) {
            activeTab.show();
            return;
        }

        if (!this._activeTab) {
            var children = this.children;
            for (var i = 0 ; i < children.length ; i++) {
                if (!(children[i] instanceof TabItem)) {
                    continue;
                }
                children[i].show();
                break;
            }
        }
    },

    /**
     * Container node padding.
     *
     * @property padding
     * @type Number
     * @default 10
     */
    _padding: 10,

    getPadding: function () {
        return this._padding;
    },

    setPadding: function (padding) {
        this._padding = padding;
        this.__html.content.style.padding = padding + "px";
    },

    /**
     * Define the active tab.
     *
     * @property activeTab
     * @type photonui.Widget
     * @default null
     */
    getActiveTab: function () {
        return Widget.getWidget(this.activeTabName);
    },

    setActiveTab: function (tab) {
        if (tab instanceof Widget) {
            this.activeTabName = tab.name;
        } else {
            this.activeTabName = null;
        }
    },

    //
    setChildrenNames: function (childrenNames) {
        this.$super(childrenNames);
        if (!this.activeTabName) {
            this.activeTabName = null;
        }
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    addChild: function (widget, layoutOptions) {
        this.$super(widget, layoutOptions);
        if (!this.activeTabName && widget instanceof TabItem) {
            this.activeTabName = widget.name;
        }
    },

    /**
     * Remove a widget from the layout.
     *
     * @method removeChild
     * @param {photonui.Widget} widget The widget to remove.
     */
    removeChild: function (widget) {
        this.$super(widget);
        if (widget === this.activeTab) {
            this.activeTabName = null;
        }
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-tablayout";

        this.__html.inner = document.createElement("div");
        this.__html.inner.className = "photonui-tablayout-innerbox";
        this.__html.outer.appendChild(this.__html.inner);

        this.__html.tabs = document.createElement("div");
        this.__html.tabs.className = "photonui-tablayout-tabs";
        this.__html.inner.appendChild(this.__html.tabs);

        this.__html.content = document.createElement("div");
        this.__html.content.className = "photonui-tablayout-content";
        this.__html.inner.appendChild(this.__html.content);
    },

    /**
     * Update the layout.
     *
     * @method _updateLayout
     * @private
     */
    _updateLayout: function () {
        Helpers.cleanNode(this.__html.tabs);
        Helpers.cleanNode(this.__html.content);

        var children = this.children;  // Cache for perf
        var tabsFragment = document.createDocumentFragment();
        var contentFragment = document.createDocumentFragment();

        var options;
        for (var i = 0 ; i < children.length ; i++) {
            if (!(children[i] instanceof TabItem)) {
                continue;
            }

            options = this._computeLayoutOptions(children[i]);

            if (options.order !== null) {
                children[i].tabHtml.style.order = options.order;
            } else {
                children[i].tabHtml.style.order = 0;
            }

            tabsFragment.appendChild(children[i].tabHtml);
            contentFragment.appendChild(children[i].html);
        }

        this.__html.tabs.appendChild(tabsFragment);
        this.__html.content.appendChild(contentFragment);
    },

    /**
     * Returns a normalized layoutOption for a given widget.
     *
     * @method _computeLayoutOptions
     * @private
     * @param {photonui.Widget} widget
     * @return {Object} the layout options
     */
    _computeLayoutOptions: function (widget) {
        var woptions = widget.layoutOptions || {};

        var options = {
            order: null
        };

        if (woptions.order !== undefined && woptions.order !== null) {
            options.order = woptions.order | 0;
        }

        return options;
    }

});

module.exports = TabLayout;


},{"../container/tabitem.js":19,"../helpers.js":22,"../widget.js":56,"./layout.js":37}],40:[function(require,module,exports){
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

},{"../base.js":7,"keyboardjs":3}],41:[function(require,module,exports){
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

/**
 * Handle colors.
 *
 * wEvents:
 *
 *   * value-changed:
 *      - description: the selected color changed.
 *      - callback:    function(photonui.Color)
 *
 * @class Color
 * @constructor
 * @extends photonui.Base
 * @param {Object} * An object that can contain any property of the Color class (optional).
 */
var Color = Base.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["value-changed"]);
        if (typeof(params) == "object" && !Array.isArray(params)) {
            this.$super(params);
        } else {
            this.$super();
            if (typeof(params) == "string") {
                this.hexString = params;
            } else if (Array.isArray(params)) {
                this.setRGBA(params);
            } else if (arguments.length >= 3) {
                this.setRGBA.apply(this, arguments);
            }
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The color in HTML RGB hexadecimal format (e.g. "#FF0000").
     *
     * @property hexString
     * @type String
     */
    getHexString: function () {
        var r = this.red.toString(16).toUpperCase();
        if (r.length == 1) {
            r = "0" + r;
        }
        var g = this.green.toString(16).toUpperCase();
        if (g.length == 1) {
            g = "0" + g;
        }
        var b = this.blue.toString(16).toUpperCase();
        if (b.length == 1) {
            b = "0" + b;
        }
        return "#" + r + g + b;
    },

    setHexString: function (value) {
        value = value.replace(" ", "");
        // #FF0000
        if (value.match(/^#[0-9a-f]{6}$/i)) {
            this._red = parseInt(value[1] + value[2], 16);
            this._green = parseInt(value[3] + value[4], 16);
            this._blue = parseInt(value[5] + value[6], 16);
            this._updateHSB();

        // #F00
        } else if (value.match(/^#[0-9a-f]{3}$/i)) {
            this._red = parseInt(value[1] + value[1], 16);
            this._green = parseInt(value[2] + value[2], 16);
            this._blue = parseInt(value[3] + value[3], 16);
            this._updateHSB();

        // Named colors
        } else {
            var colors = {
                white:   [0xFF, 0xFF, 0xFF],
                silver:  [0xC0, 0xC0, 0xC0],
                gray:    [0x80, 0x80, 0x80],
                black:   [0x00, 0x00, 0x00],
                red:     [0xFF, 0x00, 0x00],
                maroon:  [0x80, 0x00, 0x00],
                yellow:  [0xFF, 0xFF, 0x00],
                olive:   [0x80, 0x80, 0x00],
                lime:    [0x00, 0xFF, 0x00],
                green:   [0x00, 0x80, 0x00],
                aqua:    [0x00, 0xFF, 0xFF],
                teal:    [0x00, 0x80, 0x80],
                blue:    [0x00, 0x00, 0xFF],
                navy:    [0x00, 0x00, 0x80],
                fuchsia: [0xFF, 0x00, 0xFF],
                purple:  [0x80, 0x00, 0x80]
            };
            if (colors[value] !== undefined) {
                this.setRGB(colors[value]);
            }
        }

    },

    /**
     * The color in HTML RGB format (e.g. "rgb(255, 0, 0)").
     *
     * @property rgbString
     * @type String
     * @readOnly
     */
    getRgbString: function () {
        return "rgb(" + this._red + ", " + this._green + ", " + this._blue + ")";
    },

    /**
     * The color in HTML RGBA format (e.g. "rgba(255, 0, 0, 1.0)").
     *
     * @property rgbaString
     * @type String
     * @readOnly
     */
    getRgbaString: function () {
        return "rgba(" + this._red + ", " + this._green + ", " + this._blue + ", " + (this._alpha / 255) + ")";
    },

    /**
     * Red (0-255).
     *
     * @property red
     * @type Number
     */
    _red: 255,

    getRed: function () {
        return this._red;
    },

    setRed: function (red) {
        this._red = Math.max(0, Math.min(255, red | 0));
        this._updateHSB();
    },

    /**
     * Green (0-255).
     *
     * @property green
     * @type Number
     */
    _green: 0,

    getGreen: function () {
        return this._green;
    },

    setGreen: function (green) {
        this._green = Math.max(0, Math.min(255, green | 0));
        this._updateHSB();
    },

    /**
     * Blue (0-255).
     *
     * @property blue
     * @type Number
     */
    _blue: 0,

    getBlue: function () {
        return this._blue;
    },

    setBlue: function (blue) {
        this._blue = Math.max(0, Math.min(255, blue | 0));
        this._updateHSB();
    },

    /**
     * Alpha channel (0-255)
     *
     * @property alpha
     * @type Number
     */
    _alpha: 255,

    getAlpha: function () {
        return this._alpha;
    },

    setAlpha: function (alpha) {
        this._alpha = Math.max(0, Math.min(255, alpha | 0));
        this._callCallbacks("value-changed");
    },

    /**
     * Hue (0-360).
     *
     * @property hue
     * @type Number
     */
    _hue: 0,

    getHue: function () {
        return this._hue;
    },

    setHue: function (hue) {
        this._hue = Math.max(0, Math.min(360, hue | 0));
        this._updateRGB();
    },

    /**
     * Saturation (0-100).
     *
     * @property saturation
     * @type Number
     */
    _saturation: 100,

    getSaturation: function () {
        return this._saturation;
    },

    setSaturation: function (saturation) {
        this._saturation = Math.max(0, Math.min(100, saturation | 0));
        this._updateRGB();
    },

    /**
     * Brightness (0-100).
     *
     * @property brightness
     * @type Number
     */
    _brightness: 100,

    getBrightness: function () {
        return this._brightness;
    },

    setBrightness: function (brightness) {
        this._brightness = Math.max(0, Math.min(100, brightness | 0));
        this._updateRGB();
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Set RGB(A) color (alias for setRGBA).
     *
     * The params can also be replaced by an array.
     *
     * @method setRGB
     * @param {Number} red (0-255)
     * @param {Number} green (0-255)
     * @param {Number} blue (0-255)
     */
    setRGB: function () {
        this.setRGBA.apply(this, arguments);
    },

    /**
     * Set RGBA color.
     *
     * The params can also be replaced by an array.
     *
     * @method setRGBA
     * @param {Number} red (0-255)
     * @param {Number} green (0-255)
     * @param {Number} blue (0-255)
     * @param {Number} alpha (optional, 0-255)
     */
    setRGBA: function () {
        var args = arguments;
        if (arguments.length == 1 && Array.isArray(arguments[0])) {
            args = arguments[0];
        }
        if (args.length < 3) {
            return;
        }

        this._red = Math.max(0, Math.min(255, args[0] | 0));
        this._green = Math.max(0, Math.min(255, args[1] | 0));
        this._blue = Math.max(0, Math.min(255, args[2] | 0));
        if (args[3] !== undefined) {
            this._alpha = Math.max(0, Math.min(255, args[3] | 0));
        }

        this._updateHSB();
    },

    /**
     * Get RGB.
     *
     * @method getRGB
     * @return {Array} [red(0-255), green(0-255), blue(0-255)]
     */
    getRGB: function () {
        return [this._red, this._green, this._blue];
    },

    /**
     * Get RGBA.
     *
     * @method getRGBA
     * @return {Array} [red(0-255), green(0-255), blue(0-255), alpha(0-255)]
     */
    getRGBA: function () {
        return [this._red, this._green, this._blue, this._alpha];
    },

    /**
     * Set HSB color
     *
     * The params can also be replaced by an array.
     *
     * @method setHSB
     * @param {Number} hue (0-360)
     * @param {Number} saturation (0-100)
     * @param {Number} brightness (0-100)
     */
    setHSB: function () {
        var args = arguments;
        if (arguments.length == 1 && Array.isArray(arguments[0])) {
            args = arguments[0];
        }
        if (args.length != 3) {
            return;
        }

        this._hue = Math.max(0, Math.min(360, args[0] | 0));
        this._saturation = Math.max(0, Math.min(100, args[1] | 0));
        this._brightness = Math.max(0, Math.min(100, args[2] | 0));

        this._updateRGB();
    },

    toString: function () {
        return this.hexString;
    },

    // ====== Private methods ======

    /**
     * Update HSB from RGB.
     *
     * @method _updateHSB
     * @private
     */
    _updateHSB: function () {
        // http://fr.wikipedia.org/wiki/Teinte_Saturation_Valeur#Conversion_de_RVB_vers_TSV

        var r = this._red / 255;
        var g = this._green / 255;
        var b = this._blue / 255;

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);

        // Hue
        if (max == min) {
            this._hue = 0;
        } else if (max == r) {
            this._hue = Math.round((60 * (g - b) / (max - min) + 360) % 360);
        } else if (max == g) {
            this._hue = Math.round(60 * (b - r) / (max - min) + 120);
        } else if (max == b) {
            this._hue = Math.round(60 * (r - g) / (max - min) + 240);
        }

        // Saturation
        if (max === 0) {
            this._saturation = 0;
        } else {
            this._saturation = Math.round((1 - min / max) * 100);
        }

        // Brightness
        this._brightness = Math.round(max * 100);

        //
        this._callCallbacks("value-changed");
    },

    /**
     * Update RGB from HSB.
     *
     * @method _updateRGB
     * @private
     */
    _updateRGB: function () {
        // http://fr.wikipedia.org/wiki/Teinte_Saturation_Valeur#Conversion_de_TSV_vers_RVB

        var h = this.hue % 360;
        var s = this.saturation / 100;
        var b = this.brightness / 100;

        var ti = ((h / 60) | 0) % 6;
        var f = h / 60 - ti;
        var l = b * (1 - s);
        var m = b * (1 - f * s);
        var n = b * (1 - (1 - f) * s);

        switch (ti) {
            case 0:
                this._red = (b * 255) | 0;
                this._green = (n * 255) | 0;
                this._blue = (l * 255) | 0;
                break;
            case 1:
                this._red = (m * 255) | 0;
                this._green = (b * 255) | 0;
                this._blue = (l * 255) | 0;
                break;
            case 2:
                this._red = (l * 255) | 0;
                this._green = (b * 255) | 0;
                this._blue = (n * 255) | 0;
                break;
            case 3:
                this._red = (l * 255) | 0;
                this._green = (m * 255) | 0;
                this._blue = (b * 255) | 0;
                break;
            case 4:
                this._red = (n * 255) | 0;
                this._green = (l * 255) | 0;
                this._blue = (b * 255) | 0;
                break;
            case 5:
                this._red = (b * 255) | 0;
                this._green = (l * 255) | 0;
                this._blue = (m * 255) | 0;
                break;
        }

        this._callCallbacks("value-changed");
    }
});

module.exports = Color;

},{"../base.js":7}],42:[function(require,module,exports){
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

/**
 * Open files from the standard "FileOpen" dialog and drag & drop.
 *
 * wEvents:
 *
 *   * file-open:
 *      - description: File selected or dropped.
 *      - callback:    function(widget, fileBlob, x, y)  //(x=y=undefined if using a dialog)
 *
 * @class FileManager
 * @constructor
 * @extends photonui.Base
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var FileManager = Base.$extend({

    // Constructor
    __init__: function (params) {
        this.__fileField = document.createElement("input");
        this.__fileField.type = "file";
        this.__fileField.addEventListener("change", this.__onFileSelected.bind(this), false);
        this.__fileField.style.position = "fixed";
        this.__fileField.style.top = 0;
        this.__fileField.style.left = 0;
        this.__fileField.style.opacity = 0;
        this.__fileField.style.display = "none";
        document.getElementsByTagName("body")[0].appendChild(this.__fileField);
        this._acceptedMimes = [];
        this._acceptedExts = [];
        this._registerWEvents(["file-open"]);
        this.$super(params);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * List of the accepted mime types.
     *
     * @property acceptedMimes
     * @type Array
     * @default []
     */
    _acceptedMimes: [],

    getAcceptedMimes: function () {
        return this._acceptedMimes;
    },

    setAcceptedMimes: function (mimes) {
        this._acceptedMimes = mimes;
        this._updateAccepted();
    },

    /**
     * List of the accepted file extentions.
     *
     * @property acceptedExts
     * @type Array
     * @default []
     */
    _acceptedExts: [],

    getAcceptedExts: function () {
        return this._acceptedExts;
    },

    setAcceptedExts: function (exts) {
        this._acceptedExts = exts;
        this._updateAccepted();
    },

    /**
     * Element that accepts file drop (`null` disable d&d support).
     *
     * @property dropZone
     * @type HTMLElement
     * @default null
     */
    _dropZone: null,

    getDropZone: function () {
        return this._dropZone;
    },

    setDropZone: function (element) {
        // Unbind
        if (this._dropZone) {
            this._unbindEvent("document-dragover");
            this._unbindEvent("document-drop");
            this._unbindEvent("element-dragover");
            this._unbindEvent("element-drop");
        }

        this._dropZone = element;

        // Bind
        if (element) {
            this._bindEvent("document-dragover", document, "dragover", function (event) {
                event.preventDefault();
            });
            this._bindEvent("document-drop", document, "drop", function (event) {
                event.preventDefault();
            });
            this._bindEvent("element-dragover", document, "dragover", function (event) {});
            this._bindEvent("element-drop", document, "drop", this.__onFileDropped.bind(this));
        }
    },

    /**
     * Allow multiselect in FileOpen dialog.
     *
     * @property multiselect
     * @type Boolean
     * @default false
     */
    _multiselect: false,

    getMultiselect: function () {
        return this._multiselect;
    },

    setMultiselect: function (multiselect) {
        this._multiselect = multiselect;

        if (multiselect) {
            this.__fileField.multiple = "true";
        } else {
            delete this.__fileField.multiple;
        }
    },

    // ====== Private properties ======

    /**
     * The file field for opening the file dialog.
     *
     * @property __fileField
     * @private
     * @type HTMLElement
     */
    __fileField: null,

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Open the FileOpen dialog to allow user to browse its HDD for a file.
     *
     * @method open
     */
    open: function () {
        this.__fileField.style.display = "inline-block";
        this.__fileField.focus();
        this.__fileField.click();
        this.__fileField.style.display = "none";
    },

    /**
     * Destroy the class.
     *
     * @method destroy
     */
    destroy: function () {
        document.getElementsByTagName("body")[0].removeChild(this.__fileField);
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Update accepted mimes/extentions.
     *
     * @method _updateAccepted
     * @private
     */
    _updateAccepted: function () {
        var result = [];

        for (var i = 0 ; i < this.acceptedExts.length ; i++) {
            result.push("." + this.acceptedExts[i].toLocaleLowerCase());
        }

        result = result.concat(this.acceptedMimes);

        this.__fileField.accept = result.join(",");
    },

    /**
     * Check file and call callbacks.
     *
     * @method _openFile
     * @private
     * @param {File} file
     * @param {Number} x The x postition of the mouse (d&d only).
     * @param {Number} y The y postition of the mouse (d&d only).
     */
    _openFile: function (file, x, y) {
        var match = false;

        // Validate mime
        for (var m = 0 ; m < this.acceptedMimes.length ; m++) {
            if (file.type == this.acceptedMimes[m]) {
                match = true;
                break;
            }
        }

        // Validate ext
        if (!match) {
            var ext = file.name.split(".").splice(-1);
            for (var e = 0 ; e < this.acceptedExts.length ; e++) {
                if (ext == this.acceptedExts[e]) {
                    match = true;
                    break;
                }
            }
        }

        if (match) {
            this._callCallbacks("file-open", [file, x, y]);
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onFileDropped
     * @private
     * @param event
     */
    __onFileDropped: function (event) {
        for (var i in event.dataTransfer.files) {
            var file = event.dataTransfer.files[i];
            if (file instanceof File) {
                this._openFile(file, event.pageX, event.pageY);
            }
        }
    },

    /**
     * @method __onFileSelected
     * @private
     * @param event
     */
    __onFileSelected: function (event) {
        for (var i in this.__fileField.files) {
            var file = this.__fileField.files[i];
            if (file instanceof File) {
                this._openFile(file);
            }
        }
    },

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // pass
    }
});

module.exports = FileManager;

},{"../base.js":7}],43:[function(require,module,exports){
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
        return (this.pageX - ex) * this.scaleX;
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
        return (this.pageY - ey) * this.scaleY;
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
        this._stateMachine("mouse-down", event);
    },

    /**
     * @method __onMouseUp
     * @private
     * @param event
     */
    __onMouseUp: function (event) {
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

},{"../base.js":7,"../helpers.js":22,"../widget.js":56}],44:[function(require,module,exports){
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

var _spritesheets = {};

/**
 * Sprite sheet (to use with SpriteIcon).
 *
 * @class SpriteSheet
 * @constructor
 * @extends photonui.Base
 */
var SpriteSheet = Base.$extend({

    // Constructor
    __init__: function (params) {
        this._icons = {};
        this.$super(params);
        this._updateProperties(["name"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The sprit sheet name.
     *
     * @property name
     * @type String
     * @default "default"
     */
    _name: "default",

    getName: function () {
        return this._name;
    },

    setName: function (name) {
        if (_spritesheets[this.name] == this) {
            delete _spritesheets[this.name];
        }
        this._name = name;
        _spritesheets[this.name] = this;
    },

    /**
     * The spritesheet image URL.
     *
     * @property imageUrl
     * @type String
     * @default null
     */
    _imageUrl: null,

    getImageUrl: function () {
        return this._imageUrl;
    },

    setImageUrl: function (url) {
        if (!url) {
            this._imageUrl = null;
            return;
        }
        if (this._imageUrl != url) {
            this._imageUrl = url;
            // Preload
            var img = new Image();
            img.src = url;
        }
    },

    /**
     * Icon size (width = height).
     *
     * @property size
     * @type Number
     * @default 16
     */
    _size: 16,

    getSize: function () {
        return this._size;
    },

    setSize: function (size) {
        this._size = size;
    },

    /**
     * Icons.
     *
     *     {
     *          "iconName": [x, y],
     *          "icon2": [x2, y2],
     *          ...
     *     }
     *
     * @property icons
     * @type Object
     * @default: {}
     */
    _icons: {},

    getIcons: function () {
        return this._icons;
    },

    setIcons: function (icons) {
        for (var icon in icons) {
            this._icons[icon] = icons[icon];
        }
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Get icon position.
     *
     * @method getIconPosition
     * @param {String} iconName
     * @return {Object} `{x: Number, y: Number}`
     */
    getIconPosition: function (iconName) {
        return {x: this.icons[iconName][0], y: this.icons[iconName][1]};
    },

    /**
     * Get the right CSS for the given icon.
     *
     * @method getIconCss
     * @param {String} iconName
     * @return {String} the CSS.
     */
    getIconCss: function (iconName) {
        return "width: "      + this.size + "px; " +
               "height: "     + this.size + "px; " +
               "background: " + "url(" + this.imageUrl + ") " +
                                "-" + this.getIconPosition(iconName).x + "px " +
                                "-" + this.getIconPosition(iconName).y + "px;" ;
    },

    /**
     * Add an icon (set its position).
     *
     * @method addIcon
     * @param {String} iconName
     * @param {Number} x
     * @param {Number} y
     */
    addIcon: function (iconName, x, y) {
        this.icons = {iconName: [x, y]};
    },

    /**
     * Remove an icon.
     *
     * @method removeIcon
     * @param {String} iconName
     */
    removeIcon: function (iconName) {
        delete this._icons[iconName];
    }
});

/*
 * Get a sprite sheet.
 *
 * @method getSpriteSheet
 * @param {String} name The sprite sheet name.
 *
 * @return {photonui.SpriteSheet} The sprite sheet or null.
 */
SpriteSheet.getSpriteSheet = function (name) {
    if (_spritesheets[name] !== undefined) {
        return _spritesheets[name];
    }
    return null;
};

module.exports = SpriteSheet;

},{"../base.js":7}],45:[function(require,module,exports){
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

var Stone = require("stonejs");
var Base = require("../base.js");

/**
 * A wrapper around Stone.js to fire locale events to widgets.
 *
 * Documentation: https://github.com/flozz/stone.js/blob/master/README.md
 *
 * NOTE: When you instantiate the translation widget, you can pass to it
 * the `noGlobal` option to avoid the creation of the global `window._` function.
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
var Translation = Base.$extend({

    // Constructor
    __init__: function (params) {
        params = params || {};
        this._registerWEvents(["locale-changed"]);
        this.$super(params);
        this._bindEvent("locale-changed", document, "stonejs-locale-changed", this.__onStonejsLocaleChanged.bind(this));
        if (!params.noGlobal) {
            window._ = this.lazyGettext;
        }
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
     * Guess the user language.
     *
     * @method guessUserLanguage
     * @return {String} The language code (e.g. "en", "fr", "it",...)
     */
    guessUserLanguage: Stone.guessUserLanguage,

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

    /**
     * Enable/disable Stone.js translating elements with the "stonejs" attribute in the DOM.
     *
     * @method enableDomScan
     * @param {Boolean} boolean Enable or disable DOM scanning.
     */
    enableDomScan: Stone.enableDomScan,

    /**
     * Re-translate elements with the "stonejs" attribute in the DOM.
     *
     * @method updateDomTranslation
     */
    updateDomTranslation: Stone.updateDomTranslation,

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * @method __onStonejsLocaleChanged
     * @private
     */
    __onStonejsLocaleChanged: function () {
        this._callCallbacks("locale-changed", [this.locale]);
    }
});

module.exports = Translation;

},{"../base.js":7,"stonejs":4}],46:[function(require,module,exports){
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
 * @main PhotonUI
 * @namespace photonui
 */

var photonui = {};

// Include libraries in module.
photonui.lib = {};
photonui.lib.Class = require("abitbol");
photonui.lib.KeyboardJS = require("keyboardjs");
photonui.lib.Stone = require("stonejs");
photonui.lib.uuid = require("uuid");

// Base
photonui.Helpers = require("./helpers.js");
photonui.Base = require("./base.js");
photonui.Widget = require("./widget.js");

// Methods
photonui.domInsert = photonui.Widget.domInsert;
photonui.getWidget = photonui.Widget.getWidget;

// Widgets
photonui.FileManager = require("./nonvisual/filemanager.js");
photonui.Translation = require("./nonvisual/translation.js");
photonui.AccelManager = require("./nonvisual/accelmanager.js");
photonui.MouseManager = require("./nonvisual/mousemanager.js");
photonui.BaseIcon = require("./visual/baseicon.js");
photonui.FAIcon = require("./visual/faicon.js");
photonui.Image = require("./visual/image.js");
photonui.SpriteSheet = require("./nonvisual/spritesheet.js");
photonui.SpriteIcon = require("./visual/spriteicon.js");
photonui.Canvas = require("./visual/canvas.js");
photonui.Label = require("./visual/label.js");
photonui.Text = require("./visual/text.js");
photonui.ProgressBar = require("./visual/progressbar.js");
photonui.Separator = require("./visual/separator.js");
photonui.Button = require("./interactive/button.js");
photonui.ColorButton = require("./composite/colorbutton.js");
photonui.CheckBox = require("./interactive/checkbox.js");
photonui.Switch = require("./interactive/switch.js");
photonui.ToggleButton = require("./interactive/togglebutton.js");
photonui.Color = require("./nonvisual/color.js");
photonui.ColorPalette = require("./interactive/colorpalette.js");
photonui.ColorPicker = require("./interactive/colorpicker.js");
photonui.Field = require("./interactive/field.js");
photonui.NumericField = require("./interactive/numericfield.js");
photonui.TextAreaField = require("./interactive/textareafield.js");
photonui.TextField = require("./interactive/textfield.js");
photonui.Select = require("./composite/select.js");
photonui.FontSelect = require("./composite/fontselect.js");
photonui.Slider = require("./interactive/slider.js");
photonui.Container = require("./container/container.js");
photonui.Layout = require("./layout/layout.js");
photonui.BoxLayout = require("./layout/boxlayout.js");
photonui.FluidLayout = require("./layout/fluidlayout.js");
photonui.GridLayout = require("./layout/gridlayout.js");
photonui.Menu = require("./layout/menu.js");
photonui.MenuItem = require("./container/menuitem.js");
photonui.SubMenuItem = require("./container/submenuitem.js");
photonui.Viewport = require("./container/viewport.js");
photonui.BaseWindow = require("./container/basewindow.js");
photonui.Window = require("./container/window.js");
photonui.PopupWindow = require("./container/popupwindow.js");
photonui.Dialog = require("./container/dialog.js");
photonui.ColorPickerDialog = require("./composite/colorpickerdialog.js");
photonui.PopupMenu = require("./composite/popupmenu.js");
photonui.TabItem = require("./container/tabitem.js");
photonui.TabLayout = require("./layout/tablayout.js");
// [generator]
// DO NOT MODIFY/REMOVE THE PREVIOUS COMMENT, IT IS USED BY THE WIDGET GENERATOR!

module.exports = photonui;

},{"./base.js":7,"./composite/colorbutton.js":8,"./composite/colorpickerdialog.js":9,"./composite/fontselect.js":10,"./composite/popupmenu.js":11,"./composite/select.js":12,"./container/basewindow.js":13,"./container/container.js":14,"./container/dialog.js":15,"./container/menuitem.js":16,"./container/popupwindow.js":17,"./container/submenuitem.js":18,"./container/tabitem.js":19,"./container/viewport.js":20,"./container/window.js":21,"./helpers.js":22,"./interactive/button.js":23,"./interactive/checkbox.js":24,"./interactive/colorpalette.js":25,"./interactive/colorpicker.js":26,"./interactive/field.js":27,"./interactive/numericfield.js":28,"./interactive/slider.js":29,"./interactive/switch.js":30,"./interactive/textareafield.js":31,"./interactive/textfield.js":32,"./interactive/togglebutton.js":33,"./layout/boxlayout.js":34,"./layout/fluidlayout.js":35,"./layout/gridlayout.js":36,"./layout/layout.js":37,"./layout/menu.js":38,"./layout/tablayout.js":39,"./nonvisual/accelmanager.js":40,"./nonvisual/color.js":41,"./nonvisual/filemanager.js":42,"./nonvisual/mousemanager.js":43,"./nonvisual/spritesheet.js":44,"./nonvisual/translation.js":45,"./visual/baseicon.js":47,"./visual/canvas.js":48,"./visual/faicon.js":49,"./visual/image.js":50,"./visual/label.js":51,"./visual/progressbar.js":52,"./visual/separator.js":53,"./visual/spriteicon.js":54,"./visual/text.js":55,"./widget.js":56,"abitbol":1,"keyboardjs":3,"stonejs":4,"uuid":6}],47:[function(require,module,exports){
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
 * @submodule Visual
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Base class for icons.
 *
 * @class BaseIcon
 * @constructor
 * @extends photonui.Widget
 */
var BaseIcon = Widget.$extend({

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // pass
    }

});

module.exports = BaseIcon;

},{"../widget.js":56}],48:[function(require,module,exports){
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
 * @submodule Visual
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Canvas.
 *
 * @class Canvas
 * @constructor
 * @extends photonui.Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var Canvas = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties(["width", "height"]);

        // --- Canvas methods proxies ---

        /**
         * Returns a drawing context on the canvas.
         *
         * Proxy of the native canvas method. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method getContext
         * @param {String} contextId
         * @return The drawing context.
         */
        this.getContext = this.__html.canvas.getContext.bind(this.__html.canvas);

        /**
         * Indicate if the given context is supported by this canvas.
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method supportsContext
         * @param {String} contextId
         * @return {Boolean}
         */
        if (this.__html.canvas.supportsContext) {
            this.supportsContext = this.__html.canvas.supportsContext.bind(this.__html.canvas);
        }

        /**
         * Changes the context the element is related to to the given one.
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method setContext
         * @param {String} contextId
         */
        if (this.__html.canvas.setContext) {
            this.setContext = this.__html.canvas.setContext.bind(this.__html.canvas);
        }

        /**
         * Gives back a proxy to allow the canvas to be used in another Worker.
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method transferControlToProxy
         */
        if (this.__html.canvas.transferControlToProxy) {
            this.transferControlToProxy = this.__html.canvas.transferControlToProxy.bind(this.__html.canvas);
        }

        /**
         * Returns a "data:" URL containing a representation of the image (at 96dpi).
         *
         * Proxy of the native canvas method. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method toDataURL
         * @param {String} type The image format (optional, e.g: "image/png", "image/jpeg",..., default="image/png")
         * @return {String} The data URL
         */
        this.toDataURL = this.__html.canvas.toDataURL.bind(this.__html.canvas);

        /**
         * Returns a "data:" URL containing a representation of the image (at the native resolution of the canvas).
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method toDataURLHD
         * @param {String} type The image format (optional, e.g: "image/png", "image/jpeg",..., default="image/png")
         * @return {String} The data URL
         */
        if (this.__html.canvas.toDataURLHD) {
            this.toDataURLHD = this.__html.canvas.toDataURLHD.bind(this.__html.canvas);
        }

        /**
         * Returns a Blob object representing the image contained in the canvas (at 96dpi).
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method toBlob
         * @param {String} type The image format (optional, e.g: "image/png", "image/jpeg",..., default="image/png")
         * @return {Blob}
         */
        if (this.__html.canvas.toBlob) {
            this.toBlob = this.__html.canvas.toBlob.bind(this.__html.canvas);
        }

        /**
         * Returns a Blob object representing the image contained in the canvas (at the native
         * resolution of the canvas).
         *
         * Proxy of the native canvas method if exists. For more informations see:
         *
         *   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
         *
         * @method toBlobHD
         * @param {String} type The image format (optional, e.g: "image/png", "image/jpeg",..., default="image/png")
         * @return {Blob}
         */
        if (this.__html.canvas.toBlobHD) {
            this.toBlobHD = this.__html.canvas.toBlobHD.bind(this.__html.canvas);
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Canvas width.
     *
     * @property width
     * @type Number
     * default 300
     */
    getWidth: function () {
        return this.__html.canvas.width;
    },

    setWidth: function (width) {
        this.__html.canvas.width = width || 300;
    },

    /**
     * Canvas height.
     *
     * @property height
     * @type Number
     * default 150
     */
    getHeight: function () {
        return this.__html.canvas.height;
    },

    setHeight: function (height) {
        this.__html.canvas.height = height || 150;
    },

    /**
     * The Canvas HTML Element.
     *
     * @property canvas
     * @readOnly
     * @type HTMLElement
     */
    getCanvas: function () {
        return this.__html.canvas;
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.outer;
    },

    /**
     * The interactive HTML element (for event managers).
     *
     * @property interactiveNode
     * @type HTMLElement
     * @readOnly
     */
    getInteractiveNode: function () {
        return this.__html.canvas;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-canvas";

        this.__html.canvas = document.createElement("canvas");
        this.__html.outer.appendChild(this.__html.canvas);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // pass
    }
});

module.exports = Canvas;

},{"../widget.js":56}],49:[function(require,module,exports){
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
 * @submodule Visual
 * @namespace photonui
 */

var BaseIcon = require("./baseicon.js");

/**
 * Font Awesome Icon.
 *
 * Special contructor params:
 *
 *      new photonui.FAIcon( {optional params...} )
 *      new photonui.FAIcon( "iconName", {optional params...} )
 *
 * @class FAIcon
 * @constructor
 * @extends photonui.BaseIcon
 */
var FAIcon = BaseIcon.$extend({

    // Constructor
    __init__: function (params1, params2) {
        var params = {};
        if (params1 && typeof(params1) == "string") {
            params.iconName = params1;
            if (params2 && typeof(params2) == "object") {
                for (var i in params2) {
                    params[i] = params2[i];
                }
            }
        } else if (params1) {
            params = params1;
        }
        this.$super(params);
        this._updateProperties(["iconName", "size", "color"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The Font Awesome icon name (e.g. "fa-cog").
     *
     * Icon list: http://fontawesome.io/icons/
     *
     * @property iconName
     * @type String
     * @default ""
     */
    _iconName: "",

    getIconName: function () {
        return this._iconName;
    },

    setIconName: function (iconName) {
        this._iconName = iconName || "";
        this.__html.icon.className = "fa " + this.iconName + " " + this.size;
    },

    /**
     * Font Awesome icon size (e.g. "fa-2x").
     *
     * Icon sizes list: http://fontawesome.io/examples/#larger
     *
     * @property size
     * @type String
     * @default ""
     */
    _size: "",

    getSize: function () {
        return this._size;
    },

    setSize: function (size) {
        this._size = size || "";
        this.__html.icon.className = "fa " + this.iconName + " " + this.size;
    },

    /**
     * The icon color.
     *
     * @property color
     * @type String
     * default: "inherit"
     */
    _color: "inherit",

    getColor: function () {
        return this._color;
    },

    setColor: function (color) {
        this._color = color || "inherit";
        this.__html.icon.style.color = this.color;
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.outer;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("span");
        this.__html.outer.className = "photonui-widget photonui-icon photonui-faicon";

        this.__html.icon = document.createElement("i");
        this.__html.outer.appendChild(this.__html.icon);
    }
});

module.exports = FAIcon;

},{"./baseicon.js":47}],50:[function(require,module,exports){
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
 * Authored by: Clément LEVASSEUR <https://github.com/clementlevasseur>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Visual
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Image.
 *
 * @class Image
 * @constructor
 * @extends photonui.Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var Image_ = Widget.$extend({

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The image URL.
     *
     * @property url
     * @type String
     * @default ""
     */
    _url: "",

    getUrl: function () {
        return this._url;
    },

    setUrl: function (url) {
        this._url = url;
        this.__html.image.src = url;
    },

    /**
     * The image width (null = auto).
     *
     * @property width
     * @type Number
     * @default null
     */
    _width: null,

    getWidth: function () {
        return this._width;
    },

    setWidth: function (width) {
        if (width !== null) {
            this._width = width;
            this.__html.image.width = width;
        } else {
            this.__html.image.width = "";
        }
    },

    /**
     * The image height (null = auto).
     *
     * @property height
     * @type Number
     * @default null
     */
    _height: null,

    getHeight: function () {
        return this._height;
    },

    setHeight: function (height) {
        if (height !== null) {
            this._height = height;
            this.__html.image.height = height;
        } else {
            this.__html.image.height = "";
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
    getHtml: function () {
        return this.__html.div;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.div = document.createElement("div");
        this.__html.div.className = "photonui-widget photonui-image";

        this.__html.image = document.createElement("img");
        this.__html.div.appendChild(this.__html.image);
    }

});

module.exports = Image_;

},{"../widget.js":56}],51:[function(require,module,exports){
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
 * @submodule Visual
 * @namespace photonui
 */

var Widget = require("../widget.js");
var Helpers = require("../helpers.js");

/**
 * Label.
 *
 * @class Label
 * @constructor
 * @extends photonui.Widget
 */
var Label = Widget.$extend({

    // Constructor
    __init__: function (params1, params2) {
        var params = {};
        if (params1 && typeof(params1) == "string") {
            params.text = params1;
            if (params2 && typeof(params2) == "object") {
                for (var i in params2) {
                    params[i] = params2[i];
                }
            }
        } else if (params1) {
            params = params1;
        }
        params.layoutOptions = params.layoutOptions || {};
        if (params.layoutOptions.verticalExpansion === undefined) {
            params.layoutOptions.verticalExpansion = false;
        }
        this.$super(params);
        this._updateProperties(["text", "textAlign", "forInputName"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The label text.
     *
     * @property text
     * @type String
     * @default "Label"
     */
    _text: "Label",

    getText: function () {
        return this._text;
    },

    setText: function (text) {
        this._text = text;
        Helpers.cleanNode(this.__html.label);

        var lines = text.split("\n");

        for (var i = 0 ; i < lines.length ; i++) {
            this.__html.label.appendChild(document.createTextNode(lines[i]));
            if (i < lines.length - 1) {
                this.__html.label.appendChild(document.createElement("br"));
            }
        }

    },

    /**
     * The text horizontal alignement.
     *
     *   * "left",
     *   * "center",
     *   * "right".
     *
     * @property textAlign
     * @type String
     * @default "left"
     */
    _textAlign: "left",

    getTextAlign: function () {
        return this._textAlign;
    },

    setTextAlign: function (textAlign) {
        if (textAlign != "left" && textAlign != "center" && textAlign != "right") {
            throw new Error("Text alignement sould be 'left', 'center' or 'right'.");
        }
        this._textAlign = textAlign;
        this.__html.label.style.textAlign = textAlign;
    },

    /**
     * Link the label with the given input (Field, CheckBox,...) widget.
     *
     * @property forInputName
     * @type String
     * @default null
     */
    _forInputName: null,

    getForInputName: function () {
        return this._forInputName;
    },

    setForInputName: function (forInputName) {
        this._forInputName = forInputName;
        if (this._forInputName) {
            if (this.forInput) {
                this.__html.label.setAttribute("for",
                        Helpers.escapeHtml(this.forInput.inputId || this.forInput.name)
                );
            } else {
                this.__html.label.setAttribute("for",
                        Helpers.escapeHtml(forInputName)
                );
            }
        } else {
            this.__html.label.removeAttribute("for");
        }
    },

    /**
     * Link the label with the given input (Field, CheckBox,...) widget.
     *
     * @property forInput
     * @type photonui.Field, photonui.CheckBox
     * @default null
     */
    getForInput: function () {
        return Widget.getWidget(this.forInputName);
    },

    setForInput: function (forInput) {
        this.forInputName = forInput.name;
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.label;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.label = document.createElement("label");
        this.__html.label.className = "photonui-widget photonui-label photonui-widget-fixed-height";
    }
});

module.exports = Label;

},{"../helpers.js":22,"../widget.js":56}],52:[function(require,module,exports){
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
 * @submodule Visual
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * ProgressBar.
 *
 * @class ProgressBar
 * @constructor
 * @extends photonui.Widget
 */
var ProgressBar = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties(["orientation", "value", "pulsate"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.outer;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * The progression (form 0.00 to 1.00).
     *
     * @property value
     * @type Number
     * @default 0
     */
    _value: 0,

    getValue: function () {
        return this._value;
    },

    setValue: function (value) {
        this._value = Math.min(Math.max(value, 0), 1);
        if (this.orientation == "horizontal") {
            this.__html.bar.style.width = Math.floor(this.value * 100) + "%";
            this.__html.bar.style.height = "";
        } else {
            this.__html.bar.style.height = Math.floor(this.value * 100) + "%";
            this.__html.bar.style.width = "";
        }
        this.__html.textContent.innerHTML = Math.floor(this.value * 100) + " %";
    },

    /**
     * The progressbar orientation ("vertical" or "horizontal").
     *
     * @property orientation
     * @type String
     * @default "horizontal"
     */
    _orientation: "horizontal",

    getOrientation: function () {
        return this._orientation;
    },

    setOrientation: function (orientation) {
        if (orientation != "vertical" && orientation != "horizontal") {
            throw new Error("The orientation should be \"vertical\" or \"horizontal\".");
        }
        this._orientation = orientation;
        this.removeClass("photonui-progressbar-vertical");
        this.removeClass("photonui-progressbar-horizontal");
        this.addClass("photonui-progressbar-" + this.orientation);

        // Refresh the value...
        this.value = this.value;
    },

    /**
     * Enable or disable the progressbar pulsate mode.
     *
     * @property pulsate
     * @type Boolean
     * @default false
     */
    _pulsate: false,

    isPulsate: function () {
        return this._pulsate;
    },

    setPulsate: function (pulsate) {
        this._pulsate = pulsate;
        if (pulsate) {
            this.addClass("photonui-progressbar-pulsate");
            if (this.orientation == "horizontal") {
                this.__html.bar.style.width = "";
            } else {
                this.__html.bar.style.height = "";
            }
        } else {
            this.removeClass("photonui-progressbar-pulsate");
            this.value = this.value;
        }
    },

    /**
     * Display/hide the progression text.
     *
     * @property textVisible
     * @type Boolean
     * @default true
     */
    _textVisible: true,

    isTextVisible: function () {
        return this._textVisible;
    },

    setTextVisible: function (textVisible) {
        this._textVisible = textVisible;
        if (this.textVisible) {
            this.__html.text.style.display = "";
        } else {
            this.__html.text.style.display = "none";
        }
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-progressbar";

        // Hack: needed to help grid layout (<table>) to size properly its cells...
        this.__html.filldiv = document.createElement("div");
        this.__html.filldiv.className = "photonui-progressbar-fill";
        this.__html.filldiv.innerHTML = "xxxxxxxxxxx";
        this.__html.filldiv.style.opacity = 0;
        this.__html.filldiv.style.pointerEvents = "none";
        this.__html.outer.appendChild(this.__html.filldiv);

        this.__html.text = document.createElement("div");
        this.__html.text.className = "photonui-progressbar-text";
        this.__html.outer.appendChild(this.__html.text);

        this.__html.textContent = document.createElement("span");
        this.__html.text.appendChild(this.__html.textContent);

        this.__html.bar = document.createElement("div");
        this.__html.bar.className = "photonui-progressbar-bar";
        this.__html.outer.appendChild(this.__html.bar);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // pass
    }
});

module.exports = ProgressBar;

},{"../widget.js":56}],53:[function(require,module,exports){
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
 * @submodule Visual
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Separator.
 *
 * @class Separator
 * @constructor
 * @extends photonui.Widget
 */
var Separator = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._updateProperties(["orientation"]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The separator orientation ("vertical" or "horizontal").
     *
     * @property orientation
     * @type String
     * @default "horizontal"
     */
    _orientation: "horizontal",

    getOrientation: function () {
        return this._orientation;
    },

    setOrientation: function (orientation) {
        if (orientation != "vertical" && orientation != "horizontal") {
            throw new Error("The orientation should be \"vertical\" or \"horizontal\".");
        }
        this._orientation = orientation;
        this.removeClass("photonui-separator-vertical");
        this.removeClass("photonui-separator-horizontal");
        this.addClass("photonui-separator-" + this._orientation);

        this.removeClass("photonui-widget-fixed-height");
        this.removeClass("photonui-widget-fixed-width");
        if (this._orientation == "horizontal") {
            this.addClass("photonui-widget-fixed-height");
        } else {
            this.addClass("photonui-widget-fixed-width");
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
    getHtml: function () {
        return this.__html.outer;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-separator";
        this.__html.hr = document.createElement("hr");
        this.__html.outer.appendChild(this.__html.hr);
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // pass
    }
});

module.exports = Separator;

},{"../widget.js":56}],54:[function(require,module,exports){
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
 * @submodule Visual
 * @namespace photonui
 */

var BaseIcon = require("./baseicon.js");
var SpriteSheet = require("../nonvisual/spritesheet.js");

/**
 * Sprite sheet based icons.
 *
 * Special contructor params:
 *
 *      new photonui.SpriteIcon( {optional params...} )
 *      new photonui.SpriteIcon( "spriteSheetName/iconName", {optional params...} )
 *
 * @class SpriteIcon
 * @constructor
 * @extends photonui.BaseIcon
 */
var SpriteIcon = BaseIcon.$extend({

    // Constructor
    __init__: function (params1, params2) {
        var params = {};
        if (params1 && typeof(params1) == "string") {
            params.icon = params1;
            if (params2 && typeof(params2) == "object") {
                for (var i in params2) {
                    params[i] = params2[i];
                }
            }
        } else if (params1) {
            params = params1;
        }
        this.$super(params);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The sprite sheet name.
     *
     * @property spriteSheetName
     * @type String
     * @default ""
     */
    _spriteSheetName: "",

    getSpriteSheetName: function () {
        return this._spriteSheetName;
    },

    setSpriteSheetName: function (spriteSheetName) {
        this._spriteSheetName = spriteSheetName || "";
        this._update();
    },

    /**
     * The icon name.
     *
     * @property iconName
     * @type String
     * @default ""
     */
    _iconName: "",

    getIconName: function () {
        return this._iconName;
    },

    setIconName: function (iconName) {
        this._iconName = iconName || "";
        this._update();
    },

    /**
     * The icon id.
     *
     *     "spriteSheetName/iconName"
     *
     * @property icon
     * @type String
     * @default "/"
     */
    getIcon: function () {
        return this.spriteSheetName + "/" + this.iconName;
    },

    setIcon: function (icon) {
        var names = icon.split("/");
        this.spriteSheetName = names[0];
        this.iconName = names[1];
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.outer;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Update the icon.
     *
     * @method _update
     * @private
     */
    _update: function () {
        var style = "";
        if (this.spriteSheetName && this.iconName) {
            style = SpriteSheet.getSpriteSheet(this.spriteSheetName).getIconCss(this.iconName);
        }
        this.__html.icon.setAttribute("style", style);
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("span");
        this.__html.outer.className = "photonui-widget photonui-icon photonui-spriteicon";

        this.__html.icon = document.createElement("span");
        this.__html.outer.appendChild(this.__html.icon);
    }
});

module.exports = SpriteIcon;

},{"../nonvisual/spritesheet.js":44,"./baseicon.js":47}],55:[function(require,module,exports){
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
 * @submodule Visual
 * @namespace photonui
 */

var Stone = require("stonejs");
var Widget = require("../widget.js");
var Helpers = require("../helpers.js");

/**
 * Text / Raw HTML widget
 *
 * @class Text
 * @constructor
 * @extends photonui.Widget
 */
var Text_ = Widget.$extend({

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    // meta for i18n
    _lastSet: "text",
    _raw: "",

    /**
     * Text
     *
     * @property text
     * @type String
     * @default ""
     */
    getText: function () {
        return this.__html.outer.textContent;
    },

    setText: function (text) {
        this._lastSet = "text";
        this._raw = text;
        Helpers.cleanNode(this.__html.outer);
        this.__html.outer.appendChild(document.createTextNode(text));
    },

    /**
     * Raw HTML.
     *
     * @property rawHtml
     * @type String
     * @default ""
     */
    getRawHtml: function () {
        return this.__html.outer.innerHTML;
    },

    setRawHtml: function (html) {
        this._lastSet = "rawHtml";
        this._raw = html;
        this.__html.outer.innerHTML = html;
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.outer;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.outer = document.createElement("div");
        this.__html.outer.className = "photonui-widget photonui-text";
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        this.$super();
        if (this._raw instanceof Stone.LazyString) {
            this[this._lastSet] = this._raw;
        }
    }
});

module.exports = Text_;

},{"../helpers.js":22,"../widget.js":56,"stonejs":4}],56:[function(require,module,exports){
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

var Stone = require("stonejs");
var uuid = require("uuid");

var Base = require("./base.js");
var Helpers = require("./helpers.js");

var _widgets = {};

/**
 * Base class for all PhotonUI widgets.
 *
 * wEvents:
 *
 *   * show:
 *      - description: called when the widget is displayed (a change in the parent's
 *                     visibility can also trigger this event).
 *      - callback:    function(widget)
 *
 *   * hide:
 *      - description: called when the widget is hidden (a change in the parent's visibility
 *                     can also trigger this event).
 *      - callback:    function(widget)
 *
 * @class Widget
 * @constructor
 * @extends photonui.Base
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var Widget = Base.$extend({

    // Constructor
    __init__: function (params) {
        // New instances for object properties
        this.__html = {};
        this._layoutOptions = {};

        // Build the html
        this._buildHtml();

        // wEvents
        this._registerWEvents(["show", "hide"]);

        // Parent constructor
        this.$super(params);

        // Update properties
        this._updateProperties(["visible"]);

        // Default name
        if (!this.name) {
            this.name = "widget-" + uuid.v4();
        }

        // Additional className
        if (params && params.className) {
            this.addClass(params.className);
        }

        // Bind some events
        if (this.html) {
            this._bindEvent("pop-contextmenu", this.html, "contextmenu", this.__onContextMenu.bind(this));
        }
        this._bindEvent("locale-changed", document, "stonejs-locale-changed", this.__onLocaleChanged.bind(this));

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
     * @default "widget-" + uuid.v4()
     */
    _name: null,

    getName: function () {
        return this._name;
    },

    setName: function (name) {
        delete _widgets[this.name];
        this._name = name;
        _widgets[name] = this;
        if (this.html) {
            this.html.id = this.name;
        }
    },

    /**
     * The parent widget name.
     *
     * @property parentName
     * @type String
     * @readOnly
     * @default null (no parent)
     */
    _parentName: null,

    getParentName: function () {
        return this._parentName;
    },

    /**
     * The parent widget.
     *
     * @property parent
     * @type photonui.Widget
     * @readOnly
     * @default null (no parent)
     */
    getParent: function () {
        return Widget.getWidget(this.parentName);
    },

    /**
     * Is the widget visible or hidden.
     *
     * @property visible
     * @type Boolean
     * @default true
     */
    _visible: true,

    isVisible: function () {
        return this._visible;
    },

    setVisible: function (visible) {
        this._visible = Boolean(visible);
        if (!this.html) {
            return;
        }
        if (visible) {
            this.html.style.display = "";
        } else {
            this.html.style.display = "none";
        }
        this._visibilityChanged();
    },

    /**
     * Tooltip.
     *
     * @property tooltip
     * @type String
     * @default null
     */
    _tooltip: null,

    getTooltip: function () {
        return this._tooltip;
    },

    setTooltip: function (tooltip) {
        this._tooltip = tooltip;
        if (tooltip) {
            this.html.title = tooltip;
        } else {
            this.html.removeAttribute("title");
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

    getContextMenuName: function () {
        return this._contextMenuName;
    },

    setContextMenuName: function (contextMenuName) {
        this._contextMenuName = contextMenuName;
    },

    /**
     * The managed contextual menu.
     *
     * @property contextMenu
     * @type photonui.PopupWindow
     * @default null (= no context menu)
     */
    getContextMenu: function () {
        return Widget.getWidget(this.contextMenuName);
    },

    setContextMenu: function (contextMenu) {
        var PopupWindow = require("./container/popupwindow.js");
        if (contextMenu instanceof PopupWindow) {
            this.contextMenuName = contextMenu.name;
        } else {
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

    getLayoutOptions: function () {
        return this._layoutOptions;
    },

    setLayoutOptions: function (layoutOptions) {
        for (var option in layoutOptions) {
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
    getHtml: function () {
        Helpers.log("debug", "getHtml() method is not implemented on this widget.");
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
    getAbsolutePosition: function () {
        if (!this.html) {
            return {x: 0, y: 0};
        }
        return Helpers.getAbsolutePosition(this.html);
    },

    /**
     * Widget width (outer HTML element).
     *
     * @property offsetWidth
     * @type Number
     * @readOnly
     */
    getOffsetWidth: function () {
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
    getOffsetHeight: function () {
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

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Display the widget (equivalent to widget.visible = true).
     *
     * @method show
     */
    show: function () {
        this.visible = true;
    },

    /**
     * DHide the widget (equivalent to widget.visible = false).
     *
     * @method hide
     */
    hide: function () {
        this.visible = false;
    },

    /**
     * Detache the widget from its parent.
     *
     * @method unparent
     */
    unparent: function () {
        if (this.parent) {
            this.parent.removeChild(this);
        } else if (this.html && this.html.parentNode) {
            this.html.parentNode.removeChild(this.html);
        }
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        this.$super();
        this.unparent();
        delete _widgets[this.name];
    },

    /**
     * Add a class to the outer HTML element of the widget.
     *
     * @method addClass
     * @param {String} className The class to add.
     */
    addClass: function (className) {
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
    removeClass: function (className) {
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

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        Helpers.log("debug", "_buildHtml() method not implemented on this widget.");
    },

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        if (visibility && this.visible) {
            this._callCallbacks("show");
        } else {
            this._callCallbacks("hide");
        }
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
    __onContextMenu: function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.contextMenuName) {
            this.contextMenu.popupXY(event.pageX, event.pageY);
        }
    },

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // Update lazy strings...
        for (var prop in this) {
            if (this[prop] instanceof Stone.LazyString) {
                this[prop] = this[prop];
            }
        }
    }
});

/*
 * Get a widget.
 *
 * @method getWidget
 * @param {String} name The widget name.
 *
 * @return {Widget} The widget or null.
 */
Widget.getWidget = function (name) {
    if (_widgets[name] !== undefined) {
        return _widgets[name];
    }
    return null;
};

Widget.e_parent = null;

/*
 * Insert a widget in the DOM.
 *
 * method domInsert
 * @param {photonui.Widget} widget The widget to insert.
 * @param {HTMLElement} element The DOM node or its id (optional, default=Widget.e_parent)
 */
Widget.domInsert = function (widget, element) {
    element = element || Widget.e_parent || document.getElementsByTagName("body")[0];
    if (typeof(element) == "string") {
        element = document.getElementById(element);
    }
    element.appendChild(widget.html);
};

module.exports = Widget;

},{"./base.js":7,"./container/popupwindow.js":17,"./helpers.js":22,"stonejs":4,"uuid":6}]},{},[46])(46)
});