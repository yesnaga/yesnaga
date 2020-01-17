const { Board } = require('./Board');
const { InvalidInputError } = require('./Errors');

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

	test('can be initialized with custom values', () => {
		const getCustomBoard = () => new Board({
			0: { neighbours: { r: 1 } },
			1: { neighbours: { l: 0 } },
		}, {
			0: [], 1: [], 2: [],
		});
		expect(getCustomBoard).not.toThrow();
		expect(Object.keys(getCustomBoard().tiles).length).toBe(2);
		expect(getCustomBoard().tiles[0].neighbours).toStrictEqual({ r: 1 });
		expect(Object.keys(getCustomBoard().players).length).toBe(3);
		expect(getCustomBoard().players[2]).toStrictEqual([]);
	});

	describe('#getNeighbours', () => {
		test('works', () => {
			expect(theBoard.getNeighbours(5)).toBe(theBoard.tiles[5].neighbours);
		});

		test('throws for invalid indexes', () => {
			expect(() => theBoard.getNeighbours(-1)).toThrow(InvalidInputError);
			expect(() => theBoard.getNeighbours(20)).toThrow(InvalidInputError);
		});
	});

	describe('#isOccupied', () => {
		test('should give true for the players\'s start positions', () => {
			Object.values(theBoard.players).forEach((positions) => {
				positions.forEach((position) => {
					expect(theBoard.isOccupied(position)).toEqual(true);
				});
			});
			expect(theBoard.isOccupied(0)).toBe(false);
		});
	});

	describe('#canMove', () => {
		test('should give true for the players\'s start positions', () => {
			Object.values(theBoard.players).forEach((positions) => {
				positions.forEach((position) => {
					expect(theBoard.canMove(position)).toEqual(true);
				});
			});
		});

		test('should not throw for non-occupied tiles', () => {
			// useful for AI
			expect(() => theBoard.canMove(0)).not.toThrow();
		});

		test('should give false if player can\'t move', () => {
			const tinyBoard = new Board({ 0: { neighbours: {} } });
			expect(tinyBoard.canMove(0)).toEqual(false);

			const smallBoard = new Board({ 0: { neighbours: { r: 1 } }, 1: { neighbours: { l: 0 } } }, { 0: [0, 1] });
			expect(smallBoard.canMove(0)).toEqual(false);
		});

		test('throws for invalid tiles', () => {
			expect(() => theBoard.canMove(3456)).toThrow(InvalidInputError);
		});
	});
});
