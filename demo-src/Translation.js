var tr = new photonui.Translation();

tr.addCatalogs({
    "fr": {
  "Hello World": "Bonjour le monde",
  'Browser language is "{lang}".': "La langue du navigateur est « {lang} ».",
  "Close": "Fermer"
    },
    "it": {
  "Hello World": "Buongiorno il mondo",
  'Browser language is "{lang}".': 'La lingua del browser è "{lang}".',
  "Close": "Chiudere"
    }
});

tr.locale = tr.guessUserLanguage();

var layout = new photonui.BoxLayout({
    orientation: "vertical",
    children: [
  new photonui.Label({
text: _('Browser language is "{lang}".', {
    lang: tr.guessUserLanguage()
})
  }),
  new photonui.Select({
name: "lang",
placeholder: "Choose a language...",
value: tr.locale,
children: [
    new photonui.MenuItem({value: "en", text: "English"}),
    new photonui.MenuItem({value: "fr", text: "Français"}),
    new photonui.MenuItem({value: "it", text: "Italiano"}),
],
callbacks: {
    "value-changed": function(widget, value) {
  tr.locale = value;
    }
}
  })
    ]
});


photonui.domInsert(layout, document.getElementById("widget-area"));

var win = new photonui.Window({
    visible: true,
    title: _("Hello World"),
    x: 300, y: 100,
    width: 130,
    padding: 20,
    child: new photonui.Button({
  text: _("Close"),
  callbacks: {
"click": function() { win.hide(); }
  }
    }),
    callbacks: {
  "close-button-clicked": function(widget) { widget.hide(); }
    }
});
  