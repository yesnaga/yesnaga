class Disc {
	constructor(x, y, d = 80, discInfo) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.discInfo = discInfo;

		this.clicked = false;
		this.hovering = false;
		this.previewMode = false;
	}
	// uneeded variables?
	/* static colors() {
		return ['#F79B18', '#00ADEF'];
	} */

	draw() {
		fill('#e5e5e5');
		if (this.previewMode) {
			fill('#7fff00');
		}
		ellipse(this.x, this.y, this.d);

		if (game.phase === 'mid_move' && this.discInfo.moveable) {
			const dotWeight = this.hovering || this.clicked ? 2.8 : 2
			fill('black')
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 2; j++) {
					ellipse(this.x - 6 + i * 6, this.y + j * 6, dotWeight);
				}
			}
			fill('#e5e5e5');
		}
		if (this.clicked) {
			// disc is now clicked
		}
		// debug
		if (game.debug) {
			fill('black');
			textSize(20);
			text(`ID:${this.discInfo.id}`, this.x - 25, this.y + 5);
		}
	}
}
