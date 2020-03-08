const { Board } = require('./Board');
const { isValidDirection } = require('./Direction');
const { InvalidInputError } = require('./Errors');

describe('Board', () => {
	let theBoard;

	beforeEach(() => {
		theBoard = new Board();
	});

	test('initializes with tiles', () => {
		expect(theBoard.tiles).toBeInstanceOf(Object);
		expect(Object.keys(theBoard.tiles).length).toBe(19);
	});

	test('initializes with players', () => {
		expect(theBoard.tokens).toBeInstanceOf(Object);
		expect(Object.keys(theBoard.tokens)).toStrictEqual(['0', '1']);
		theBoard.tokens[0].forEach((position) => {
			expect(theBoard.tokens[1]).not.toContain(position);
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
		expect(Object.keys(getCustomBoard().tokens).length).toBe(3);
		expect(getCustomBoard().tokens[2]).toStrictEqual([]);
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
			Object.values(theBoard.tokens).forEach((positions) => {
				positions.forEach((position) => {
					expect(theBoard.isOccupied(position)).toEqual(true);
				});
			});
			expect(theBoard.isOccupied(0)).toBe(false);
		});
	});

	describe('#canMoveToken', () => {
		test('should give true for the players\'s start positions', () => {
			Object.values(theBoard.tokens).forEach((positions) => {
				positions.forEach((position) => {
					expect(theBoard.canMoveToken(position)).toEqual(true);
				});
			});
		});

		test('should not throw for non-occupied tiles', () => {
			// useful for AI
			expect(() => theBoard.canMoveToken(0)).not.toThrow();
		});

		test('should give false if player can\'t move', () => {
			const tinyBoard = new Board({ 0: { neighbours: {} } });
			expect(tinyBoard.canMoveToken(0)).toEqual(false);

			const smallBoard = new Board({ 0: { neighbours: { r: 1 } }, 1: { neighbours: { l: 0 } } }, { 0: [0, 1] });
			expect(smallBoard.canMoveToken(0)).toEqual(false);
		});

		test('throws for invalid tiles', () => {
			expect(() => theBoard.canMoveToken(3456)).toThrow(InvalidInputError);
		});
	});

	describe('#canMoveTokenTo', () => {
		test('should give true for straight movement to empty tile without obstacle', () => {
			const smallBoard = new Board({ 0: { neighbours: { r: 1 } }, 1: { neighbours: { l: 0 } } }, { 0: [0] });
			expect(smallBoard.canMoveTokenTo(0, 1)).toEqual(true);

			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, { 0: [1] });
			expect(lineBoard.canMoveTokenTo(1, 4)).toEqual(true);
		});

		test('should give false if movement is not straight', () => {
			const cornerBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, br: 2 } },
				2: { neighbours: { tl: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, { 0: [1] });
			expect(cornerBoard.canMoveTokenTo(1, 4)).toEqual(false);
		});

		test('should give false if movement is blocked by own tokens', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, { 0: [1, 2] });
			expect(lineBoard.canMoveTokenTo(1, 4)).toEqual(false);
		});

		test('should give false if movement is blocked by other player\'s tokens', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, { 0: [1], 1: [3] });
			expect(lineBoard.canMoveTokenTo(1, 4)).toEqual(false);
		});

		test('should enforce maximum movement length', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, { 0: [1] });
			expect(lineBoard.canMoveTokenTo(1, 2)).toEqual(false);
		});

		test('should handle maximum movement length with obstacles', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, { 0: [1, 3] });
			expect(lineBoard.canMoveTokenTo(1, 2)).toEqual(true);
		});
	});

	describe('#getMaximumTokenMovementInDirection', () => {
		test('should throw for invalid inputs', () => {
			expect(() => theBoard.getMaximumTokenMovementInDirection(44, 'l')).toThrow(InvalidInputError);
			expect(() => theBoard.getMaximumTokenMovementInDirection(0, 'wt')).toThrow(InvalidInputError);
		});

		test('should return the tile itself if no movement is possible', () => {
			expect(theBoard.getMaximumTokenMovementInDirection(10, 'br')).toEqual(10);
			expect(theBoard.getMaximumTokenMovementInDirection(16, 'l')).toEqual(16);
			expect(theBoard.getMaximumTokenMovementInDirection(8, 'tl')).toEqual(8);
		});

		test('should return the correct tile after moving in the given direction', () => {
			expect(theBoard.getMaximumTokenMovementInDirection(10, 'l')).toEqual(5);
			expect(theBoard.getMaximumTokenMovementInDirection(16, 'r')).toEqual(2);
			expect(theBoard.getMaximumTokenMovementInDirection(10, 'bl')).toEqual(11);
			expect(theBoard.getMaximumTokenMovementInDirection(8, 'bl')).toEqual(4);
		});
	});

	describe('#getMaximumTokenMovementTiles', () => {
		test('should throw for invalid inputs', () => {
			expect(() => theBoard.getMaximumTokenMovementTiles(73)).toThrow(InvalidInputError);
		});

		test('should return a list of possible movement tiles, filtered by viability', () => {
			expect(new Set(theBoard.getMaximumTokenMovementTiles(1))).toStrictEqual(new Set([4, 7, 9, 11, 17]));
			expect(new Set(theBoard.getMaximumTokenMovementTiles(7))).toStrictEqual(new Set([11, 15]));
			expect(new Set(theBoard.getMaximumTokenMovementTiles(10))).toStrictEqual(new Set([5, 9, 11]));
			expect(new Set(theBoard.getMaximumTokenMovementTiles(15))).toStrictEqual(new Set([7, 11]));
		});
	});

	describe('#moveToken', () => {
		it('should only do something for valid movements', () => {
			const p1 = [...theBoard.tokens[0]];
			theBoard.moveToken(p1[0], p1[1]); // illegal move
			theBoard.moveToken(p1[0], 0); // impossible move
			theBoard.moveToken(5, 2); // no token at position 5
			expect(new Set(theBoard.tokens[0])).toStrictEqual(new Set(p1));
		});

		it('should work for the default board', () => {
			theBoard.moveToken(8, 4);
			theBoard.moveToken(10, 5);
			theBoard.moveToken(12, 6);
			expect(new Set(theBoard.tokens[0])).toStrictEqual(new Set([4, 6, 16]));
			expect(new Set(theBoard.tokens[1])).toStrictEqual(new Set([5, 14, 18]));
		});

		it('should work for custom boards', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, { 0: [1] });
			lineBoard.moveToken(1, 0);
			expect(lineBoard.tokens[0][0]).toStrictEqual(0);
			lineBoard.moveToken(0, 4);
			expect(lineBoard.tokens[0][0]).toStrictEqual(4);
		});

		it('should work for arbitrary numbers of plyers', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, {
				0: [0], 1: [1], 2: [2], 3: [4],
			});
			lineBoard.moveToken(4, 3);
			expect(lineBoard.tokens[3][0]).toStrictEqual(3);
		});
	});

	describe('#canMoveDisc', () => {
		test('should throw for invalid input', () => {
			expect(() => theBoard.canMoveDisc(111)).toThrow(InvalidInputError);
		});

		test('should not allow taking discs from the inside of the board', () => {
			for (let i = 0; i <= 6; i += 1) {
				expect(theBoard.canMoveDisc(i)).toEqual(false);
			}
		});

		test('should not allow moving occupied discs', () => {
			for (const i of [8, 10, 12, 14, 16, 18]) {
				expect(theBoard.canMoveDisc(i)).toEqual(false);
			}
		});

		test('should allow moving "freely moveable" discs', () => {
			for (const i of [7, 9, 11, 13, 15, 17]) {
				expect(theBoard.canMoveDisc(i)).toEqual(true);
			}

			const smallBoard = new Board({
				0: { neighbours: { r: 1, br: 2 } },
				1: { neighbours: { l: 0, bl: 2, br: 3 } },
				2: { neighbours: { tl: 0, tr: 1, r: 3 } },
				3: { neighbours: { tl: 1, l: 2 } },
			}, {});
			for (const i of [0, 1, 2, 3]) {
				expect(smallBoard.canMoveDisc(i)).toEqual(true);
			}
		});

		test.skip('should give false for previously moved disc', () => { });

		test('should not allow moving a disc that splits the board', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, {});
			expect(lineBoard.canMoveDisc(2)).toEqual(false);
		});

		test('should allow moving a disc that leaves another disc connected to only a third disc', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, {});
			expect(lineBoard.canMoveDisc(4)).toEqual(true);
		});
	});

	describe('#span', () => {
		it('should reach all tiles of the default field', () => {
			expect(theBoard.span()).toStrictEqual(new Set([
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
			]));
		});

		it('should accept an optional start field', () => {
			expect(theBoard.span(10)).toStrictEqual(theBoard.span());
		});

		it('should accept an optional condition function', () => {
			expect(theBoard.span(0, (id) => id < 5)).toStrictEqual(new Set([0, 1, 2, 3, 4]));
		});
	});

	describe('#getDiscMoveTargets', () => {
		it('should return all outer discs with all missing neighbours', () => {
			expect(theBoard.getDiscMoveTargets(0).length).toStrictEqual(30);
		});

		it('should exclude moving a disc to its current position', () => {
			// disc 10 is an outer disc with three missing neighbours
			expect(theBoard.getDiscMoveTargets(10).length).toStrictEqual(27);
			// disc 11 is an outer disc with two missing neighbours
			expect(theBoard.getDiscMoveTargets(11).length).toStrictEqual(28);
		});

		it('should return <tile, direction> tuples for all candidates', () => {
			theBoard.getDiscMoveTargets(17).forEach((sample) => {
				expect(sample).toBeInstanceOf(Array);
				expect(sample.length).toStrictEqual(2);
				expect(theBoard.tileset.isValidIndex(sample[0])).toStrictEqual(true);
				expect(isValidDirection(sample[1])).toStrictEqual(true);
			});
		});
	});
});
