"use strict";

// Watches for insertion/removal of the sketch container and starts/stops the sketch accordingly.
;(function() {
  // Start only if not already active
  const ensureInitialized = () => {
    const holder = document.getElementById('sketch-holder');
    const isActive = holder && holder.dataset && holder.dataset.sketchActive === 'true';
    if (holder && !isActive) {
      console.log('[view-watcher] Detected sketch-holder; starting sketch');
      if (typeof window.startSketch === 'function') {
        window.startSketch();
      }
      return true;
    }
    if (!holder && isActive) {
      console.log('[view-watcher] Sketch holder removed; stopping sketch');
      if (typeof window.stopSketch === 'function') {
        window.stopSketch();
      }
      return true;
    }
    return !!holder;
  };

  const observer = new MutationObserver(() => {
    ensureInitialized();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  // Initial check in case the holder is already present
  ensureInitialized();
})();
