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
photonui.FileManager = photonui.Base.$extend({

    // Constructor
    __init__: function(params) {
        this.__fileField = document.createElement("input");
        this.__fileField.type = "file";
        this.__fileField.addEventListener("change", this.__onFileSelected.bind(this), false);
        this._acceptedMimes = [],
        this._acceptedExts = [],
        this.$super(params);
        this._registerWEvents(["file-open"]);
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

    getAcceptedMimes: function() {
        return this._acceptedMimes;
    },

    setAcceptedMimes: function(mimes) {
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

    getAcceptedExts: function() {
        return this._acceptedExts;
    },

    setAcceptedExts: function(exts) {
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

    getDropZone: function() {
        return this._dropZone;
    },

    setDropZone: function(element) {
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
            this._bindEvent("document-dragover", document, "dragover", function(event) {
                event.preventDefault();
            });
            this._bindEvent("document-drop", document, "drop", function(event) {
                event.preventDefault();
            });
            this._bindEvent("element-dragover", document, "dragover", function(event) {});
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

    getMultiselect: function() {
        return this._multiselect;
    },

    setMultiselect: function(multiselect) {
        this._multiselect = multiselect;

        if (multiselect) {
            this.__fileField.multiple = "true";
        }
        else {
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
    open: function() {
        this.__fileField.click();
    },


    // ====== Private methods ======


    /**
     * Update accepted mimes/extentions.
     *
     * @method _updateAccepted
     * @private
     */
    _updateAccepted: function() {
        var result = [];

        for (var i=0 ; i<this.acceptedExts.length ; i++) {
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
    _openFile: function(file, x, y) {
        var match = false;

        // Validate mime
        for (var m=0 ; m<this.acceptedMimes.length ; m++) {
            if (file.type == this.acceptedMimes[m]) {
                match = true;
                break;
            }
        }

        // Validate ext
        if (!match) {
            var ext = file.name.split(".").splice(-1)
            for (var e=0 ; e<this.acceptedExts.length ; e++) {
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
    __onFileDropped: function(event) {
        for (var i in event.dataTransfer.files) {
            var file = event.dataTransfer.files[i];
            if(file instanceof File) {
                this._openFile(file, event.pageX, event.pageY);
            }
        }
    },

    /**
     * @method __onFileSelected
     * @private
     * @param event
     */
    __onFileSelected: function(event) {
        for (var i in this.__fileField.files) {
            var file = this.__fileField.files[i];
            if(file instanceof File) {
                this._openFile(file);
            }
        }
    }
});
