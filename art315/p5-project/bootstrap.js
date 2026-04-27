"use strict";

// Bootstrap: start the sketch when the sketch container is present in the DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log('[bootstrap] DOMContentLoaded, attempting to start sketch if holder exists');
  if (typeof window.startSketch === 'function') {
    const holder = document.getElementById("sketch-holder");
    if (holder) {
      window.startSketch();
    }
  }
});
