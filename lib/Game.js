const db = require('quick.db');
const { nanoid } = require('nanoid');

// eslint-disable-next-line new-cap
const games = new db.table('games');

class Game {
	constructor({ pid = nanoid(), players = 2, gamestate = {} }) {
		this.pid = pid;
		this.players = players;
		this.gamestate = gamestate;
	}

	static getByPid(pid) {
		const game = games.get(pid);
		return new Game(game);
	}

	static all() {
		return games.all().map((item) => new Game(JSON.parse(item.data)));
	}

	toObject() {
		return {
			pid: this.pid,
			players: this.players,
			gamestate: this.gamestate,
		};
	}

	save() {
		games.set(this.pid, this.toObject());
		return this;
	}
}

module.exports = {
	Game,
};
