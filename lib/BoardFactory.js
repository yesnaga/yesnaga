const { Board } = require('./Board');

class BoardFactory {
	/**
	 * Returns JSON-compatible object representation of a board
	 * @param {Board} board a board to convert
	 */
	static toObject(board) {
		return {
			players: Object.keys(board.tokens).map((player) => ({
				id: player,
				tokens: board.tokens[player].map((token) => ({
					tile: token,
					moveable: board.canMoveToken(token),
					moveableTo: board.getMaximumTokenMovementTiles(token),
				})),
			})),
			discs: Object.values(board.discById).map((disc) => ({
				...disc,
				moveable: board.canMoveDisc(disc),
				moveableTo: board.getDiscMoveTargets(disc),
				neighbours: board.getNeighbours(disc),
			})),
		};
	}

	/**
	 * Returns a Board instance based on the given object representation
	 * @param {Object} object plain object representation of a board
	 * @returns {Board} the board
	 */
	static createBoardFromObject(object) {
		const tiles = object.discs.map((d) => ({ id: d.id, x: d.x, y: d.y }));
		const tokens = {};
		object.players.forEach((player) => {
			tokens[player.id] = player.tokens.map((t) => t.tile);
		});
		return new Board(tiles, tokens);
	}
}

module.exports = {
	BoardFactory,
};
