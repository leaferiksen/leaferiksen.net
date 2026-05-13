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
	const createWords = (words) => words.map((text) => ({ text, started: false, progress: 0 }));
	// fancy arrays made with gemini
	const introWords = createWords(["WHEN", "WE", "ARE", "GONE"]);
	const treeWords = [
		{ text: "THE", angle: -Math.PI * 0.4 },
		{ text: "TREES", angle: Math.PI * 0.3 },
		{ text: "  WILL", angle: -Math.PI * 0.4 },
	].map((w) => ({ ...w, started: false, progress: 0 }));
	// 1: Cars, 2: Tree Growth, 3: Petals/Swaying
	let currentStep = 1;
	let introBaseX, introBaseY, customFont;
	let bgBase, bgDetailA, bgDetailB;
	const flyingPetals = Array.from({ length: 25 }, () => ({ progress: 1 }));
	const restart = () => {
		currentStep = 1;
		[...introWords, ...treeWords].forEach((word) => {
			word.started = false;
			word.progress = 0;
		});
		flyingPetals.forEach((petal) => (petal.progress = 1));
	};
	const restartButton = { label: "RESTART", x: 15, width: 90 };
	p.setup = async () => {
		const canvas = p.createCanvas(p.canvas.parentElement.clientWidth, p.canvas.parentElement.clientHeight);
		canvas.mouseClicked(() => {
			const isOverRestart = p.mouseX > restartButton.x && p.mouseX < restartButton.x + restartButton.width && p.mouseY > 15 && p.mouseY < 45;
			if (isOverRestart) return restart();

			const mx = p.mouseX / p.width;
			const my = p.mouseY / p.height;
			// limit click targets roughly to the area of the animation
			if (currentStep === 1) {
				if (mx > 0.45 && mx < 0.6 && my > 0.5 && my < 0.75) {
					const nextWord = introWords.find((w) => !w.started);
					if (nextWord) nextWord.started = true;
				}
			} else if (currentStep === 2) {
				if (mx > 0.4 && mx < 0.7 && my > 0.75 && my < 0.95) {
					const nextWord = treeWords.find((w) => !w.started);
					if (nextWord) nextWord.started = true;
				}
			} else if (currentStep === 3) {
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
	// mostly done by hand, but gemini handled the bezierPoint tricks
	const drawCars = () => {
		if (currentStep > 1) return;
		const cp1 = { x: introBaseX - p.width * 0.4, y: introBaseY + p.height * 0.05 };
		const cp2 = { x: introBaseX - p.width * 0.8, y: introBaseY + p.height * 0.4 };
		introWords.forEach((word) => {
			if (!word.started) return;
			const fontSize = p.height * 0.125;
			p.textSize(p.lerp(fontSize * 0.1, fontSize, word.progress));
			p.fill(255);
			p.textAlign(p.CENTER, p.CENTER);
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
			p.translate(p.textWidth(word.text) * (i === 1 ? 0.5 : 1.1), 0);
		});
		p.pop();
	};
	// design fully handmade, object management by gemini
	const spawnPetals = () => {
		flyingPetals
			.filter((p) => p.progress >= 1)
			.slice(0, 5)
			.forEach((petal) => {
				Object.assign(petal, {
					startX: p.width * 0.75 + p.random(-30, 30),
					startY: p.height * 0.5 + p.random(-p.height * 0.2, p.height * 0.2),
					endX: -p.textWidth("RIOT") - 100,
					endY: p.height * p.random(0.1, 0.4),
					speed: p.random(0.001, 0.003),
					progress: 0,
				});
			});
	};
	const drawPetals = () => {
		p.textSize(p.height * 0.02);
		p.textAlign(p.CENTER, p.CENTER);
		p.fill(255, 200);
		flyingPetals.forEach((petal) => {
			if (petal.progress >= 1) return;
			petal.progress = p.constrain(petal.progress + petal.speed, 0, 1);
			const x = p.lerp(petal.startX, petal.endX, petal.progress);
			const y = p.lerp(petal.startY, petal.endY, petal.progress);
			p.text("RIOT", x, y);
		});
	};
	const drawRestartButton = () => {
		p.push();
		p.noStroke();
		p.textSize(14);
		p.textAlign(p.CENTER, p.CENTER);
		p.fill(255, 100);
		p.rect(restartButton.x, 15, restartButton.width, 30, 5);
		p.fill(255);
		p.text(restartButton.label, restartButton.x + restartButton.width / 2, 30);
		p.pop();
	};
	p.draw = () => {
		p.clear();
		const pulse = (p.sin(p.frameCount * 0.05) + 1) / 2;
		p.image(bgBase, 0, 0, p.width, p.height);
		// Once words are 60% of the way across the screen and the last animation completes start next step
		if (currentStep === 1 && introWords.every((w) => w.started && w.progress > 0.6)) {
			currentStep = 2;
		} else if (currentStep === 2 && treeWords.every((w) => w.started && w.progress === 1)) {
			currentStep = 3;
		}
		const detail = currentStep === 1 ? bgDetailA : currentStep === 2 ? bgDetailB : null;
		if (detail) {
			p.push();
			p.tint(255, pulse * 255);
			p.image(detail, 0, 0, p.width, p.height);
			p.pop();
		}
		drawCars();
		if (currentStep >= 2) {
			drawTree(currentStep === 3);
		}
		if (currentStep === 3) drawPetals();
		drawRestartButton();
	};
	p.windowResized = () => {
		p.resizeCanvas(0, 0); // resize fails if canvas is not reset first
		p.resizeCanvas(p.canvas.parentElement.clientWidth, p.canvas.parentElement.clientHeight);
		updateLayout();
	};
	p.keyPressed = () => {
		if (p.key === "s" || p.key === "S") {
			p.saveCanvas("p5-screenshot", "png");
		}
	};
};
