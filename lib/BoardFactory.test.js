const { BoardFactory } = require('./BoardFactory');
const { Board } = require('./Board');

const mapToSet = (arr) => new Set(arr.map((t) => `${t.x}:${t.y}`));

describe('BoardFactory', () => {
	describe('round trip', () => {
		it('does not throw', () => {
			expect(() => BoardFactory.createBoardFromObject(BoardFactory.toObject(new Board()))).not.toThrow();
		});

		const expectEqualBoards = (a, b) => {
			expect(new Set(Object.keys(b.tokens)))
				.toStrictEqual(new Set(Object.keys(a.tokens)));

			Object.keys(b.tokens).forEach((key) => {
				const tokenset = mapToSet(b.tokens[key]);
				const defaultTokenset = mapToSet(a.tokens[key]);
				expect(tokenset).toStrictEqual(defaultTokenset);
			});

			const discTargets = mapToSet(b.getDiscMoveTargets({ x: 0, y: 0 }));
			const defaultTargets = mapToSet(a.getDiscMoveTargets({ x: 0, y: 0 }));
			expect(discTargets).toStrictEqual(defaultTargets);
		};

		it('works for default board', () => {
			const defaultBoard = new Board();
			const object = BoardFactory.toObject(defaultBoard);
			const loadedBoard = BoardFactory.createBoardFromObject(object);

			expect(loadedBoard).not.toBeUndefined();
			expect(loadedBoard).not.toBe(defaultBoard);
			expectEqualBoards(defaultBoard, loadedBoard);
		});

		it('works for custom board', () => {
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
			expectEqualBoards(lineBoard, BoardFactory.createBoardFromObject(BoardFactory.toObject(lineBoard)));
		});
	});
});
