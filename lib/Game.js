const db = require('quick.db');
const { nanoid } = require('nanoid');
const { Board } = require('./Board');
const { BoardFactory } = require('./BoardFactory');

// eslint-disable-next-line new-cap
const games = new db.table('games');

class Game {
	constructor({ pid = nanoid(), players = 2, gamestate = {} }) {
		this.pid = pid;
		this.players = players;
		this.gamestate = gamestate;
		if (!gamestate.board) {
			this.gamestate.board = new Board();
		} else {
			this.gamestate.board = BoardFactory.createBoardFromObject(gamestate.board);
		}
	}

	static createNew(data) {
		const game = new Game(data);
		game.save();
		return game;
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
			gamestate: {
				...this.gamestate,
				board: BoardFactory.toObject(this.gamestate.board),
			},
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
