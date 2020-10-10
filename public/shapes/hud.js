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

	setup() {}

	draw() {
		textSize(20);
		fill('#BBB');
		text('Player turn:', 25, 30);
		textSize(26);
		const currentPlayer = game.getPlayerTurn();
		fill(this.playerInformation[currentPlayer].color);
		text(this.playerInformation[currentPlayer].name, 25, 60);
		ellipse(10, 50, 15);
	}
}
