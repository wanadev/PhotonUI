var img = new photonui.Image({
    url: "../../images/favicon.png"
});

var mouse = new photonui.MouseManager({
    element: img,
    callbacks: {
        "click": function(manager, mstate) {
            alert("You clicked on the image at " + 
                  mstate.x + ", " + mstate.y);
        }
    }
});

photonui.domInsert(img, "demo");
