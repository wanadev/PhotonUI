var pos = photonui.Helpers.getAbsolutePosition("demo");

var popup = new photonui.PopupWindow({
    padding: 10,
    width: 200,
    height: 200,
    child: new photonui.Label({
        text: "Click anywhere to close"
    })
});

popup.popupXY(pos.x, pos.y);
