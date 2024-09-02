var translation = new photonui.Translation();

translation.addCatalogs({
    "fr": {
        "messages": {
            "Hello World": ["Bonjour le monde"]
        }
    }
});

translation.locale = "fr";  // Change the locale to test

var label = new photonui.Label({
    text: _("Hello World")
});

photonui.domInsert(label, "demo");
