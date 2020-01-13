const { Board, InvalidTileIndexError } = require('./Board');

describe('Board', () => {
	let theBoard;

	beforeAll(() => {
		theBoard = new Board();
	});

	test('initializes with tiles', () => {
		expect(theBoard.tiles).toBeInstanceOf(Object);
		expect(Object.keys(theBoard.tiles).length).toBe(19);
	});

	test('initializes with players', () => {
		expect(theBoard.players).toBeInstanceOf(Object);
		expect(Object.keys(theBoard.players)).toStrictEqual(['0', '1']);
		theBoard.players[0].forEach((position) => {
			expect(theBoard.players[1]).not.toContain(position);
		});
	});

	describe('#getNeighbours', () => {
		test('works', () => {
			expect(theBoard.getNeighbours(5)).toBe(theBoard.tiles[5].neighbours);
		});

		test('throws for invalid indexes', () => {
			expect(() => theBoard.getNeighbours(-1)).toThrow(InvalidTileIndexError);
			expect(() => theBoard.getNeighbours(20)).toThrow(InvalidTileIndexError);
		});
	});
});
