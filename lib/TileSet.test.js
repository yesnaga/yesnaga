const { TileSet } = require('./TileSet');
const { InvalidInputError } = require('./Errors');
const { tiles: defaultTiles } = require('./defaults');

describe('TileSet', () => {
	it('should work on default tile set', () => {
		expect(() => new TileSet(defaultTiles)).not.toThrow();
	});

	describe('#isValidIndex', () => {
		const tileSet = new TileSet({ 4: {}, 7: {}, 9: {} });

		it('returns true for valid indexes', () => {
			expect(tileSet.isValidIndex(4)).toBeTruthy();
			expect(tileSet.isValidIndex(7)).toBeTruthy();
			expect(tileSet.isValidIndex(9)).toBeTruthy();
		});

		it('returns false for invalid indexes', () => {
			expect(tileSet.isValidIndex(2)).toBeFalsy();
		});
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
