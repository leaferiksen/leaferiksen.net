"use strict";

// Standalone P5 sketch controller. Exposes startSketch and stopSketch for integration with router.
let _sketchInstance = null;
let _holder = null;

function startSketch() {
	if (_sketchInstance) return;
	_holder = document.getElementById("sketch-holder");
	if (!_holder) return;

	_sketchInstance = new p5((p) => {
		let word = "WHEN WE ARE GONE";
		let t = 0;
		let started = false;
		let startX;
		let wordY;
		let startSize = 10;
		let endSize = 100;
		let w = _holder.clientWidth;
		let h = _holder.clientHeight;

		p.setup = () => {
			p.createCanvas(w, h).parent(_holder);
			startX = p.width / 2;
			wordY = p.height * (2 / 3);
		};

		p.draw = () => {
			// Start animation only after a mouse click
			if (!started) return;
			// Clear canvas to transparent so CSS background image shows through
			p.clear();
			// Animate word along a diagonal path toward bottom-left, increasing size
			let size = p.lerp(startSize, endSize, t);
			p.textSize(size);
			// End position off-screen to the bottom-left
			let endXLocal = -p.textWidth(word);
			let cx = p.lerp(startX, endXLocal, t);
			// Diagonal movement: linear from center to bottom-left
			let y = p.lerp(wordY, p.height + 20, t);
			p.fill(255);
			p.textAlign(p.CENTER, p.CENTER);
			p.push();
			p.translate(cx, y);
			p.rotate(-0.2);
			p.text(word, 0, 0);
			p.pop();
			if (t < 1) t += 0.01;
		};

		p.mouseClicked = () => {
			// Start the animation only if clicking inside the canvas
			if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
				if (!started) {
					started = true;
					t = 0;
				}
			}
		};
	}, _holder);
	console.log("P5 sketch started");
}

function stopSketch() {
	if (_sketchInstance) {
		_sketchInstance.remove();
		_sketchInstance = null;
	}
	if (_holder) {
		_holder.innerHTML = "";
		_holder = null;
	}
	console.log("P5 sketch stopped");
}

window.startSketch = startSketch;
window.stopSketch = stopSketch;
