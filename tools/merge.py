#!/usr/bin/python
# -*- coding: UTF-8 -*-


"""Stone.js merger -- Merge built JSONs into a single JSON or a Javascript."""


import os
import sys
import json
import argparse


CATALOGS = {}


def ls_file(path, ext="js"):
    for root, folders, files in os.walk(path):
        for file_ in files:
            if file_.split(".")[-1].lower() == ext.lower():
                yield os.path.join(root, file_)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", metavar="PATH", 
            help="Path to the directory that contains translations JSONs")
    parser.add_argument("-o", "--output",
            default=None,
            help="the output file (if not specified, file will be wrote in the same directory than the input)",
    )
    parser.add_argument("-f", "--format",
            default="json",
            choices=['json', 'js'],
            help="the output format: 'json' or 'js' (defautl: json)",
    )
    args = parser.parse_args()

    if not os.path.isdir(args.path):
        print("E: The source folder does not exists (%s)" % args.source)
        sys.exit(1)

    OUTPUT = args.output if args.output != None else os.path.join(args.path, "catalog.%s" % args.format)

    print("\nReading JSONs...")
    for file_ in ls_file(args.path, "json"):
        if file_ == OUTPUT:
            continue
        print("  * %s" % file_)
        json_l10n = json.loads(open(file_, "r").read().decode("utf-8"))
        CATALOGS.update(json_l10n);

    print("\nWriting merged file...")
    result = json.dumps(CATALOGS, sort_keys=True, indent=4, ensure_ascii=False,
                encoding="utf-8").encode("utf-8")
    if args.format == "js":
        result = "Stone.addCatalogs(" + result + ");"
    open(OUTPUT, "w").write(result)
