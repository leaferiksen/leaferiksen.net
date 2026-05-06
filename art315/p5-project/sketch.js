"use strict";
// P5 sketch controller for use with Navigation API (made with gemini)
let _sketchInstance = null;
function stopSketch() {
	_sketchInstance?.remove();
	_sketchInstance = null;
}
function startSketch() {
	if (_sketchInstance || !document.getElementById("sketch-holder")) return;
	_sketchInstance = new p5(sketchLogic, "sketch-holder");
}
const sketchLogic = (p) => {
	// Step data
	const introWords = [
		{ text: "WHEN", started: false, progress: 0 },
		{ text: "WE", started: false, progress: 0 },
		{ text: "ARE", started: false, progress: 0 },
		{ text: "GONE", started: false, progress: 0 },
	];
	const treeWords = [
		{ text: "THE", angle: -Math.PI * 0.4, started: false, progress: 0 },
		{ text: "TREES", angle: Math.PI * 0.3, started: false, progress: 0 },
		{ text: "  WILL", angle: -Math.PI * 0.4, started: false, progress: 0 },
		{ text: "RIOT", angle: Math.PI * 0.4, started: false, progress: 0 },
	];
	let currentStep = 1; // 1: Cars, 2: Tree Growth, 3: Petals/Swaying
	let introBaseX, introBaseY, customFont;
	let bgBase, bgDetailA, bgDetailB;
	let flyingPetals = [];

	p.setup = async () => {
		const canvas = p.createCanvas(p.canvas.parentElement.clientWidth, p.canvas.parentElement.clientHeight);
		canvas.mouseClicked(() => {
			if (currentStep === 1) {
				const nextWord = introWords.find((w) => !w.started);
				if (nextWord) nextWord.started = true;
			} else if (currentStep === 2) {
				const nextWord = treeWords.find((w) => !w.started);
				if (nextWord) nextWord.started = true;
			} else if (currentStep === 3) {
				spawnPetals();
			}
		});
		customFont = await p.loadFont("/art315/p5-project/assets/Permanent_Marker/PermanentMarker-Regular.ttf");
		bgBase = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-1.png");
		bgDetailA = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-2.png");
		bgDetailB = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-3.png");
		p.textFont(customFont);
		updateLayout();
	};

	const updateLayout = () => {
		introBaseX = p.width / 2;
		introBaseY = p.height * 0.71;
	};

	const drawCars = () => {
		if (currentStep > 1) return; // Stop drawing cars once we've transitioned
		introWords.forEach((word) => {
			if (!word.started) return;
			const fontSize = p.height * 0.125;
			p.textSize(p.lerp(fontSize * 0.1, fontSize, word.progress));
			p.fill(255);
			p.textAlign(p.CENTER, p.CENTER);
			const cp1 = { x: introBaseX - p.width * 0.4, y: introBaseY + p.height * 0.05 };
			const cp2 = { x: introBaseX - p.width * 0.8, y: introBaseY + p.height * 0.4 };
			const tx = p.bezierPoint(introBaseX, cp1.x, cp2.x, -p.textWidth(word.text), word.progress);
			const ty = p.bezierPoint(introBaseY, cp1.y, cp2.y, p.height + 20, word.progress);
			p.push();
			p.translate(tx, ty);
			p.rotate(-0.2);
			p.text(word.text, 0, 0);
			p.pop();
			word.progress = p.constrain(word.progress + 0.002, 0, 1);
		});
	};

	const drawTree = (sway) => {
		p.push();
		p.textSize(p.height * 0.075);
		p.fill(255);
		p.textAlign(p.LEFT, p.CENTER);
		p.translate(p.width * 0.6, p.height * 0.85);
		treeWords.forEach((word, i) => {
			if (!word.started) return;
			word.progress = p.constrain(word.progress + 0.05, 0, 1);
			let angle = word.angle;
			if (sway) {
				angle += p.sin(p.frameCount * 0.02 + i * 0.5) * 0.02;
				if (word.text.includes("TREES")) {
					angle += p.sin(p.frameCount * 0.02) * 0.05;
				}
			}
			p.rotate(angle);
			p.text(word.text.substring(0, p.floor(word.progress * word.text.length)), 0, 0);
			const spacing = i === 1 ? 0.5 : 1.1;
			p.translate(p.textWidth(word.text) * spacing, 0);
		});
		p.pop();
	};

	const spawnPetals = () => {
		const petalsPerClick = 5;
		for (let i = 0; i < petalsPerClick; i++) {
			flyingPetals.push({
				posX: p.width * 0.75 + p.random(-30, 30),
				posY: p.height * 0.5 + p.random(-p.height * 0.2, p.height * 0.2),
				driftX: p.random(-4, -2),
				driftY: p.random(-0.5, -0.2),
			});
		}
	};

	const drawPetals = () => {
		p.textSize(p.height * 0.02);
		p.textAlign(p.CENTER, p.CENTER);
		p.fill(255, 200);

		for (let i = flyingPetals.length - 1; i >= 0; i--) {
			const petal = flyingPetals[i];

			// Update position
			petal.posX += petal.driftX;
			petal.posY += petal.driftY;

			// Render
			p.text("RIOT", petal.posX, petal.posY);

			// Clean up off-screen petals
			const isOffScreen = petal.posX < -p.textWidth("RIOT");
			if (isOffScreen) {
				flyingPetals.splice(i, 1);
			}
		}
	};

	p.draw = () => {
		p.clear();
		const pulse = (p.sin(p.frameCount * 0.03) + 1) / 2;
		p.image(bgBase, 0, 0, p.width, p.height);

		// Auto-transition logic: trigger as soon as words are visually gone (~80% progress)
		if (currentStep === 1 && introWords.every((w) => w.started && w.progress > 0.8)) {
			currentStep = 2;
		} else if (currentStep === 2 && treeWords.every((w) => w.started && w.progress === 1)) {
			currentStep = 3;
		}

		// Background Details
		if (currentStep === 1) {
			p.push();
			p.tint(255, pulse * 255);
			p.image(bgDetailA, 0, 0, p.width, p.height);
			p.pop();
		} else {
			p.push();
			// Step 2 pulses, Step 3 is more stable/alive
			const bgAlpha = currentStep === 2 ? pulse * 255 : 200 + pulse * 55;
			p.tint(255, bgAlpha);
			p.image(bgDetailB, 0, 0, p.width, p.height);
			p.pop();
		}

		drawCars();
		if (currentStep >= 2) drawTree(currentStep === 3);
		if (currentStep === 3) drawPetals();
	};

	p.windowResized = () => {
		p.resizeCanvas(0, 0);
		const holder = p.canvas.parentElement;
		p.resizeCanvas(holder.clientWidth, holder.clientHeight);
		updateLayout();
	};
};
