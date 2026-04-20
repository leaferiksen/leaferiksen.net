// all projects in reverse chronological order

const bouncyBallBtn = document.getElementById("bouncyBall");
bouncyBallBtn.addEventListener("click", () => {
	new p5((p) => {
		let b = [];
		let num = 1000;

		p.setup = () => {
			p.createCanvas(600, 600);
			b = new Ball();
			for (let i = 0; i < num; i++) {
				b[i] = new Ball();
			}
		};

		p.draw = () => {
			p.background("white");
			for (let i = 0; i < num; i++) {
				b[i].move();
				b[i].display();
				b[i].bounce();
			}
		};
		class Ball {
			constructor() {
				this.x = p.random(p.width);
				this.y = p.random(p.height);
				this.xSpeed = p.random(-5, 5);
				this.ySpeed = p.random(-5, 5);
			}
			move() {
				this.x += this.xSpeed;
				this.y += this.ySpeed;
			}
			display() {
				p.fill(0, 10);
				p.noStroke();
				p.ellipse(this.x, this.y, 100);
			}
			bounce() {
				if (this.x > p.width || this.x < 0) {
					this.xSpeed = this.xSpeed * -1;
				}
				if (this.y > p.height || this.y < 0) {
					this.ySpeed = this.ySpeed * -1;
				}
			}
		}
	});
});
