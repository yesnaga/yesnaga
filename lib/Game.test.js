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
	});
});
