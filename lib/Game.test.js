const gameModule = require('./Game');
const { GamesModelMock } = require('./models/Games.mock');
const { NotFoundError, InvalidMoveError, IllegalMoveError } = require('./Errors');

describe('Game', () => {
	describe('dependency injection', () => {
		it('exports a function taking an optional model as argument', () => {
			expect(gameModule instanceof Function).toBe(true);

			expect(gameModule().Game instanceof Function).toBe(true);
			const defaultGame = new (gameModule().Game)({});
			expect(defaultGame).not.toBe(undefined);

			const modifiedGame = new (gameModule(() => { }).Game)({});
			expect(modifiedGame).not.toBe(undefined);
		});
	});

	describe('use cases', () => {
		let mock;
		let Game;
		let GamePhases;

		beforeEach(() => {
			mock = new GamesModelMock();
			const instance = gameModule(mock);
			// eslint-disable-next-line prefer-destructuring
			Game = instance.Game;
			// eslint-disable-next-line prefer-destructuring
			GamePhases = instance.GamePhases;
		});

		describe('#createNew', () => {
			it('creates a new game and returns it after persisting to the model', () => {
				expect(mock.count()).toEqual(0);

				const game = Game.createNew({});
				expect(mock.count()).toEqual(1);
				expect(game).toBeInstanceOf(Game);
			});

			it('assignes default values if not given', () => {
				const game = Game.createNew({});
				expect(game.friendlyName).toEqual('My Yesnaga Game');
				expect(game.players.length).toEqual(2);
				expect(game.state.turn).toEqual(0);
			});
		});

		describe('#getByPid', () => {
			it('returns a game based on its public id', () => {
				const game1 = Game.createNew({ pid: 'foo' });
				const game2 = Game.createNew({ pid: 'bar' });
				const game3 = Game.createNew({ pid: 'baz' });
				expect(Game.getByPid('foo')).toEqual(game1);
				expect(Game.getByPid('baz')).toEqual(game3);
				expect(Game.getByPid('bar')).toEqual(game2);
			});

			it('throws an error if the game does not exist', () => {
				expect(() => Game.getByPid('doesnotexist')).toThrow(NotFoundError);
			});
		});

		describe('#toObject', () => {
			it('returns an object representation of a game', () => {
				const game = new Game({});
				const obj = game.toObject();
				expect(obj).toBeInstanceOf(Object);
				expect(JSON.parse(JSON.stringify(obj))).toStrictEqual(obj);
			});

			it('contains pid, players, friendlyName, and gamestate', () => {
				const game = new Game({});
				const obj = game.toObject();
				['pid', 'players', 'friendlyName', 'gamestate'].forEach((property) => {
					expect(Object.prototype.hasOwnProperty.call(obj, property)).toEqual(true);
				});
			});

			it('serializes the game\'s state and board', () => {
				const game = new Game({ gamestate: { turn: 4 } });
				const obj = game.toObject();
				expect(obj.gamestate.turn).toEqual(4);
				expect(Object.prototype.hasOwnProperty.call(obj.gamestate, 'board')).toEqual(true);
			});

			it('works for custom values', () => {
				const game = new Game({
					pid: 'foobar',
					players: ['me', 'you', 'him'],
					friendlyName: 'Mein Yesnaga-Spiel',
				});
				const obj = game.toObject();
				expect(obj.pid).toEqual('foobar');
				expect(new Set(obj.players)).toStrictEqual(new Set(['me', 'you', 'him']));
				expect(obj.friendlyName).toEqual('Mein Yesnaga-Spiel');
			});
		});

		describe('#save', () => {
			it('creates a game in the model', () => {
				const game = new Game({
					pid: 'savegame',
					friendlyName: 'should be saved',
				});
				expect(mock.count()).toEqual(0);
				game.save();
				expect(mock.count()).toEqual(1);
				expect(mock.data[game.pid].pid).toEqual(game.pid);
				expect(mock.data[game.pid].friendlyName).toEqual(game.friendlyName);
			});

			it('returns the game instance', () => {
				const game = new Game({});
				expect(game.save()).toEqual(game);
			});
		});

		describe('#moveToken', () => {
			it('allows valid moves', () => {
				const game = new Game({});
				expect(() => game.moveToken({ from: { x: -2, y: 0 }, to: { x: -2, y: -1 } }))
					.not.toThrow();
				expect(game.state.board.getToken({ x: -2, y: -1 })).not.toEqual(undefined);
			});

			it('throws InvalidMoveError for invalid moves', () => {
				const game = new Game({});
				// not this player's turn
				expect(() => game.moveToken({ from: { x: -2, y: -2 }, to: { x: -2, y: -1 } }))
					.toThrow(InvalidMoveError);
				// no token to move
				expect(() => game.moveToken({ from: { x: 0, y: 0 }, to: { x: -4, y: -4 } }))
					.toThrow(InvalidMoveError);
			});

			it('throws IllegalMoveError for illegal moves of a valid token', () => {
				const game = new Game({});
				expect(() => game.moveToken({ from: { x: -2, y: 0 }, to: { x: -4, y: -4 } }))
					.toThrow(IllegalMoveError); // not a valid target for this token
			});

			it('doesn\'t allow to move a token twice in a row', () => {
				const game = new Game({});
				game.moveToken({ from: { x: -2, y: 0 }, to: { x: -2, y: -1 } });
				expect(() => game.moveToken({ from: { x: -2, y: -1 }, to: { x: -2, y: 0 } }))
					.toThrow(InvalidMoveError);
			});

			it('doesn\'t allow moving two tokens without moving a disc first', () => {
				const game = new Game({});
				game.moveToken({ from: { x: -2, y: 0 }, to: { x: -2, y: -1 } });
				expect(() => game.moveToken({ from: { x: -2, y: -2 }, to: { x: -1, y: -2 } }))
					.toThrow(InvalidMoveError);
			});

			it('updates the game state after a successful move', () => {
				const game = new Game({});
				expect(game.state.phase).toEqual(GamePhases.INITIAL);
				game.moveToken({ from: { x: 2, y: 2 }, to: { x: -1, y: -1 } });
				expect(game.state.phase).toEqual(GamePhases.MID_MOVE);
			});
		});

		describe('#moveDisc', () => {
			it('doesn\'t allow moving discs if a token needs to be moved first', () => {
				const game = new Game({});
				expect(game.state.phase).toEqual(GamePhases.INITIAL);
				expect(() => game.moveDisc({ from: { x: -2, y: -1 }, to: { x: 2, y: 3 } }))
					.toThrow(InvalidMoveError);
			});

			it('only works in MID_MOVE phase', () => {
				const game = new Game({});
				expect(game.state.phase).toEqual(GamePhases.INITIAL);
				game.state.phase = GamePhases.MID_MOVE;
				expect(() => game.moveDisc({ from: { x: -2, y: -1 }, to: { x: 2, y: 3 } }))
					.not.toThrow();
				expect(game.state.board.getDisc({ x: 2, y: 3 })).not.toEqual(undefined);
			});

			it('doesn\'t allow moving discs to invalid locations', () => {
				const game = new Game({ gamestate: { phase: GamePhases.MID_MOVE } });
				expect(() => game.moveDisc({ from: { x: -2, y: -1 }, to: { x: 2, y: 4 } }))
					.toThrow(IllegalMoveError);
			});

			it('doesn\'t allow moving unmoveable discs', () => {
				const game = new Game({ gamestate: { phase: GamePhases.MID_MOVE } });
				expect(() => game.moveDisc({ from: { x: -2, y: -2 }, to: { x: 2, y: 3 } }))
					.toThrow(IllegalMoveError);
			});

			it('doesn\'t allow moving discs to locations only attached to one other disc', () => {
				const game = new Game({ gamestate: { phase: GamePhases.MID_MOVE } });
				expect(() => game.moveDisc({ from: { x: -2, y: -1 }, to: { x: 3, y: 3 } }))
					.toThrow(IllegalMoveError);
			});
		});

		describe('movement', () => {
			it('should manage the game state according to actions', () => {
				const game = new Game({});
				expect(game.state.phase).toEqual(GamePhases.INITIAL);
				expect(game.state.turn).toEqual(0);
				game.moveToken({ from: { x: 2, y: 2 }, to: { x: -1, y: -1 } });
				expect(game.state.phase).toEqual(GamePhases.MID_MOVE);
				game.moveDisc({ from: { x: -2, y: -1 }, to: { x: 2, y: 3 } });
				expect(game.state.phase).toEqual(GamePhases.INITIAL);
				expect(game.state.turn).toEqual(1);
			});

			it('should not allow managing the opponent\'s game pieces', () => {
				// in move 0, it's player0's turn, but (-2,-2) is player1's token
				const game = new Game({ gamestate: { turn: 0 } });
				expect(() => game.moveToken({ from: { x: -2, y: -2 }, to: { x: -1, y: -1 } }))
					.toThrow(InvalidMoveError);

				// in move 1, it should be player1's turn
				game.state.turn = 1;
				// (2,2) is player0's token
				expect(() => game.moveToken({ from: { x: 2, y: 2 }, to: { x: -1, y: -1 } }))
					.toThrow(InvalidMoveError);
				// (-2,-2) is player1's token:
				expect(() => game.moveToken({ from: { x: -2, y: -2 }, to: { x: 1, y: 1 } }))
					.not.toThrow();
			});

			it('allows for many turns', () => {
				const game = new Game({ gamestate: { turn: 854623873 } });
				expect(() => game.moveToken({ from: { x: -2, y: -2 }, to: { x: 1, y: 1 } }))
					.not.toThrow();

				expect(game.state.board.getToken({ x: -2, y: -2 })).toEqual(undefined);
				expect(game.state.board.getToken({ x: 1, y: 1 })).not.toEqual(undefined);
			});
		});
	});
});
