const { Board } = require('./Board');
const { isValidDirection } = require('./Direction');
const { InvalidInputError } = require('./Errors');

describe('Board', () => {
	let theBoard;

	beforeEach(() => {
		theBoard = new Board();
	});

	it('initializes with tiles', () => {
		expect(theBoard.discById).toBeInstanceOf(Object);
		expect(theBoard.discByCoordinates).toBeInstanceOf(Object);
		expect(Object.keys(theBoard.discById).length).toBe(19);
	});

	it('initializes with players', () => {
		expect(theBoard.tokens).toBeInstanceOf(Object);
		expect(Object.keys(theBoard.tokens)).toStrictEqual(['0', '1']);
		theBoard.tokens[0].forEach((position) => {
			expect(theBoard.tokens[1]).not.toContain(position);
		});
	});

	it('can be initialized with custom values', () => {
		const getCustomBoard = () => new Board([
			{ id: 3, x: 0, y: 1 },
			{ id: 42, x: -2, y: 5 },
		], {
			0: [], 1: [], 2: [],
		});
		expect(getCustomBoard).not.toThrow();
		expect(Object.keys(getCustomBoard().discById).length).toBe(2);
		expect(getCustomBoard().discById[3]).toStrictEqual({ id: 3, x: 0, y: 1 });
		expect(Object.keys(getCustomBoard().tokens).length).toBe(3);
		expect(getCustomBoard().tokens[2]).toStrictEqual([]);
	});

	describe('#getNeighbours', () => {
		it('works', () => {
			const neighbours = theBoard.getNeighbours({ x: 0, y: -1 });
			expect(neighbours.length).toBe(6);
			const ids = new Set(neighbours.map((n) => n.id));
			expect(ids).toStrictEqual(new Set([0, 4, 6, 15, 16, 17]));
		});

		it('returns an empty array for invalid discs', () => {
			expect(theBoard.getNeighbours(-1, -7).length).toBe(0);
			expect(theBoard.getNeighbours(200, 5).length).toBe(0);
		});
	});

	describe('#isOccupied', () => {
		it('should give true for the players\'s start positions', () => {
			Object.values(theBoard.tokens).forEach((playerTokens) => {
				playerTokens.forEach((token) => {
					expect(theBoard.isOccupied(token)).toEqual(true);
				});
			});
		});

		it('should give false for an empty disc', () => {
			expect(theBoard.isOccupied(0, 0)).toBe(false);
		});
	});

	describe('#canMoveToken', () => {
		it('should give true for the players\'s start positions', () => {
			Object.values(theBoard.tokens).forEach((playerTokens) => {
				playerTokens.forEach((token) => {
					expect(theBoard.canMoveToken(token)).toEqual(true);
				});
			});
		});

		it('should not throw for non-occupied tiles', () => {
			// useful for AI
			expect(() => theBoard.canMoveToken(0)).not.toThrow();
		});

		it('should give false if player can\'t move', () => {
			const tinyBoard = new Board([{ id: 0, x: 0, y: 0 }]);
			expect(tinyBoard.canMoveToken(0)).toEqual(false);

			const smallBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
			], {
				0: [
					{ x: 0, y: 0 },
					{ x: 1, y: 0 },
				],
			});
			expect(smallBoard.canMoveToken(0)).toEqual(false);
		});

		it('doesn\'t throw for invalid tiles', () => {
			expect(() => theBoard.canMoveToken(23, 456)).not.toThrow();
		});
	});

	describe('#canMoveTokenTo', () => {
		it('should give true for straight movement to empty tile without obstacle', () => {
			const smallBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
			], {
				0: [
					{ x: 0, y: 0 },
				],
			});
			expect(smallBoard.canMoveTokenTo({ x: 0, y: 0 }, { x: 1, y: 0 })).toEqual(true);

			const lineBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
				{ id: 1, x: 2, y: 0 },
			], {
				0: [
					{ x: 1, y: 0 },
				],
			});
			expect(lineBoard.canMoveTokenTo({ x: 1, y: 0 }, { x: 2, y: 0 })).toEqual(true);
		});

		it('should give false if movement is not straight', () => {
			const cornerBoard = new Board([
				{ id: 0, x: 0, y: -1 },
				{ id: 1, x: 0, y: 0 },
				{ id: 2, x: 1, y: 1 },
				{ id: 3, x: 1, y: 2 },
			], { 0: [{ x: 0, y: -1 }] });
			expect(cornerBoard.canMoveTokenTo({ x: 0, y: -1 }, { x: 1, y: 2 })).toEqual(false);
		});

		it('should give false if movement is blocked by own tokens', () => {
			const lineBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
				{ id: 1, x: 2, y: 0 },
			], {
				0: [
					{ x: 0, y: 0 },
					{ x: 1, y: 0 },
				],
			});
			expect(lineBoard.canMoveTokenTo({ x: 0, y: 0 }, { x: 2, y: 0 })).toEqual(false);
		});

		it('should give false if movement is blocked by other player\'s tokens', () => {
			const lineBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
				{ id: 1, x: 2, y: 0 },
			], {
				0: [
					{ x: 0, y: 0 },
				],
				1: [
					{ x: 1, y: 0 },
				],
			});
			expect(lineBoard.canMoveTokenTo({ x: 0, y: 0 }, { x: 2, y: 0 })).toEqual(false);
		});

		it('should enforce maximum movement length', () => {
			const lineBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
				{ id: 1, x: 2, y: 0 },
			], {
				0: [
					{ x: 0, y: 0 },
				],
			});
			expect(lineBoard.canMoveTokenTo({ x: 0, y: 0 }, { x: 1, y: 0 })).toEqual(false);
		});

		it('should handle maximum movement length with obstacles', () => {
			const lineBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
				{ id: 1, x: 2, y: 0 },
			], {
				0: [
					{ x: 0, y: 0 },
					{ x: 2, y: 0 },
				],
			});
			expect(lineBoard.canMoveTokenTo({ x: 0, y: 0 }, { x: 1, y: 0 })).toEqual(true);
		});
	});

	describe('#getMaximumTokenMovementInDirection', () => {
		it('should return the tile itself if no movement is possible', () => {
			expect(theBoard.getMaximumTokenMovementInDirection({ x: 0, y: 2 }, 'br')).toEqual(theBoard.discById[10]);
			expect(theBoard.getMaximumTokenMovementInDirection({ x: 0, y: -2 }, 'l')).toEqual(theBoard.discById[16]);
			expect(theBoard.getMaximumTokenMovementInDirection({ x: -2, y: 0 }, 'tl')).toEqual(theBoard.discById[8]);
		});

		it('should return the correct tile after moving in the given direction', () => {
			expect(theBoard.getMaximumTokenMovementInDirection({ x: 0, y: 2 }, 'l')).toEqual(theBoard.discById[5]);
			expect(theBoard.getMaximumTokenMovementInDirection({ x: 0, y: -2 }, 'r')).toEqual(theBoard.discById[2]);
			expect(theBoard.getMaximumTokenMovementInDirection({ x: 0, y: 2 }, 'bl')).toEqual(theBoard.discById[11]);
			expect(theBoard.getMaximumTokenMovementInDirection({ x: -2, y: 0 }, 'bl')).toEqual(theBoard.discById[4]);
		});
	});

	describe('#getMaximumTokenMovementTiles', () => {
		it('should return a list of possible movement tiles, filtered by viability', () => {
			expect(new Set(theBoard.getMaximumTokenMovementTiles({ x: -1, y: 0 }))).toStrictEqual(new Set([
				theBoard.discById[4],
				theBoard.discById[7],
				theBoard.discById[9],
				theBoard.discById[11],
				theBoard.discById[17],
			]));
			expect(new Set(theBoard.getMaximumTokenMovementTiles({ x: -2, y: -1 }))).toStrictEqual(new Set([
				theBoard.discById[11],
				theBoard.discById[15],
			]));
			expect(new Set(theBoard.getMaximumTokenMovementTiles({ x: 0, y: 2 }))).toStrictEqual(new Set([
				theBoard.discById[5],
				theBoard.discById[9],
				theBoard.discById[11],
			]));
			expect(new Set(theBoard.getMaximumTokenMovementTiles({ x: 1, y: -1 }))).toStrictEqual(new Set([
				theBoard.discById[7],
				theBoard.discById[11],
			]));
		});
	});

	describe('#moveToken', () => {
		it('should only do something for valid movements', () => {
			const p1 = [...theBoard.tokens[0]];
			theBoard.moveToken(p1[0].x, p1[0].y, p1[1].x, p1[1].y); // illegal move
			theBoard.moveToken(p1[0].x, p1[0].y, 0, 0); // impossible move
			theBoard.moveToken(0, -1, 0, 1); // no token at position 5

			expect(new Set(theBoard.tokens[0])).toStrictEqual(new Set(p1));
		});

		it('should work for the default board', () => {
			theBoard.moveToken({ x: -2, y: 0 }, { x: 1, y: 0 });
			theBoard.moveToken({ x: 0, y: 2 }, { x: 0, y: -1 });
			theBoard.moveToken({ x: 2, y: 2 }, { x: -1, y: -1 });
			expect(new Set(theBoard.tokens[0])).toStrictEqual(new Set([
				{ x: 1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -2 },
			]));
			expect(new Set(theBoard.tokens[1])).toStrictEqual(new Set([
				{ x: 0, y: -1 }, { x: 2, y: 0 }, { x: -2, y: -2 },
			]));
		});

		it('should work for custom boards', () => {
			const lineBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
				{ id: 1, x: 2, y: 0 },
			], {
				0: [
					{ x: 0, y: 0 },
				],
			});
			lineBoard.moveToken({ x: 0, y: 0 }, { x: 1, y: 0 });
			expect(lineBoard.tokens[0][0]).toStrictEqual({ x: 0, y: 0 });
			lineBoard.moveToken({ x: 0, y: 0 }, { x: 2, y: 0 });
			expect(lineBoard.tokens[0][0]).toStrictEqual({ x: 2, y: 0 });
		});

		it('should work for arbitrary numbers of plyers', () => {
			const lineBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
				{ id: 1, x: 2, y: 0 },
				{ id: 2, x: 3, y: 0 },
			], {
				0: [
					{ x: 0, y: 0 },
				],
				1: [
					{ x: 1, y: 0 },
				],
				2: [
					{ x: 2, y: 0 },
				],
			});
			lineBoard.moveToken({ x: 2, y: 0 }, { x: 3, y: 0 });
			expect(lineBoard.tokens[2][0]).toStrictEqual({ x: 3, y: 0 });
		});
	});

	describe('#canMoveDisc', () => {
		it('should throw for invalid input', () => {
			expect(() => theBoard.canMoveDisc(111)).toThrow(InvalidInputError);
		});

		it('should not allow taking discs from the inside of the board', () => {
			for (let i = 0; i <= 6; i += 1) {
				expect(theBoard.canMoveDisc(i)).toEqual(false);
			}
		});

		it('should not allow moving occupied discs', () => {
			for (const i of [8, 10, 12, 14, 16, 18]) {
				expect(theBoard.canMoveDisc(i)).toEqual(false);
			}
		});

		it('should allow moving "freely moveable" discs', () => {
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

		it.skip('should give false for previously moved disc', () => { });

		it('should not allow moving a disc that splits the board', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, {});
			expect(lineBoard.canMoveDisc(2)).toEqual(false);
		});

		it('should allow moving a disc that leaves another disc connected to only a third disc', () => {
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

	describe.skip('#span', () => {
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
