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
			discs: Object.keys(board.tiles).map((key) => parseInt(key, 10)).map((discTile) => ({
				id: discTile,
				moveable: board.canMoveDisc(discTile),
				moveableTo: board.getDiscMoveTargets(discTile),
				neighbours: board.getNeighbours(discTile),
			})),
		};
	}
}

module.exports = {
	BoardFactory,
};
