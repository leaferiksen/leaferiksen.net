"use strict";
// P5 sketch controller for use with Navigation API (some help from Gemini)
let _sketchInstance = null;
function stopSketch() {
	_sketchInstance?.remove();
	_sketchInstance = null;
	console.log("P5 sketch stopped");
}
function startSketch() {
	if (_sketchInstance || !document.getElementById("sketch-holder")) return;
	_sketchInstance = new p5(sketchLogic, "sketch-holder");
	console.log("P5 sketch started");
}
const sketchLogic = (p) => {
	// fancy array figured out with gemini, angles figured out by hand
	const animation1 = [
		{ text: "WHEN", started: false, animationProgress: 0 },
		{ text: "WE", started: false, animationProgress: 0 },
		{ text: "ARE", started: false, animationProgress: 0 },
		{ text: "GONE", started: false, animationProgress: 0 },
	];
	const animation2 = [
		{ text: "THE", angle: -Math.PI * 0.4, started: false, progress: 0 },
		{ text: "TREES", angle: Math.PI * 0.3, started: false, progress: 0 },
		{ text: "  WILL", angle: -Math.PI * 0.4, started: false, progress: 0 },
		{ text: "RIOT", angle: Math.PI * 0.4, started: false, progress: 0 },
	];
	let introBaseX, introBaseY, customFont;
	let background1, background2, background3;
	p.setup = async () => {
		// Use the parent element's size for the canvas
		const canvas = p.createCanvas(p.canvas.parentElement.clientWidth, p.canvas.parentElement.clientHeight);
		// Handle clicks ONLY on the canvas area (made with Gemini)
		canvas.mouseClicked(() => {
			const currentAnimationList = animation1.every((word) => word.started) ? animation2 : animation1;
			const nextWordToStart = currentAnimationList.find((word) => !word.started);
			if (nextWordToStart) nextWordToStart.started = true;
		});
		customFont = await p.loadFont("/art315/p5-project/assets/goswell-demo/GoswellDemoRegular.ttf");
		background1 = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-1.png");
		background2 = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-2.png");
		background3 = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-3.png");
		p.textFont(customFont);
		introBaseX = p.width / 2;
		introBaseY = p.height * 0.71;
	};
	p.draw = () => {
		p.clear();
		// Phase controller made with gemini
		const isPhase1Complete = animation1.every((word) => word.started);
		const backgroundFade = (p.sin(p.frameCount * 0.03) + 1) / 2;
		// Layer 1: Base tunnel image
		p.image(background1, 0, 0, p.width, p.height);
		// Layer 2: Glowing details
		p.push();
		p.tint(255, backgroundFade * 255);
		p.image(isPhase1Complete ? background3 : background2, 0, 0, p.width, p.height);
		p.pop();
		// Animation 1: Sliding Words
		animation1.forEach((word) => {
			if (!word.started) return;
			const targetFontSize = p.height * 0.125;
			p.textSize(p.lerp(targetFontSize * 0.1, targetFontSize, word.animationProgress));
			p.fill(255);
			p.textAlign(p.CENTER, p.CENTER);
			const destinationX = -p.textWidth(word.text);
			// bezierPoints explained by gemini, I figured out the right values
			const controlPoint1 = { x: introBaseX - p.width * 0.4, y: introBaseY + p.height * 0.05 };
			const controlPoint2 = { x: introBaseX - p.width * 0.8, y: introBaseY + p.height * 0.4 };
			const currentX = p.bezierPoint(introBaseX, controlPoint1.x, controlPoint2.x, destinationX, word.animationProgress);
			const currentY = p.bezierPoint(introBaseY, controlPoint1.y, controlPoint2.y, p.height + 20, word.animationProgress);
			p.push();
			p.translate(currentX, currentY);
			p.rotate(-0.2);
			p.text(word.text, 0, 0);
			p.pop();
			// constrain is super cool, I wish it was introduced earlier
			word.animationProgress = p.constrain(word.animationProgress + 0.003, 0, 1);
		});
		// Animation 2: Tree Growth (substring trick and branching made with gemini)
		if (isPhase1Complete) {
			p.textSize(p.height * 0.075);
			p.fill(255);
			p.textAlign(p.LEFT, p.CENTER);
			p.translate(p.width * 0.6, p.height * 0.85);

			animation2.forEach((word, index) => {
				if (!word.started) return;
				word.progress = p.constrain(word.progress + 0.05, 0, 1);

				p.rotate(word.angle);
				const charsToShow = p.floor(word.progress * word.text.length);
				p.text(word.text.substring(0, charsToShow), 0, 0);

				// Branching logic: "WILL" (index 2) starts halfway along "TREES" (index 1)
				const spacingFactor = index === 1 ? 0.5 : 1.1;
				p.translate(p.textWidth(word.text) * spacingFactor, 0);
			});
		}
	};
	p.windowResized = () => {
		const holder = p.canvas.parentElement;
		p.resizeCanvas(0, 0);
		p.resizeCanvas(holder.clientWidth, holder.clientHeight);
		introBaseX = p.width / 2;
		introBaseY = p.height * 0.71;
	};
};
