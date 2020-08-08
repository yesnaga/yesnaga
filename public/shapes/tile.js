class Tile {
	constructor(x, y, d = 80, tileInfo, player) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.tileInfo = tileInfo;
		this.colors = {
			p1: '#F79B18',
			p2: '#00ADEF',
		};
		this.player = player; // enum: ['p1','p2']
		this.hovering = false;

		this.debug = true;
		this.clicked = false;
	}

	setup() {
		return false;
	}

	draw() {
		if (this.player) { // check if tile is owned by player
			fill('#e5e5e5');
			ellipse(this.x, this.y, this.d + 20);
			fill(this.colors[this.player]);
			const hoverValue = this.hovering ? 10 : 0;
			const clickValue = this.clicked ? 10 : 0;
			ellipse(this.x, this.y, this.d + hoverValue + clickValue);
		} else {
			fill('#e5e5e5');
			ellipse(this.x, this.y, this.d);
		}

		// debug
		if (this.debug) {
			fill('black');
			textSize(20);
			text(`ID:${this.tileInfo.id}`, this.x - 25, this.y + 5);
			text(this.hovering.toString(), this.x - 25, this.y + 25);
		}
	}
}
