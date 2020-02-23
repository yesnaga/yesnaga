const Direction = require('./Direction');
const { InvalidInputError } = require('./Errors');

describe('Direction', () => {
	describe('#isValidDirection', () => {
		it('returns true for valid directions', () => {
			['tl', 'tr', 'l', 'r', 'bl', 'br'].forEach((direction) => {
				expect(Direction.isValidDirection(direction)).toEqual(true);
			});
		});

		it('returns false for invalid directions', () => {
			['ttt', 'mt', 'bt', 5, {}, [], '', NaN].forEach((value) => {
				expect(Direction.isValidDirection(value)).toEqual(false);
			});
		});
	});

	describe('#ensureValidDirection', () => {
		it('passes for valid directions', () => {
			['tl', 'tr', 'l', 'r', 'bl', 'br'].forEach((direction) => {
				expect(() => Direction.ensureValidDirection(direction)).not.toThrow();
			});
		});

		it('throws for invalid directions', () => {
			['ttt', 'mt', 'bt', 5, {}, [], '', NaN].forEach((value) => {
				expect(() => Direction.ensureValidDirection(value)).toThrow(InvalidInputError);
			});
		});
	});
});
