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
 * @main PhotonUI
 * @namespace photonui
 */


var photonui = {};

photonui.Helpers = require("./helpers.js");
photonui.Base = require("./base.js");
photonui.Widget = require("./widget.js");

photonui.FileManager = require("./misc/filemanager.js");
photonui.Translation = require("./misc/translation.js");

photonui.AccelManager = require("./event/accelmanager.js");
photonui.MouseManager = require("./event/mousemanager.js");

photonui.BaseIcon = require("./visual/baseicon.js");
photonui.FAIcon = require("./visual/faicon.js");
photonui.Image = require("./visual/image.js");
photonui.SpriteSheet = require("./visual/spritesheet.js");
photonui.SpriteIcon = require("./visual/spriteicon.js");
photonui.Canvas = require("./visual/canvas.js");
photonui.Label = require("./visual/label.js");
photonui.Text = require("./visual/text.js");
photonui.ProgressBar = require("./visual/progressbar.js");
photonui.Separator = require("./visual/separator.js");

photonui.Button = require("./input/button/button.js");
photonui.ColorButton = require("./input/button/colorbutton.js");

photonui.CheckBox = require("./input/checkbox/checkbox.js");
photonui.Switch = require("./input/checkbox/switch.js");
photonui.ToggleButton = require("./input/checkbox/togglebutton.js");

photonui.Color = require("./input/color/color.js");
photonui.ColorPalette = require("./input/color/colorpalette.js");
photonui.ColorPicker = require("./input/color/colorpicker.js");

photonui.Field = require("./input/field/field.js");
photonui.NumericField = require("./input/field/numericfield.js");
photonui.TextAreaField = require("./input/field/textareafield.js");
photonui.TextField = require("./input/field/textfield.js");

photonui.Select = require("./input/select/select.js");
photonui.FontSelect = require("./input/select/fontselect.js");

photonui.Slider = require("./input/slider/slider.js");

photonui.Container = require("./container/container.js");
photonui.Layout = require("./container/layout/layout.js");
photonui.BoxLayout = require("./container/layout/boxlayout.js");
photonui.FluidLayout = require("./container/layout/fluidlayout.js");
photonui.GridLayout = require("./container/layout/gridlayout.js");

photonui.Menu = require("./container/menu/menu.js");
photonui.MenuItem = require("./container/menu/menuitem.js");
photonui.SubMenuItem = require("./container/menu/submenuitem.js");

photonui.Viewport = require("./container/viewport/viewport.js");

photonui.BaseWindow = require("./container/window/basewindow.js");
photonui.Window = require("./container/window/window.js");
photonui.PopupWindow = require("./container/window/popupwindow.js");
photonui.Dialog = require("./container/window/dialog.js");

photonui.ColorPickerDialog = require("./composite/colorpickerdialog.js");
photonui.PopupMenu = require("./composite/popupmenu.js");

photonui.domInsert = photonui.Widget.domInsert;
photonui.getWidget = photonui.Widget.getWidget;

// Include libraries in module.
photonui.lib = {};
photonui.lib.Class = require("classyjs");
photonui.lib.KeyboardJS = require("keyboardjs");
photonui.lib.Stone = require("../lib/stone");

module.exports = photonui;
