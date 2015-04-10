hideWidgetArea();

// Create the Dialog
var dlg = new photonui.Dialog({
    title: "My Dialog",
    x: 50, y: 100,
    visible: true,
    padding: 20,
    child: new photonui.Label({
  name: "label",
  text: "Hello, I'm a dialog window!"
    }),
    buttons: [
  new photonui.Button({name: "btn-ok", text: "Ok"}),
  new photonui.Button({name: "btn-notok", text: "You lie!"})
    ]
});

// Buttons events
photonui.getWidget("btn-ok").registerCallback(
    "click",     // Event id
    "click",     // wEvent
    function(widget) { // Callback
  var label = photonui.getWidget("label");
  label.text = "Cool :)";
    }
);

photonui.getWidget("btn-notok").registerCallback(
    "click",     // Event id
    "click",     // wEvent
    function(widget) { // Callback
  var label = photonui.getWidget("label");
  label.text = "Hello, I'm a dialog window, TRUST ME!";
    }
);

// Close the dialog
dlg.registerCallback("close", "close-button-clicked", dlg.destroy, dlg);
  
