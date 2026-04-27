"use strict";

// Standalone P5 sketch controller. Exposes startSketch and stopSketch for integration with router.
let _sketchInstance = null;
let _holder = null;

function startSketch() {
	if (_sketchInstance) return;
	_holder = document.getElementById("sketch-holder");
	if (!_holder) return;

	_sketchInstance = new p5((p) => {
		let words = [
			{ text: "WHEN", t: 0, started: false },
			{ text: "WE", t: 0, started: false },
			{ text: "ARE", t: 0, started: false },
			{ text: "GONE", t: 0, started: false },
		];
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
			p.clear();

			// Draw pulsing indicator if there are words left to start
			const remaining = words.filter((w) => !w.started).length;
			if (remaining > 0) {
				p.push();
				p.noStroke();
				p.fill(255, 255, 255, 150 + p.sin(p.frameCount * 0.1) * 50);
				p.circle(startX, wordY, 20 + p.sin(p.frameCount * 0.1) * 5);
				p.pop();
			}

			words.forEach((w) => {
				if (!w.started) return;

				// Animate word along a diagonal path toward bottom-left, increasing size
				let size = p.lerp(startSize, endSize, w.t);
				p.textSize(size);
				p.fill(255);
				p.textAlign(p.CENTER, p.CENTER);

				// End position off-screen to the bottom-left
				let endXLocal = -p.textWidth(w.text);
				let cx = p.lerp(startX, endXLocal, w.t);
				let y = p.lerp(wordY, p.height + 20, w.t);

				p.push();
				p.translate(cx, y);
				p.rotate(-0.2);
				p.text(w.text, 0, 0);
				p.pop();

				if (w.t < 1) w.t += 0.01;
			});
		};

		p.mouseClicked = () => {
			// Start the next word animation only if clicking inside the canvas
			if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
				const nextWord = words.find((w) => !w.started);
				if (nextWord) {
					nextWord.started = true;
					nextWord.t = 0;
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
