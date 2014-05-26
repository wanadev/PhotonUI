#!/usr/bin/python
# -*- coding: UTF-8 -*-


"""Stone.js locale builder -- Build .po files into JSON."""


import os
import sys
import json
import argparse

import polib


def ls_file(path, ext="js"):
    for root, folders, files in os.walk(path):
        for file_ in files:
            if file_.split(".")[-1].lower() == ext.lower():
                yield os.path.join(root, file_)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", metavar="PATH", 
            help="Path to the directory that contains translations")
    parser.add_argument("-o", "--output",
            default=None,
            help="the JSONs output folder (if not specified, the JSONs will be written in the same folder than the .po files)",
    )
    args = parser.parse_args()

    if not os.path.isdir(args.path):
        print("E: The source folder does not exists (%s)" % args.source)
        sys.exit(1)

    OUTPUT = args.output if args.output != None else args.path

    if not os.path.isdir(OUTPUT):
        os.makedirs(OUTPUT)

    print("\nBuilding translations...")
    for file_ in ls_file(args.path, "po"):
        lang = file_.split("/")[-1].split(".")[0]
        catalog = {lang: {}}
        print("  * %s" % file_)
        po = polib.pofile(file_)
        for entry in [e for e in po.translated_entries() if not e.obsolete]:
            catalog[lang][entry.msgid] = entry.msgstr
        open(os.path.join(OUTPUT, "%s.json" % lang), "w").write(
                json.dumps(catalog, sort_keys=True, indent=4, ensure_ascii=False,
                    encoding="utf-8").encode("utf-8"))
