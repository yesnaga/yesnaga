const hints = {
	initial: 'token',
	mid_move: 'disc'
}

class Hud {
	constructor(game) {
		this.game = game;
		this.playerInformation = this.game.players.map((name, index) => ({
			name,
			color: Hud.colors()[index % Hud.colors().length],
		}));
	}

	static colors() {
		return [
			'#F79B18',
			'#00ADEF',
		];
	}

	draw() {
		textAlign(LEFT)
		noStroke()
		textSize(20);
		fill('#BBB');
		text('Player turn:', 25, 30);
		textSize(26);
		const currentPlayer = game.getPlayerTurn();
		fill(this.playerInformation[currentPlayer].color);
		text(this.playerInformation[currentPlayer].name, 25, 60);
		ellipse(140, 25, 15);

		// draws hints in start phase
		if (game.gameHistory.length < 3) {
			fill('#BBB');
			textSize(map(sin(frameCount * 0.02), -20, 1, 45, 25));
			text(`Move a ${hints[game.phase]}`, 25, 120)
		}
		stroke("black")
	}
}
