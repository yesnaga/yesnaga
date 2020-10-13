const gameModule = require('./Game');
const { GamesModelMock } = require('./models/Games.mock');
const { NotFoundError } = require('./Errors');

describe('Game', () => {
	describe('dependency injection', () => {
		it('exports a function taking an optional model as argument', () => {
			expect(gameModule instanceof Function).toBe(true);

			expect(gameModule().Game instanceof Function).toBe(true);
			const defaultGame = new (gameModule().Game)({});
			expect(defaultGame).not.toBe(undefined);

			const modifiedGame = new (gameModule(() => {}).Game)({});
			expect(modifiedGame).not.toBe(undefined);
		});
	});

	describe('use cases', () => {
		let mock;
		let Game;

		beforeEach(() => {
			mock = new GamesModelMock();
			// eslint-disable-next-line prefer-destructuring
			Game = gameModule(mock).Game;
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
	});
});
