class Game {
	constructor(data) {
		this.background = new Background();
		this.drawBackground = false;
		this.cheatArray = [];
		this.gameHistory = data.gameHistory || [];
		this.errorMsg = null;
		this.debug = false;
		this.players = data.players;

		// temp variable
		this.phase = /* data.gamestate.phase || */ 'mid_move' // enum: ["mid_move", "initial"]
		this.replaceBoard(data.gamestate.board);
		this.hud = new Hud(this);
	}

	setPhase(phase) {
		this.phase = phase
	}

	replaceBoard(board) {
		this.tokens = [];
		this.discs = [];
		this.ghostDiscs = []
		this.playerTokens = board.players;

		const uniqueGhostDiscs = new Set();

		board.discs.forEach((d) => {
			this.discs.push(new Disc(d.x * 120 + (d.y * -60) + 500, d.y * 100 + 500, 80, d));

			d.moveableTo.forEach(ghostDisc => uniqueGhostDiscs.add(JSON.stringify(ghostDisc)))

			this.playerTokens.forEach((player) => {
				const token = player.tokens.find((t) => t.tile.x === d.x && t.tile.y === d.y);
				if (token) {
					this.tokens.push(new Token(d.x * 120 + (d.y * -60) + 500, d.y * 100 + 500, 60, token, parseInt(player.id, 10)));
				}
			});
		});
		this.ghostDiscs = Array.from(uniqueGhostDiscs)
			.map(ghostDisc => JSON.parse(ghostDisc))
			.map(ghostDisc => new GhostDisc(ghostDisc.x * 120 + (ghostDisc.y * -60) + 500, ghostDisc.y * 100 + 500, 80, ghostDisc))
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
			disc.hovering = this.discHoverCheck(disc, mouseX, mouseY);
			disc.draw();
		});
		this.tokens.forEach((token) => {
			token.hovering = this.tileHoverCheck(token, mouseX, mouseY);
			token.draw();
		});
		if (this.phase === 'mid_move') {
			this.ghostDiscs.forEach((ghostDisc) => {
				ghostDisc.draw();
			})
		}
		if (this.errorMsg) {
			fill('tomato');
			text(`${this.errorMsg}`, 25, 150);
		}
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

	tileHoverCheck(tile, mX, mY) {
		if (this.getPlayerTurn() !== tile.player) {
			return false;
		}
		const delta = Math.sqrt((mX - tile.x) ** 2 + (mY - tile.y) ** 2);
		return delta < tile.d / 2;
	}

	discHoverCheck(tile, mX, mY) {
		const delta = Math.sqrt((mX - tile.x) ** 2 + (mY - tile.y) ** 2);
		return delta < tile.d / 2;
	}

	resetClick() {
		for (const tile of this.tokens) {
			tile.clicked = false;
		}
		for (const disc of this.discs) {
			disc.clicked = false;
			disc.previewMode = false;
		}
	}

	checkLegalMove(token, disc) {
		return token.tokenInfo.moveableTo.some((legalMoves) => legalMoves.id === disc.discInfo.id);
	}


	clickTile(e) {
		const clickedToken = this.tokens.find((t) => t.clicked);
		const nextDiscPosition = this.discs.find((d) => d.hovering);

		// checks if player is trying to make a move and validates it (and makes move if legal)
		if (clickedToken && nextDiscPosition && this.checkLegalMove(clickedToken, nextDiscPosition)) {
			makeMove(clickedToken, nextDiscPosition)
				.then((result) => {
					if (result) {
						this.replaceBoard(result)
						// this.setPhase(result)
					}
				})
				.catch(errorHandler);
		}
		this.resetClick();

		const token = this.tokens.find((t) => t.hovering);
		const disc = this.discs.find((d) => d.hovering)

		if (token) {
			token.clicked = !token.clicked;

			token.tokenInfo.moveableTo.forEach((target) => {
				const targetDisc = this.discs.find((d) => d.discInfo.id === target.id);
				if (targetDisc) {
					targetDisc.previewMode = true;
				}
			});
		}

		if (disc && this.phase === 'mid_move') {
			disc.clicked = !disc.clicked;
		}
	}
}


const makeMove = async (clickedToken, nextDiscPosition) => {
	const from = {
		x: clickedToken.tokenInfo.tile.x,
		y: clickedToken.tokenInfo.tile.y
	}
	const to = {
		x: nextDiscPosition.discInfo.x,
		y: nextDiscPosition.discInfo.y
	}
	let response;
	try {
		response = await fetch('api/moveToken', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ from, to }),
		});
		const body = await response.json()
		if (response.status === 200) {
			return body.gamestate.board
		}
		return errorHandler(body.message)
	} catch (e) {
		throw e;
	}
};

const errorHandler = error => {
	console.error(`Error occured: ${error}`)
	game.errorMsg = error
	setTimeout(() => {
		game.errorMsg = null;
	}, 5000);
	// throw error
}