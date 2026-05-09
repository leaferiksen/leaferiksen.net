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
	const restart = () => {
		currentStep = 1;
		[...introWords, ...treeWords].forEach((word) => {
			word.started = false;
			word.progress = 0;
		});
		flyingPetals = [];
	};
	const buttons = [
		{ label: "RESTART", x: () => 15, width: 90, action: restart },
		{ label: "SAVE IMAGE", x: () => p.width - 135, width: 120, action: () => p.saveCanvas("p5-screenshot", "png") },
	];
	p.setup = async () => {
		const canvas = p.createCanvas(p.canvas.parentElement.clientWidth, p.canvas.parentElement.clientHeight);
		canvas.mouseClicked(() => {
			for (const button of buttons) {
				const x = button.x();
				const isMouseOverButton = p.mouseX > x && p.mouseX < x + button.width && p.mouseY > 15 && p.mouseY < 45;

				if (isMouseOverButton) {
					return button.action();
				}
			}
			const mx = p.mouseX / p.width;
			const my = p.mouseY / p.height;

			if (currentStep === 1) {
				// Center sixth: middle half horizontally, middle third vertically
				if (mx > 0.45 && mx < 0.6 && my > 0.5 && my < 0.75) {
					const nextWord = introWords.find((w) => !w.started);
					if (nextWord) nextWord.started = true;
				}
			} else if (currentStep === 2) {
				// Bottom center sixth: middle half horizontally, bottom third vertically
				if (mx > 0.4 && mx < 0.7 && my > 0.75 && my < 0.95) {
					const nextWord = treeWords.find((w) => !w.started);
					if (nextWord) nextWord.started = true;
				}
			} else if (currentStep === 3) {
				// Number four of five fifths horizontally and middle third vertically
				if (mx > 0.6 && mx < 0.9 && my > 0.3 && my < 0.75) {
					spawnPetals();
				}
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
			let spacing = 1.1;
			// hack to fix alignment of "WILL"
			if (i === 1) {
				spacing = 0.5;
			}
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
			p.text("RIOT", petal.posX, petal.posY);
			// Clean up off-screen petals
			const isOffScreen = petal.posX < -p.textWidth("RIOT");
			if (isOffScreen) {
				flyingPetals.splice(i, 1);
			}
		}
	};
	const drawButtons = () => {
		p.push();
		p.noStroke();
		p.textSize(14);
		p.textAlign(p.CENTER, p.CENTER);
		buttons.forEach((button) => {
			const x = button.x();
			p.fill(255, 100);
			p.rect(x, 15, button.width, 30, 5);
			p.fill(255);
			p.text(button.label, x + button.width / 2, 30);
		});
		p.pop();
	};
	p.draw = () => {
		p.clear();
		const pulse = (p.sin(p.frameCount * 0.05) + 1) / 2;
		p.image(bgBase, 0, 0, p.width, p.height);
		// Auto-transition logic: after words are 60% of the way across the screen, wait for the next animation to complete, then start next step
		if (currentStep === 1) {
			const allWordsStarted = introWords.every((w) => w.started);
			const allWordsMovedEnough = introWords.every((w) => w.progress > 0.6);

			if (allWordsStarted && allWordsMovedEnough) {
				currentStep = 2;
			}
		} else if (currentStep === 2) {
			const allTreeWordsFinished = treeWords.every((w) => w.started && w.progress === 1);

			if (allTreeWordsFinished) {
				currentStep = 3;
			}
		}
		let detail = null;
		if (currentStep === 1) {
			detail = bgDetailA;
		} else if (currentStep === 2) {
			detail = bgDetailB;
		}
		if (detail) {
			p.push();
			p.tint(255, pulse * 255);
			p.image(detail, 0, 0, p.width, p.height);
			p.pop();
		}
		drawCars();
		if (currentStep >= 2) {
			const shouldSway = currentStep === 3;
			drawTree(shouldSway);
		}
		if (currentStep === 3) drawPetals();
		drawButtons();
	};
	p.windowResized = () => {
		p.resizeCanvas(0, 0); // resize fails if canvas is not reset first
		p.resizeCanvas(p.canvas.parentElement.clientWidth, p.canvas.parentElement.clientHeight);
		updateLayout();
	};
};
