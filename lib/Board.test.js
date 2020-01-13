const { Board } = require('./Board');

describe('Board', () => {
	test('initializes with tiles', () => {
		const newBoard = new Board();
		expect(newBoard.tiles).toBeInstanceOf(Object);
		expect(Object.keys(newBoard.tiles).length).toBe(19);
	});
});
