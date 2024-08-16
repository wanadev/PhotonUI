Things to do while releasing a new version
==========================================

This file is a memo for the maintainer.


0. Checks
---------

* Check Copyright years in the LICENSE file
* Check there will be no trash in the package (``npm pack``)


1. Release
----------

* Build ``dist/*.js`` and ``CREDITS.txt`` files: ``npx grunt``
* Update version number in ``package.json``
* Edit / update changelog in ``README.md``
* Commit / tag (``git commit -m vX.Y.Z && git tag vX.Y.Z && git push && git push --tags``)


2. Publish NPM package
-----------------------

* ``npm publish``


3. Publish Github Release
-------------------------

* Make a release on Github
* Add changelog


4. Update documentation website
-------------------------------

* https://github.com/wanadev/photonui-site
