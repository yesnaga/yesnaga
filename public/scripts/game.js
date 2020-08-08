class Game {
	constructor(gameObject) {
		this.background = new Background();
		this.hud = new Hud([,]);
		// filled with Tile-classes
		// filled with ids of already existing tiles
		this.drawnTiles = [];
		this.playerTiles = [];

		this.tiles = [];

		this.neighbours = NEIGHBOURS;
		this.discs = gameObject.discs;
		this.players = gameObject.players;

		this.drawBackground = false;
		this.cheatArray = [];
		this.gameHistory = [];
	}

	getPlayerTurn() {
		return this.gameHistory.length % 2 ? 'p2' : 'p1';
	}

	getPlayerTurnIndex() {
		return this.gameHistory.length % 2 ? 1 : 0;
	}

	setup() {
		this.background.setup();
		this.discs.forEach((d) => {
			this.tiles.push(new Tile(d.x * 120 + (d.y * -60) + 500, d.y * 100 + 500, 80, d));
			if (this.players[0].tokens.some((t) => t.tile.x === d.x && t.tile.y === d.y)) {
				this.playerTiles.push(new Tile(d.x * 120 + (d.y * -60) + 500, d.y * 100 + 500, 60, d, 'p1'));
			}
			if (this.players[1].tokens.some((t) => t.tile.x === d.x && t.tile.y === d.y)) {
				this.playerTiles.push(new Tile(d.x * 120 + (d.y * -60) + 500, d.y * 100 + 500, 60, d, 'p2'));
			}
		});
	}

	draw() {
		clear();
		if (this.drawBackground) {
			this.background.draw();
		}
		this.hud.draw();
		this.tiles.forEach((tile) => {
			tile.draw();
		});
		this.playerTiles.forEach((tile) => {
			tile.hovering = this.hoverCheck(tile, mouseX, mouseY);
			tile.draw();
		});
		text(`${mouseX.toFixed(2)}   ${mouseY.toFixed(2)}`, mouseX, mouseY);
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
		/* this.hoverCheck(false, mouseX, mouseY) */
		const playerTurnIndex = this.getPlayerTurnIndex();
		let tileId;

		this.tiles.forEach((t, i) => {
			t.clicked = false; // unclicks all tiles
			const r = 35; // or 40
			if (t.x - r < mouseX // left
                && t.x + r > mouseX // right
                && t.y - r < mouseY // top
                && t.y + r > mouseY) { // bottom
				tileId = this.tiles[i].tileInfo.id;
				if (this.players[playerTurnIndex].tokens.some((t) => t.tile === tileId)) {
					this.tiles[i].clicked = !this.tiles[i].clicked;
				}
			}
		});
	}
}
