const { nanoid } = require('nanoid');
const { Board } = require('./Board');
const { BoardFactory } = require('./BoardFactory');
const { InvalidMoveError, NotFoundError } = require('./Errors');
const { GameModel } = require('./models/Games.model');

const PHASES = Object.freeze({
	INITIAL: 'initial',
	MID_MOVE: 'mid_move',
	FINISHED: 'finished',
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
				movedDiscs: [],
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
			if (!game) {
				throw new NotFoundError(`No game found with pid=${pid}.`);
			}
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
				throw new InvalidMoveError();
			}
			board.moveToken(from, to);
			if (this.state.board.isWon()) {
				this.state.phase = PHASES.FINISHED;
				this.state.winner = this.players[currentPlayer];
			} else {
				this.state.phase = PHASES.MID_MOVE;
			}
			this.save();
			return this;
		}

		moveDisc({ from, to }) {
			const { board } = this.state;
			const disc = board.getDisc(from);

			if (!disc || this.state.phase !== PHASES.MID_MOVE) {
				throw new InvalidMoveError();
			}
			if (this.state.turn > 0) {
				const lastMove = this.state.movedDiscs[this.state.turn - 1];
				if (lastMove.to.x === from.x && lastMove.to.y === from.y) {
					throw new InvalidMoveError('You cannot move your opponent\'s last moved disc.');
				}
			}
			if (!board.canMoveDiscTo(from, to)) {
				throw new InvalidMoveError();
			}
			board.moveDisc(from, to);
			this.state.phase = PHASES.INITIAL;
			this.state.turn += 1;
			this.state.movedDiscs.push({ from, to });
			this.save();
			return this;
		}
	}

	return { Game, GamePhases: PHASES };
};
