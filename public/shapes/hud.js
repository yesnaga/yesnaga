class Hud {
	constructor(gameHistory) {
		this.gameHistory = gameHistory;
		this.playerInformation = {
			p1: {
				color: '#F79B18',
				name: 'Max',
			},
			p2: {
				color: '#00ADEF',
				name: 'Tor',
			},
		};
	}

	setup() {
		console.log('Hud setup');
	}

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
