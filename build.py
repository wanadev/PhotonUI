#!/usr/bin/python
# -*- coding: UTF-8 -*-

# Copyright (c) 2014, Wanadev <http://www.wanadev.fr/>
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
#   * Redistributions of source code must retain the above copyright notice, this
#     list of conditions and the following disclaimer.
#   * Redistributions in binary form must reproduce the above copyright notice,
#     this list of conditions and the following disclaimer in the documentation
#     and/or other materials provided with the distribution.
#   * Neither the name of Wanadev nor the names of its contributors may be used
#     to endorse or promote products derived from this software without specific
#     prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
# Authored by: Fabien LOISON <http://flozz.fr/>


"""Merge PhotonUI into three files: "photonui.js" (PhotonUI javascript),
"photonui.css" (PhotonUI required CSS) and "photonui-theme.css" (PhotonUI
default theme).
"""


import os
import sys
import json
import shutil
import argparse


PHOTONUI_PATH = "./photonui/"
PHOTONUI_PACKAGES_FILE = "./photonui.json"


class PhotonUiBuilder(object):
    """List all needed modules/files/assets for the build.

    Args:
        module_index -- The index of all available modules.
    """

    def __init__(self, module_index):
        """The constructor."""
        self._module_index = module_index;
        self._modules_priority = {}  # moduleName: priority
        self.modules = []

    def add_modules(self, modules):
        """Add one or more modules to the build.

        Args:
            modules -- A module or a list of modules to add in the build.
        """
        if not type(modules) in (list, dict):
            modules = [modules]
        for moduleName in modules:
            self._calc_priority(moduleName)
        self.modules = self._modules_priority.keys()
        self.modules.sort(key=lambda moduleName: self._modules_priority[moduleName])

    def get_javascript(self):
        """Get the Javascipt files list.

        Return:
            A generator that lists the javascript files.
        """
        for moduleName in self.modules:
            for file_ in self._module_index[moduleName]["javascript"]:
                yield file_

    def get_css(self):
        """Get the CSS files list.

        Return:
            A generator that lists the CSS files.
        """
        for moduleName in self.modules:
            for file_ in self._module_index[moduleName]["css"]:
                yield file_

    def get_theme_css(self):
        """Get the theme CSS files list.

        Return:
            A generator that lists the theme CSS files.
        """
        for moduleName in self.modules:
            for file_ in self._module_index[moduleName]["themeCss"]:
                yield file_

    def get_assets(self):
        """Get the asset files list.

        Return:
            A generator that lists the asset files.
        """
        for moduleName in self.modules:
            for file_ in self._module_index[moduleName]["assets"]:
                yield file_

    def _calc_priority(self, moduleName):
        """Calculate the priority of each module."""
        if moduleName in self._modules_priority:
            return self._modules_priority[moduleName]

        self._modules_priority[moduleName] = 1;
        for depName in self._module_index[moduleName]["dependencies"]:
            self._modules_priority[moduleName] += self._calc_priority(depName)
        return self._modules_priority[moduleName]


if __name__ == "__main__":
    # Get PhotonUI modules
    photonui_modules = json.load(open(PHOTONUI_PACKAGES_FILE, "r"))

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-l", "--list",
            action="store_const",
            const=True,
            help="show the available modules and exit",
    )
    parser.add_argument("-a", "--list-all",
            action="store_const",
            const=True,
            help="show all the available modules (including abstract ones) and exit",
    )
    parser.add_argument("-o", "--output",
            default="./photonui.out/",
            help="the output directory ('./photonui.out/' by default)",
    )
    parser.add_argument("module",
            nargs="*",
            default=photonui_modules.keys(),
            help="modules to include in the build (by default, all modules are included)",
    )
    args = parser.parse_args()

    # List modules
    if args.list:
        print(", ".join(sorted(filter(lambda k: not photonui_modules[k]["abstract"], photonui_modules.keys()))))
        sys.exit(0)

    # List all modules
    if args.list_all:
        print(", ".join(sorted(photonui_modules.keys())))
        sys.exit(0)

    # Check arg modules
    for module in args.module:
        if not module in photonui_modules:
            print("Error: the module does not exist: %s" % module)
            sys.exit(1)

    # Initialize builder and print included modules
    builder = PhotonUiBuilder(photonui_modules)
    builder.add_modules(args.module)
    print("The following modules will be included in the build:\n")
    print(", ".join(builder.modules))

    # Create the output directory if not exists
    if not os.path.isdir(args.output):
        os.makedirs(args.output)

    # Merge javascript
    print("\n\nMerging javascripts:\n")
    output = open(os.path.join(args.output, "photonui.js"), "w")
    output.write("var photonui = (function(window, undefined) {\n")
    for file_ in builder.get_javascript():
        print("  * %s" % file_)
        output.write("\n/%s\n * %-73s *\n %s/\n\n"  % ("*"*77, file_, "*"*76))
        output.write(open(os.path.join(PHOTONUI_PATH, file_), "r").read())
    output.write("\nreturn photonui;\n})(window);")
    output.close()

    # Merge CSS
    print("\n\nMerging required CSS:\n")
    output = open(os.path.join(args.output, "photonui.css"), "w")
    for file_ in builder.get_css():
        print("  * %s" % file_)
        output.write("\n/%s\n * %-73s *\n %s/\n\n"  % ("*"*77, file_, "*"*76))
        output.write(open(os.path.join(PHOTONUI_PATH, file_), "r").read())
    output.close()

    # Merge Theme CSS
    print("\n\nMerging theme CSS:\n")
    output = open(os.path.join(args.output, "photonui-theme.css"), "w")
    for file_ in builder.get_theme_css():
        print("  * %s" % file_)
        output.write("\n/%s\n * %-73s *\n %s/\n\n"  % ("*"*77, file_, "*"*76))
        output.write(open(os.path.join(PHOTONUI_PATH, file_), "r").read())
    output.close()

    # Add Assets
    print("\n\nCopying assets:\n")
    dest = os.path.join(args.output, "assets");
    for file_ in builder.get_assets():
        if not os.path.isdir(dest):
            os.makedirs(dest)
        print("  * %s" % file_)
        shutil.copy(os.path.join(PHOTONUI_PATH, file_), dest)
