var box = new photonui.BoxLayout();

var button1 = new photonui.Button({text: "Vertical Layout"});
box.addChild(button1);
button1.registerCallback(
    "btnclick",
    "click",
    function(widget, event) {
        box.orientation = "vertical";
    }
);

var button2 = new photonui.Button({text: "Horizontal Layout"});
box.addChild(button2);
button2.registerCallback(
    "btnclick",
    "click",
    function(widget, event) {
        box.orientation = "horizontal";
    }
);

var button3 = new photonui.Button();
box.addChild(button3);

photonui.domInsert(box, document.getElementById("widget-area"));

