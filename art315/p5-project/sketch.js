"use strict";

// Standalone P5 sketch controller. Exposes startSketch and stopSketch for integration with router.
// Sin function and animation2 progression system made with Gemini

let _sketchInstance = null;

function startSketch() {
	if (_sketchInstance) return;
	const holder = document.getElementById("sketch-holder");
	if (!holder) return;

	_sketchInstance = new p5((p) => {
		const animation1 = [
			{ text: "WHEN", started: false, animationProgress: 0 },
			{ text: "WE", started: false, animationProgress: 0 },
			{ text: "ARE", started: false, animationProgress: 0 },
			{ text: "GONE", started: false, animationProgress: 0 },
		];
		const animation2 = [
			{ text: "THE", angle: -Math.PI * 0.55, started: false, typingProgress: 0 },
			{ text: "TREES", angle: -Math.PI * 2.25, started: false, typingProgress: 0 },
			{ text: "WILL", angle: -Math.PI * 2.55, started: false, typingProgress: 0 },
		];
		let introBaseX, introBaseY, customFont;
		let backgroundLayer1, backgroundLayer2, backgroundLayer3;

		p.setup = async () => {
			p.createCanvas(holder.clientWidth, holder.clientHeight);
			customFont = await p.loadFont("/art315/p5-project/assets/goswell-demo/GoswellDemoRegular.ttf");
			backgroundLayer1 = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-1.png");
			backgroundLayer2 = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-2.png");
			backgroundLayer3 = await p.loadImage("/art315/p5-project/assets/mt-rainier-tunnel-3.png");
			p.textFont(customFont);
			introBaseX = p.width / 2;
			introBaseY = p.height * 0.71;
		};

		p.draw = () => {
			if (!customFont || !backgroundLayer1 || !backgroundLayer2 || !backgroundLayer3) return;
			p.clear();

			const isPhase1Complete = animation1.every((word) => word.started);
			const backgroundFade = (p.sin(p.frameCount * 0.03) + 1) / 2;

			p.image(backgroundLayer1, 0, 0, p.width, p.height);
			p.push();
			p.tint(255, backgroundFade * 255);
			p.image(isPhase1Complete ? backgroundLayer3 : backgroundLayer2, 0, 0, p.width, p.height);
			p.pop();

			// Animation 1: Sliding Words
			animation1.forEach((word) => {
				if (!word.started) return;

				const targetFontSize = p.height * 0.125;
				p.textSize(p.lerp(targetFontSize * 0.1, targetFontSize, word.animationProgress));
				p.fill(255);
				p.textAlign(p.CENTER, p.CENTER);

				const destinationX = -p.textWidth(word.text);
				const controlPoint1 = { x: introBaseX - p.width * 0.4, y: introBaseY + p.height * 0.05 };
				const controlPoint2 = { x: introBaseX - p.width * 0.8, y: introBaseY + p.height * 0.4 };

				const currentX = p.bezierPoint(introBaseX, controlPoint1.x, controlPoint2.x, destinationX, word.animationProgress);
				const currentY = p.bezierPoint(introBaseY, controlPoint1.y, controlPoint2.y, p.height + 20, word.animationProgress);

				p.push();
				p.translate(currentX, currentY);
				p.rotate(-0.2);
				p.text(word.text, 0, 0);
				p.pop();

				word.animationProgress = p.constrain(word.animationProgress + 0.003, 0, 1);
			});

			// --- Animation 2: Tree Growth ---
			if (isPhase1Complete) {
				p.push();
				p.textSize(p.height * 0.075);
				p.fill(255);
				p.textAlign(p.LEFT, p.CENTER);
				p.translate(p.width * 0.6, p.height * 0.85);
				p.rotate(0.35); // treeTiltAngle

				const characterSpacingFactor = 1.3;
				animation2.forEach((word, wordIndex) => {
					if (!word.started) return;
					word.typingProgress = p.constrain(word.typingProgress + 0.15, 0, word.text.length);

					if (wordIndex === 1) p.translate(p.textWidth(animation2[0].text) * characterSpacingFactor, 0);
					if (wordIndex === 2) p.translate((p.textWidth(animation2[1].text) * characterSpacingFactor) / 2, p.height * -0.05);

					const relativeRotation = word.angle - (wordIndex > 0 ? animation2[wordIndex - 1].angle : 0);
					p.rotate(relativeRotation);

					for (let charIndex = 0; charIndex < p.floor(word.typingProgress); charIndex++) {
						const charXOffset = p.textWidth(word.text.substring(0, charIndex)) * characterSpacingFactor;
						p.text(word.text[charIndex], charXOffset, 0);
					}
				});
				p.pop();
			}
		};

		p.mouseClicked = () => {
			if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
				const currentAnimationList = animation1.every((word) => word.started) ? animation2 : animation1;
				const nextWordToStart = currentAnimationList.find((word) => !word.started);
				if (nextWordToStart) nextWordToStart.started = true;
			}
		};

		p.windowResized = () => {
			p.resizeCanvas(0, 0);
			p.resizeCanvas(holder.clientWidth, holder.clientHeight);
			introBaseX = p.width / 2;
			introBaseY = p.height * 0.71;
		};
	}, holder);
	console.log("P5 sketch started");
}

function stopSketch() {
	_sketchInstance?.remove();
	_sketchInstance = null;
	console.log("P5 sketch stopped");
}

window.startSketch = startSketch;
window.stopSketch = stopSketch;
