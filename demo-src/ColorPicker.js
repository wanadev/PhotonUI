document.body.innerHTML += '<div id="infos" style="position: absolute; top: 380px; left: 40px; font-family: monospace"></div>';

var e = document.getElementById("infos");

function onValueChanged() {
    var html = "Color name: " + cp.color.hexString + "<br />";
    html += "<br />";
    html += "Red: " + cp.color.red + "<br />";
    html += "Green: " + cp.color.green + "<br />";
    html += "Blue: " + cp.color.blue + "<br />";
    html += "Alpha: " + cp.color.alpha + "<br />";
    html += "<br />";
    html += "Hue: " + cp.color.hue + "<br />";
    html += "Saturation: " + cp.color.saturation + "<br />";
    html += "Brightness: " + cp.color.brightness + "<br />";
    e.innerHTML = html;
}

var cp = new photonui.ColorPicker();
cp.registerCallback("change", "value-changed", onValueChanged);
onValueChanged();

photonui.domInsert(cp, document.getElementById("widget-area"));
  
