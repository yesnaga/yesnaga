class Disc {
	constructor(x, y, d = 80, discInfo) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.discInfo = discInfo;

		this.hovering = false;
		this.debug = true;
		this.previewMode = false;
	}

	static colors() {
		return ['#F79B18', '#00ADEF'];
	}


	setup() {
		return false;
	}

	draw() {
		fill('#e5e5e5');
		/* if (this.hovering) {
			fill('#7fff00');
		} */
		if (this.previewMode) {
			fill('#7fff00');
		}
		ellipse(this.x, this.y, this.d);


		// debug
		if (this.debug) {
			fill('black');
			textSize(20);
			text(`ID:${this.discInfo.id}`, this.x - 25, this.y + 5);
		}
	}
}
