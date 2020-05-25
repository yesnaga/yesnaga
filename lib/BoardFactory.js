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
}

module.exports = {
	BoardFactory,
};
