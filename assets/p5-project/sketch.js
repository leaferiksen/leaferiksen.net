"use strict";

(() => {
	// Guard: if Webstudio ever executes this file twice, do nothing the second time.
	if (window.__treesSketchInstalled) return;
	window.__treesSketchInstalled = true;

	const CONFIG = {
		p5Url: "https://cdn.jsdelivr.net/npm/p5@2.2.2/lib/p5.js",
		triggerSelector: 'a[href="#sketch-holder"]',
		assets: {
			font: "/assets/p5-project/assets/Permanent_Marker/PermanentMarker-Regular.ttf",
			base: "/assets/p5-project/assets/mt-rainier-tunnel-1.jpeg",
			detailA: "/assets/p5-project/assets/mt-rainier-tunnel-2.jpeg",
			detailB: "/assets/p5-project/assets/mt-rainier-tunnel-3.jpeg",
		},
	};

	// ---------------------------------------------------------------
	// Loader: p5 is fetched on demand, so script order/defer can't break us
	// ---------------------------------------------------------------
	let p5Promise = null;
	const loadP5 = () => {
		if (window.p5) return Promise.resolve();
		if (!p5Promise) {
			p5Promise = new Promise((resolve, reject) => {
				const s = document.createElement("script");
				s.src = CONFIG.p5Url;
				s.onload = resolve;
				s.onerror = () => {
					p5Promise = null; // allow retry on the next click
					reject(new Error("Could not load p5.js"));
				};
				document.head.appendChild(s);
			});
		}
		return p5Promise;
	};

	// ---------------------------------------------------------------
	// Overlay: created on click, appended to <body>, styled inline.
	// Nothing here depends on the page's CSS or on a pre-existing holder div.
	// ---------------------------------------------------------------
	let ui = null; // { root, holder, status, onKey }
	let instance = null;

	const makeButton = (label, onClick) => {
		const b = document.createElement("button");
		b.type = "button";
		b.textContent = label;
		b.style.cssText =
			"padding:6px 14px;border:0;border-radius:5px;background:rgba(255,255,255,.4);" +
			"color:#fff;font:600 14px system-ui,sans-serif;cursor:pointer;";
		b.addEventListener("click", onClick);
		return b;
	};

	const buildOverlay = () => {
		const root = document.createElement("div");
		root.setAttribute("role", "dialog");
		root.setAttribute("aria-modal", "true");
		root.setAttribute("aria-label", "Interactive animation");
		root.style.cssText = "position:fixed;inset:0;z-index:9999;background:#000;";

		const holder = document.createElement("div");
		holder.style.cssText = "position:absolute;inset:0;";

		const controls = document.createElement("div");
		controls.style.cssText = "position:absolute;top:15px;left:15px;display:flex;gap:10px;z-index:1;";
		controls.append(
			makeButton("RESTART", () => instance && instance.restart && instance.restart()),
			makeButton("CLOSE", close),
		);

		const status = document.createElement("div");
		status.textContent = "Loading…";
		status.style.cssText =
			"position:absolute;inset:0;display:grid;place-items:center;color:#fff;" +
			"font:16px system-ui,sans-serif;pointer-events:none;";

		root.append(holder, status, controls);

		const onKey = (e) => {
			if (e.key === "Escape") close();
		};
		document.addEventListener("keydown", onKey);

		return { root, holder, status, onKey };
	};

	const open = async () => {
		if (ui) return;
		ui = buildOverlay();
		document.body.appendChild(ui.root);
		document.body.style.overflow = "hidden";

		const mine = ui; // detect "closed while loading"
		try {
			await loadP5();
			if (ui !== mine) return;
			instance = new window.p5(
				createSketch(CONFIG.assets, {
					onReady: () => ui === mine && mine.status.remove(),
					onError: (err) => {
						console.error(err);
						if (ui === mine) mine.status.textContent = "Couldn't load the animation.";
					},
				}),
				mine.holder,
			);
		} catch (err) {
			console.error(err);
			if (ui === mine) mine.status.textContent = "Couldn't load the animation.";
		}
	};

	function close() {
		if (instance) {
			instance.remove();
			instance = null;
		}
		if (ui) {
			document.removeEventListener("keydown", ui.onKey);
			ui.root.remove();
			ui = null;
		}
		document.body.style.overflow = "";
	}

	// One delegated listener on document: survives React hydration/re-renders.
	document.addEventListener("click", (e) => {
		const link = e.target instanceof Element && e.target.closest(CONFIG.triggerSelector);
		if (!link) return;
		e.preventDefault();
		open();
	});

	// ---------------------------------------------------------------
	// The sketch itself
	// ---------------------------------------------------------------
	function createSketch(assets, hooks) {
		return (p) => {
			const createWords = (words) => words.map((text) => ({ text, started: false, progress: 0 }));
			const introWords = createWords(["WHEN", "WE", "ARE", "GONE"]);
			const treeWords = [
				{ text: "THE", angle: -Math.PI * 0.4 },
				{ text: "TREES", angle: Math.PI * 0.3 },
				{ text: "  WILL", angle: -Math.PI * 0.4 },
			].map((w) => ({ ...w, started: false, progress: 0 }));

			// 1: Cars, 2: Tree Growth, 3: Petals/Swaying
			let currentStep = 1;
			let ready = false;
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
			p.restart = restart; // lets the DOM Restart button call in

			p.setup = async () => {
				const canvas = p.createCanvas(window.innerWidth, window.innerHeight);

				canvas.mouseClicked(() => {
					// limit click targets roughly to the area of the animation
					const mx = p.mouseX / p.width;
					const my = p.mouseY / p.height;
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
						if (mx > 0.55 && mx < 0.9 && my > 0.3 && my < 0.85) {
							spawnPetals();
						}
					}
				});

				try {
					[customFont, bgBase, bgDetailA, bgDetailB] = await Promise.all([
						p.loadFont(assets.font),
						p.loadImage(assets.base),
						p.loadImage(assets.detailA),
						p.loadImage(assets.detailB),
					]);
				} catch (err) {
					hooks.onError(err);
					return;
				}
				p.textFont(customFont);
				updateLayout();
				ready = true;
				hooks.onReady();
			};

			const updateLayout = () => {
				introBaseX = p.width / 2;
				introBaseY = p.height * 0.71;
			};

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
				const alpha = sway ? p.lerp(150, 255, (p.sin(p.frameCount * 0.08) + 1) / 2) : 255;
				p.fill(255, alpha);
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

			const spawnPetals = () => {
				flyingPetals
					.filter((f) => f.progress >= 1)
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

			p.draw = () => {
				if (!ready) return;
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
				if (currentStep >= 2) drawTree(currentStep === 3);
				if (currentStep === 3) drawPetals();
			};

			p.windowResized = () => {
				p.resizeCanvas(0, 0); // resize fails if canvas is not reset first
				p.resizeCanvas(window.innerWidth, window.innerHeight);
				updateLayout();
			};

			p.keyPressed = () => {
				if (p.key === "s" || p.key === "S") {
					p.saveCanvas("p5-screenshot", "png");
				}
			};
		};
	}
})();
