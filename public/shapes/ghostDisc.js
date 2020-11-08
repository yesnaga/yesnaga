class GhostDisc {
	constructor(x, y, d = 80, discInfo) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.discInfo = discInfo;

		// this.clicked = false;
		this.hovering = false;
		this.display = false;
	}

	draw() {
		if (this.display) {
			fill('rgba(220, 220, 220, 0.24)');
			if (!this.hovering) {
				noStroke();
			}
			ellipse(this.x, this.y, this.d);
			stroke('black');
		}
	}
}
