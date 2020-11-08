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

	draw() {
		fill('#e5e5e5');
		if (this.previewMode) {
			fill('#7fff00');
		}
		ellipse(this.x, this.y, this.d);

		if (game.phase === 'mid_move' && this.discInfo.moveable) {
			const dotWeight = this.hovering || this.clicked ? 3.5 : 2;
			fill('black');
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 2; j++) {
					ellipse(this.x - 8 + i * 8, this.y - 2 + j * 8, dotWeight);
				}
			}
			fill('#e5e5e5');
		}
	}
}
