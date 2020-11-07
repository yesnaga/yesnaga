class Game {
	constructor(data) {
		this.cheatArray = [];
		this.gameHistory = data.gameHistory || [];
		this.players = data.players;
		this.pid = data.pid;
		this.winner = null;
		this.errorMsg = null;
		this.setTurn(data.gamestate.turn);
		this.setPhase(data.gamestate.phase);
		this.replaceBoard(data.gamestate.board);
		this.replaceHud(data);
	}

	replaceHud(data = this) {
		this.hud = new Hud(data);
	}

	// Mega hack, must fix
	setTurn(size) {
		this.gameHistory = Array.from({ length: size });
	}

	setPhase(phase = 'initial') {
		// Enum: ['intial', 'mid_move', 'finished']
		if (phase === 'finished') {
			localStorage.removeItem('yesnaga_pid');
			setTimeout(() => {
				// reloads the page after finishing the game
				// forcing the user back to main menu
				location.reload();
			}, 20 * 1000);
		}
		this.phase = phase;
	}

	replaceBoard(board) {
		this.tokens = [];
		this.discs = [];
		this.ghostDiscs = [];
		this.playerTokens = board.players;

		const uniqueGhostDiscs = new Set();

		board.discs.forEach((d) => {
			this.discs.push(new Disc(d.x * 120 + (d.y * -60) + 500, d.y * 100 + 500, 80, d));

			d.moveableTo.forEach((ghostDisc) => uniqueGhostDiscs.add(JSON.stringify(ghostDisc)));

			this.playerTokens.forEach((player) => {
				const token = player.tokens.find((t) => t.tile.x === d.x && t.tile.y === d.y);
				if (token) {
					this.tokens.push(new Token(d.x * 120 + (d.y * -60) + 500, d.y * 100 + 500, 60, token, parseInt(player.id, 10)));
				}
			});
		});
		this.ghostDiscs = Array.from(uniqueGhostDiscs)
			.map((ghostDisc) => JSON.parse(ghostDisc))
			.map((ghostDisc) => new GhostDisc(ghostDisc.x * 120 + (ghostDisc.y * -60) + 500, ghostDisc.y * 100 + 500, 80, ghostDisc));
	}

	getPlayerTurn() {
		return this.gameHistory.length % 2;
	}

	draw() {
		clear();
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
				ghostDisc.hovering = this.ghostDiscHoverCheck(ghostDisc, mouseX, mouseY);
				ghostDisc.draw();
			});
		}
		this.hud.draw();
		if (this.errorMsg) {
			fill('tomato');
			text(`${this.errorMsg}`, 25, 150);
		}
	}

	cheatCode(key) {
		// user can trigger easter egg with the konami code
		this.cheatArray.push(key);
		const konamiCheat = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
		const stringifiedCheat = JSON.stringify(konamiCheat).toLowerCase();
		const stringifiedInput = JSON.stringify(this.cheatArray).toLowerCase();

		if (stringifiedInput === stringifiedCheat) {
			console.warn('Super Yesnaga mode: activated');
			console.warn('Starting reactors: online');
			console.warn('Enabling advanced systems');
			setTimeout(() => {
				console.error('missing cpu power - aborting..');
			}, 3000);
		}

		// user is given 3 seconds to type code before array is reset
		setTimeout(() => {
			this.cheatArray = [];
		}, 3000);
	}

	tileHoverCheck(tile, mX, mY) {
		if (this.getPlayerTurn() !== tile.player || this.phase !== 'initial') {
			return false;
		}
		const delta = Math.sqrt((mX - tile.x) ** 2 + (mY - tile.y) ** 2);
		return delta < tile.d / 2;
	}

	discHoverCheck(tile, mX, mY) {
		const delta = Math.sqrt((mX - tile.x) ** 2 + (mY - tile.y) ** 2);
		return delta < tile.d / 2;
	}

	ghostDiscHoverCheck(tile, mX, mY) {
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
		for (const ghostDisc of this.ghostDiscs) {
			ghostDisc.display = false;
		}
	}

	checkLegalTokenMove(token, disc) {
		return token.tokenInfo.moveableTo.some((legalMoves) => legalMoves.id === disc.discInfo.id);
	}

	checkLegalDiscMove(disc, ghostDisc) {
		return disc.discInfo.moveableTo.some((legalMoves) => legalMoves.x === ghostDisc.discInfo.x && legalMoves.y === ghostDisc.discInfo.y);
	}

	mouseClicked(e) {
		const clickedToken = this.tokens.find((t) => t.clicked);
		const hoveringToken = this.tokens.find((t) => t.hovering);
		const hoveringDisc = this.discs.find((d) => d.hovering);
		if (this.phase === 'initial') {
			return this.mouseClickInitialPhase(clickedToken, hoveringDisc, hoveringToken);
		}
		const clickedDisc = this.discs.find((d) => d.clicked);
		const ghostDisc = this.ghostDiscs.find((gd) => gd.hovering);

		if (this.phase === 'mid_move') {
			return this.mouseClickMidMovePhase(clickedDisc, hoveringDisc, ghostDisc);
		}
	}


	mouseClickInitialPhase(clickedToken, hoveringDisc, hoveringToken) {
		if (clickedToken && hoveringDisc && this.checkLegalTokenMove(clickedToken, hoveringDisc)) {
			makeTokenMove(clickedToken, hoveringDisc, this.pid)
				.then((result) => {
					if (result) {
						this.replaceBoard(result.gamestate.board);
						this.setPhase(result.gamestate.phase);
						this.setTurn(result.gamestate.turn);
						this.replaceHud(result);
					}
				})
				.catch(errorHandler);
		}

		this.resetClick();

		if (hoveringToken) {
			hoveringToken.clicked = !hoveringToken.clicked;

			hoveringToken.tokenInfo.moveableTo.forEach((target) => {
				const targetDisc = this.discs.find((d) => d.discInfo.id === target.id);
				if (targetDisc) {
					targetDisc.previewMode = true;
				}
			});
		}
	}

	mouseClickMidMovePhase(clickedDisc, hoveringDisc, ghostDisc) {
		if (clickedDisc && ghostDisc && this.checkLegalDiscMove(clickedDisc, ghostDisc)) {
			makeDiscMove(clickedDisc, ghostDisc, this.pid)
				.then((result) => {
					if (result) {
						this.replaceBoard(result.gamestate.board);
						this.setPhase(result.gamestate.phase);
						this.setTurn(result.gamestate.turn);
						this.replaceHud(result);
					}
				})
				.catch(errorHandler);
		}
		this.resetClick();

		if (hoveringDisc && hoveringDisc.discInfo.moveable) {
			hoveringDisc.clicked = !hoveringDisc.clicked;
			hoveringDisc.discInfo.moveableTo.forEach((moveableToDisc) => {
				const discToDisplay =					this.ghostDiscs.find((ghostDisc) => ghostDisc.discInfo.x === moveableToDisc.x && ghostDisc.discInfo.y === moveableToDisc.y);
				discToDisplay.display = true;
			});
		}
	}
}


