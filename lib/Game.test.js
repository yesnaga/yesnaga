const gameModule = require('./Game');
const { GamesModelMock } = require('./models/Games.mock');

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
		describe('#createNew', () => {
			it('creates a new game and returns it after persisting to the model', () => {
				const mock = new GamesModelMock();
				const { Game } = gameModule(mock);
				expect(mock.count()).toEqual(0);

				const game = Game.createNew({});
				expect(mock.count()).toEqual(1);
				expect(game).toBeInstanceOf(Game);
			});
		});
	});
});
