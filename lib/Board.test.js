const { Board } = require('./Board');
const { isValidDirection } = require('./Direction');

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
				{ id: 2, x: 2, y: 0 },
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
				{ id: 2, x: 2, y: 0 },
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
				{ id: 2, x: 2, y: 0 },
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
				{ id: 2, x: 2, y: 0 },
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
				{ id: 2, x: 2, y: 0 },
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
			theBoard.moveToken(p1[0], p1[1]); // illegal move
			theBoard.moveToken(p1[0], { x: 0, y: 0 }); // impossible move
			theBoard.moveToken({ x: 0, y: -1 }, { x: 0, y: 1 }); // no token at position 5

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
				{ id: 2, x: 2, y: 0 },
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
				{ id: 2, x: 2, y: 0 },
				{ id: 3, x: 3, y: 0 },
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
		it('should not allow taking discs from the inside of the board', () => {
			for (let i = 0; i <= 6; i += 1) {
				expect(theBoard.canMoveDisc(theBoard.discById[i])).toEqual(false);
			}
		});

		it('should not allow moving occupied discs', () => {
			for (const i of [8, 10, 12, 14, 16, 18]) {
				expect(theBoard.canMoveDisc(theBoard.discById[i])).toEqual(false);
			}
		});

		it('should allow moving "freely moveable" discs', () => {
			for (const i of [7, 9, 11, 13, 15, 17]) {
				expect(theBoard.canMoveDisc(theBoard.discById[i])).toEqual(true);
			}

			const smallBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 0, y: 1 },
				{ id: 2, x: 1, y: 1 },
				{ id: 3, x: 1, y: 2 },
			], {});
			for (const i of [0, 1, 2, 3]) {
				expect(smallBoard.canMoveDisc(smallBoard.discById[i])).toEqual(true);
			}
		});

		it.skip('should give false for previously moved disc', () => { });

		it('should not allow moving a disc that splits the board', () => {
			const lineBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
				{ id: 2, x: 2, y: 0 },
				{ id: 3, x: 3, y: 0 },
			], {});
			expect(lineBoard.canMoveDisc({ x: 2, y: 0 })).toEqual(false);
		});

		it('should allow moving a disc that leaves another disc connected to only a third disc', () => {
			const lineBoard = new Board([
				{ id: 0, x: 0, y: 0 },
				{ id: 1, x: 1, y: 0 },
				{ id: 2, x: 2, y: 0 },
				{ id: 3, x: 3, y: 0 },
			], {});
			expect(lineBoard.canMoveDisc({ x: 3, y: 0 })).toEqual(true);
		});
	});

	describe('#span', () => {
		it('should reach all tiles of the default field', () => {
			expect(theBoard.span()).toStrictEqual(new Set([
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
			]));
		});

		it('should accept an optional start field', () => {
			expect(theBoard.span(theBoard.discById[10])).toStrictEqual(theBoard.span());
		});

		it('should accept an optional condition function', () => {
			expect(theBoard.span(theBoard.discById[0], ({ id }) => id < 5)).toStrictEqual(new Set([0, 1, 2, 3, 4]));
		});
	});

	describe('#getDiscMoveTargets', () => {
		it('should return all outer discs with all missing neighbours', () => {
			expect(theBoard.getDiscMoveTargets({ x: 0, y: 0 }).length).toStrictEqual(18);
		});

		it('should exclude moving a disc to its current position', () => {
			// outer disc with three missing neighbours
			expect(theBoard.getDiscMoveTargets({ x: 0, y: 2 }).length).toStrictEqual(17);
			// outer disc with two missing neighbours
			expect(theBoard.getDiscMoveTargets({ x: 1, y: 2 }).length).toStrictEqual(18);
		});

		it('should return coordinates for all candidates', () => {
			theBoard.getDiscMoveTargets({ x: -1, y: -2 }).forEach((sample) => {
				expect(sample).toBeInstanceOf(Object);
				expect(typeof sample.x).toBe('number');
				expect(typeof sample.y).toBe('number');
			});
		});
	});

	describe('#moveDisc', () => {
		it('should remove the disc at the original location', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, {});
			lineBoard.moveDisc(0, { l: 4 });
			expect(lineBoard.getNeighbours(1).l).toEqual(undefined);
		});

		it('should add the disc at the new location', () => {
			const lineBoard = new Board({
				0: { neighbours: { r: 1 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, r: 3 } },
				3: { neighbours: { l: 2, r: 4 } },
				4: { neighbours: { l: 3 } },
			}, {});
			lineBoard.moveDisc(0, { l: 4 });
			expect(lineBoard.getNeighbours(4).r).toEqual(0);
		});

		it('should update all old and new neighbours accordingly', () => {
			theBoard.moveDisc(18, { bl: 10 });
			expect(theBoard.getNeighbours(7).l).toEqual(undefined);
			expect(theBoard.getNeighbours(6).tl).toEqual(undefined);
			expect(theBoard.getNeighbours(17).tr).toEqual(undefined);
			expect(theBoard.getNeighbours(10).tr).toEqual(18);
			expect(theBoard.getNeighbours(9).r).toEqual(18);
		});

		it('should join non-neighbouring discs', () => {
			/*
			  0--1--2               0--1--2
			 /       \             /       \
			7		  3    ==>    7         3
			 \       /             \       /
			  6	    4               6--5--4
				   /
				  5
			*/
			const circleBoard = new Board({
				0: { neighbours: { r: 1, bl: 7 } },
				1: { neighbours: { l: 0, r: 2 } },
				2: { neighbours: { l: 1, br: 3 } },
				3: { neighbours: { tl: 2, bl: 4 } },
				4: { neighbours: { tr: 3, bl: 5 } },
				5: { neighbours: { tr: 4 } },
				6: { neighbours: { tl: 7 } },
				7: { neighbours: { br: 6, tr: 0 } },
			});
			circleBoard.moveDisc(5, { l: 6 });
			expect(circleBoard.getNeighbours(4).l).toEqual(5);
		});
	});
});
