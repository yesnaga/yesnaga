class Game {
	constructor(gameObject) {
		this.background = new Background();
		this.hud = new Hud([,]);
		// filled with Tile-classes
		// filled with ids of already existing tiles
		this.tokens = [];

		this.discs = [];

		this.players = gameObject.players;

		this.drawBackground = false;
		this.cheatArray = [];
		this.gameHistory = [];

		gameObject.discs.forEach((d) => {
			this.discs.push(new Disc(d.x * 120 + (d.y * -60) + 500, d.y * 100 + 500, 80, d));

			this.players.forEach((player) => {
				const token = player.tokens.find((t) => t.tile.x === d.x && t.tile.y === d.y);
				if (token) {
					this.tokens.push(new Token(d.x * 120 + (d.y * -60) + 500, d.y * 100 + 500, 60, token, parseInt(player.id, 10)));
				}
			});
		});
	}

	getPlayerTurn() {
		return this.gameHistory.length % 2;
	}

	setup() {
		this.background.setup();
	}

	draw() {
		clear();
		if (this.drawBackground) {
			this.background.draw();
		}
		this.hud.draw();
		this.discs.forEach((disc) => {
			disc.draw();
		});
		this.tokens.forEach((token) => {
			token.hovering = this.hoverCheck(token, mouseX, mouseY);
			token.draw();
		});
		// text(`${mouseX.toFixed(2)}   ${mouseY.toFixed(2)}`, mouseX, mouseY);
	}

	cheatCode(key) {
		// user can trigger easter egg with the konami code
		this.cheatArray.push(key);
		if (key === 'B' || key.toLowerCase() === 'q') {
			this.drawBackground = !this.drawBackground;
			background('white'); // this for resetting the background resulting in no trail of clouds on board.
		}
		const konamiCheat = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
		const stringifiedCheat = JSON.stringify(konamiCheat).toLowerCase();
		const stringifiedInput = JSON.stringify(this.cheatArray).toLowerCase();

		if (stringifiedInput === stringifiedCheat) {
			this.background.xSunSpeed = 50;
			console.warn('Super Yesnaga mode: activated');
			console.warn('Starting reactors: online');
			console.warn('Enabling advanced systems');
			setTimeout(() => {
				console.error('missing cpu power - aborting..');
				this.background.xSunSpeed = 0.5;
			}, 3000);
		}

		// user is given 3 seconds to type code before array is reset
		setTimeout(() => {
			this.cheatArray = [];
		}, 3000);
	}

	hoverCheck(tile, mX, mY) {
		if (this.getPlayerTurn() !== tile.player) {
			return false;
		}
		const delta = Math.sqrt((mX - tile.x) ** 2 + (mY - tile.y) ** 2);
		return delta < tile.d / 2;
	}

	// not dry
	// reuse hover function somehow!
	clickTile(e) {
		for (const tile of this.tokens) {
			tile.clicked = false;
		}
		for (const disc of this.discs) {
			disc.previewMode = false;
		}

		const token = this.tokens.find((t) => t.hovering);

		if (token) {
			token.clicked = !token.clicked;

			token.tokenInfo.moveableTo.forEach((target) => {
				const targetDisc = this.discs.find((d) => d.discInfo.id === target.id);
				if (targetDisc) {
					targetDisc.previewMode = true;
				}
			});
		}
	}
}
