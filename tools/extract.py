#!/usr/bin/python
# -*- coding: UTF-8 -*-


"""Stone.js string extractor -- Extract strings from javascript files and
build / update translations files (.pot/.po).
"""


import os
import sys
import datetime
import argparse

import jslex
import polib


STRINGS = {}
FUNCTIONS = []


def ls_file(path, ext="js"):
    for root, folders, files in os.walk(path):
        for file_ in files:
            if file_.split(".")[-1].lower() == ext.lower():
                yield os.path.join(root, file_)


def js_string_extractor(path):
    js = open(path, "r").read().decode("utf-8")
    lexer = jslex.JsLexer()
    fname = False
    infn = False
    buff = ""
    line = 1
    stline = 1
    for name, token in lexer.lex(js):
        if name in ("ws", "linecomment", "comment"):
            line += token.count("\n")
            continue
        if not fname:
            if name == "id" and token in FUNCTIONS:
                fname = True
        else:
            if not infn:
                if name == "punct" and token == "(":
                    infn = True
                    stline = line
                else:
                    fname = False
            else:
                if name == "string":
                    if token[0] == "'":
                        buff += token[1:-1].replace("\\'", "'")
                    else:
                        buff += token[1:-1].replace('\\"', '"')
                elif name == "punct" and token in (")", ","):
                    if buff:
                        if not buff in STRINGS:
                            STRINGS[buff] = []
                        STRINGS[buff].append([path, stline])
                    buff = ""
                    fname = False
                    infn = False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", metavar="PATH", nargs="+",
            help="Source files and directories")
    parser.add_argument("-o", "--output",
            default="l10n/",
            help="the output folder for translations (default: 'l10n/')",
    )
    parser.add_argument("-f", "--functions-name",
            default="_,gettext,lazyGettext",
            help="the name of the translation functions separated by a comma (default: '_,gettext,lazyGettext')",
    )
    args = parser.parse_args()

    if not os.path.isdir(args.output):
        os.makedirs(args.output)

    FUNCTIONS = args.functions_name.split(",")

    print("\nExtracting strings...")
    for path in args.paths:
        if os.path.isfile(path):
            print("  * %s" % path)
            js_string_extractor(path)
        elif os.path.isdir(path):
            for file_ in ls_file(path, "js"):
                print("  * %s" % file_)
                js_string_extractor(file_)
        else:
            print("E: No such file or directory '%s'" % path)
            sys.exit(1)

    print("\nGenerating catalog...")
    catalog = polib.POFile()
    catalog.metadata = {
        "Project-Id-Version": "1.0",
        "Language": "Unknown",
        "Report-Msgid-Bugs-To": "you@example.com",
        "POT-Creation-Date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M%z"),
        "PO-Revision-Date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M%z"),
        "Last-Translator": "you <you@example.com>",
        "Language-Team": "English <yourteam@example.com>",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Transfer-Encoding": "8bit",
    }
    for msgid in STRINGS:
        catalog.append(polib.POEntry(
            msgid=msgid,
            msgstr="",
            occurrences=STRINGS[msgid],
        ))

    catalog.save(os.path.join(args.output, "catalog.pot"))

    print("\nUpdating translations...")
    for file_ in ls_file(args.output, "po"):
        print("  * %s" % file_)
        po = polib.pofile(file_)
        po.merge(catalog)
        po.save(file_)
