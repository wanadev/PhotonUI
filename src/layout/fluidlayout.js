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
 * Layout Options:
 *
 *     {
 *         align: <String (stretch|expand, start|left|top, center|middle, end|right|bottom), default=center>,
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
     * @default 0
     */
    _horizontalSpacing: 0,

    getHorizontalSpacing: function () {
        return this._horizontalSpacing;
    },

    setHorizontalSpacing: function (horizontalSpacing) {
        this._horizontalSpacing = horizontalSpacing;
        this._updateLayout();
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
        this.__html.innerbox.style.paddingLeft = this._verticalPadding + "px";
        this.__html.innerbox.style.paddingRight = this._verticalPadding + "px";
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
        this.__html.innerbox.style.paddingTop = this._horizontalPadding + "px";
        this.__html.innerbox.style.paddingBottom = this._horizontalPadding + "px";
    },

    /**
     * Vertical alignment of children widgets.
     *
     * Values:
     *
     *     * start|top|begin (default)
     *     * center|middle
     *     * end|bottom
     *
     * @property verticalAlign
     * @type String
     * @default "start"
     */
    _verticalAlign: "start",

    getVerticalAlign: function () {
        return this._verticalAlign;
    },

    setVerticalAlign: function (align) {
        if (["start", "top", "begin"].indexOf(align) > -1) {
            this._verticalAlign = "start";
            this.__html.innerbox.style.alignContent = "flex-start";
        } else if (["center", "middle"].indexOf(align) > -1) {
            this._verticalAlign = "center";
            this.__html.innerbox.style.alignContent = "center";
        } else if (["end", "bottom"].indexOf(align) > -1) {
            this._verticalAlign = "end";
            this.__html.innerbox.style.alignContent = "flex-end";
        }
    },

    /**
     * Horizontal alignment of children widgets.
     *
     * Values:
     *
     *     * start|left|begin (default)
     *     * center|middle
     *     * end|right
     *
     * @property horizontalAlign
     * @type String
     * @default "start"
     */
    _horizontalAlign: "start",

    getHorizontalAlign: function () {
        return this._horizontalAlign;
    },

    setHorizontalAlign: function (align) {
        if (["start", "left", "begin"].indexOf(align) > -1) {
            this._horizontalAlign = "start";
            this.__html.innerbox.style.justifyContent = "flex-start";
        } else if (["center", "middle"].indexOf(align) > -1) {
            this._horizontalAlign = "center";
            this.__html.innerbox.style.justifyContent = "center";
        } else if (["end", "right"].indexOf(align) > -1) {
            this._horizontalAlign = "end";
            this.__html.innerbox.style.justifyContent = "flex-end";
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
        this.__html.outerbox.className = "photonui-widget photonui-fluidlayout";
        this.__html.innerbox = document.createElement("div");
        this.__html.innerbox.className = "photonui-fluidlayout-innerbox";
        this.__html.outerbox.appendChild(this.__html.innerbox);
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

        this.__html.innerbox.style.marginTop = (this.verticalSpacing > 0) ? -this.verticalSpacing + "px" : "0px";
        this.__html.innerbox.style.marginLeft = (this.horizontalSpacing > 0) ? -this.horizontalSpacing + "px" : "0px";

        var div = null;
        for (var i = 0 ; i < children.length ; i++) {
            var options = this._computeLayoutOptions(children[i]);

            div = document.createElement("div");
            div.className = "photonui-container";

            // spacings
            div.style.marginTop = this.verticalSpacing + "px";
            div.style.marginLeft = this.horizontalSpacing + "px";

            // layout option: align
            div.className += " photonui-layout-align-" + options.align;

            // layout options: *width
            if (options.minWidth !== null) {
                div.style.minWidth = options.minWidth + "px";
            }
            if (options.maxWidth !== null) {
                div.style.maxWidth = options.maxWidth + "px";
            }
            if (options.width !== null) {
                div.style.width = options.width + "px";
            }

            // layout options: *height
            if (options.minHeight !== null) {
                div.style.minHeight = options.minHeight + "px";
            }
            if (options.maxHeight !== null) {
                div.style.maxHeight = options.maxHeight + "px";
            }
            if (options.height !== null) {
                div.style.height = options.height + "px";
            }

            // layout options: order
            if (options.order !== null) {
                div.style.order = options.order;
            }

            div.appendChild(children[i].html);
            fragment.appendChild(div);
        }

        Helpers.cleanNode(this.__html.innerbox);
        this.__html.innerbox.appendChild(fragment);
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
            order: null,
            align: "center",   // start|begin|top, center|middle, end|bottom, stretch|expand
            minWidth: null,
            maxWidth: null,
            width: null,
            minHeight: null,
            maxHeight: null,
            height: null
        };

        // order
        if (woptions.order !== undefined) {
            options.order = woptions.order | 0;
        }

        // align
        if (woptions.align) {
            if (["stretch", "expand"].indexOf(woptions.align) > -1) {
                options.align = "stretch";
            } else if (["center", "middle"].indexOf(woptions.align) > -1) {
                options.align = "center";
            } else if (["start", "begin", "top"].indexOf(woptions.align) > -1) {
                options.align = "start";
            } else if (["end", "bottom"].indexOf(woptions.align) > -1) {
                options.align = "end";
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
    }

});

module.exports = FluidLayout;
