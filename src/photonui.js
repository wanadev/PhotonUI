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
photonui.lib.lodash = require("lodash");

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
photonui.KeyboardManager = require("./nonvisual/keyboardmanager.js");
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
photonui.Expander = require("./container/expander.js");
photonui.ColorPickerDialog = require("./composite/colorpickerdialog.js");
photonui.PopupMenu = require("./composite/popupmenu.js");
photonui.TabItem = require("./container/tabitem.js");
photonui.TabLayout = require("./layout/tablayout.js");
photonui.IconButton = require("./interactive/iconbutton.js");
photonui.Template = require("./visual/template.js");
photonui.BaseDataView = require("./dataview/basedataview.js");
photonui.ListView = require("./dataview/listview.js");
// [generator]
// DO NOT MODIFY/REMOVE THE PREVIOUS COMMENT, IT IS USED BY THE WIDGET GENERATOR!

module.exports = photonui;
