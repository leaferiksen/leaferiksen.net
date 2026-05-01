"use strict";

// Standalone P5 sketch controller. Exposes startSketch and stopSketch for integration with router.
// Sin function made with Gemini

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
		let font;
		let bg1, bg2, bg3;
		let startSize = 10;
		let endSize = 100;
		let w = _holder.clientWidth;
		let h = _holder.clientHeight;

		p.setup = async () => {
			p.createCanvas(w, h).parent(_holder);
			font = await p.loadFont("/art315/p5-project/assets/goswell-demo/GoswellDemoRegular.ttf");
			bg1 = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-1.png");
			bg2 = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-2.png");
			bg3 = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-3.png");
			p.textFont(font);
			startX = p.width / 2;
			wordY = p.height * 0.71;
		};

		p.draw = () => {
			if (!font || !bg1 || !bg2 || !bg3) return;
			p.clear();

			// Simple fade between backgrounds
			const allStarted = words.every((w) => w.started);
			const targetBg = allStarted ? bg3 : bg2;
			let fade = (p.sin(p.frameCount * 0.03) + 1) / 2;

			p.image(bg1, 0, 0, p.width, p.height);
			p.push();
			p.tint(255, fade * 255);
			p.image(targetBg, 0, 0, p.width, p.height);
			p.pop();

			words.forEach((w) => {
				if (!w.started) return;

				// Animate word along a diagonal path toward bottom-left, increasing size
				let size = p.lerp(startSize, endSize, w.t);
				p.textSize(size);
				p.fill(255);
				p.textAlign(p.CENTER, p.CENTER);

				// End position off-screen to the bottom-left
				let endXLocal = -p.textWidth(w.text);
				let targetY = p.height + 20;

				// Cubic Bezier path for a shallow start and a sharp drop
				// cp1 keeps it high and moving left; cp2 pulls it further left and much lower for a sharper drop
				let cp1X = startX - p.width * 0.4;
				let cp1Y = wordY + p.height * 0.05;
				let cp2X = startX - p.width * 0.8;
				let cp2Y = wordY + p.height * 0.4; // Lowered significantly for sharper drop

				let x1 = p.lerp(startX, cp1X, w.t);
				let x2 = p.lerp(cp1X, cp2X, w.t);
				let x3 = p.lerp(cp2X, endXLocal, w.t);
				let cx = p.lerp(p.lerp(x1, x2, w.t), p.lerp(x2, x3, w.t), w.t);

				let y1 = p.lerp(wordY, cp1Y, w.t);
				let y2 = p.lerp(cp1Y, cp2Y, w.t);
				let y3 = p.lerp(cp2Y, targetY, w.t);
				let y = p.lerp(p.lerp(y1, y2, w.t), p.lerp(y2, y3, w.t), w.t);

				p.push();
				p.translate(cx, y);
				p.rotate(-0.2);
				p.text(w.text, 0, 0);
				p.pop();

				if (w.t < 1) w.t += 0.003;
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
