document.getElementById("widget-area").style.width = "200px";

var pbar = new photonui.ProgressBar({pulsate: true});

function progress() {
    if (pbar.value < 1) {
  pbar.pulsate = false;
  pbar.value += 0.05;
  setTimeout(progress, 100);
    }
}
setTimeout(progress, 3000);

photonui.domInsert(pbar, document.getElementById("widget-area"));
  
