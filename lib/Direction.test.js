const {
	isValidDirection, ensureValidDirection,
	getLeftNeighbour, getRightNeighbour, getNeighbouringDirections,
	getOppositeDirection,
} = require('./Direction');
const { InvalidInputError } = require('./Errors');

describe('Direction', () => {
	describe('#isValidDirection', () => {
		it('returns true for valid directions', () => {
			['tl', 'tr', 'l', 'r', 'bl', 'br'].forEach((direction) => {
				expect(isValidDirection(direction)).toEqual(true);
			});
		});

		it('returns false for invalid directions', () => {
			['ttt', 'mt', 'bt', 5, {}, [], '', NaN].forEach((value) => {
				expect(isValidDirection(value)).toEqual(false);
			});
		});
	});

	describe('#ensureValidDirection', () => {
		it('passes for valid directions', () => {
			['tl', 'tr', 'l', 'r', 'bl', 'br'].forEach((direction) => {
				expect(() => ensureValidDirection(direction)).not.toThrow();
			});
		});

		it('throws for invalid directions', () => {
			['ttt', 'mt', 'bt', 5, {}, [], '', NaN].forEach((value) => {
				expect(() => ensureValidDirection(value)).toThrow(InvalidInputError);
			});
		});
	});

	describe('neighbours', () => {
		test('#getLeftNeighbour returns the left neighbour direction', () => {
			expect(getLeftNeighbour('l')).toEqual('bl');
			expect(getLeftNeighbour('r')).toEqual('tr');
			expect(getLeftNeighbour('tl')).toEqual('l');
			expect(getLeftNeighbour('bl')).toEqual('br');
			expect(getLeftNeighbour('tr')).toEqual('tl');
			expect(getLeftNeighbour('br')).toEqual('r');
		});

		test('#getRightNeighbour returns the right neighbour direction', () => {
			expect(getRightNeighbour('l')).toEqual('tl');
			expect(getRightNeighbour('r')).toEqual('br');
			expect(getRightNeighbour('tl')).toEqual('tr');
			expect(getRightNeighbour('bl')).toEqual('l');
			expect(getRightNeighbour('tr')).toEqual('r');
			expect(getRightNeighbour('br')).toEqual('bl');
		});

		test('#getNeighbouringDirections returns the two adjacent directions', () => {
			expect(new Set(getNeighbouringDirections('l'))).toStrictEqual(new Set(['tl', 'bl']));
			expect(new Set(getNeighbouringDirections('r'))).toStrictEqual(new Set(['tr', 'br']));
			expect(new Set(getNeighbouringDirections('tl'))).toStrictEqual(new Set(['l', 'tr']));
			expect(new Set(getNeighbouringDirections('bl'))).toStrictEqual(new Set(['l', 'br']));
			expect(new Set(getNeighbouringDirections('tr'))).toStrictEqual(new Set(['tl', 'r']));
			expect(new Set(getNeighbouringDirections('br'))).toStrictEqual(new Set(['bl', 'r']));
		});

		test('#getOppositeDirection returns the facing direction', () => {
			expect(getOppositeDirection('l')).toEqual('r');
			expect(getOppositeDirection('r')).toEqual('l');
			expect(getOppositeDirection('tl')).toEqual('br');
			expect(getOppositeDirection('bl')).toEqual('tr');
			expect(getOppositeDirection('tr')).toEqual('bl');
			expect(getOppositeDirection('br')).toEqual('tl');
		});
	});
});
