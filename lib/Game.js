const db = require('quick.db');
const { nanoid } = require('nanoid');
const { Board } = require('./Board');
const { BoardFactory } = require('./BoardFactory');
const { InvalidMoveError, IllegalMoveError } = require('./Errors');

// eslint-disable-next-line new-cap
const games = new db.table('games');

class Game {
	constructor({ pid = nanoid(), players = 2, gamestate: state = {} }) {
		this.pid = pid;
		this.players = players;
		this.state = {
			turn: 0,
			...state,
		};
		if (!state.board) {
			this.state.board = new Board();
		} else {
			this.state.board = BoardFactory.createBoardFromObject(state.board);
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
				...this.state,
				board: BoardFactory.toObject(this.state.board),
			},
		};
	}

	save() {
		games.set(this.pid, this.toObject());
		return this;
	}

	moveToken({ from, to }) {
		const { board } = this.state;
		const token = board.getToken(from);
		const currentPlayer = this.state.turn % this.players;

		if (!token || !board.tokenBelongsToPlayer(token, currentPlayer)) {
			throw new InvalidMoveError();
		}
		if (!board.canMoveTokenTo(from, to)) {
			throw new IllegalMoveError();
		}
		board.moveToken(from, to);
		this.save();
		return this;
	}
}

module.exports = {
	Game,
};
