const { nanoid } = require('nanoid');
const { Board } = require('./Board');
const { BoardFactory } = require('./BoardFactory');
const { InvalidMoveError, IllegalMoveError } = require('./Errors');
const { GameModel } = require('./models/Games.model');

const PHASES = Object.freeze({
	INITIAL: 'initial',
	MID_MOVE: 'mid_move',
});

module.exports = (Model = new GameModel()) => {
	class Game {
		constructor({
			pid = nanoid(),
			players = ['Max', 'Tor'],
			friendlyName = 'My Yesnaga Game',
			gamestate: state = {},
		}) {
			this.pid = pid;
			this.players = players;
			this.friendlyName = friendlyName;
			this.state = {
				turn: 0,
				phase: PHASES.INITIAL,
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
			const game = Model.get(pid);
			return new Game(game);
		}

		static all() {
			return Model.all().map((item) => new Game(item));
		}

		toObject() {
			return {
				pid: this.pid,
				players: this.players,
				friendlyName: this.friendlyName,
				gamestate: {
					...this.state,
					board: BoardFactory.toObject(this.state.board),
				},
			};
		}

		save() {
			Model.set(this.pid, this.toObject());
			return this;
		}

		moveToken({ from, to }) {
			const { board } = this.state;
			const token = board.getToken(from);
			const currentPlayer = this.state.turn % this.players.length;

			if (
				!token
				|| this.state.phase !== PHASES.INITIAL
				|| !board.tokenBelongsToPlayer(token, currentPlayer)
			) {
				throw new InvalidMoveError();
			}
			if (!board.canMoveTokenTo(from, to)) {
				throw new IllegalMoveError();
			}
			board.moveToken(from, to);
			this.state.phase = PHASES.MID_MOVE;
			this.save();
			return this;
		}

		moveDisc({ from, to }) {
			const { board } = this.state;
			const disc = board.getDisc(from);

			if (!disc || this.state.phase !== PHASES.MID_MOVE) {
				throw new InvalidMoveError();
			}
			if (!board.canMoveDiscTo(from, to)) {
				throw new IllegalMoveError();
			}
			board.moveDisc(from, to);
			this.state.phase = PHASES.INITIAL;
			this.state.turn += 1;
			this.save();
			return this;
		}
	}

	return { Game };
};
