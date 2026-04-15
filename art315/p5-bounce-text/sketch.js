// Bouncing text in all directions

var x = 100;
var y = 300;
var xStep = 3;
var yStep = 3;

var words = ["WHEN", "WE", "ARE", "GONE", "THE", "TREES", "WILL", "RIOT"];
var wordIndex = 0;
var myBackground;

function setup() {
	createCanvas(600, 600);
	myBackground = "green";
	noStroke();
}

function draw() {
	var word = words[wordIndex];

	// draw the background
	background(myBackground);
	// draw the text
	fill("lightGreen");

	for (i = x - 120; i <= x + 120; i += 30) {
		for (j = y - 100; j <= y + 75; j += 30) {
			ellipse(i, j, 15);
		}
	}

	//move the text
	x += xStep;
	y += yStep;
	fill("white");
	textSize(64);
	textAlign(CENTER);
	text(word, x, y);

	// bounce along x axis
	if (x > width || x < 0) {
		xStep = xStep * -1;
		if (wordIndex < words.length - 1) {
			wordIndex++;
		} else {
			wordIndex = 0;
		}
	}

	// bounce along y axis
	if (y > height || y < 0) {
		yStep = yStep * -1;
		if (wordIndex < words.length - 1) {
			wordIndex++;
		} else {
			wordIndex = 0;
		}
	}
}
