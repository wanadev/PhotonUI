# PhotonUI - A javascript framework to create user interfaces

[ ![NPM Version](http://img.shields.io/npm/v/photonui.svg?style=flat) ](https://www.npmjs.com/package/photonui)
[ ![License](http://img.shields.io/npm/l/photonui.svg?style=flat) ](https://github.com/wanadev/PhotonUI/blob/master/LICENSE)

PhotonUI is a work in progress javascript framework to create rich web user interfaces without having to manipulate any HTML nor CSS.

* **Website:** http://wanadev.github.io/PhotonUI/
* **Quick start:** http://wanadev.github.io/PhotonUI/doc/quick-start.html


## Getting Started

### Standalone Version

All the files you need are in the `dist` folder. You just have to import

* `photonui-base.css` (must be imported first),
* `photonui-theme-particle.css`,
* and`photonui.js` (or `photonui.min.js`)

in your page:


```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Boilerplate</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <link type="text/css" rel="stylesheet" href="dist/photonui-base.css" />
        <link type="text/css" rel="stylesheet" href="dist/photonui-theme-particle.css" />
        <script src="dist/photonui.js"></script>
        
    </head>
    <body>
    </body>
</html>
```


### NPM and Browserify

If you are using [Browserify][browserify] in your project, a [NPM package][npm] is available. To install it, juste type:

```
npm install --save photonui
```

then, to use it in your project you just have to import PhotonUI:

```js
var photonui = require("photonui");
```

**NOTE:** do not forget to import CSS files in yout HTML page:

```html
<link rel="stylesheet" href="./node_modules/photonui/dist/photonui-base.css" />
<link rel="stylesheet" href="./node_modules/photonui/dist/photonui-theme-particle.css" />
```


## Hacking

PhotonUI is built using [Grunt][grunt], [Less][less] and [Browserify][browserify]. If you want to hack it, you will have to install few tools.


### Installing Dependencies

To build PhotonUI, you will first have to install [Node.js][nodejs] (or [io.js][iojs]).

**NOTE:** If you are on Ubuntu / Debian Linux you must install the `nodejs-legacy` package.

Next, install globaly the `grunt-cli` npm package:

    npm install -g grunt-cli

Then install the PhotonUI's dependencies:

    npm install


### Building PhotonUI

Once the build stuff and dependencies installed, you just have to run the `grunt` command to build PhotonUI:

    grunt

All generated files are in the `dist` folder.

**NOTE:** during the development, it can be annoying to run the `grunt` command every time you make a change. You can instead run the following command to automatically rebuild what changed each time you modify a file:

    grunt watch


### Coding Style

PhotonUI follows the [Yandex Javascript CodeStyle][codestyle-yandex] **EXCEPT** for the quote marks where we use **double quotes** (`"`).

You can automatically check your code follows the conventions by using this command:

    grunt jscs


### Testing

To run the PhotonUI tests, you can use the following command:

    grunt test

**BUT** some tests will fail because [PhantomJS][phantomjs], the browser used to run the tests, embedded a very old Webkit version. So you currently have to launch the tests manually in your browser:

1. Check that the javascript is well formed: `grunt jshint`
2. Check that the code follows our coding style: `grunt jscs`
3. Build PhotonUI: `grunt`
4. Run the tests: open `test/index.html` in your browser.


### Creating Your Own widgets

If you want to create you own PhotonUI widgets, first read this:

* http://wanadev.github.io/PhotonUI/doc/custom-widget.html

The documentation above explain how to create a custom widget **outside** of the PhotonUI project.

Once you feel comfortable with the custom widget creation, you can create widgets inside the PhotonUI project. We created a [Yeoman][yo] generator that creates all required files for you:

* https://github.com/wanadev/generator-photonui-widget


## Related projects:

* [photonui-site](https://github.com/wanadev/photonui-site): The PhotonUI's site
* [generator-photonui-widget](https://github.com/wanadev/generator-photonui-widget): The PhotonUI widget generator




[browserify]: http://browserify.org/
[npm]: https://www.npmjs.com/package/photonui
[grunt]: http://gruntjs.com/
[less]: http://lesscss.org/
[nodejs]: https://nodejs.org/
[iojs]: https://iojs.org/
[phantomjs]: http://phantomjs.org/
[yo]: http://yeoman.io/
[codestyle-yandex]: https://github.com/yandex/codestyle/blob/master/javascript.md
