var canvas = new photonui.Canvas({
    width: 200,
    height: 150
});

photonui.domInsert(canvas, "demo");

var ctx = canvas.getContext("2d");

ctx.lineWidth = 3;
ctx.strokeStyle = "#DB624F";

ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(40, 140);
ctx.lineTo(50, 30);
ctx.lineTo(190, 100);
ctx.stroke();
