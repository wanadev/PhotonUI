function addTitle(text) {
    var workingArea = document.getElementById("working-area");
    if (!workingArea) {
        workingArea = document.getElementsByTagName("body")[0];
    }
    var h1 = document.createElement("h1");
    h1.appendChild(document.createTextNode(text));
    workingArea.appendChild(h1);
}

function addTestArea() {
    var workingArea = document.getElementById("working-area");
    if (!workingArea) {
        workingArea = document.getElementsByTagName("body")[0];
    }
    var div = document.createElement("div");
    div.className = "test-area";
    workingArea.appendChild(div);
    return div;
}


var DummyWidget = photonui.Widget.$extend({

    __init__: function(params) {
        this.$super(params);
        this._updateProperties(["text"]);
    },

    _text: "Widget",

    getText: function() {
        return this._text;
    },

    setText: function(text) {
        this._text = text;
        photonui.Helpers.cleanNode(this.__html.div);
        this.__html.div.appendChild(document.createTextNode(this._text));
        this.__html.div.title = this._text;
    },

    getHtml: function() {
        return this.__html.div;
    },

    _buildHtml: function() {
        this.__html.div = document.createElement("div");
        this.__html.div.className = "photonui-widget photonui-dummywidget";
    }
});


var DummyContainer = photonui.Container.$extend({

    getHtml: function() {
        return this.__html.div;
    },

    getContainerNode: function() {
        return this.__html.div;
    },

    _buildHtml: function() {
        this.__html.div = document.createElement("div");
        this.__html.div.className = "photonui-widget photonui-dummycontainer photonui-container";
    }
});


var DummyLayout = photonui.Layout.$extend({

    getHtml: function() {
        return this.__html.ul;
    },

    _buildHtml: function() {
        this.__html.ul = document.createElement("ul");
        this.__html.ul.className = "photonui-widget photonui-dummylayout";
    },

    _updateLayout: function() {
        photonui.Helpers.cleanNode(this.__html.ul);

        var children = this.children;  // Cache for perf
        var fragment = document.createDocumentFragment();

        var li;
        for (var i=0 ; i<children.length ; i++) {
            li = document.createElement("li");
            li.className = "photonui-container";
            li.appendChild(children[i].html);
            fragment.appendChild(li);
        }

        this.__html.ul.appendChild(fragment);
    }
});


function toBeAlmostEqualToMatcher() {
    return {
        compare: function(value1, value2, precision) {
            precision = precision || 1;

            if (value1 >= value2 - precision && value1 <= value2 + precision) {
                return {
                    pass: true,
                    message: "Expected " + value1 + " NOT to be almost equal to " + value2 + " (precision: " + precision + ")"
                };
            }
            else {
                return {
                    pass: false,
                    message: "Expected " + value1 + " to be almost equal to " + value2 + " (precision: " + precision + ")"
                };
            }
        }
    };
}
