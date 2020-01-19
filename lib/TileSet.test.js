const { TileSet } = require('./TileSet');
const { InvalidInputError } = require('./Errors');
const { tiles: defaultTiles } = require('./defaults');

describe('TileSet', () => {
	it('should work on default tile set', () => {
		expect(() => new TileSet(defaultTiles)).not.toThrow();
	});

	describe('#ensureValidIndex', () => {
		const tileSet = new TileSet({ 1: {}, 2: {}, 3: {} });

		it('passes for valid indexes', () => {
			expect(() => tileSet.ensureValidIndex(1)).not.toThrow();
			expect(() => tileSet.ensureValidIndex(2)).not.toThrow();
			expect(() => tileSet.ensureValidIndex(3)).not.toThrow();
		});

		it('throws for invalid indexes', () => {
			expect(() => tileSet.ensureValidIndex(5)).toThrow(InvalidInputError);
		});
	});
});
