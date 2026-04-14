let r;
let g;
let b;

function setup() {
	createCanvas(windowWidth, windowHeight);
	r = random(255);
	g = random(255);
	b = random(255);
}

function draw() {
	background(100, 150, 200);
	stroke("green");
	strokeWeight(10);
	let magicX = width / 2;
	let magicY = height / 4 + mouseY / 1.5;
	let magicSize = 200 - mouseY / 3;
	let fallback = 30;
	line(magicX, magicY, width / 2, height * (4 / 5));
	noStroke();
	fill(r, g, b);
	if (magicSize > fallback) {
		ellipse(magicX, magicY, magicSize * (2 / 5), magicSize * (6 / 5));
		ellipse(magicX, magicY, magicSize * (6 / 5), magicSize * (2 / 5));
		fill("white");
		circle(magicX, magicY, magicSize / 4);
	} else {
		ellipse(magicX, magicY, fallback * (2 / 5), fallback * (6 / 5));
		ellipse(magicX, magicY, fallback * (6 / 5), fallback * (2 / 5));
		fill("white");
		circle(magicX, magicY, fallback / 4);
	}
	fill(r, g, b);
}

function mousePressed() {
	r = random(255);
	g = random(100, 200);
	b = random(100);
}