const makeTokenMove = async (clickedToken, nextDiscPosition, pid) => {
	const from = {
		x: clickedToken.tokenInfo.tile.x,
		y: clickedToken.tokenInfo.tile.y,
	};
	const to = {
		x: nextDiscPosition.discInfo.x,
		y: nextDiscPosition.discInfo.y,
	};
	let response;
	try {
		response = await fetch('api/moveToken', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ from, to, pid }),
		});
		const body = await response.json();
		if (response.status === 200) {
			return body;
		}
		return errorHandler(body.message);
	} catch (e) {
		throw e;
	}
};

const makeDiscMove = async (clickedDisc, ghostDisc, pid) => {
	const from = {
		x: clickedDisc.discInfo.x,
		y: clickedDisc.discInfo.y,
	};
	const to = {
		x: ghostDisc.discInfo.x,
		y: ghostDisc.discInfo.y,
	};
	let response;
	try {
		response = await fetch('api/moveDisc', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ from, to, pid }),
		});
		const body = await response.json();
		if (response.status === 200) {
			return body;
		}
		return errorHandler(body.message);
	} catch (e) {
		throw e;
	}
};

const errorHandler = (error) => {
	console.error(`Error occured: ${error}`);
	game.errorMsg = error;
	setTimeout(() => {
		game.errorMsg = null;
	}, 5000);
	// throw error
};
