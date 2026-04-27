"use strict";

// Standalone P5 sketch controller. Exposes startSketch and stopSketch for integration with router.
(function () {
	let sketchInstance = null;
	let holder = null;

	function startSketch() {
		if (sketchInstance) return;
		holder = document.getElementById("sketch-holder");
		if (!holder) return;

		sketchInstance = new p5((p) => {
			let word = "WHEN WE ARE GONE";
			let started = false;
			let startX;
			let wordY;
			let startSize = 10;
			let endSize = 100;
			let w = holder.clientWidth;
			let h = holder.clientHeight;

			p.setup = () => {
				p.createCanvas(w, h).parent(holder);
				startX = p.width / 2;
				wordY = p.height * (2 / 3);
			};

			p.draw = () => {
				// Start animation only after a mouse click
				if (!started) return;
				// Clear canvas to transparent so CSS background image shows through
				p.clear();
				// Animate word along a diagonal path toward bottom-left, increasing size
				let size = p.lerp(startSize, endSize, 0.01);
				p.textSize(size);
				// End position off-screen to the bottom-left
				let endXLocal = -p.textWidth(word);
				let cx = p.lerp(startX, endXLocal, t);
				// Diagonal movement: linear from center to bottom-left
				let y = p.lerp(wordY, p.height + 20, t);
				// Tilted rendering
				p.fill(255);
				p.textAlign(p.CENTER, p.CENTER);
				p.translate(cx, y);
				p.rotate(-0.1);
				p.text(word, 0, 0);
			};

			p.mouseClicked = () => {
				// Start the animation on first click inside the canvas
				if (!started) {
					started = true;
					t = 0;
				}
				return false; // prevent default
			};
		}, holder);
		console.log("P5 sketch started");
		// Indicate active state with DOM attribute on holder
		if (holder) holder.dataset.sketchActive = "true";
	}

	function stopSketch() {
		if (sketchInstance) {
			sketchInstance.remove();
			sketchInstance = null;
		}
		if (holder) {
			holder.innerHTML = "";
			holder = null;
		}
		console.log("P5 sketch stopped");
		if (holder) holder.dataset.sketchActive = "false";
	}

	window.startSketch = startSketch;
	window.stopSketch = stopSketch;
})();
