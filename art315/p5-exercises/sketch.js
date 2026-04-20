const manyFacesBtn = document.getElementById("manyFaces");
manyFacesBtn.addEventListener("click", () => {
	new p5((p) => {
		p.setup = () => {
			p.createCanvas(400, 400);
		};

		p.draw = () => {
			face(50, 10, 10);
			face(130, 150, 30);
			face(300, 70, 20);
		};
		function face(x, y, size) {
			eye(x - size * 2, y, size);
			eye(x + size * 2, y, size);
			mouth(x, y + size * 2, size);
		}
		function eye(x, y, size) {
			p.ellipseMode(p.CENTER);
			p.rectMode(p.CENTER);
			p.noStroke();
			p.fill("grey");
			p.rect(x, y, size * 2, size);
			p.fill("black");
			p.circle(x, y, size / 4);
		}
		function mouth(x, y, size) {
			p.strokeWeight(size / 5);
			p.stroke("maroon");
			p.fill("red");
			p.ellipse(x, y, size * 4, size * 2);
		}
	});
});

const weirdEyesBtn = document.getElementById("weirdEyes");
weirdEyesBtn.addEventListener("click", () => {
	new p5((p) => {
		p.setup = () => {
			p.createCanvas(400, 400);
		};

		p.draw = () => {
			eye(200, 100, 30);
			eye(100, 100, 20);
			eye(100, 200, 40);
			eye(280, 170, 60);
			eye(300, 300, 80);
		};

		function eye(x, y, size) {
			p.ellipseMode(p.CENTER);
			p.rectMode(p.CENTER);
			p.noStroke();
			p.fill("grey");
			p.rect(x, y, size * 2, size);
			p.fill("black");
			p.circle(x, y, size / 4);
		}
	});
});

const weirdFaceBtn = document.getElementById("weirdFace");
weirdFaceBtn.addEventListener("click", () => {
	new p5((p) => {
		p.setup = () => {
			p.createCanvas(300, 300);
		};

		p.draw = () => {
			eye(200, 100);
			eye(100, 100);
			mouth(150, 150);
		};

		function eye(x, y) {
			p.ellipseMode(p.CENTER);
			p.rectMode(p.CENTER);
			p.noStroke();
			p.fill("grey");
			p.rect(x, y, 60, 40);
			p.fill("black");
			p.circle(x, y, 10, 10);
		}

		function mouth(x, y) {
			p.strokeWeight(5);
			p.stroke("maroon");
			p.fill("red");
			p.ellipse(x, y, 60, 30);
		}
	});
});

const kgToLbsBtn = document.getElementById("kgToLbs");
kgToLbsBtn.addEventListener("click", () => {
	new p5((p) => {
		p.setup = () => {
			p.createCanvas(400, 400);
			p.text("result is also in the console", 20, 60);
			kgToLbs(25, 100);
			kgToLbs(100, 125);
			kgToLbs(500, 150);
		};

		function kgToLbs(kg, pos) {
			let lbs = kg * 2.2;
			p.text(result, 20, pos);
			console.log(kg + " is " + lbs + " lbs");
		}
	});
});

const bounceTextBtn = document.getElementById("bounceText");
bounceTextBtn.addEventListener("click", () => {
	new p5((p) => {
		// Bouncing text in all directions
		let x = 100,
			y = 300,
			xStep = 3,
			yStep = 3,
			words = ["WHEN", "WE", "ARE", "GONE", "THE", "TREES", "WILL", "RIOT"],
			wordIndex = 0;

		p.setup = () => {
			p.createCanvas(400, 400);
			p.noStroke();
		};

		p.draw = () => {
			let word = words[wordIndex];
			p.background("green");
			p.fill("lightGreen");
			for (i = x - 120; i <= x + 120; i += 30) {
				for (j = y - 100; j <= y + 75; j += 30) {
					p.ellipse(i, j, 15);
				}
			}
			x += xStep;
			y += yStep;
			p.fill("white");
			p.textSize(64);
			p.textAlign(p.CENTER);
			p.text(word, x, y);
			// bounce along x axis
			if (x > p.width || x < 0) {
				xStep = xStep * -1;
				if (wordIndex < words.length - 1) {
					wordIndex++;
				} else {
					wordIndex = 0;
				}
			}
			// bounce along y axis
			if (y > p.height || y < 0) {
				yStep = yStep * -1;
				if (wordIndex < words.length - 1) {
					wordIndex++;
				} else {
					wordIndex = 0;
				}
			}
		};
	});
});

const flowerBtn = document.getElementById("flower");
flowerBtn.addEventListener("click", () => {
	new p5((p) => {
		let r, g, b;

		p.setup = () => {
			p.createCanvas(400, 400);
			r = p.random(255);
			g = p.random(255);
			b = p.random(255);
		};

		p.draw = () => {
			p.background(100, 150, 200);
			p.stroke("green");
			p.strokeWeight(10);
			let magicX = p.width / 2;
			let magicY = p.height / 4 + p.mouseY / 1.5;
			let magicSize = 200 - p.mouseY / 3;
			let fallback = 30;
			p.line(magicX, magicY, p.width / 2, p.height * (4 / 5));
			p.noStroke();
			p.fill(r, g, b);
			if (magicSize > fallback) {
				p.ellipse(magicX, magicY, magicSize * (2 / 5), magicSize * (6 / 5));
				p.ellipse(magicX, magicY, magicSize * (6 / 5), magicSize * (2 / 5));
				p.fill("white");
				p.circle(magicX, magicY, magicSize / 4);
			} else {
				p.ellipse(magicX, magicY, fallback * (2 / 5), fallback * (6 / 5));
				p.ellipse(magicX, magicY, fallback * (6 / 5), fallback * (2 / 5));
				p.fill("white");
				p.circle(magicX, magicY, fallback / 4);
			}
			p.fill(r, g, b);
		};

		p.mousePressed = () => {
			r = p.random(255);
			g = p.random(100, 200);
			b = p.random(100);
		};
	});
});

const robotBtn = document.getElementById("robot");
robotBtn.addEventListener("click", () => {
	new p5((p) => {
		p.setup = () => {
			p.createCanvas(600, 600);
		};

		p.draw = () => {
			p.background(100, 150, 200);
			p.noStroke();
			p.fill(60, 100, 30);
			p.rect(170, 50, 200, 150);
			p.triangle(370, 200, 170, 200, 270, 300);
			p.triangle(370, 500, 170, 500, 270, 200);
			p.circle(330, 510, 40);
			p.circle(220, 510, 40);
			p.fill(230);
			p.ellipse(310 + p.mouseX / 50, 110 + p.mouseY / 50, 50);
			p.ellipse(210 + p.mouseX / 50, 110 + p.mouseY / 50, 50);
			p.fill(30);
			p.ellipse(300 + p.mouseX / 20, 100 + p.mouseY / 20, 20);
			p.ellipse(200 + p.mouseX / 20, 100 + p.mouseY / 20, 20);
			p.stroke(230);
			p.strokeWeight(10);
			p.line(305, 330, 300 + p.mouseX / 5, 200 + p.mouseY / 5);
			p.line(235, 330, 180 + p.mouseX / 5, 200 + p.mouseY / 5);
		};

		p.mousePressed = () => {
			p.background(230);
		};
	});
});
