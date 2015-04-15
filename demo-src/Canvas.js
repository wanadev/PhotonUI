var canvas = new photonui.Canvas();

var ctx = canvas.getContext("2d");
ctx.lineWidth = 2;
ctx.strokeStyle = "#07656D";

for (var i=0 ; i<3 ; i++) {
    var w = Math.floor((Math.random() * 100) + 10);
    var h = Math.floor((Math.random() * 100) + 10);
    var x = Math.floor((Math.random() * (canvas.width - w)));
    var y = Math.floor((Math.random() * (canvas.height - h)));
    ctx.strokeRect(x, y, w, h);
}

photonui.domInsert(canvas, document.getElementById("widget-area"));

