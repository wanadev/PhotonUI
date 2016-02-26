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
 * @submodule Visual
 * @namespace photonui
 */

var lodash = require("lodash");
var Widget = require("../widget.js");
var Helpers = require("../helpers.js");

/**
 * Widget that displays template-generated HTML (uses lodash.template).
 *
 * @class Template
 * @constructor
 * @extends photonui.Widget
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var Template = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this.$data.compiledTemplate = function () {
            return document.createElement("div");
        };
        this.$super(params);
        this.update = lodash.debounce(this.update, 50);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The template.
     *
     * @property template
     * @type String
     * @default ""
     */
    _template: "",

    getTemplate: function () {
        return this._template;
    },

    setTemplate: function (tpl) {
        this._template = tpl;
        this.$data.compiledTemplate = lodash.template(this._template);
        lodash.defer(this.update);
    },

    getData: function () {
        lodash.defer(this.update);
        return this.$super();
    },

    setData: function (data) {
        this.$super(data);
        this.update();
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

    // ====== Public methods ======

    /**
     * Update the template (NOTE: the template is automatically updated when you change data)
     *
     * @method update
     */
    update: function () {
        Helpers.cleanNode(this.html);
        if (!this.$data.compiledTemplate) {
            return;
        }
        try {
            this.html.innerHTML = this.$data.compiledTemplate(this._data);
        } catch (error) {
            Helpers.log("error", "An error occured when rendering the template: " + error);
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
        this.__html.div = document.createElement("div");
        this.__html.div.className = "photonui-widget photonui-template";
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    __onLocaleChanged: function () {
        this.update();
    }

});

module.exports = Template;
