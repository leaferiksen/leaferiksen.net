window.onload = function () {
  setTimeout(glowStart, 1000);
};
function glowStart() {
  var toggleLabel = document.getElementById("toggle-label");
  toggleLabel.classList += "glow";
  setTimeout(glowEnd, 2000);
}
function glowEnd() {
  var toggleLabel = document.getElementById("toggle-label");
  toggleLabel.classList -= "glow";
}
