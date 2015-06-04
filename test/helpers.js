

var DummyWidget = photonui.Widget.$extend({

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
        this.__html.ul = document.createElement("div");
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
