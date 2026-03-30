function setup() {
	createCanvas(600, 600);
}

function draw() {
	background(100, 150, 200);
	noStroke();
	fill(60, 100, 30);
	rect(170, 50, 200, 150);
	triangle(370, 200, 170, 200, 270, 300);
	triangle(370, 500, 170, 500, 270, 200);
	circle(330, 510, 40);
	circle(220, 510, 40);
	fill(230);
	ellipse(310 + mouseX / 50, 110 + mouseY / 50, 50);
	ellipse(210 + mouseX / 50, 110 + mouseY / 50, 50);
	fill(30);
	ellipse(300 + mouseX / 20, 100 + mouseY / 20, 20);
	ellipse(200 + mouseX / 20, 100 + mouseY / 20, 20);
	stroke(230);
	strokeWeight(10);
	line(305, 330, 300 + mouseX / 5, 200 + mouseY / 5);
	line(235, 330, 180 + mouseX / 5, 200 + mouseY / 5);
}

function mousePressed() {
	background(230);
}
