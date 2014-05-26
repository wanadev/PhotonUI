#!/bin/bash


# Python setup / check

for path in ${PATH//:/ } ; do
    if [ -z $PYTHON ] || [ \! -x $PYTHON ] ; then
        if [ -x $path/python2.7 ] ; then
            PYTHON=$path/python2.7
        elif [ -x $path/python2 ] ; then
            PYTHON=$path/python2
        elif [ -x $path/python ] ; then
            PYTHON=$path/python
        fi
    fi
done

if [ -z $PYTHON ] ; then
    echo -e "\e[1;31mE: Unable to find Python\e[0m\n"
    echo -e "You can specify the path to Python by running this script with"
    echo -e "the following command:\n"
    echo -e "    PYTHON=/path/to/python ./stone.js"
    exit 1
fi

$PYTHON <<< "import jslex" > /dev/null 2> /dev/null || {
    echo -e "\e[1;31mE: Unable to find the jslex Python module\e[0m\n"
    echo -e "You can install it with the following command:\n"
    echo -e "    pip install jslex"
    echo -e "    easy_install jslex    # Mac OS"
    exit 1
}

$PYTHON <<< "import polib" > /dev/null 2> /dev/null || {
    echo -e "\e[1;31mE: Unable to find the polib Python module\e[0m\n"
    echo -e "You can install it with the following command:\n"
    echo -e "    pip install polib"
    echo -e "    easy_install polib    # Mac OS"
    exit 1
}


# Check Params and run tools

if [ "$1" == extract ] ; then
    shift
    $PYTHON tools/extract.py "$@"
    exit $?
elif [ "$1" == build ] ; then
    shift
    $PYTHON tools/build.py "$@"
    exit $?
elif [ "$1" == merge ] ; then
    shift
    $PYTHON tools/merge.py "$@"
    exit $?
else
    echo -e "STONE.JS TOOLS"
    echo -e "\nUSAGE:"
    echo -e "    ./stone.sh <command> [params]"
    echo -e "    ./stone.sh <command> --help"
    echo -e "\nCOMMANDS:"
    echo -e "    extract -- Extract strings from js files and update locales (.po)"
    echo -e "    build   -- Build locales (.po -> .json)"
    echo -e "    merge   -- Merge all JSONs into one JSON file containing all translations"
    echo -e "               for all languages"
    exit 1
fi
