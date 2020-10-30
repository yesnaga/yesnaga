const hints = {
	initial: 'token',
	mid_move: 'disc',
};

class Hud {
	constructor(game) {
		this.confetti = []
		this.winner = game.gamestate.winner
		this.playerInformation = game.players.map((name, index) => ({
			name,
			color: Hud.colors()[index % Hud.colors().length],
		}));
		this.setupConfetti()
	}

	static colors() {
		return [
			'#F79B18',
			'#00ADEF',
		];
	}

	setupConfetti(){
		if (!this.winner) return;
		const confettiColors = ['#00aeef','#ec008c','#72c8b6'];
    	this.confetti = Array.from({length: 100}, _ => new Confetti(random(0, width), random(-height, 0), random(-1, 1), random(confettiColors)))
	}

	draw() {
		textAlign(LEFT);
		noStroke();
		textSize(20);
		fill('#BBB');
		text('Player turn:', 25, 30);
		textSize(26);
		const currentPlayer = game.getPlayerTurn();
		fill(this.playerInformation[currentPlayer].color);
		text(this.playerInformation[currentPlayer].name, 25, 60);
		ellipse(140, 25, 15);

		// draws confetti
		if (this.winner){
			this.confetti.forEach(confetti=>confetti.draw())
		}

		// draws hints in start phase
		if (game.gameHistory.length < 3) {
			fill('#BBB');
			textSize(map(sin(frameCount * 0.02), -20, 1, 45, 25));
			text(`Move a ${hints[game.phase]}`, 25, 120);
		}
		stroke('black');
	}
}


class Confetti {
  constructor(x, y, speed, color) {
    this.x = x;
 	this.y = y;
	this.color = color
    this.speed = speed;
    this.time = random(0, 100);
    this.amp = random(2, 30);
    this.phase = random(0.5, 2);
    this.size = random(width / 25, height / 50);
    this.isCircle = Math.random() >= 0.5
  }

  draw() {
    fill(this.color);
    noStroke();
    push();
    translate(this.x, this.y);
    translate(this.amp * sin(this.time * this.phase), this.speed * cos(2 * this.time * this.phase));
    rotate(this.time);
    rectMode(CENTER);
    scale(cos(this.time / 4), sin(this.time / 4));
    this.isCircle ? ellipse(0, 0, this.size) : rect(0, 0, this.size, this.size / 2)
    pop();

    this.time = this.time + 0.1;
    this.speed += 1 / 200;
    this.y += this.speed;
  }
}
