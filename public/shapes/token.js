class Token {
	constructor(x, y, d = 80, tokenInfo, player) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.tokenInfo = tokenInfo;
		this.player = player; // enum: ['p1','p2']

		this.hovering = false;
		this.clicked = false;
	}

	static colors() {
		return ['#F79B18', '#00ADEF'];
	}


	setup() {
		return false;
	}

	draw() {
		fill('#e5e5e5');
		ellipse(this.x, this.y, this.d + 20);
		fill(Token.colors()[this.player]);
		if (this.hovering || this.clicked) {
			strokeWeight(4);
		}
		ellipse(this.x, this.y, this.d);
		strokeWeight(1);

		// debug
		if (game.debug) {
			fill('black');
			textSize(20);
			text(`P${this.player}`, this.x - 25, this.y + 5);
		}
	}
}
